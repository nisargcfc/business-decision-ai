export default async function handler(req, res) {
  res.status(200).json({ 
    message: "API is working!",
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    method: req.method
  });
}
