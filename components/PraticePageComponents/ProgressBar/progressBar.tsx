"use client";

import { usePractice } from "@/shared/contexts/practiceContext";

export const ProgressBar = () => {
  const { progress } = usePractice();
  

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full transition-colors ${
              index < progress ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      <div className="text-center mt-2">
        <span className="text-sm text-muted-foreground">
          {progress} de 6
        </span>
      </div>
    </div>
  );
};
