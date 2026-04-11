// /api/generate-copy.js
import OpenAI from 'openai';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action, topic, content } = req.query;
    
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is completely missing from physical Vercel Environment.");
    }
    
    const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    if (action === 'hashtags') {
        const payload = content ? decodeURIComponent(content).substring(0, 500) : '';
        if(!payload) return res.status(400).json({ error: "No content provided." });
        
        const completion = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an algorithmic SEO expert. Given a social media post, immediately reply with 5 highly optimized trending hashtags separated by spaces,. DO NOT include any conversation or explanation. Example output: #B2B #Growth #SaaS #Marketing #Tech" },
                { role: "user", content: payload }
            ],
            temperature: 0.2,
        });

        const tags = completion.choices[0].message.content.trim();
        return res.status(200).json({ success: true, hashtags: tags });
        
    } else if (action === 'draft') {
        const payload = topic ? decodeURIComponent(topic).substring(0, 200) : 'General Marketing Growth Tips';
        
        const completion = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Write a short, engaging, highly-viral B2B social media post draft (max 4 sentences) about the provided topic. Do not include hashtags. Keep it strictly professional yet slightly edgy to guarantee algorithmic velocity." },
                { role: "user", content: payload }
            ],
            temperature: 0.7,
        });

        const draft = completion.choices[0].message.content.trim();
        return res.status(200).json({ success: true, text: draft });
    } else if (action === 'email') {
        const payload = topic ? decodeURIComponent(topic).substring(0, 200) : 'Company Updates';
        
        const completion = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Write a short, engaging 2-3 sentence email marketing paragraph based on the user's intent. Make it sound professional yet exciting. IMPORTANT: Return ONLY plain text. Do NOT include any markdown, hyperlinks, brackets, or URLs." },
                { role: "user", content: payload }
            ],
            temperature: 0.7,
        });

        const draft = completion.choices[0].message.content.trim();
        return res.status(200).json({ success: true, text: draft });
    }
    
    return res.status(400).json({ error: "Invalid action routing requested." });
    
  } catch(e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
