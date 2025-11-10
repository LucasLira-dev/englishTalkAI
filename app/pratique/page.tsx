"use client";

import { useRouter } from "next/navigation";
import { useUserContext } from "@/shared/contexts/userContext";
import { PracticeProvider } from "@/shared/contexts/practiceContext";
import { PracticeContent } from "@/components/PracticeContent/practiceContent";
import { Loading } from "@/components/Loading/loading";
import { useEffect } from "react";

export default function PratiquePage() {
  const { isAuthenticated, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname !== "/") {
        router.replace("/");
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <PracticeProvider>
      <PracticeContent />
    </PracticeProvider>
  );
}
