import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey || apiKey.includes('PASTE')) {
    console.error("Missing valid OpenAI credentials in .env.local!");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

/**
 * Scrapes a URL and extracts only the readable text (ignores nav, scripts, ads)
 */
async function scrapeTextFromUrl(url) {
    console.log(`\n🕷️ Scraping: ${url}`);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Remove junk elements that confuse the LLM
        $('script, style, nav, footer, iframe, noscript').remove();
        
        // Extract plain text from paragraphs and headers
        const readableText = $('h1, h2, h3, p, li')
            .map((i, el) => $(el).text())
            .get()
            .join('\n')
            .replace(/\s+/g, ' ') // Collapse whitespace
            .trim();
            
        return readableText;
    } catch (error) {
        console.error(`❌ Failed to scrape ${url}:`, error.message);
        return "";
    }
}

/**
 * Uses OpenAI to perform SurferSEO-style Entity Extraction
 */
async function extractRankingEntities(text, keyword) {
    console.log(`🤖 Analyzing text with OpenAI for Entities...`);
    
    const prompt = `
    You are an expert SEO analyst. I am going to give you the text of an article that currently ranks on Page 1 of Google for the keyword: "${keyword}".
    
    Read this text and extract the "Entities" and "LSI Keywords" (Latent Semantic Indexing) that the author deliberately included to rank highly. 
    
    Return ONLY a comma-separated list of the 10 most critical SEO topics/entities found in this text. No pleasantries.
    
    TEXT TO ANALYZE:
    ${text.substring(0, 10000)} // Ensure we don't blow up the context window
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using mini for speed/cost efficiency during testing
            messages: [{ role: "user", content: prompt }]
        });
        
        return completion.choices[0].message.content;
    } catch(err) {
         console.error(`❌ OpenAI API Error:`, err.message);
         return "";
    }
}

// Execute the test run
(async () => {
    // We grab the URL from the previous step (Rank #5 for Las Vegas SEO)
    const targetKeyword = "las vegas seo";
    const targetUrl = "https://acuteseo.com/las-vegas-seo/";
    
    const pageText = await scrapeTextFromUrl(targetUrl);
    
    if (pageText) {
        const entities = await extractRankingEntities(pageText, targetKeyword);
        console.log(`\n✅ -- SURFER SEO ENTITY ANALYSIS --`);
        console.log(`To beat ${targetUrl} for the term "${targetKeyword}", your article MUST include these entities:\n`);
        console.log(`👉 ${entities}\n`);
    }
})();
