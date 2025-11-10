"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/shared/firebase";
import { markSessionAsCompleted } from "../services/practiceService";
import { PracticeSession } from "../services/practiceService";
import { useUserContext } from "@/shared/contexts/userContext";
import { updateSessionProgress } from "@/lib/utils";

interface PracticeContextType {
  session: PracticeSession | null;
  loading: boolean;
  completeSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
  currentSentence: string | null;
  progress: number;
  checkAnswer: (answer: string) => Promise<void>;
}

const PracticeContext = createContext<PracticeContextType>(null!);

export function PracticeProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSentence, setCurrentSentence] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { user } = useUserContext();

  // 🔹 Busca ou cria sessão quando o usuário loga
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function loadSession() {
    console.log("Loading session...");
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid }),
      });

      const data = await res.json();
      setSession(data.session);
      console.log(data.session);
      setCurrentSentence(data.session.sentences[data.session.currentIndex]);
      setProgress(data.session.currentIndex + 1);
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Quando o usuário termina todas as frases
  async function completeSession() {
    if (!session) return;

    try {
      // 1. Marca sessão atual como completa
      await markSessionAsCompleted(session.id);

      // 2. Busca ou cria uma nova
      await loadSession();
    } catch (error) {
      console.error("Error completing session:", error);
    }
  }

  // checar se usuario acertou
  async function checkAnswer(answer: string) {
    if (!session) return;

    try {
      await updateSessionProgress(
        session.id,
        answer,
        setProgress,
        setCurrentSentence,
        session.sentences,
        progress,
        completeSession,
      );
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  }

  return (
    <PracticeContext.Provider
      value={{
        session,
        loading,
        completeSession,
        refreshSession: loadSession,
        currentSentence,
        progress,
        checkAnswer,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export const usePractice = () => useContext(PracticeContext);
