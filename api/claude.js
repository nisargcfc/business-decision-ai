// (for Vercel serverless function)

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
  
    try {
      const { prompt } = req.body;
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY, // Note: no REACT_APP_ prefix
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-0",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Claude API Error ${response.status}:`, errorData);
        res.status(response.status).json({ error: 'Claude API error', details: errorData });
        return;
      }
  
      const data = await response.json();
      res.status(200).json(data);
      
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }