import axios from 'axios';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const ipRequestMap = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const now = Date.now();
  if (!ipRequestMap[ip]) ipRequestMap[ip] = [];
  ipRequestMap[ip] = ipRequestMap[ip].filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (ipRequestMap[ip].length >= RATE_LIMIT_MAX_REQUESTS) {
    console.warn(`[RATE LIMIT] IP: ${ip}`);
    return res.status(429).json({ error: 'Too many requests. Please wait.' });
  }
  ipRequestMap[ip].push(now);

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
  if (!MODELSLAB_API_KEY) return res.status(500).json({ error: 'Missing API key' });

  console.log("[REQUEST BODY]:", {
    model,
    prompt,
    negative_prompt,
    steps,
    sampler,
    cfg,
    seed
  });

  if (!prompt || typeof prompt !== 'string' || prompt.length < 3) {
    return res.status(400).json({ error: 'Invalid or missing prompt' });
  }

  try {
    const response = await axios.post(
      "https://api.modelslab.dev/generate",
      {
        model,
        prompt,
        negative_prompt,
        steps,
        sampler,
        cfg,
        seed
      },
      {
        headers: {
          Authorization: `Bearer ${MODELSLAB_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("[MODELSLAB RESPONSE]:", response.data);
    return res.status(200).json({ image_url: response.data.image_url });
  } catch (err) {
    console.error("[MODELSLAB ERROR]:", err?.response?.data || err.message);
    return res.status(500).json({ error: 'Image generation failed.' });
  }
}