"use client";

import React from "react";

type LastResult = {
  isCorrect: boolean;
  feedback: string;
} | null;

type Props = {
  isListening: boolean;
  isAnalyzing: boolean;
  showResult: boolean;
  lastResult: LastResult;
  userAnswer: string;
};

export const AudioFeedback: React.FC<Props> = ({
  isListening,
  isAnalyzing,
  showResult,
  lastResult,
  userAnswer,
}) => {
  return (
    <div className="p-4 flex flex-col justify-center items-center shadow-md border border-gray-300 rounded-md w-full">
      <div className="text-center">
        {isListening ? (
          <>
            <p className="text-2xl mb-2 animate-pulse">🎤</p>
            <p className="text-sm text-muted-foreground">Ouvindo...</p>
          </>
        ) : isAnalyzing ? (
          <>
            <p className="text-2xl mb-2">⏳</p>
            <p className="text-sm text-muted-foreground">
              Analisando sua pronúncia...
            </p>
          </>
        ) : showResult && lastResult ? (
          <>
            <p className="text-2xl mb-2">
              {lastResult.isCorrect ? "✅" : "❌"}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              {lastResult.feedback}
            </p>
            <p className="text-xs text-muted-foreground">
              Você disse: &quot;{userAnswer}&quot;
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl mb-2">🎤</p>
            <p className="text-sm text-muted-foreground">
              Clique para começar a falar
            </p>
          </>
        )}
      </div>
    </div>
  );
};