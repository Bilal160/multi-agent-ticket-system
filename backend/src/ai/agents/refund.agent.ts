import { generateAgentResponse, AgentResponse } from './base.agent';
import { REFUND_AGENT_PROMPT } from '../prompts/refund.prompt';

export const handleRefundInquiry = async (query: string, history: string[] = []): Promise<AgentResponse> => {
  return generateAgentResponse(REFUND_AGENT_PROMPT, query, history);
};
