export default async function handler(req, res) {
  console.log("[FUNCTION HIT] /api/generate.js");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  console.log("[REQUEST RECEIVED]:", req.body);

  // Return a new static test image from a reliable source
  return res.status(200).json({
    image_url: "https://placekitten.com/512/512"
  });
}