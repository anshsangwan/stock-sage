import { StateGraph, START, END } from '@langchain/langgraph';
import { AgentState } from './state.js';
import { researchNode } from './nodes/research.js';
import { analysisNode } from './nodes/analysis.js';
import { decisionNode } from './nodes/decision.js';

// Define the LangGraph workflow
const workflow = new StateGraph(AgentState)
  .addNode('research', researchNode)
  .addNode('analysis', analysisNode)
  .addNode('decision', decisionNode)
  
  // Define edges
  .addEdge(START, 'research')
  .addEdge('research', 'analysis')
  .addEdge('analysis', 'decision')
  .addEdge('decision', END);

// Compile the graph
export const researchGraph = workflow.compile();
