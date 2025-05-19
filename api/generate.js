export default async function handler(req, res) {
  console.log("[FUNCTION HIT] /api/generate.js");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  console.log("[REQUEST RECEIVED]:", req.body);

  // Return a static test image to confirm end-to-end flow
  return res.status(200).json({
    image_url: "https://via.placeholder.com/512x512.png?text=Test+Image"
  });
}