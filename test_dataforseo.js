const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;
if (!login || !password) {
  console.error("Missing DataForSEO credentials in .env.local!");
  process.exit(1);
}

const authBuffer = Buffer.from(`${login}:${password}`).toString('base64');
const authHeader = `Basic ${authBuffer}`;

async function testConnection() {
  console.log("Initiating highly-secure uplink to DataForSEO mainframes...");
  
  try {
    // Ping the User Data API to check our balance
    const response = await fetch("https://api.dataforseo.com/v3/appendix/user_data", {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    console.log("✅ Uplink Established!");
    console.log("-----------------------------------------");
    console.log(`Account Email: ${json.tasks[0].result[0].login}`);
    console.log(`Remaining Balance: $${json.tasks[0].result[0].money.balance}`);
    console.log("-----------------------------------------");
    
  } catch (error) {
    console.error("❌ Uplink Failed:", error.message);
  }
}

testConnection();
