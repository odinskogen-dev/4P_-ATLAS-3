import { AtlasNode, LayerId, AtlasNodeType } from '@/types/atlas';

/**
 * Filter nodes by active layers
 * Only return nodes whose layerIds include at least one active layer
 */
export function filterNodesByLayers(nodes: AtlasNode[], activeLayers: LayerId[]): AtlasNode[] {
  if (activeLayers.length === 0) return [];
  return nodes.filter((node) =>
    node.layerIds.some((layerId) => activeLayers.includes(layerId))
  );
}

/**
 * Get nodes of a specific type
 */
export function filterNodesByType(nodes: AtlasNode[], type: AtlasNodeType): AtlasNode[] {
  return nodes.filter((node) => node.type === type);
}

/**
 * Get node color based on type and layer
 */
export function getNodeColor(node: AtlasNode, activeLayers: LayerId[]): string {
  // Color by node type
  switch (node.type) {
    case 'ecosystem':
      return '#2E2EFF'; // Brand blue
    case 'species':
      return '#3CD6CE'; // Aqua
    case 'threat':
      return '#FF5023'; // Orange
    case 'solution':
      return '#3AE86F'; // Green
    case 'mission':
      return '#C8FF6B'; // Neon lime
    case 'partner':
      return '#ADDD00'; // Acid
    case 'impact-unit':
      return '#3AE86F'; // Green
    case 'funding-gap':
      return '#FF7D50'; // Light orange
    default:
      return '#2E2EFF';
  }
}

/**
 * Get node size multiplier for selected state
 */
export function getNodeSize(isSelected: boolean): number {
  return isSelected ? 1.2 : 0.8;
}

/**
 * Earth texture URLs — local 4PLANET branded Earth
 */
export const EARTH_TEXTURE_URL = '/textures/4planet-earth-blue-white-2048.jpg';
export const EARTH_BUMP_URL = '/textures/4planet-earth-blue-white-2048.jpg';

/**
 * Fallback - use same local texture if needed
 */
export const EARTH_TEXTURE_FALLBACK = '/textures/4planet-earth-blue-white-2048.jpg';
export const EARTH_BUMP_FALLBACK = '/textures/4planet-earth-blue-white-2048.jpg';

/**
 * Get node label for display
 */
export function getNodeLabel(node: AtlasNode): string {
  return node.name;
}

/**
 * Get node icon/badge for type
 */
export function getNodeTypeBadge(type: AtlasNodeType): string {
  switch (type) {
    case 'ecosystem':
      return 'E';
    case 'species':
      return 'S';
    case 'threat':
      return 'T';
    case 'solution':
      return 'O';
    case 'mission':
      return 'M';
    case 'partner':
      return 'P';
    case 'impact-unit':
      return 'I';
    case 'funding-gap':
      return 'F';
    default:
      return '?';
  }
}
