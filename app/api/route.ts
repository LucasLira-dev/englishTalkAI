import { GoogleGenAI } from "@google/genai";

// Prefer a server-side API key variable. NEXT_PUBLIC_* vars are exposed to the client;
// keep the real key out of client bundles. We still fallback to NEXT_PUBLIC_GEMINI_API_KEY
// for quick local testing, but in production set GOOGLE_AI_API_KEY (or GEMINI_API_KEY).
const apiKey =
  process.env.GOOGLE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Google AI API key is required in env (GOOGLE_AI_API_KEY or GEMINI_API_KEY)",
  );
}

const ai = new GoogleGenAI({ apiKey });

export async function getMessage() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:
        "Generate one simple English sentence for pronunciation practice. Make it conversational and not too long.",
    });

    // Handle the case where response.text might be undefined
    const text = response.text || "Hello, how are you today?";
    console.log(text);

    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Hello, how are you today?"; // fallback sentence
  }
}

// Generate 6 sentences for a complete session
export async function generateSession() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate exactly 6 different English sentences for pronunciation practice.
      Make them:
      - Conversational and natural
      - Varying difficulty levels (2 easy, 2 medium, 2 slightly challenging)
      - Between 5-15 words each
      - Different topics (greetings, daily activities, opinions, etc.)
      - Separate each sentence with a new line

      Format: Return only the sentences, one per line, nothing else.`,
    });

    const text = response.text || getFallbackSentences().join("\n");

    // Split the response into individual sentences and clean them
    const sentences = text
      .split("\n")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0)
      .slice(0, 6); // Ensure we only get 6 sentences

    // If we didn't get 6 sentences, pad with fallback sentences
    if (sentences.length < 6) {
      const fallbacks = getFallbackSentences();
      while (sentences.length < 6) {
        sentences.push(fallbacks[sentences.length % fallbacks.length]);
      }
    }

    console.log("Generated session sentences:", sentences);
    return sentences;
  } catch (error) {
    console.error("Error generating session:", error);
    return getFallbackSentences();
  }
}

export async function generateResult(
  userAnswer: string,
  correctSentence: string,
) {
  try {
    const prompt = `You are an English pronunciation teacher. Evaluate the user's spoken attempt against the correct sentence.

    IMPORTANT: Respond ONLY with valid JSON in this exact format:
    {
      "isCorrect": true/false,
      "feedback": "Brief feedback message"
    }

    Evaluation criteria:
    - Consider the transcription may have small errors from speech recognition
    - Focus on overall meaning and pronunciation accuracy
    - Be encouraging but honest
    - If words are very similar or just small grammatical differences, consider it correct
    - If the meaning is completely different or most words are wrong, mark as incorrect

    Examples of acceptable variations:
    - "Hello how are you" vs "Hello, how are you today?" → CORRECT
    - "I'm good thanks" vs "I am good, thank you" → CORRECT
    - "The weather is nice" vs "Weather is good today" → CORRECT
    - "Completely different sentence" → INCORRECT`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}

      Correct Sentence: "${correctSentence}"
      User's Transcribed Answer: "${userAnswer}"

      Respond with JSON only:`,
    });

    const text = response.text || "";
    console.log("Raw evaluation response:", text);

    // Clean the response to extract JSON
    let cleanedText = text.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```json\n?/, "").replace(/```$/, "");
    }

    // Find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    const result = JSON.parse(cleanedText);

    // Validate the response structure
    if (
      typeof result.isCorrect !== "boolean" ||
      typeof result.feedback !== "string"
    ) {
      throw new Error("Invalid response structure");
    }

    return result;
  } catch (error) {
    console.error("Error generating result:", error);

    // Fallback: Simple similarity check
    const similarity = calculateSimilarity(
      userAnswer.toLowerCase(),
      correctSentence.toLowerCase(),
    );
    const isCorrect = similarity > 0.6; // 60% similarity threshold

    return {
      isCorrect,
      feedback: isCorrect
        ? "Boa pronúncia! Continue praticando."
        : "Tente novamente. Foque em falar devagar e claramente.",
    };
  }
}

// Simple similarity calculation for fallback
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(" ").filter((w) => w.length > 0);
  const words2 = str2.split(" ").filter((w) => w.length > 0);

  if (words1.length === 0 && words2.length === 0) return 1;
  if (words1.length === 0 || words2.length === 0) return 0;

  let matchCount = 0;
  const maxLength = Math.max(words1.length, words2.length);

  for (const word1 of words1) {
    for (const word2 of words2) {
      // Check for exact match or similar words
      if (
        word1 === word2 ||
        (word1.length > 3 &&
          word2.length > 3 &&
          (word1.includes(word2) || word2.includes(word1)))
      ) {
        matchCount++;
        break;
      }
    }
  }

  return matchCount / maxLength;
}

// Fallback sentences in case AI fails
function getFallbackSentences(): string[] {
  return [
    "Hello, how are you today?",
    "I love reading books in my free time.",
    "The weather is beautiful this morning.",
    "Would you like to join us for dinner?",
    "I think learning new languages is fascinating.",
    "Technology has changed our lives dramatically.",
  ];
}
