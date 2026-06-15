'use client';

interface AtlasLegendProps {
  activeLayerCount: number;
  nodeCount: number;
  totalNodeCount: number;
}

export default function AtlasLegend({ activeLayerCount, nodeCount, totalNodeCount }: AtlasLegendProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '8px 16px',
        background: 'rgba(5,5,5,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '3px',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
      }}
    >
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
        DRAG TO ROTATE · SCROLL TO ZOOM · CLICK TO INSPECT
      </span>
      <div style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.1)' }} />
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
        {nodeCount} / {totalNodeCount} NODES
      </span>
    </div>
  );
}
