const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;

if (!login || !password) {
  console.error("Missing DataForSEO credentials in .env.local!");
  process.exit(1);
}

const authBuffer = Buffer.from(`${login}:${password}`).toString('base64');
const authHeader = `Basic ${authBuffer}`;

async function fetchKeywordData(targetKeywords) {
  console.log(`[DataForSEO] Fetching Search Volume for: ${targetKeywords.join(', ')}...`);
  
  const postData = [{
    // 2840 = United States
    "location_code": 2840,
    "language_name": "English",
    "keywords": targetKeywords
  }];

  try {
    const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP Error: ${response.status} ${response.statusText} - Body: ${errBody}`);
    }

    const data = await response.json();
    
    // Parse the heavily nested DataForSEO response
    const results = data.tasks[0].result;
    
    console.log("\n✅ -- KEYWORD DATA RETURNED --\n");
    
    results.forEach(item => {
        console.log(`🔑 Keyword: "${item.keyword}"`);
        console.log(`   📊 Monthly Search Volume: ${item.search_volume}`);
        console.log(`   💰 Cost Per Click (CPC): $${item.cpc ? item.cpc.toFixed(2) : '0.00'}`);
        console.log(`   📈 Competition Level: ${item.competition} (0-100 scale)\n`);
    });

  } catch (error) {
    console.error("❌ API Request Failed:", error.message);
  }
}

// Test with some agency-related keywords
fetchKeywordData([
    "las vegas seo", 
    "custom software development", 
    "digital marketing agency"
]);
