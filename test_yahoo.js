const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
const symbols = ['CL=F', 'NG=F', 'GC=F', '^TASI.SR', 'BTC-USD', '^GSPC', '^VIX'];
async function test() {
    for (const s of symbols) {
        try {
            const result = await yahooFinance.quote(s);
            console.log(`\n--- Symbol: ${s} ---`);
            console.log(`regularMarketPrice: ${result.regularMarketPrice}`);
            console.log(`regularMarketChangePercent: ${result.regularMarketChangePercent}`);
            console.log(`preMarketPrice: ${result.preMarketPrice}`);
            console.log(`postMarketPrice: ${result.postMarketPrice}`);
            console.log(`regularMarketTime: ${result.regularMarketTime}`);
        } catch (e) {
            console.log(`Error ${s}: ${e.message}`);
        }
    }
}
test();
