import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
//
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const firestore = getFirestore(app);
export const auth = getAuth(app);

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider);
};

export async function getUnCompletedSession(userId: string) {
  const sessionRef = collection(firestore, "practiceSessions");

  const q = query(
    sessionRef,
    where("userId", "==", userId),
    where("completed", "==", false),
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Retorna a primeira sessão encontrada (pode haver mais de uma, mas normalmente deve ter só uma)
    const sessionDoc = querySnapshot.docs[0];
    return { id: sessionDoc.id, ...sessionDoc.data() };
  } else {
    // Nenhuma sessão incompleta encontrada
    return null;
  }
}
