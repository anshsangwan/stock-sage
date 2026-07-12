import { Annotation } from '@langchain/langgraph';

// Define the state for the investment research workflow
export const AgentState = Annotation.Root({
  query: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  companyName: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  ticker: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  
  // Research
  newsSources: Annotation({
    reducer: (x, y) => (y ? [...(x ?? []), ...y] : x),
    default: () => [],
  }),
  relatedArticles: Annotation({
    reducer: (x, y) => (y ? [...(x ?? []), ...y] : x),
    default: () => [],
  }),
  
  // Analysis
  bullCase: Annotation({
    reducer: (x, y) => (y ? [...(x ?? []), ...y] : x),
    default: () => [],
  }),
  bearCase: Annotation({
    reducer: (x, y) => (y ? [...(x ?? []), ...y] : x),
    default: () => [],
  }),
  
  // Decision
  verdict: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  executiveSummary: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
  
  // Sentiment (Milestone 5)
  sentimentPercentage: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => 50,
  }),
  sentimentLabel: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => 'Neutral',
  }),
});
