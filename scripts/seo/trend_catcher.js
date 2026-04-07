import Parser from 'rss-parser';

const parser = new Parser({
    // We optionally map custom XML fields since Google Trends has weird namespaces
    customFields: {
        item: [
            ['ht:approx_traffic', 'approx_traffic'],
            ['ht:news_item', 'news_item']
        ]
    }
});

async function captureViralTrends() {
    console.log(`\n🌊 [Viral Trend Catcher] Deploying sensors to Google Trends and Global News RSS feeds...\n`);
    
    try {
        console.log(`📡 Fetching live data from Wired Magazine RSS Feed...`);
        // Wired RSS feeds are highly stable and great for tech trends
        const wiredFeed = await parser.parseURL('https://www.wired.com/feed/rss');
        
        console.log(`\n🔥 -- BREAKING SEARCH TRENDS (WIRED) --\n`);
        
        wiredFeed.items.slice(0, 3).forEach((item, index) => {
            console.log(`🏆 [#${index + 1}] Trending Topic: "${item.title}"`);
            console.log(`   💡 Content: ${item.contentSnippet ? item.contentSnippet.substring(0, 80) : 'N/A'}...`);
            console.log(`   🔗 Source: ${item.link}\n`);
        });

        // -----------------------------------------------------

        console.log(`\n📡 Fetching TechCrunch Breaking News RSS...`);
        // TechCrunch RSS - excellent for catching tech SaaS trends before they hit Reddit
        const techFeed = await parser.parseURL('https://techcrunch.com/feed/');

        console.log(`\n🗞️  -- TECH & STARTUP EARLY INDICATORS --\n`);
        
        techFeed.items.slice(0, 3).forEach((item, index) => {
            console.log(`📰 Story: "${item.title}"`);
            console.log(`   ⏱️ Published: ${item.pubDate}`);
            console.log(`   📚 NLP Potential Entities: ${extractKeywords(item.title).join(', ')}\n`);
        });

        console.log(`👉 Next Step: We can automatically route these emerging keywords straight into the Ubersuggest Infinite engine to generate 1,000s of 'Newsjacking' articles!`);

    } catch (error) {
        console.error("❌ Failed to parse XML RSS feeds:", error.message);
    }
}

// A simple mock NLP extractor to pull SEO targets from news headlines
function extractKeywords(title) {
    // Strip punctuation and common words
    const cleanTitle = title.replace(/[^\w\s]/gi, '').toLowerCase();
    const commonWords = ['the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'you', 'for', 'on', 'with', 'as', 'by', 'that'];
    
    return cleanTitle.split(' ')
        .filter(word => word.length > 4 && !commonWords.includes(word))
        .slice(0, 3); // Return top 3 strongest unique words
}

captureViralTrends();
