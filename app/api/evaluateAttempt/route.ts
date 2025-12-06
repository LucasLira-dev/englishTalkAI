import { NextRequest, NextResponse } from "next/server";
import { generateResult } from "../../../lib/genai";
import { markAnswerAsCorrect } from "@/shared/services/practiceService";

export async function POST(request: NextRequest) {
  try {

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 400 },
      );
    }

    const { userAnswer, correctSentence, sessionId, sentenceIndex } = body;

    // Validate required fields
    if (!userAnswer || !correctSentence) {
      console.error("Missing required fields:", {
        userAnswer: !!userAnswer,
        correctSentence: !!correctSentence,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: userAnswer and correctSentence",
          received: {
            userAnswer: !!userAnswer,
            correctSentence: !!correctSentence,
          },
        },
        { status: 400 },
      );
    }

    // Call the generateResult function from the main route
    const evaluation = await generateResult(userAnswer, correctSentence);

    // If the answer is correct and we have session info, persist it
    if (evaluation.isCorrect && sessionId) {
      try {
        await markAnswerAsCorrect(sessionId, userAnswer);
      } catch (persistError) {
        console.error("Error persisting correct answer:", persistError);
        // Don't fail the request if persistence fails, just log it
      }
    }

    return NextResponse.json({
      success: true,
      evaluation: {
        isCorrect: evaluation.isCorrect,
        feedback: evaluation.feedback,
        userAnswer,
        correctSentence,
        sessionId,
        sentenceIndex,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error evaluating pronunciation:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate pronunciation attempt",
        errorType: error instanceof Error ? error.constructor.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        evaluation: {
          isCorrect: false,
          feedback:
            "Erro na conexão com o servidor. Verifique sua internet e tente novamente.",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Use POST to evaluate pronunciation attempts",
      example: {
        method: "POST",
        body: {
          userAnswer: "Hello, how are you today?",
          correctSentence: "Hello, how are you today?",
          sessionId: "optional-session-id",
          sentenceIndex: 0,
          userId: "user-firebase-uid",
        },
      },
    },
    { status: 405 },
  );
}
