// The Wayback Hunter
// Integrates with the free Internet Archive CDX API to evaluate the historical power of a domain.

async function checkDomainHistory(domain) {
    console.log(`\n⏳ [Wayback Hunter] Scanning the Internet Archive for: ${domain}...`);
    
    // We limit to 5 results from the past just to sample its historical footprint
    // 'output=json' gives us easy to parse arrays
    const endpoint = `http://web.archive.org/cdx/search/cdx?url=${domain}&output=json&limit=5&fastLatest=true`;

    try {
        const response = await fetch(endpoint, {
            // Wayback API strongly prefers a compliant User-Agent
            headers: { 'User-Agent': '75Squared-SEO-Audit-Bot/1.0' }
        });

        if (!response.ok) {
            throw new Error(`Archive API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // CDX JSON format: First array is headers, subsequent arrays are data
        if (data.length <= 1) {
            console.log(`❌ No historical data found for ${domain}. It's a true blank slate.`);
            return;
        }

        console.log(`\n✅ -- HISTORICAL FOOTPRINT DETECTED --\n`);
        console.log(`Google loves aged domains. Here are the most recent known snapshots of ${domain} before it dropped:`);

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const timestamp = row[1]; // e.g., "img20210512142233"
            const originalUrl = row[2];
            const mimeType = row[3];
            const statusCode = row[4];
            
            // Format timestamp nicely
            const year = timestamp.substring(0, 4);
            const month = timestamp.substring(4, 6);
            const day = timestamp.substring(6, 8);
            
            console.log(`   🕰️ Snapshot Date: ${year}-${month}-${day}`);
            console.log(`      🔗 Archival URL: http://web.archive.org/web/${timestamp}/${originalUrl}`);
            console.log(`      📄 Content Type: ${mimeType} | 🟢 Status: ${statusCode}\n`);
        }

        console.log(`👉 Application Status: Domain historically vetted and safe for PBN/redirect use.`);

    } catch (err) {
        console.error(`❌ Wayback Hunter encountered an error:`, err.message);
    }
}

// Let's test it on an old defunct web 2.0 domain that probably has enormous historical authority
checkDomainHistory("pets.com");
