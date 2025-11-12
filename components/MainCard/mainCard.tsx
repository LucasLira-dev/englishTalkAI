"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { usePractice } from "@/shared/contexts/practiceContext";
import { textToSpeech } from "@/shared/services/elevenLabsService";
import { useAudioRecording } from "@/shared/hooks/useAudioRecording";


export const MainCard = () => {
  const { currentSentence, progress, loading, session } =
    usePractice();
  
  const { handleListen, showResult, setShowResult, setLastResult, setUserAnswer, setIsListening, setIsAnalyzing, isListening, isAnalyzing, lastResult, userAnswer, handleStopListening } = useAudioRecording();

  const [isProcessing, setIsProcessing] = useState(false)


  useEffect(() => {
    if (session) {
      setShowResult(false);
      setLastResult(null);
      setUserAnswer("");
      setIsListening(false);
      setIsAnalyzing(false);
    }
  }, [session, setShowResult, setLastResult, setUserAnswer, setIsListening, setIsAnalyzing]);

  const handleNext = () => {
    setShowResult(false);
    setLastResult(null);
    setUserAnswer("");
  };

  // 🔊 PLAY AUDIO — ajustado para funcionar no celular
  const playAudio = async () => {
    if (!currentSentence) return;

    setIsProcessing(true);

    try {
      await textToSpeech(currentSentence);
    } catch (error) {
      setIsProcessing(false);
      console.error("Erro ao reproduzir áudio:", error);
    }
    setIsProcessing(false);
  };
  

  // 🎨 JSX
  if (loading) {
    return (
      <div className="bg-primary-foreground flex flex-col gap-6 items-center justify-center p-6 border shadow-lg rounded-md min-w-full">
        <div className="text-center">
          <p className="text-2xl mb-2">⏳</p>
          <p className="text-sm text-muted-foreground">
            Buscando sessão...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-foreground flex flex-col gap-6 items-center justify-center p-6 border shadow-lg rounded-md min-w-full">
      <div className="text-center w-full">
        <p className="text-sm mb-2">Pergunta {progress} de 6</p>
        <p className="text-sm">Ouça a frase:</p>
      </div>

      <div className="p-4 bg-chart-2/95 rounded-md text-primary-foreground w-full text-center">
        <p className="text-md font-bold">
          {currentSentence || "Carregando..."}
        </p>
      </div>

      <Button
        onClick={playAudio}
        variant="outline"
        className="w-full bg-transparent hover:bg-accent/80 hover:text-primary-foreground font-bold cursor-pointer"
        disabled={!currentSentence || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <span className="inline-block animate-sway">🔊</span>
            <span>Carregando áudio...</span>
          </div>
        ) : (
          "🔊 Ouvir"
        )}
      </Button>

      <p className="text-sm mt-4">Agora repita a frase</p>

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
    </div>
  );
};