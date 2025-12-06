import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore, auth } from "../firebase";

export interface PracticeSession {
  userId: string;
  sentences: string[];
  id: string;
  userAnswers: string[];
  currentIndex: number;
  completed: boolean;
  createdAt: Timestamp;
}

// Helper function to get auth token
async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  return await user.getIdToken();
}

export async function savePracticeSession(userId: string, sentences: string[]) {
  const sessionData = {
    userId,
    sentences,
    userAnswers: [],
    currentIndex: 0,
    completed: false,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(firestore, "practiceSessions"),
    sessionData,
  );
  return { id: docRef.id, ...sessionData };
}

export async function markSessionAsCompleted(sessionId: string) {
  const token = await getAuthToken();

  const response = await fetch("/api/completeSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao completar sessão");
  }

  return await response.json();
}

export async function markAnswerAsCorrect(sessionId: string, answer: string) {
  const token = await getAuthToken();

  const response = await fetch("/api/updateProgress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, answer }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar progresso");
  }

  const result = await response.json();
  return result; // Retorna { success: true, newCurrentIndex }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function incrementCurrentIndex(_sessionId: string) {
  // Esta função não é mais necessária, pois o incremento é feito junto com markAnswerAsCorrect
  // Mantendo por compatibilidade, mas não faz nada
  console.warn("incrementCurrentIndex is deprecated, use markAnswerAsCorrect instead");
}
