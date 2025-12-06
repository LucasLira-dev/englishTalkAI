import { NextResponse } from "next/server";
import { generateSession } from "../../../lib/genai";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { adminAuth } from "@/shared/firebaseAdmin";

const db = getFirestore();

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de autenticação não fornecido" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;
    
    // Buscar sessão incompleta existente
    const sessionsRef = db.collection("practiceSessions");
    const q = sessionsRef
      .where("userId", "==", userId)
      .where("completed", "==", false)
      .limit(1);
    
    const querySnapshot = await q.get();
    
    if (!querySnapshot.empty) {
      const sessionDoc = querySnapshot.docs[0];
      return NextResponse.json({
        success: true,
        session: { id: sessionDoc.id, ...sessionDoc.data() },
      });
    }
    
    // Criar nova sessão
    const sentences = await generateSession();
    const sessionData = {
      userId,
      sentences,
      userAnswers: [],
      currentIndex: 0,
      completed: false,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await sessionsRef.add(sessionData);
    
    return NextResponse.json({
      success: true,
      session: { id: docRef.id, ...sessionData, createdAt: new Date() },
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
