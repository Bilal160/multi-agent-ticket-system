import { generateAgentResponse, AgentResponse } from './base.agent';
import { TECHNICAL_AGENT_PROMPT } from '../prompts/technical.prompt';

export const handleTechnicalInquiry = async (query: string, history: string[] = []): Promise<AgentResponse> => {
  return generateAgentResponse(TECHNICAL_AGENT_PROMPT, query, history);
};
