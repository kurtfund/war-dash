const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const TICKER_SYMBOLS = [
    { symbol: 'CL=F', name: 'WTI Crude Oil', category: 'Energy', url: 'https://finance.yahoo.com/quote/CL=F' },
    { symbol: 'NG=F', name: 'Natural Gas', category: 'Energy', url: 'https://finance.yahoo.com/quote/NG=F' },
    { symbol: 'GC=F', name: 'Gold', category: 'Safe Haven', url: 'https://finance.yahoo.com/quote/GC=F' },
    { symbol: '^TASI.SR', name: 'Tadawul All-Share', category: 'Middle East', url: 'https://finance.yahoo.com/quote/%5ETASI.SR' },
    { symbol: 'BTC-USD', name: 'Bitcoin', category: 'Crypto', url: 'https://finance.yahoo.com/quote/BTC-USD' },
    { symbol: '^GSPC', name: 'S&P 500', category: 'Equities', url: 'https://finance.yahoo.com/quote/%5EGSPC' },
    { symbol: '^VIX', name: 'VIX', category: 'Volatility', url: 'https://finance.yahoo.com/quote/%5EVIX' }
];

async function test() {
    try {
        const symbols = TICKER_SYMBOLS.map(t => t.symbol);
        const quotes = await yahooFinance.quote(symbols);
        console.log("Success:", quotes.length);
    } catch(e) {
        console.error("Error:", e.message);
    }
}
test();
