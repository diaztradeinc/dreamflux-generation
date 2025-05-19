import axios from 'axios';

export default async function handler(req, res) {
  console.log("[FUNCTION HIT] /api/generate.js");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const {
    prompt,
    negative_prompt,
    steps,
    sampler,
    cfg,
    seed,
    model
  } = req.body;

  const MODELSLAB_API_KEY = process.env.MODELSLAB_API_KEY;
  if (!MODELSLAB_API_KEY) {
    return res.status(500).json({ error: 'Missing MODELSLAB_API_KEY' });
  }

  const payload = {
    key: MODELSLAB_API_KEY,
    prompt,
    negative_prompt,
    steps,
    sampler,
    cfg,
    seed,
    model
  };

  console.log("[REQUEST PAYLOAD]:", payload);

  try {
    const response = await axios.post(
      "https://modelslab.com/api/v6/realtime/text2img",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("[MODELSLAB RESPONSE]:", response.data);
    return res.status(200).json(response.data);
  } catch (err) {
    const errorDetails = err?.response?.data || err.message;
    console.error("[MODELSLAB ERROR]:", errorDetails);
    return res.status(500).json({ error: 'ModelsLab error', details: errorDetails });
  }
}