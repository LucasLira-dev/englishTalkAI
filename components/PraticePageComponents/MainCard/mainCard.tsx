"use client";

import { useState, useEffect } from "react";
import { usePractice } from "@/shared/contexts/practiceContext";
import { textToSpeech } from "@/shared/services/elevenLabsService";
import { useAudioRecording } from "@/shared/hooks/useAudioRecording";
import { PlayAudioButton } from "../PlayAudioButton/playAudioButton";
import { VoiceButton } from "../VoiceButton/voiceButton";
import { AudioFeedback } from "../AudioFeedback/audioFeedback";


export const MainCard = () => {
  const { currentSentence, progress, loading, session } =
    usePractice();

  const { setShowResult, setLastResult, setUserAnswer, setIsListening, setIsAnalyzing, isAnalyzing, isListening, lastResult, showResult, userAnswer, handleListen, handleStopListening } = useAudioRecording();

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
      
      <PlayAudioButton 
      currentSentence={currentSentence} 
      isProcessing={isProcessing} 
      playAudio={playAudio} />
      
      <p className="text-sm mt-4">Agora repita a frase</p>

      <AudioFeedback
        isListening={isListening}
        isAnalyzing={isAnalyzing}
        showResult={showResult}
        lastResult={lastResult}
        userAnswer={userAnswer}
      />

      <VoiceButton
        currentSentence={currentSentence}
        handleNext={handleNext}
        isListening={isListening}
        isAnalyzing={isAnalyzing}
        showResult={showResult}
        handleListen={handleListen}
        handleStopListening={handleStopListening}
      />
    </div>
  );
};