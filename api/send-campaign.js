export default async function handler(req, res) {
  // CORS Preflight headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
     return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, subject_line, body_content, recipients } = req.body;
  if (!body_content || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
     return res.status(400).json({ error: "Invalid payload. Target audience missing or content empty." });
  }

  const apiKey = "re_3eVScRzb_A9aRWSAehZYgKEFj4sCai6eB";

  try {
     const strippedText = body_content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

     const emailPayload = {
       from: "Nexus Broadcasting <admin@75squared.com>",
       to: recipients.map(r => r.email),
       subject: subject_line || title || "Notification from 75squared.com",
       html: body_content,
       text: strippedText || "Please view this email in an HTML compatible client.",
     };

     const sendReq = await fetch("https://api.resend.com/emails", {
       method: "POST",
       headers: {
         "Authorization": `Bearer ${apiKey}`,
         "Content-Type": "application/json"
       },
       body: JSON.stringify(emailPayload)
     });

     const sendRes = await sendReq.json();

     if (!sendReq.ok) {
        throw new Error(sendRes.message || 'Failed to dispatch via Resend');
     }

     return res.status(200).json({ success: true, message: `Successfully blasted to ${recipients.length} recipients.` });
  } catch(error) {
     return res.status(500).json({ error: error.message });
  }
}
