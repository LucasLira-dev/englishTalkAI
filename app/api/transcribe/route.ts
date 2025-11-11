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

    console.log("File received:", {
      size: file.size,
      type: file.type,
    });

    const elevenKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!elevenKey) {
      throw new Error("Chave da ElevenLabs não configurada");
    }

    // Preparar FormData para speech-to-text
    const fd = new FormData();
    fd.append("file", file, "audio.webm");
    fd.append("model_id", "scribe_v1");

    // Try speech-to-text directly - skip voices permission check
    const response = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
        },
        body: fd,
      },
    );

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      console.error("Response text:", responseText);
      return NextResponse.json(
        { error: "Invalid response from ElevenLabs" },
        { status: 500 },
      );
    }

    if (!response.ok) {
      console.error("Erro ElevenLabs:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
        responseText: responseText,
      });

      let errorMessage = "Erro na transcrição";
      if (response.status === 402) {
        errorMessage = "Créditos insuficientes na conta ElevenLabs";
      } else if (response.status === 401) {
        errorMessage = "API key inválida ou sem permissões para speech-to-text";
      } else if (response.status === 404) {
        errorMessage =
          "Endpoint não encontrado - verifique se speech-to-text está disponível no seu plano";
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: data,
          status: response.status,
          needsUpgrade: response.status === 402 || response.status === 404,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Erro no backend STT:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Falha ao processar áudio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
