import yfModule from 'yahoo-finance2';

let yahooFinance: any = yfModule;

// Explicitly instantiate the YahooFinance class if Webpack ESM proxying returns the constructor directly.
if (yahooFinance && yahooFinance.name === 'YahooFinance') {
    yahooFinance = new yahooFinance();
} else if (yahooFinance && yahooFinance.default && yahooFinance.default.name === 'YahooFinance') {
    yahooFinance = new yahooFinance.default();
}

// Fallback logic for CommonJS environments
if (!yahooFinance || typeof yahooFinance.search !== 'function') {
    const reqYf = require('yahoo-finance2');
    if (reqYf && reqYf.name === 'YahooFinance') {
        yahooFinance = new reqYf();
    } else if (reqYf && reqYf.default && reqYf.default.name === 'YahooFinance') {
        yahooFinance = new reqYf.default();
    } else {
        yahooFinance = reqYf.default || reqYf;
    }
}

export default yahooFinance;
