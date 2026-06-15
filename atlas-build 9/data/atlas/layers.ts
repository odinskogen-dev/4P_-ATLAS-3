import { AtlasLayer } from '@/types/atlas';

export const ATLAS_LAYERS: AtlasLayer[] = [
  {
    id: 'living-systems',
    label: 'Living Systems',
    description: 'Ecosystems and biomes',
    color: '#2E2EFF',
    active: true,
  },
  {
    id: 'key-species',
    label: 'Key Species',
    description: 'Keystone and indicator species',
    color: '#3CD6CE',
    active: true,
  },
  {
    id: 'threats',
    label: 'Threats',
    description: 'Active ecological threats',
    color: '#FF5023',
    active: false,
  },
  {
    id: 'solutions',
    label: 'Solutions',
    description: 'Solutions and restoration approaches',
    color: '#3AE86F',
    active: false,
  },
  {
    id: 'missions',
    label: 'Missions',
    description: '4PLANET mission nodes',
    color: '#C8FF6B',
    active: true,
  },
  {
    id: 'partners',
    label: 'Partners',
    description: 'Partner organizations and projects',
    color: '#ADDD00',
    active: false,
  },
  {
    id: 'funding-gaps',
    label: 'Funding Gaps',
    description: 'Underfunded critical areas',
    color: '#FF7D50',
    active: false,
  },
  {
    id: 'impact-units',
    label: 'Impact Units',
    description: 'Measurable impact actions',
    color: '#3AE86F',
    active: false,
  },
];
