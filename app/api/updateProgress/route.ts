import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { adminAuth } from "@/shared/firebaseAdmin";

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = req.headers.get("Authorization");
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

    // Obter dados da requisição
    const { sessionId, answer } = await req.json();

    if (!sessionId || !answer) {
      return NextResponse.json(
        { error: "sessionId e answer são obrigatórios" },
        { status: 400 }
      );
    }

    // Referência ao documento da sessão
    const sessionRef = db.collection("practiceSessions").doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return NextResponse.json(
        { error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    const sessionData = sessionDoc.data();

    // Verificar se a sessão pertence ao usuário
    if (sessionData?.userId !== userId) {
      return NextResponse.json(
        { error: "Acesso não autorizado a esta sessão" },
        { status: 403 }
      );
    }

    // Atualizar a sessão: adicionar resposta e incrementar índice
    const currentIndex = sessionData.currentIndex || 0;
    const newCurrentIndex = currentIndex + 1;

    await sessionRef.update({
      userAnswers: FieldValue.arrayUnion(answer),
      currentIndex: newCurrentIndex,
    });

    return NextResponse.json({
      success: true,
      newCurrentIndex,
    });
  } catch (error) {
    console.error("Error updating session progress:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar progresso da sessão" },
      { status: 500 }
    );
  }
}
