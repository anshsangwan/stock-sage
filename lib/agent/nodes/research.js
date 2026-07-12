import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Research Node
 * 
 * 1. Extracts the exact company name and ticker from the user's query.
 * 2. Fetches recent news and financial data (mocked for M0, implemented in M5).
 */
export async function researchNode(state, config) {
  // Extract API key from config (passed from API route)
  const apiKey = config.configurable?.apiKey;
  if (!apiKey) throw new Error('Gemini API key is required');

  const onStep = config.configurable?.onStep;

  // Stage 1: Extract corporate ticker
  if (onStep) onStep(1, { status: 'running' });

  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey,
    temperature: 0,
  });

  const query = state.query;

  // 1. Extract Company Name and Ticker
  const prompt = `You are a financial entity extraction model.
Given the user query below, extract the company name and stock ticker.
Return ONLY a JSON object in this format, with no markdown formatting:
{"companyName": "Apple Inc.", "ticker": "AAPL"}

Query: ${query}`;

  const res = await model.invoke(prompt);
  console.log('[DEBUG Research Node] res:', res);
  
  let extracted = { companyName: query, ticker: 'UNKNOWN' };
  try {
    const content = typeof res?.content === 'string' ? res.content : '';
    if (!content) {
      throw new Error('Gemini returned empty or invalid content');
    }
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    extracted = JSON.parse(cleanJson);
  } catch (e) {
    console.error('Failed to parse ticker from Gemini:', e, 'Response was:', res);
  }

  if (onStep) onStep(1, { status: 'completed', companyName: extracted.companyName, ticker: extracted.ticker });

  // Stage 2: Gather latest news
  if (onStep) onStep(2, { status: 'running' });

  let newsSources = [];
  let relatedArticles = [];

  try {
    const apiKeyTavily = process.env.TAVILY_API_KEY;
    if (!apiKeyTavily) {
      throw new Error('TAVILY_API_KEY env variable is not set');
    }

    const { tavily } = require('@tavily/core');
    const tvly = tavily({ apiKey: apiKeyTavily });
    
    // Search for 6 articles
    const searchResult = await tvly.search(`${extracted.companyName} news ${extracted.ticker}`, {
      maxResults: 6,
    });

    const articles = (searchResult.results || []).map(r => ({
      title: r.title,
      url: r.url,
      content: r.content || r.snippet || '',
    }));

    // Split into 3 Research Sources and 3 Related Reading
    newsSources = articles.slice(0, 3);
    relatedArticles = articles.slice(3, 6);
  } catch (error) {
    console.warn('[Research Node] Tavily search failed, using mock news data:', error.message);
    
    // Fallback Mock News (3 Research Sources)
    newsSources = [
      { title: `Recent developments at ${extracted.companyName}`, url: 'https://example.com/research-1', content: 'The company announced a major product line update showing strong margin improvement.' },
      { title: `Market headwinds for ${extracted.ticker}`, url: 'https://example.com/research-2', content: 'Analysts warn of supply chain bottlenecks and increasing competition in Asian markets.' },
      { title: `${extracted.companyName} Financial Audit`, url: 'https://example.com/research-3', content: 'Strong balance sheet with minimal leverage provides robust defensive cushion.' }
    ];

    // Fallback Related Reading (3 additional articles)
    relatedArticles = [
      { title: `Technological innovations in ${extracted.ticker} sector`, url: 'https://example.com/related-1', content: 'Industry transitions to cloud-native AI pipelines are accelerating.' },
      { title: `Executive interview with ${extracted.companyName} CTO`, url: 'https://example.com/related-2', content: 'CTO discusses long-term product roadmap and capital expenditure expansion.' },
      { title: `Global supply chain trends for ${extracted.ticker}`, url: 'https://example.com/related-3', content: 'Ocean freight rates stabilize, relieving margin pressures for hardware vendors.' }
    ];
  }

  // Mock brief delay for news gathering
  await new Promise(resolve => setTimeout(resolve, 800));

  if (onStep) onStep(2, { status: 'completed' });

  return {
    companyName: extracted.companyName,
    ticker: extracted.ticker,
    newsSources,
    relatedArticles,
  };
}
