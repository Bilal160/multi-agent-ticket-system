import { classifyQuery } from './orchestrator.node';
import { determineRouting, RoutingDecision } from './confidence.router';
import { handleRefundInquiry } from '../agents/refund.agent';
import { handleTechnicalInquiry } from '../agents/technical.agent';
import { handleGeneralInquiry } from '../agents/general.agent';
import { AgentResponse } from '../agents/base.agent';

export const processRequest = async (query: string): Promise<{
    category: string;
    confidence: number;
    decision: RoutingDecision;
    agentResponse: AgentResponse | null;
}> => {
    const { category, confidence } = await classifyQuery(query);
    console.log(`[Orchestrator] Classified as ${category} with confidence ${confidence}`);

    const decision = determineRouting(confidence);
    
    let agentResponse: AgentResponse | null = null;

    if (decision !== RoutingDecision.MANUAL_HANDLING) {
      switch (category) {
        case 'REFUND':
          agentResponse = await handleRefundInquiry(query);
          break;
        case 'TECHNICAL':
          agentResponse = await handleTechnicalInquiry(query);
          break;
        case 'GENERAL':
          agentResponse = await handleGeneralInquiry(query);
          break;
        default:
          console.log('Unknown category, defaulting to manual.');
      }
    }

    return {
      category,
      confidence,
      decision,
      agentResponse,
    };
};
