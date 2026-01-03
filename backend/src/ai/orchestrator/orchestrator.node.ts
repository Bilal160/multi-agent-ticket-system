import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { config } from '../../config/env';

const ORCHESTRATOR_PROMPT = `
You are the Orchestrator for a support system. 
Classify the user's intent into one of the following categories:
- REFUND: Cancellation, money back, return.
- TECHNICAL: App crash, error code, login issue, bug.
- GENERAL: Hours, location, contact, general questions.

Output ONLY the category name.
`;

export const classifyQuery = async (query: string): Promise<{ category: string; confidence: number }> => {
  if (!config.OPENAI_API_KEY) {
     console.warn('OPENAI_API_KEY not found. Using Mock Orchestrator.');
     const lowerQuery = query.toLowerCase();
     let category = 'GENERAL';
     let confidence = 0.5;

     if (lowerQuery.includes('refund') || lowerQuery.includes('money') || lowerQuery.includes('cancel')) {
       category = 'REFUND';
       confidence = 0.95;
     } else if (lowerQuery.includes('error') || lowerQuery.includes('crash') || lowerQuery.includes('bug')) {
       category = 'TECHNICAL';
       confidence = 0.95;
     }
     
     return { category, confidence };
  }

  try {
    const model = new ChatOpenAI({
      apiKey: config.OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0,
    });

    const response = await model.invoke([
      new SystemMessage(ORCHESTRATOR_PROMPT),
      new HumanMessage(query),
    ]);
    
    const category = response.content.toString().trim().toUpperCase();
    const validCategories = ['REFUND', 'TECHNICAL', 'GENERAL'];
    const confidence = validCategories.includes(category) ? 0.95 : 0.5;

    return { category, confidence };
  } catch (error) {
      console.error('Orchestrator LLM Error:', error);
      return { category: 'GENERAL', confidence: 0 };
  }
};
