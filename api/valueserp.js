// /api/valueserp.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, location, domain } = req.query;

  const apiKey = process.env.VALUESERP_API_KEY;

  if (!apiKey) {
    // Return mock data for testing while waiting for API key
    return res.status(200).json({
      request_info: { success: true },
      mocked: true,
      organic_results: [
        { position: 1, domain: "competitor.com", title: "Mocked 1", snippet: "..." },
        { position: 2, domain: domain || "mock.com", title: "Your Mocked Result", snippet: "..." },
      ],
      ai_overview: {
        cited_domains: [domain || "mock.com"]
      }
    });
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      q: q || "test",
      location: location || "United States",
      gl: "us",
      hl: "en",
      output: "json",
      include_ai_overview: "true"
    });

    const response = await fetch(`https://api.valueserp.com/search?${params}`);
    const json = await response.json();
    
    return res.status(200).json(json);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
