// /api/sentiment.js
import OpenAI from 'openai';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query.q || '75squared';
  
  try {
    const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // In a real heavy-duty enterprise app we would use Google Custom Search API or BrandWatch.
    // For this physical logic layer, we use OpenAI to dynamically simulate a real-time web scrape aggregation.
    const completion = await ai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a real-time brand sentiment analyzer. The user will provide a brand string. Generate a highly realistic JSON output representing live internet mentions across Twitter, Reddit, and TrustPilot from the past 24 hours. The JSON must exactly match this structure: { positiveScore: 84, neutralScore: 12, negativeScore: 4, mentions: [ { platform: 'Twitter', time: '5 mins ago', text: 'mention text', sentiment: 'Positive', color: 'green' } ] }. Ensure metrics sum to 100. Generate exactly 3 realistic mentions tailored to the brand." },
            { role: "user", content: `Brand Query: ${query}` }
        ],
        temperature: 0.6,
        response_format: { type: "json_object" }
    });

    const payload = JSON.parse(completion.choices[0].message.content);
    
    return res.status(200).json({ success: true, analytics: payload });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
