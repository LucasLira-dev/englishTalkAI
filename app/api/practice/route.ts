import { NextResponse } from "next/server";
import { generateSession } from "../../../lib/genai";
import { savePracticeSession } from "@/shared/services/practiceService";
import { getUnCompletedSession } from "@/shared/firebase";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    const existingSession = await getUnCompletedSession(userId);
    if (existingSession) {
      return NextResponse.json({
        success: true,
        session: existingSession,
      });
    }
    

    // Generate 6 sentences for the session
    const sentences = await generateSession();
    const newSession = await savePracticeSession(userId, sentences);


    return NextResponse.json({
      success: true,
      session: newSession,
    });
  } catch (error) {
    console.error("Error creating practice session:", error);

    // Return fallback session in case of error
    const fallbackSession = {
      id: Date.now().toString(),
      sentences: [
        "Hello, how are you today?",
        "I love reading books in my free time.",
        "The weather is beautiful this morning.",
        "Would you like to join us for dinner?",
        "I think learning new languages is fascinating.",
        "Technology has changed our lives dramatically.",
      ],
      currentIndex: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      session: fallbackSession,
    });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Use POST to create a new practice session",
    },
    { status: 405 },
  );
}
