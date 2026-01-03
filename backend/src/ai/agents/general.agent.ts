import { generateAgentResponse, AgentResponse } from './base.agent';
import { GENERAL_AGENT_PROMPT } from '../prompts/general.prompt';

export const handleGeneralInquiry = async (query: string, history: string[] = []): Promise<AgentResponse> => {
  return generateAgentResponse(GENERAL_AGENT_PROMPT, query, history);
};
