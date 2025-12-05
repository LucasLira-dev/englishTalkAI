'use client';

import { useRef, useState } from "react";
import { processSpeechResult } from "@/lib/utils";
import { usePractice } from "../contexts/practiceContext";
import { useUserContext } from "../contexts/userContext";
import { transcribeAudio } from "@/shared/services/elevenLabsService";

export const useAudioRecording = () => {
  
  const { currentSentence, progress, session, checkAnswer } =
    usePractice();
  const { user } = useUserContext();
  
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{
    isCorrect: boolean;
    feedback: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const handleListen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        setIsListening(false);
        setIsAnalyzing(true);

        try {
          const transcript = await transcribeAudio(audioBlob);
          await handleSpeechResult(transcript);
        } catch (error) {
          console.error("Erro ao transcrever:", error);
          alert("Erro ao processar áudio.");
        } finally {
          setIsAnalyzing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Permissão para usar o microfone é necessária.");
    }
  };

  const handleStopListening = () => {
    mediaRecorderRef.current?.stop();
    setIsListening(false);
  };
  
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
          userId: user?.uid,
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
  
  return {
    isListening,
    isAnalyzing,
    handleListen,
    handleStopListening,
    setIsListening,
    setIsAnalyzing,
    handleSpeechResult,
    lastResult,
    showResult,
    userAnswer,
    setShowResult,
    setLastResult,
    setUserAnswer
  }
}