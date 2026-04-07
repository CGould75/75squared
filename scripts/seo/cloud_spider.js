import * as cheerio from 'cheerio';

async function crawlAndAudit(url) {
    console.log(`\n🕷️ [Cloud Spider] Initiating Technical Audit for: ${url}\n`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': '75Squared-CloudSpider/1.0 (+https://75squared.com)'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to access site. HTTP Status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        
        let report = {
            target_url: url,
            audit_results: []
        };

        // 1. Check Title Tag
        const title = $('title').text();
        if (!title) {
            report.audit_results.push({ issue: "Missing Title Tag", severity: "High" });
        } else if (title.length > 60) {
            report.audit_results.push({ issue: `Title too long (${title.length} chars). Keep under 60.`, severity: "Medium" });
        } else {
            console.log(`✅ Title Tag optimized: "${title}"`);
        }

        // 2. Check Meta Description
        const metaDesc = $('meta[name="description"]').attr('content');
        if (!metaDesc) {
            report.audit_results.push({ issue: "Missing Meta Description", severity: "High" });
        } else if (metaDesc.length > 160) {
            report.audit_results.push({ issue: `Meta Desc too long (${metaDesc.length} chars). Keep under 160.`, severity: "Medium" });
        } else {
            console.log(`✅ Meta Description optimized: "${metaDesc.substring(0, 50)}..."`);
        }

        // 3. Check H1 Tags
        const h1Tags = $('h1');
        if (h1Tags.length === 0) {
            report.audit_results.push({ issue: "Missing H1 Tag", severity: "High" });
        } else if (h1Tags.length > 1) {
            report.audit_results.push({ issue: `Multiple H1 Tags found (${h1Tags.length}). Only use 1 per page.`, severity: "Medium" });
        } else {
            console.log(`✅ Single H1 Tag found: "${h1Tags.first().text().trim().substring(0, 50)}"`);
        }

        // 4. Check Missing Alt Text on Images
        let missingAltCount = 0;
        $('img').each((i, el) => {
            const alt = $(el).attr('alt');
            if (!alt || alt.trim() === '') {
                missingAltCount++;
            }
        });
        
        if (missingAltCount > 0) {
            report.audit_results.push({ issue: `${missingAltCount} images are missing ALT text attributes.`, severity: "Low" });
        } else {
            console.log(`✅ All images have ALT text.`);
        }

        // Output final diagnostic summary
        console.log("\n--- 🚨 TECHNICAL AUDIT SUMMARY ---");
        if (report.audit_results.length === 0) {
            console.log("No technical SEO issues found! Site is squeaky clean.");
        } else {
            report.audit_results.forEach(res => {
                const icon = res.severity === "High" ? "🚨" : (res.severity === "Medium" ? "⚠️" : "ℹ️");
                console.log(`${icon} [${res.severity}] ${res.issue}`);
            });
        }
        console.log("----------------------------------\n");

    } catch (error) {
        console.error(`❌ Cloud Spider Crawl Failed:`, error.message);
    }
}

// Perform a technical audit on a target website (using acuteseo as our test subject again)
crawlAndAudit("https://acuteseo.com/las-vegas-seo/");
