import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
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
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId é obrigatório" },
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

    // Marcar sessão como completa
    await sessionRef.update({
      completed: true,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error completing session:", error);
    return NextResponse.json(
      { error: "Erro ao completar sessão" },
      { status: 500 }
    );
  }
}
