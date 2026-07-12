import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

/**
 * Decision Node
 * 
 * Generates the final verdict (INVEST or PASS) and the Executive Summary.
 */
export async function decisionNode(state, config) {
  const apiKey = config.configurable?.apiKey;
  const onStep = config.configurable?.onStep;

  // Stage 5: Generate investment thesis
  if (onStep) onStep(5, { status: 'running' });

  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    apiKey,
    temperature: 0.2,
  });

  const prompt = `You are a Chief Investment Officer.
Review the following analysis for ${state.companyName} (${state.ticker}).

Bull Case:
${state.bullCase.map(c => '- ' + c).join('\n')}

Bear Case:
${state.bearCase.map(c => '- ' + c).join('\n')}

Based on this analysis, make a final investment decision.
1. Determine a verdict: exactly "INVEST" or "PASS".
2. Write a concise 2-3 sentence Executive Summary explaining the rationale behind the verdict.

Return ONLY a JSON object in this format, with no markdown formatting:
{
  "verdict": "INVEST",
  "executiveSummary": "Your 2-3 sentence summary here."
}`;

  const res = await model.invoke(prompt);
  
  let decision = { verdict: 'PASS', executiveSummary: '' };
  try {
    const content = typeof res?.content === 'string' ? res.content : '';
    if (!content) {
      throw new Error('Gemini returned empty or invalid content');
    }
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    decision = JSON.parse(cleanJson);
  } catch (e) {
    console.error('Failed to parse decision from Gemini:', e, 'Response was:', res);
    decision = {
      verdict: 'PASS',
      executiveSummary: 'Unable to confidently generate an investment thesis due to parsing errors. Proceed with caution.',
    };
  }

  // Ensure verdict is strictly INVEST or PASS
  const validVerdict = decision.verdict === 'INVEST' ? 'INVEST' : 'PASS';

  if (onStep) onStep(5, { status: 'completed' });

  return {
    verdict: validVerdict,
    executiveSummary: decision.executiveSummary,
  };
}
