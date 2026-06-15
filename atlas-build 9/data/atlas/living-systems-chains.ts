import { LivingSystemsChain } from '@/types/atlas';

export const ATLAS_LIVING_SYSTEMS_CHAINS: LivingSystemsChain[] = [
  {
    id: 'chain-jaguar',
    nodeId: 'node-jaguar',
    missionId: 'mission-am4zonia',
    chain: [
      {
        label: 'Jaguar',
        type: 'species',
        description: 'Apex predator',
      },
      {
        label: 'Predation',
        type: 'function',
        description: 'Regulates herbivore populations, maintains trophic balance',
      },
      {
        label: 'Forest Resilience',
        type: 'ecosystem-service',
        description: 'Healthy herbivore populations sustain vegetation structure',
      },
      {
        label: 'Climate & Water Stability',
        type: 'human-system',
        description: 'Forest structure regulates precipitation, carbon storage, temperature',
      },
      {
        label: 'Habitat Fragmentation',
        type: 'threat',
        description: 'Jaguar range reduced 50%, isolated populations cannot interbreed',
      },
      {
        label: 'Habitat Corridors & Protected Areas',
        type: 'solution',
        description: 'Create continuous habitat enabling migration and genetic diversity',
      },
      {
        label: 'AM4ZONIA Mission',
        type: 'mission',
        description: 'Protect and restore Amazon ecosystems',
      },
      {
        label: 'Hectares of Forest Protected & Monitored',
        type: 'impact',
        description: 'Measurable forest area under protection and active monitoring',
      },
    ],
  },
  {
    id: 'chain-bee',
    nodeId: 'node-western-honey-bee',
    missionId: 'mission-species',
    chain: [
      {
        label: 'Western Honey Bee',
        type: 'species',
        description: 'Primary pollinator of crops and wildflowers',
      },
      {
        label: 'Pollination',
        type: 'function',
        description: '75% of crop varieties depend on insect pollination',
      },
      {
        label: 'Food Production & Nutrition',
        type: 'ecosystem-service',
        description: 'Pollination enables fruit, vegetable, and seed production',
      },
      {
        label: 'Human Food Security & Health',
        type: 'human-system',
        description: 'Nutrition, agricultural livelihoods, economic stability',
      },
      {
        label: 'Pesticides & Habitat Loss',
        type: 'threat',
        description: 'Synthetic pesticides kill pollinators. Monoculture eliminates habitat.',
      },
      {
        label: 'Regenerative Farming & Pollinator Habitat',
        type: 'solution',
        description: 'Reduce pesticides, restore flowering plants, create diverse agroecosystems',
      },
      {
        label: 'SPECIES / FOOD Missions',
        type: 'mission',
        description: 'Protect keystone species. Support food security.',
      },
      {
        label: 'Hectares of Pollinator Habitat Restored',
        type: 'impact',
        description: 'Area under regenerative practices with native flowering plants',
      },
    ],
  },
  {
    id: 'chain-whale',
    nodeId: 'node-blue-whale',
    missionId: 'mission-wh4les',
    chain: [
      {
        label: 'Blue Whale',
        type: 'species',
        description: 'Largest animal on Earth. Apex consumer of krill.',
      },
      {
        label: 'Nutrient Cycling & Carbon Sequestration',
        type: 'function',
        description: 'Whales distribute nutrients vertically. Whale falls sequester carbon for centuries.',
      },
      {
        label: 'Ocean Productivity & Carbon Storage',
        type: 'ecosystem-service',
        description: 'Whale nutrient cycling supports phytoplankton. Whale falls store carbon.',
      },
      {
        label: 'Climate Regulation & Food Web Support',
        type: 'human-system',
        description: 'Carbon sequestration aids climate stability. Healthy fisheries support food security.',
      },
      {
        label: 'Ship Strikes, Prey Depletion, Pollution',
        type: 'threat',
        description: 'Industrial fishing depletes krill. Ships strike whales. Chemical pollution accumulates.',
      },
      {
        label: 'Marine Protected Areas & Fisheries Reform',
        type: 'solution',
        description: 'Establish ocean sanctuaries. Manage krill sustainably. Reduce shipping impacts.',
      },
      {
        label: 'WH4LES Mission',
        type: 'mission',
        description: 'Restore whale populations and marine food webs',
      },
      {
        label: 'Whale Individuals Protected & Monitored',
        type: 'impact',
        description: 'Population size tracked through monitoring programs',
      },
    ],
  },
  {
    id: 'chain-oslofjord',
    nodeId: 'node-oslofjord',
    missionId: 'mission-os4lofjorden',
    chain: [
      {
        label: 'Eelgrass & Mussel Beds',
        type: 'species',
        description: 'Foundational habitat structures in fjord ecosystem',
      },
      {
        label: 'Nutrient Cycling & Water Filtration',
        type: 'function',
        description: 'Seagrass absorbs excess nutrients. Mussels filter and clarify water.',
      },
      {
        label: 'Water Quality & Fish Nursery Habitat',
        type: 'ecosystem-service',
        description: 'Clean water. Juvenile fish nursery grounds.',
      },
      {
        label: 'Urban Coastal Health & Fisheries',
        type: 'human-system',
        description: 'Livable coastal cities. Seafood production. Recreation value.',
      },
      {
        label: 'Eutrophication, Pollution, Habitat Loss',
        type: 'threat',
        description: '90% of seagrass lost. Algal blooms. Fish declined.',
      },
      {
        label: 'Mussel Restoration & Pollution Reduction',
        type: 'solution',
        description: 'Transplant mussels. Improve wastewater treatment. Reduce agricultural runoff.',
      },
      {
        label: '4Oslofjorden Pilot Project',
        type: 'mission',
        description: 'Restore Oslofjord as proof-of-concept for urban fjord restoration',
      },
      {
        label: 'Hectares of Fjord Restored',
        type: 'impact',
        description: 'Area of habitat restoration and monitoring',
      },
    ],
  },
];
