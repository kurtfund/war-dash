const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
    let browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-blink-features=AutomationControlled']
    });
    const page = await browser.newPage();
    try {
        await page.setViewport({width: 1920, height: 1080});
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        console.log("Nav...");
        await page.goto('https://iran.liveuamap.com/', { waitUntil: 'networkidle2', timeout: 45000 });
        console.log("Waiting 10s for CF to clear...");
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const html = await page.content();
        console.log("Length:", html.length);
        if(html.includes("Just a moment")) {
            console.log("Still blocked by Cloudflare.");
        } else {
            console.log("Bypassed Cloudflare!");
            const title = await page.$eval('title', el => el.innerText).catch(()=>'');
            console.log("Title:", title);
        }
    } catch(e) { console.error(e); } finally { await browser.close(); }
})();
