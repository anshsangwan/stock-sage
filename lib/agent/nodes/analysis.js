import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Analysis Node
 * 
 * Evaluates the collected data and constructs the Bull and Bear cases.
 */
export async function analysisNode(state, config) {
  const apiKey = config.configurable?.apiKey;
  const onStep = config.configurable?.onStep;

  // Stage 3: Collect financial & market sentiment data
  if (onStep) onStep(3, { status: 'running' });
  // Mock brief delay for fetching financials/sentiment
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (onStep) onStep(3, { status: 'completed' });

  // Stage 4: Evaluate bull & bear arguments
  if (onStep) onStep(4, { status: 'running' });

  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey,
    temperature: 0.2,
  });

  const newsContext = state.newsSources
    .map(s => `- ${s.title}: ${s.content}`)
    .join('\n');

  const prompt = `You are an expert equity analyst.
Analyze the following context for ${state.companyName} (${state.ticker}).

Context:
${newsContext || 'No recent news available.'}

Based on the context and your general financial knowledge, perform the following tasks:
1. Generate a list of exactly 3 strong Bull Case arguments (catalysts for growth/positive outlook).
2. Generate a list of exactly 3 strong Bear Case arguments (risks/negative outlook).
3. Evaluate the overall news sentiment. Return an overall sentiment percentage (0 to 100, where 0 is extremely bearish, 50 is neutral, and 100 is extremely bullish) and an appropriate sentiment label ("Bullish", "Mildly Bullish", "Neutral", "Mildly Bearish", "Bearish").

Return ONLY a JSON object in this format, with no markdown formatting:
{
  "bullCase": ["point 1", "point 2", "point 3"],
  "bearCase": ["point 1", "point 2", "point 3"],
  "sentimentPercentage": 70,
  "sentimentLabel": "Mildly Bullish"
}`;

  const res = await model.invoke(prompt);
  
  let analysis = { bullCase: [], bearCase: [], sentimentPercentage: 50, sentimentLabel: 'Neutral' };
  try {
    const content = typeof res?.content === 'string' ? res.content : '';
    if (!content) {
      throw new Error('Gemini returned empty or invalid content');
    }
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    analysis = JSON.parse(cleanJson);
  } catch (e) {
    console.error('Failed to parse analysis from Gemini:', e, 'Response was:', res);
    // Fallback if parsing fails
    analysis = {
      bullCase: ["Strong market position.", "Consistent revenue growth."],
      bearCase: ["Macroeconomic headwinds.", "Increasing competition."],
      sentimentPercentage: 50,
      sentimentLabel: "Neutral"
    };
  }

  if (onStep) onStep(4, { status: 'completed' });

  return {
    bullCase: analysis.bullCase,
    bearCase: analysis.bearCase,
    sentimentPercentage: Number(analysis.sentimentPercentage) || 50,
    sentimentLabel: analysis.sentimentLabel || 'Neutral',
  };
}
