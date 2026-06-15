'use client';

import { AtlasLayer, LayerId } from '@/types/atlas';

interface MobileLayerSheetProps {
  open: boolean;
  onClose: () => void;
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

export default function MobileLayerSheet({
  open,
  onClose,
  layers,
  onToggle,
}: MobileLayerSheetProps) {
  if (!open) return null;

  return (
    <>
      {/* Subtle dim overlay - no blur */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.18)',
          zIndex: 40,
          backdropFilter: 'none',
        }}
      />

      {/* Layer Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px 18px 0 0',
          zIndex: 50,
          maxHeight: '62dvh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'slideUp 0.3s ease-out',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        {/* Header with drag handle */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            position: 'sticky',
            top: 0,
            background: '#050505',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '4px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '2px',
              margin: '0 auto 12px',
            }}
          />
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              margin: '0',
            }}
          >
            Layers
          </h3>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            Toggle layers to control what appears on the globe
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => {
                  onToggle(layer.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: layer.active ? `${LAYER_COLORS[layer.id]}10` : 'transparent',
                  border: layer.active
                    ? `1px solid ${LAYER_COLORS[layer.id]}`
                    : '1px solid rgba(255,255,255,0.1)',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '48px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: layer.active ? LAYER_COLORS[layer.id] : 'transparent',
                    border: `2px solid ${LAYER_COLORS[layer.id]}`,
                    flexShrink: 0,
                    opacity: layer.active ? 1 : 0.4,
                    boxShadow: layer.active
                      ? `0 0 8px ${LAYER_COLORS[layer.id]}60`
                      : 'none',
                  }}
                />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: layer.active ? 600 : 500,
                      color: layer.active
                        ? 'rgba(255,255,255,0.9)'
                        : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {layer.label}
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>
                    {layer.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ height: '8px' }} />
        </div>

        <style>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
