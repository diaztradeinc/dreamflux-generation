import axios from 'axios';

export default async function handler(req, res) {
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

  try {
    const response = await axios.post(
      'https://api.modelslab.dev/generate',
      {
        prompt,
        negative_prompt,
        steps,
        sampler,
        cfg,
        seed,
        model
      },
      {
        headers: {
          Authorization: `Bearer ${MODELSLAB_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({ image_url: response.data.image_url });
  } catch (err) {
    console.error('ModelsLab API error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'Image generation failed.' });
  }
}