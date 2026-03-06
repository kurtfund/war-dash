const https = require('https');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
    try {
        const urls = [
            "https://www.youtube.com/@SkyNews/live",
            "https://www.youtube.com/@dwnews/live",
            "https://www.youtube.com/@ABCNews/live"
        ];
        for (const url of urls) {
            const html = await fetchHTML(url);
            const match = html.match(/"videoId":"([^"]+)"/);
            console.log(url, match ? match[1] : 'null');
        }
    } catch(e) { console.error(e) }
})();
