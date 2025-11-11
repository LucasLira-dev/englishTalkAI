export const textToSpeech = async (text: string): Promise<void> => {
  const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
  const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

  if (!API_KEY) {
    throw new Error(
      "NEXT_PUBLIC_ELEVENLABS_API_KEY não encontrada nas variáveis de ambiente",
    );
  }

  try {
    // Fazer requisição direta para a API do ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Erro na API do ElevenLabs: ${response.status} ${response.statusText}`,
      );
    }

    // Converter resposta para ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();

    // Verificar se AudioContext está disponível
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("AudioContext não é suportado neste navegador");
    }

    // Criar contexto de áudio
    const audioContext = new AudioContextClass();

    // Decodificar dados de áudio
    const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);

    // Criar fonte e reproduzir
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    // Retornar promise que resolve quando o áudio termina
    return new Promise<void>((resolve) => {
      source.onended = () => resolve();

      // Timeout como fallback caso onended não funcione
      setTimeout(
        () => {
          resolve();
        },
        audioBuffer.duration * 1000 + 1000,
      );
    });
  } catch (error) {
    console.error("Erro no serviço ElevenLabs:", error);
    throw error;
  }
};

export async function transcribeAudio(blob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn("ElevenLabs failed, trying Web Speech API fallback...");
      return await transcribeWithWebSpeechAPI();
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Erro no serviço ElevenLabs:", error);
    console.log("Fallback para Web Speech API...");
    return await transcribeWithWebSpeechAPI();
  }
}

// Fallback function using Web Speech API
async function transcribeWithWebSpeechAPI(): Promise<string> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error("Neither ElevenLabs nor Web Speech API are available"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    let hasResult = false;

    recognition.onresult = (event: any) => {
      hasResult = true;
      const transcript = event.results[0][0].transcript;
      resolve(transcript.trim());
    };

    recognition.onerror = (event: any) => {
      reject(new Error(`Web Speech API error: ${event.error}`));
    };

    recognition.onend = () => {
      if (!hasResult) {
        reject(new Error("No speech detected"));
      }
    };

    try {
      recognition.start();
    } catch (error) {
      reject(new Error("Failed to start Web Speech API"));
    }
  });
}
