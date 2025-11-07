"use client";

import { MainCard } from "../MainCard/mainCard";
import { PracticeHeader } from "../PracticeHeader/practiceHeader";
import { ProgressBar } from "../ProgressBar/progressBar";

export const PracticeContent = () => {
  return (
    <main className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <PracticeHeader />
        <ProgressBar />
        <MainCard />
      </div>
    </main>
  );
};
