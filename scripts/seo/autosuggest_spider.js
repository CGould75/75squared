// The Ubersuggest Infinite Keyword Engine
// Bypasses paid APIs by extracting direct Search intent from Google's Autocomplete servers

async function scrapeGoogleAutosuggest(baseKeyword) {
    console.log(`\n🔍 [Autosuggest Spider] Generating infinite keyword matrix for: "${baseKeyword}"...\n`);
    
    // The alphabet suffix list ensures we get every possible variation
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let masterKeywordList = new Set();
    
    // Function to fetch a single query variation
    async function fetchSuggestions(query) {
        // Google's undocumented autocomplete endpoint
        const endpoint = `http://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            const data = await response.json();
            // data[1] contains the array of suggested strings
            return data[1] || [];
        } catch (err) {
            console.error(`Failed to fetch suggestions for "${query}":`, err.message);
            return [];
        }
    }

    // Step 1: Get base queries
    const baseSuggestions = await fetchSuggestions(baseKeyword);
    baseSuggestions.forEach(k => masterKeywordList.add(k));

    // Step 2: Loop through the alphabet to force Google to reveal long-tail secrets
    // (e.g., "las vegas seo a", "las vegas seo b", etc.)
    console.log(`🧠 Querying the Google Hivemind A-Z variations...`);
    
    // We run these concurrently for speed, but ideally we'd add a slight delay in production to avoid rate limits
    const promises = alphabet.map(async (letter) => {
        const query = `${baseKeyword} ${letter}`;
        const suggestions = await fetchSuggestions(query);
        suggestions.forEach(k => masterKeywordList.add(k));
    });

    await Promise.all(promises);

    // Filter out the base keyword itself and sort alphabetically
    const sortedKeywords = Array.from(masterKeywordList)
        .filter(k => k.toLowerCase() !== baseKeyword.toLowerCase())
        .sort();

    console.log(`\n✅ -- UBERSUGGEST HARVEST COMPLETE --\n`);
    console.log(`Extracted ${sortedKeywords.length} uniquely highly-searched terms completely for free:`);
    
    // Output a sample of 15 to keep the terminal clean
    sortedKeywords.slice(0, 15).forEach(k => console.log(`   👉 ${k}`));
    console.log(`   ...and ${sortedKeywords.length - 15} more hidden variations!`);
    
    console.log(`\nThese can now be sent to DataForSEO (Integration 1) in batches of 1,000 to uncover pinpoint Search Volumes!`);
}

// Test extracting long-tail keywords for a broad topic
scrapeGoogleAutosuggest("las vegas seo");
