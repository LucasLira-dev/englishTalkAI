"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { usePractice } from "@/shared/contexts/practiceContext";
import { processSpeechResult } from "@/lib/utils";

export const MainCard = () => {
  const {
    currentSentence,
    progress,
    loading,
    session,
    checkAnswer,
  } = usePractice();

  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    feedback: string;
  } | null>(null);

  // Speech recognition refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // const isRecognitionSupported = useRef(false);

  // Reset states when a new session is loaded
  useEffect(() => {
    if (session) {
      setShowResult(false);
      setLastResult(null);
      setUserAnswer("");
      setIsListening(false);
      setIsAnalyzing(false);
    }
  }, [session]); // Reset when session changes

  const handleNext = () => {
    setShowResult(false);
    setLastResult(null);
    setUserAnswer("");
  };

  // Função para processar a resposta do usuário
  const handleSpeechResult = async (transcript: string) => {
    setUserAnswer(transcript);
    setIsAnalyzing(true);

    try {
      const result = await processSpeechResult(
        transcript,
        {
          transcript,
          currentSentence,
          sessionId: session?.id,
          progress,
        },
        checkAnswer,
      );

      setLastResult(result.result);
      setShowResult(true);
    } catch (error) {
      console.error("Speech evaluation error:", error);
      setLastResult({
        isCorrect: false,
        feedback: "Erro inesperado. Tente novamente.",
      });
      setShowResult(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleListen = () => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!speechRecognition) {
      console.error("Speech recognition not supported");
      return;
    }
    const recognition = new speechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      handleSpeechResult(result);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const playAudio = () => {
    if (currentSentence) {
      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="bg-primary-foreground flex flex-col gap-6 items-center justify-center p-6 border shadow-lg rounded-md min-w-full">
        <div className="text-center">
          <p className="text-2xl mb-2">⏳</p>
          <p className="text-sm text-muted-foreground">
            Gerando nova sessão...
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
          &quot; {currentSentence || "Carregando..."} &quot;
        </p>
      </div>

      <Button
        onClick={playAudio}
        variant="outline"
        className="w-full bg-transparent hover:bg-accent/80 hover:text-primary-foreground font-bold cursor-pointer"
        disabled={!currentSentence}
      >
        🔊 Ouvir
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
