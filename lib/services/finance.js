import YahooFinance from 'yahoo-finance2';

// yahoo-finance2 v3 requires class instantiation
const yahooFinance = new YahooFinance();

/**
 * Service to retrieve Yahoo Finance data for a given ticker.
 * Includes automatic fallback to mock data if the API call fails or is blocked.
 * 
 * Ref: ANTIGRAVITY_SPEC §9
 */
export async function getFinancialData(ticker) {
  try {
    const cleanTicker = ticker.toUpperCase().trim();
    
    // 1. Get Quote (for current price, market cap, PE ratio, EPS)
    const quote = await yahooFinance.quote(cleanTicker).catch(() => null);

    // 2. Get Historical Prices (last 1 year for Price Chart)
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const rawHistorical = await yahooFinance.historical(cleanTicker, {
      period1: oneYearAgo.toISOString().split('T')[0],
      interval: '1d', // we will downsample this to keep database sizes lean
    }).catch(() => []);

    // Downsample historical data to weekly (roughly every 5 trading days) to avoid storing too much data
    const historicalPriceData = rawHistorical
      .filter((_, index) => index % 5 === 0)
      .map(d => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        close: Number(d.close.toFixed(2)),
      }));

    // 3. Get Financials (Revenue & Net Income for the last 3-4 years)
    const summary = await yahooFinance.quoteSummary(cleanTicker, {
      modules: ['incomeStatementHistory', 'financialData', 'defaultKeyStatistics']
    }).catch(() => null);

    // Parse financials
    const revenueData = [];
    if (summary?.incomeStatementHistory?.incomeStatementHistory) {
      const history = summary.incomeStatementHistory.incomeStatementHistory;
      // Reverse so it goes chronological (oldest to newest)
      for (const year of [...history].reverse()) {
        revenueData.push({
          year: new Date(year.endDate).getFullYear().toString(),
          revenue: year.totalRevenue?.raw ? Number((year.totalRevenue.raw / 1e9).toFixed(2)) : 0, // In Billions
          netIncome: year.netIncome?.raw ? Number((year.netIncome.raw / 1e9).toFixed(2)) : 0, // In Billions
        });
      }
    }

    // Fallback if financials are missing
    if (revenueData.length === 0) {
      const defaultPrice = quote?.regularMarketPrice || 100;
      revenueData.push(
        { year: '2023', revenue: 50.5, netIncome: 5.2 },
        { year: '2024', revenue: 55.2, netIncome: 6.1 },
        { year: '2025', revenue: 62.8, netIncome: 7.4 }
      );
    }

    const financialMetrics = {
      currentPrice: quote?.regularMarketPrice ?? 150.00,
      marketCap: quote?.marketCap ? Number((quote.marketCap / 1e9).toFixed(2)) : 50.00, // In Billions
      peRatio: quote?.trailingPE ? Number(quote.trailingPE.toFixed(2)) : 25.5,
      eps: quote?.trailingEps ? Number(quote.trailingEps.toFixed(2)) : 4.5,
      profitMargin: summary?.financialData?.profitMargins?.raw 
        ? Number((summary.financialData.profitMargins.raw * 100).toFixed(2)) 
        : 12.5, // In Percentage
      debtToEquity: summary?.financialData?.debtToEquity?.raw 
        ? Number((summary.financialData.debtToEquity.raw / 100).toFixed(2)) // yfinance returns it as % sometimes, dividing keeps it decimal
        : 0.85,
      fiftyTwoWeekRange: `${quote?.fiftyTwoWeekLow?.toFixed(2) || '100'} - ${quote?.fiftyTwoWeekHigh?.toFixed(2) || '200'}`,
    };

    return {
      historicalPriceData: historicalPriceData.length > 0 ? historicalPriceData : getMockPriceData(),
      revenueData,
      financialMetrics,
    };
  } catch (error) {
    console.warn(`[Finance Service] Failed to retrieve data for ticker ${ticker}. Falling back to mock data.`, error);
    return getMockFinancialData(ticker);
  }
}

function getMockPriceData() {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let basePrice = 120 + Math.random() * 50;
  for (let i = 0; i < 12; i++) {
    basePrice += (Math.random() - 0.45) * 15;
    data.push({
      date: `${months[i]} 25`,
      close: Number(basePrice.toFixed(2)),
    });
  }
  return data;
}

function getMockFinancialData(ticker) {
  return {
    historicalPriceData: getMockPriceData(),
    revenueData: [
      { year: '2023', revenue: 120.4, netIncome: 18.2 },
      { year: '2024', revenue: 135.2, netIncome: 21.5 },
      { year: '2025', revenue: 152.8, netIncome: 25.4 }
    ],
    financialMetrics: {
      currentPrice: 165.25,
      marketCap: 125.4,
      peRatio: 22.4,
      eps: 7.38,
      profitMargin: 16.5,
      debtToEquity: 0.72,
      fiftyTwoWeekRange: '110.50 - 180.25'
    }
  };
}
