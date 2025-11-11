import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.TTSFORFREE_API_KEY!;
  const { text } = req.body;

  try {
    // 1. Cria o job de TTS
    const createRes = await fetch("https://api.ttsforfree.com/api/tts/createby", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Texts: text,
        Voice: "v1:YPj2X6j04RZcJdGzo-CC0GBpkJ985PD5X_VWU_nJkNzppGtbnxJL-dU_hglv", // exemplo: voz em inglês (pegue do endpoint getListVoice)
        Pitch: 0,
        ConnectionId: "",
        CallbackUrl: "",
      }),
    });

    const job = await createRes.json();
    const jobId = job.jobId;

    // 2. Polling para aguardar áudio pronto
    let audioUrl = "";
    for (let i = 0; i < 10; i++) {
      const statusRes = await fetch(`https://api.ttsforfree.com/api/tts/status/${jobId}`, {
        headers: { "X-API-Key": apiKey },
      });
      const status = await statusRes.json();

      if (status.Status === "SUCCESS") {
        audioUrl = status.FilePath;
        break;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!audioUrl) {
      return res.status(500).json({ error: "Audio generation timed out" });
    }

    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "TTS failed" });
  }
}
