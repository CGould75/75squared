const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;

if (!login || !password) {
  console.error("Missing DataForSEO credentials in .env.local!");
  process.exit(1);
}

const authBuffer = Buffer.from(`${login}:${password}`).toString('base64');
const authHeader = `Basic ${authBuffer}`;

async function fetchGoogleRankings(keyword) {
  console.log(`[DataForSEO] Scraping LIVE Google SERP for: "${keyword}"...`);
  
  const postData = [{
    "keyword": keyword,
    "location_code": 2840, // United States
    "language_code": "en",
    "device": "desktop",
    "depth": 10 // We only need the top 10 results for SurferSEO-style analysis
  }];

  try {
    const response = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
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
    const results = data.tasks[0].result[0].items;
    
    console.log("\n✅ -- TOP 10 GOOGLE RANKINGS RETURNED --\n");
    console.log(`Search Term: ${data.tasks[0].data.keyword}\n`);

    // Filter to only show actual organic webpage results (ignoring ads/maps for now)
    const organicResults = results.filter(item => item.type === "organic");

    organicResults.forEach(item => {
        console.log(`🏆 Rank #${item.rank_absolute}`);
        console.log(`   📝 Title: ${item.title}`);
        console.log(`   🔗 URL:   ${item.url}`);
        console.log(`   💡 Desc:  ${item.description ? item.description.substring(0, 80) + '...' : 'No description'}\n`);
    });

  } catch (error) {
    console.error("❌ API Request Failed:", error.message);
  }
}

// Test with a highly competitive SEO keyword
fetchGoogleRankings("las vegas seo");
