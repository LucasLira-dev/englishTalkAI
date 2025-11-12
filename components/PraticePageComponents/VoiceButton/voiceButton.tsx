'use client';

import { Button } from "@/components/ui/button";

interface VoiceButtonProps {
  currentSentence: string | null;
  handleNext: () => void;
  isListening: boolean;
  isAnalyzing: boolean;
  showResult: boolean;
  handleListen: () => void;
  handleStopListening: () => void;
}

export const VoiceButton = ({
  currentSentence,
  handleNext,
  isListening,
  isAnalyzing,
  showResult,
  handleListen,
  handleStopListening,
}: VoiceButtonProps) => {
  return (
    <div className="flex gap-4 w-full">
      {showResult ? (
        <Button
          onClick={handleNext}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          size="lg"
        >
          Continuar
        </Button>
      ) : !isListening && !isAnalyzing ? (
        <Button
          onClick={handleListen}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          size="lg"
          disabled={!currentSentence}
        >
          🎤 Comece a falar
        </Button>
      ) : (
        <Button
          onClick={handleStopListening}
          disabled={isAnalyzing}
          className="flex-1 bg-accent hover:bg-accent/90"
          size="lg"
        >
          {isAnalyzing ? "⏳ Analisando..." : "⏹️ Parar"}
        </Button>
      )}
    </div>
  );
};