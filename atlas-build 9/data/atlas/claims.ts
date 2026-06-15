import { Claim } from '@/types/atlas';

export const ATLAS_CLAIMS: Claim[] = [
  // Jaguar claims
  {
    id: 'claim-jaguar-habitat',
    text: 'Jaguars are keystone predators that maintain trophic balance in rainforest ecosystems through predation on large herbivores.',
    sourceId: 'iucn-jaguar',
    confidence: 'verified',
    linkedNodeIds: ['node-jaguar', 'node-amazon'],
    linkedMissionIds: ['mission-am4zonia'],
  },
  {
    id: 'claim-jaguar-range',
    text: 'Jaguar range has been reduced by 50% due to habitat loss and fragmentation across South America.',
    sourceId: 'gbif-jaguar',
    confidence: 'sourced',
    linkedNodeIds: ['node-jaguar', 'threat-habitat-fragmentation'],
    linkedMissionIds: ['mission-species'],
  },

  // Amazon claims
  {
    id: 'claim-amazon-carbon',
    text: 'The Amazon Rainforest stores approximately 150–200 billion tonnes of carbon in biomass.',
    sourceId: 'gfw-amazon',
    confidence: 'sourced',
    linkedNodeIds: ['node-amazon', 'node-carbon-storage'],
    linkedMissionIds: ['mission-clim4te', 'mission-am4zonia'],
  },
  {
    id: 'claim-amazon-biodiversity',
    text: 'The Amazon contains approximately 10% of all species on Earth.',
    sourceId: 'gfw-amazon',
    confidence: 'sourced',
    linkedNodeIds: ['node-amazon'],
    linkedMissionIds: ['mission-species'],
  },

  // Coral claims
  {
    id: 'claim-coral-bleaching',
    text: 'Global coral bleaching events have increased in frequency due to ocean warming, with major events occurring in 2016, 2017, and 2020.',
    sourceId: 'iucn-coral',
    confidence: 'verified',
    linkedNodeIds: ['node-coral-triangle', 'threat-warming', 'node-great-barrier-reef'],
    linkedMissionIds: ['mission-cor4l'],
  },
  {
    id: 'claim-coral-biodiversity',
    text: 'Coral reefs support 25% of marine fish species while covering less than 1% of the ocean floor.',
    sourceId: 'iucn-coral',
    confidence: 'verified',
    linkedNodeIds: ['node-coral-triangle', 'node-great-barrier-reef'],
    linkedMissionIds: ['mission-cor4l'],
  },

  // Ocean claims
  {
    id: 'claim-ocean-carbon',
    text: 'The Southern Ocean absorbs approximately 40% of anthropogenic CO₂ emitted globally.',
    sourceId: 'ohi-ocean',
    confidence: 'sourced',
    linkedNodeIds: ['node-southern-ocean'],
    linkedMissionIds: ['mission-clim4te', 'mission-wh4les'],
  },

  // Whale claims
  {
    id: 'claim-whale-ecosystem-service',
    text: 'Whales drive significant nutrient cycling and carbon sequestration through whale fall pathways and vertical migration.',
    sourceId: 'iucn-whale',
    confidence: 'sourced',
    linkedNodeIds: ['node-blue-whale', 'node-orca'],
    linkedMissionIds: ['mission-wh4les'],
  },

  // Climate claims
  {
    id: 'claim-ipcc-warming',
    text: 'Global temperatures have risen approximately 1.1°C above pre-industrial levels, with human activity as the dominant cause.',
    sourceId: 'ipcc-climate',
    confidence: 'verified',
    linkedNodeIds: ['threat-warming'],
    linkedMissionIds: ['mission-clim4te'],
  },

  // Pollinator claims
  {
    id: 'claim-bee-pollination',
    text: 'Approximately 75% of global crop varieties depend on pollination by insects, primarily bees.',
    sourceId: 'fao-bee',
    confidence: 'sourced',
    linkedNodeIds: ['node-western-honey-bee'],
    linkedMissionIds: ['mission-species', 'mission-s4piens-food'],
  },
  {
    id: 'claim-pollinator-decline',
    text: 'Pollinator populations have declined significantly due to pesticide use, habitat loss, and climate change.',
    sourceId: 'fao-bee',
    confidence: 'sourced',
    linkedNodeIds: ['node-western-honey-bee', 'threat-pesticides'],
    linkedMissionIds: ['mission-species'],
  },

  // Oslofjord claims
  {
    id: 'claim-oslofjord-restoration',
    text: 'The Oslofjord has lost approximately 90% of its eelgrass meadows since the 1960s, degrading its capacity to support fish and marine life.',
    sourceId: '4planet-manual-oslofjord',
    confidence: 'curated',
    linkedNodeIds: ['node-oslofjord'],
    linkedMissionIds: ['mission-ocean', 'mission-os4lofjorden'],
  },

  // Ecosystem services claims
  {
    id: 'claim-ecosystem-services-framework',
    text: 'Ecosystem services framework includes provisioning, regulating, cultural and supporting services essential to human wellbeing.',
    sourceId: 'iucn-ecosystem-services',
    confidence: 'sourced',
    linkedNodeIds: [],
    linkedMissionIds: [],
  },
];
