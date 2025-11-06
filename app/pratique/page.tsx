'use client';

import { MainCard } from "@/components/MainCard/mainCard";
import { PracticeHeader } from "@/components/PracticeHeader/practiceHeader";
import { ProgressBar } from "@/components/ProgressBar/progressBar";
import { useState } from 'react';

export default function PratiquePage() {
  
  const [sessionProgress, setSessionProgress] = useState(1);
  
  return (
    <main
    className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <PracticeHeader />
        <ProgressBar sessionProgress={sessionProgress} />
        <MainCard />
      </div>
    </main>
  );
}