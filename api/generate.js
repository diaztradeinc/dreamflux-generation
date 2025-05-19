import axios from 'axios';

const samplerMap = {
  "Euler A": "euler_a",
  "DDIM": "ddim",
  "Heun": "heun",
  "DPM++ 2M": "dpmpp_2m"
};

const modelMap = {
  "Realistic Vision": "realistic-vision-v51",
  "Deliberate": "deliberate-v2",
  "DreamShaper": "dreamshaper-v8",
  "MeinaMix": "meinamix",
  "Protogen": "protogen-x3.4",
  "ReV Animated": "rev-animated",
  "PastelMix": "pastelmix",
  "Counterfeit": "counterfeit-v30",
  "Analog Madness": "analog-madness",
  "Absolute Reality": "absolute-reality-v1",
  "EpicRealism": "epicrealism",
  "CyberRealistic": "cyberrealistic",
  "AbyssOrangeMix3 (AOM3)": "aom3",
  "ChilloutMix": "chilloutmix",
  "Anything V3": "anything-v3"
};

export default async function handler(req, res) {
  console.log("[FUNCTION HIT] /api/generate.js");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  let {
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

  model = modelMap[model] || model;
  sampler = samplerMap[sampler] || sampler;

  const payload = {
    key: MODELSLAB_API_KEY,
    prompt,
    negative_prompt,
    width: 512,
    height: 512,
    samples: 1,
    safety_checker: true,
    base64: false,
    instant_response: false,
    steps: steps || 30,
    guidance_scale: cfg || 7,
    seed: seed || null,
    model_id: model
  };

  console.log("[NORMALIZED PAYLOAD]:", payload);

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
    const status = err?.response?.status;
    const contentType = err?.response?.headers?.["content-type"];
    let errorDetails = "Unknown error";

    if (err?.response?.data && typeof err.response.data === "string" && contentType?.includes("text/html")) {
      errorDetails = err.response.data;
    } else if (err?.response?.data) {
      errorDetails = err.response.data;
    } else {
      errorDetails = err.message;
    }

    console.error("[MODELSLAB ERROR]:", errorDetails);
    return res.status(500).json({ error: 'ModelsLab error', details: errorDetails, status });
  }
}