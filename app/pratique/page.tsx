'use client'; 

import { redirect } from "next/navigation";
import { useUserContext } from "@/shared/contexts/userContext";
import { PracticeContent } from "@/components/PracticeContent/practiceContent";

export default function PratiquePage() {
  const { isAuthenticated, loading } = useUserContext();

  if(loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <PracticeContent />
  );
}
