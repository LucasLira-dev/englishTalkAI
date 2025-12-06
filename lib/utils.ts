import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types for speech evaluation utils
export interface EvaluationParams {
  transcript: string;
  currentSentence: string | null;
  sessionId?: string;
  progress: number;
  userId?: string;
}

export interface EvaluationResult {
  success: boolean;
  result: {
    isCorrect: boolean;
    feedback: string;
  } | null;
  error?: string;
}

// Utility function to evaluate user speech
export async function evaluateUserSpeech(
  params: EvaluationParams,
): Promise<EvaluationResult> {
  const { transcript, currentSentence, sessionId, progress, userId } = params;

  if (!currentSentence) {
    return {
      success: false,
      result: null,
      error: "Nenhuma frase disponível para avaliar",
    };
  }

  try {
    const requestBody = {
      userAnswer: transcript,
      correctSentence: currentSentence,
      sessionId,
      sentenceIndex: progress - 1, // currentIndex é baseado em 0
      userId,
    };

    const response = await fetch("/api/evaluateAttempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Erro HTTP: ${response.status}`);
    }

    if (data.success && data.evaluation) {
      return {
        success: true,
        result: {
          isCorrect: data.evaluation.isCorrect,
          feedback: data.evaluation.feedback,
        },
      };
    } else {
      return {
        success: false,
        result: {
          isCorrect: false,
          feedback: data?.error || "Erro na avaliação. Tente novamente.",
        },
      };
    }
  } catch (error) {
    console.error("Speech evaluation error:", error);

    let errorMessage = "Erro de conexão. Verifique sua internet.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      result: {
        isCorrect: false,
        feedback: errorMessage,
      },
    };
  }
}

// Utility function to handle speech result processing
export async function processSpeechResult(
  transcript: string,
  evaluationParams: EvaluationParams,
  checkAnswerFn: (answer: string) => Promise<void>,
): Promise<{
  result: { isCorrect: boolean; feedback: string };
  shouldUpdateProgress: boolean;
}> {
  const evaluationResult = await evaluateUserSpeech({
    ...evaluationParams,
    transcript,
  });

  if (evaluationResult.success && evaluationResult.result) {
    // If correct, update progress through context
    if (evaluationResult.result.isCorrect) {
      await checkAnswerFn(transcript);
    }

    return {
      result: evaluationResult.result,
      shouldUpdateProgress: evaluationResult.result.isCorrect,
    };
  } else {
    return {
      result: evaluationResult.result || {
        isCorrect: false,
        feedback: evaluationResult.error || "Erro desconhecido",
      },
      shouldUpdateProgress: false,
    };
  }
}

// Utility function to update session progress
export async function updateSessionProgress(
  sessionId: string,
  answer: string,
  updateProgressFn: (newProgress: number) => void,
  updateCurrentSentenceFn: (sentence: string | null) => void,
  sentences: string[],
  _currentProgress: number,
  completeSessionFn: () => Promise<void>,
): Promise<void> {
  try {
    // Import the service functions dynamically to avoid circular imports
    const { markAnswerAsCorrect } = await import(
      "@/shared/services/practiceService"
    );

    // 1. Save answer and increment index in database (both done in one API call now)
    const result = await markAnswerAsCorrect(sessionId, answer);
    const newCurrentIndex = result.newCurrentIndex;

    // 2. Update local progress (currentIndex + 1 for display purposes)
    updateProgressFn(newCurrentIndex + 1);

    // 3. Update current sentence or complete session
    if (newCurrentIndex < sentences.length) {
      updateCurrentSentenceFn(sentences[newCurrentIndex]);
    } else {
      // 4. If completed all sentences, mark session as complete
      await completeSessionFn();
    }
  } catch (error) {
    console.error("Error updating session progress:", error);
    throw error;
  }
}
