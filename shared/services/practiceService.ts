import { addDoc, collection, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export interface PracticeSession {
  userId: string;
  sentences: string[];
  id: string;
  userAnswers: string[];
  currentIndex: number;
  completed: boolean;
  createdAt: Timestamp;
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

  const docRef = await addDoc(collection(firestore, "practiceSessions"), sessionData);
  return { id: docRef.id, ...sessionData };
}


export async function markSessionAsCompleted(sessionId: string) {
  const sessionDoc = doc(firestore, "practiceSessions", sessionId);
  await updateDoc(sessionDoc, { completed: true });
}