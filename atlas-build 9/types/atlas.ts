/* Domain and core types */
export type Domain = 'OCE4N_' | 'E4RTH_' | 'S4PIENS_' | '4CULTURE';
export type AtlasNodeType = 'ecosystem' | 'species' | 'threat' | 'solution' | 'mission' | 'partner' | 'impact-unit' | 'funding-gap';
export type LayerId = 'living-systems' | 'key-species' | 'threats' | 'solutions' | 'missions' | 'partners' | 'funding-gaps' | 'impact-units';
export type Confidence = 'verified' | 'sourced' | 'curated' | 'draft';
export type NodeStatus = 'prototype' | 'planned' | 'active' | 'reference';
export type MissionStatus = 'proof' | 'planned' | 'active';
export type PartnershipStatus = 'reference-only' | 'potential' | 'in-dialogue' | 'partner';
export type PartnerType = 'nonprofit' | 'company' | 'research' | 'public' | 'indigenous-led' | 'community-led' | 'unknown';
export type GeographyType = 'point' | 'region' | 'polygon';
export type ImpactVerificationStatus = 'not-live' | 'estimated' | 'partner-required' | 'verified';
export type SourceType = 'report' | 'dataset' | 'article' | 'scientific-paper' | 'partner' | 'manual-note';
export type ChainElementType = 'species' | 'function' | 'ecosystem-service' | 'human-system' | 'threat' | 'solution' | 'mission' | 'impact';

export interface Coordinates {
  lat: number;
  lng: number;
}

/* Node interface — unified geography representation */
export interface AtlasNode {
  id: string;
  slug: string;
  type: AtlasNodeType;
  name: string;
  subtitle?: string;
  domain?: Domain;
  region: string;
  coordinates: Coordinates;
  geographyType: GeographyType;
  layerIds: LayerId[];
  missionIds: string[];
  partnerIds?: string[];
  sourceIds: string[];
  claimIds: string[];
  confidence: Confidence;
  shortDescription: string;
  whyItMatters: string;
  status: NodeStatus;
}

/* Mission interface */
export interface Mission {
  id: string;
  slug: string;
  name: string;
  domain: Domain;
  status: MissionStatus;
  shortDescription: string;
  problem: string;
  livingSystemSummary: string;
  threatSummary: string;
  solutionSummary: string;
  fundingGapId?: string;
  nodeIds: string[];
  partnerIds: string[];
  impactUnitIds: string[];
  sourceIds: string[];
  claimIds: string[];
  sponsorRelevance: string;
}

/* Partner/Project interface */
export interface PartnerProject {
  id: string;
  name: string;
  type: PartnerType;
  website?: string;
  region: string;
  coordinates?: Coordinates;
  missionIds: string[];
  solutionTypes: string[];
  shortDescription: string;
  whyRelevantTo4PLANET: string;
  sourceIds: string[];
  claimIds: string[];
  partnershipStatus: PartnershipStatus;
  confidence: Confidence;
}

/* Impact Unit interface */
export interface ImpactUnit {
  id: string;
  label: string;
  missionId: string;
  unit: string;
  estimatedCostNOK?: number;
  whatItFunds: string;
  verificationStatus: ImpactVerificationStatus;
  partnerRequired: boolean;
  reportingLogic: string;
  caveat: string;
}

/* Source interface */
export interface Source {
  id: string;
  title: string;
  organisation: string;
  url?: string;
  year?: number;
  type: SourceType;
  licenseNote?: string;
  lastReviewed: string;
}

/* Claim interface */
export interface Claim {
  id: string;
  text: string;
  sourceId: string;
  confidence: Confidence;
  uncertaintyNote?: string;
  linkedNodeIds?: string[];
  linkedMissionIds?: string[];
}

/* Funding Gap interface */
export interface FundingGap {
  id: string;
  title: string;
  missionId: string;
  summary: string;
  underfundedArea: string;
  whyMarketsFail?: string;
  sponsorOpportunity: string;
  sourceIds: string[];
  confidence: Confidence;
}

/* Living Systems Chain interface */
export interface LivingSystemsChain {
  id: string;
  nodeId: string;
  missionId?: string;
  chain: {
    label: string;
    type: ChainElementType;
    description: string;
  }[];
}

/* Layer UI interface */
export interface AtlasLayer {
  id: LayerId;
  label: string;
  description: string;
  color: string;
  active: boolean;
}
