export default async function handler(req, res) {
  const { prompt = 'technology' } = req.query;
  
  try {
     const query = encodeURIComponent(prompt.trim().replace(/ /g, ','));
     const response = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=3&content_filter=high`);
     
     if (!response.ok) throw new Error('Proxy rejection');
     
     const data = await response.json();
     
     // Select a random image from the top 3 best matches
     if (data && data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(3, data.results.length));
        const rawUrl = data.results[randomIndex].urls.regular;
        
        // 302 Redirect directly to the image payload
        res.redirect(302, rawUrl);
     } else {
        // Fallback to a guaranteed high-end technology asset if the semantic query fails
        res.redirect(302, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80');
     }
  } catch (error) {
     res.redirect(302, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80');
  }
}
