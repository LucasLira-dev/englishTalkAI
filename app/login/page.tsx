'use client'; 

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { useUserContext } from "@/shared/contexts/userContext";
import { ButtonLogin } from "@/components/ButtonLogin/buttonLogin";

export default function LoginPage() {
  
  const { isAuthenticated, loading } = useUserContext();
  
  if (loading) return <div>Loading...</div>;
  
  if (isAuthenticated) {
    redirect('/')
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 border border-border shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-primary to-accent mb-4">
              <span className="text-lg font-bold text-primary-foreground">
                ✨
              </span>
            </div>
            <h1 className="font-bold text-2xl mb-2">
              Welcome to EnglishTalkAI
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com o Google para começar a praticar inglês
            </p>
          </div>
          <ButtonLogin />
        </Card>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
