export enum RoutingDecision {
  AUTO_RESPOND = 'AUTO_RESPOND',
  REQUIRE_APPROVAL = 'REQUIRE_APPROVAL',
  MANUAL_HANDLING = 'MANUAL_HANDLING',
}

export const determineRouting = (confidence: number): RoutingDecision => {
  if (confidence >= 0.8) {
    return RoutingDecision.AUTO_RESPOND;
  } else if (confidence >= 0.5) {
    return RoutingDecision.REQUIRE_APPROVAL;
  } else {
    return RoutingDecision.MANUAL_HANDLING;
  }
};
