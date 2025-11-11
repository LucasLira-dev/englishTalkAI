import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo recebido" },
        { status: 400 },
      );
    }

    const elevenKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!elevenKey) {
      throw new Error("Chave da ElevenLabs não configurada");
    }

      // envia para a API da ElevenLabs
      const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text/convert", {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
        },
        body: (() => {
          const fd = new FormData();
          fd.append("file", file, "audio.webm");
          fd.append("model_id", "scribe_v1");
          fd.append("language_code", "en");
          return fd;
        })(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro ElevenLabs:", data);
      return NextResponse.json(
        { error: "Erro na transcrição" },
        { status: 500 },
      );
    }

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Erro no backend STT:", error);
    return NextResponse.json(
      { error: "Falha ao processar áudio" },
      { status: 500 },
    );
  }
}
