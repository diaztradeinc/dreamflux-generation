export default async function handler(req, res) {
  console.log("[FUNCTION LOADED] /api/generate.js");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  return res.status(200).json({ message: 'Generate endpoint active' });
}