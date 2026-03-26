import yf from 'yahoo-finance2';

// Defensive instantiation for Vercel Serverless where Webpack sometimes provides the raw class instead of the default singleton instance.
let yahooFinance: any = yf;

if (yahooFinance && typeof yahooFinance.search !== 'function') {
    if (yahooFinance.default && typeof yahooFinance.default.search === 'function') {
        yahooFinance = yahooFinance.default;
    } else if (typeof yahooFinance.default === 'function') {
        yahooFinance = new yahooFinance.default();
    } else if (typeof yahooFinance === 'function') {
        yahooFinance = new (yahooFinance as any)();
    } else {
        // If all else fails, use require fallback
        const yfReq = require('yahoo-finance2');
        if (typeof yfReq.search === 'function') yahooFinance = yfReq;
        else if (yfReq.default && typeof yfReq.default.search === 'function') yahooFinance = yfReq.default;
        else if (typeof yfReq.default === 'function') yahooFinance = new yfReq.default();
        else if (typeof yfReq === 'function') yahooFinance = new yfReq();
    }
}

export default yahooFinance;
