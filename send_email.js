const apiKey = "re_3eVScRzb_A9aRWSAehZYgKEFj4sCai6eB";

async function send() {
  const req = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Nexus God-Mode <admin@75squared.com>",
      to: ["cgetchman@gmail.com", "chandratoy@gmail.com"],
      subject: "[Deployment] Nexus Network Live on Vercel Edge",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h1 style="color: #6366f1;">75² Nexus: Physical Email Delivery Confirmed.</h1>
          <p>This email was securely delivered to your personal inboxes directly from the Nexus God-Mode terminal via the Resend API.</p>
          <ul>
            <li><strong>Verified Domain:</strong> 75squared.com</li>
            <li><strong>SMTP Engine:</strong> Resend Active</li>
            <li><strong>Database:</strong> Natively wired to Supabase Vault</li>
          </ul>
          <p>Please check the local dashboard. If you ran the Supabase SQL injection, your Audience CRM tab should physically display these two targeted email addresses.</p>
          <a href="http://localhost:5173/admin" style="display:inline-block; padding: 12px 24px; background: black; color: white; text-decoration: none; border-radius: 8px;">View Application</a>
        </div>
      `
    })
  });
  const res = await req.json();
  console.log(res);
}
send();
