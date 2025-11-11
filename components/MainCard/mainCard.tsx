"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { usePractice } from "@/shared/contexts/practiceContext";
import { processSpeechResult } from "@/lib/utils";

export const MainCard = () => {
  const { currentSentence, progress, loading, session, checkAnswer } =
    usePractice();

  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    feedback: string;
  } | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (session) {
      setShowResult(false);
      setLastResult(null);
      setUserAnswer("");
      setIsListening(false);
      setIsAnalyzing(false);
    }
  }, [session]);

  const handleNext = () => {
    setShowResult(false);
    setLastResult(null);
    setUserAnswer("");
  };

  // 🔊 PLAY AUDIO — ajustado para funcionar no celular
  const playAudio = () => {
    if (!currentSentence) return;

    // sempre cancela o que estiver tocando
    window.speechSynthesis.cancel();

    setIsProcessing(true);

    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    // Callback para quando o áudio terminar
    utterance.onend = () => {
      setIsProcessing(false);
    };

    utterance.onerror = () => {
      console.error("Erro ao reproduzir áudio");
      setIsProcessing(false);
      alert("O áudio não pôde ser reproduzido. Tente novamente.");
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Erro ao reproduzir áudio:", err);
      alert("O áudio não pôde ser reproduzido. Tente novamente.");
      setIsProcessing(false);
    }
  };

  // 🎤 PROCESSA RESULTADO
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

  // 🎤 ESCUTAR FALA — ajustado para Android/iOS
  const handleListen = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Reconhecimento de voz não é suportado neste dispositivo. Tente usar o Chrome no Android ou no computador.",
      );
      return;
    }

    // no Android, precisa garantir permissão de microfone
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Permissão para usar o microfone é necessária.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      handleSpeechResult(result);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "network") {
        alert("Erro de rede no reconhecimento de voz. Tente novamente.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  const handleStopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // 🎨 JSX
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
          {currentSentence || "Carregando..."}
        </p>
      </div>

      <Button
        onClick={playAudio}
        variant="outline"
        className="w-full bg-transparent hover:bg-accent/80 hover:text-primary-foreground font-bold cursor-pointer"
        disabled={!currentSentence || isProcessing}
      >
        {isProcessing ? "🔊 Tocando..." : "🔊 Ouvir"}
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
