const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

async function test() {
    try {
        const t = await yahooFinance.quote(['CL=F', 'NG=F', 'GC=F']);
        console.log(t.length, t[0].symbol, t[0].regularMarketPrice);
    } catch(e) {
        console.error(e);
    }
}
test();
