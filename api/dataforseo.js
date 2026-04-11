// /api/dataforseo.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { domain, action } = req.query;
  
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return res.status(500).json({ error: "Missing DataForSEO credentials in .env.local" });
  }

  const authBuffer = Buffer.from(`${login}:${password}`).toString('base64');
  const authHeader = `Basic ${authBuffer}`;

  try {
    if (action === 'backlinks') {
      // Fetch domain backlink summary
      const response = await fetch("https://api.dataforseo.com/v3/backlinks/summary/live", {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            target: domain,
            internal_list_limit: 10,
            backlinks_status_type: "all"
          }
        ])
      });

      const json = await response.json();
      return res.status(200).json(json);
    } 
    
    // ... we can add 'audit' or 'keywords' actions here.
    // For now, return a basic success if we just ping info.
    return res.status(400).json({ error: "Invalid action" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
