'use client';

import { AtlasLayer, LayerId } from '@/types/atlas';

interface LayerControlsProps {
  layers: AtlasLayer[];
  onToggle: (id: LayerId) => void;
}

const LAYER_COLORS: Record<LayerId, string> = {
  'living-systems': '#2E2EFF',
  'key-species': '#3CD6CE',
  'threats': '#FF5023',
  'solutions': '#3AE86F',
  'missions': '#C8FF6B',
  'partners': '#ADDD00',
  'funding-gaps': '#FF7D50',
  'impact-units': '#3AE86F',
};

export default function LayerControls({ layers, onToggle }: LayerControlsProps) {
  return (
    <div
      className="absolute bottom-8 left-6 z-20"
      style={{
        background: 'rgba(5,5,5,0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px',
        padding: '16px',
        backdropFilter: 'blur(12px)',
        minWidth: '180px',
      }}
    >
      <div className="section-label" style={{ marginBottom: '12px' }}>Layers</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                flexShrink: 0,
                background: layer.active ? LAYER_COLORS[layer.id] : 'transparent',
                border: `1.5px solid ${LAYER_COLORS[layer.id]}`,
                opacity: layer.active ? 1 : 0.4,
                transition: 'all 0.2s',
                boxShadow: layer.active ? `0 0 6px ${LAYER_COLORS[layer.id]}60` : 'none',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: layer.active ? 500 : 400,
                color: layer.active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                letterSpacing: '0.02em',
                transition: 'color 0.2s',
              }}
            >
              {layer.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
