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
  console.log("[🔧] /api/generate triggered");

  if (req.method !== 'POST') {
    console.warn("[❌] Invalid method:", req.method);
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const {
      prompt,
      negative_prompt,
      width,
      height,
      samples,
      steps,
      sampler,
      cfg,
      seed,
      safety_checker,
      base64,
      instant_response,
      model
    } = req.body;

    console.log("[✅] Received POST payload");

    const MODELSLAB_API_KEY = process.env.MODELSLAB_API_KEY;
    if (!MODELSLAB_API_KEY) {
      console.error("[❌] Missing MODELSLAB_API_KEY");
      return res.status(500).json({ error: 'Missing MODELSLAB_API_KEY' });
    }

    const resolvedModel = modelMap[model] || model;
    const resolvedSampler = samplerMap[sampler] || sampler;

    const payload = {
      key: MODELSLAB_API_KEY,
      prompt,
      negative_prompt,
      width: parseInt(width),
      height: parseInt(height),
      samples: parseInt(samples),
      steps: parseInt(steps),
      guidance_scale: parseFloat(cfg),
      seed,
      safety_checker,
      base64,
      instant_response,
      model_id: resolvedModel,
      sampler: resolvedSampler
    };

    console.log("[📦] Sending payload to ModelsLab:", payload);

    const response = await axios.post(
      "https://modelslab.com/api/v6/realtime/text2img",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("[✅] ModelsLab API response received");
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

    console.error("[💥] API Error:", errorDetails);
    return res.status(500).json({ error: 'ModelsLab error', details: errorDetails, status });
  }
}