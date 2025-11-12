"use client";

import { useEffect, useState } from "react";

export function Loading() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 25;
      });
    }, 250);

    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 600);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-linear-to-br from-background via-background to-background flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Large gradient orbs with smooth animation */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-3/4 left-3/4 w-80 h-80 bg-linear-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center gap-12">
        {/* Logo with animated pulse */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary rounded-full"
              style={{
                animation: "spin 3s linear infinite",
              }}
            ></div>

            {/* Middle rotating ring */}
            <div
              className="absolute inset-2 border-2 border-transparent border-b-accent border-l-accent rounded-full"
              style={{
                animation: "spin 2s linear infinite reverse",
              }}
            ></div>

            {/* Center icon */}
            <div className="text-5xl relative z-10 animate-pulse">🎤</div>
          </div>

          <h2 className="text-xl font-display font-bold text-foreground text-center">
            EnglishTalkAI
          </h2>
        </div>

        {/* Status text with dynamic messages */}
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-sm font-medium text-muted-foreground text-center min-h-6">
            {progress < 25 && "Iniciando sessão de aprendizado..."}
            {progress >= 25 && progress < 50 && "Preparando o tutor de IA..."}
            {progress >= 50 &&
              progress < 75 &&
              "Ativando reconhecimento de voz..."}
            {progress >= 75 && progress < 95 && "Finalizando configurações..."}
            {progress >= 95 && "Pronto para começar!"}
          </p>

          {/* Enhanced progress bar with gradient */}
          <div className="w-full space-y-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-linear-to-r from-primary via-accent to-primary rounded-full transition-all duration-300 ease-out shadow-lg shadow-primary/50"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Animated dots indicator */}
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              style={{
                animation: `wave 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Floating particles effect */}
        <FloatingParticles />
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }

        @keyframes floatLeft {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function FloatingParticles() {
  const [particles] = useState(() => {
    return [...Array(6)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationName: Math.random() > 0.5 ? "float" : "floatLeft",
      delay: i * 0.5,
    }));
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/40 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animation: `${particle.animationName} 3s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
