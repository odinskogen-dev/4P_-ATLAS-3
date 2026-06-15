'use client';

interface PerformanceControlsProps {
  autoRotate: boolean;
  onAutoRotateToggle: (value: boolean) => void;
  performanceMode: 'standard' | 'low';
  onPerformanceModeChange: (mode: 'standard' | 'low') => void;
}

export default function PerformanceControls({
  autoRotate,
  onAutoRotateToggle,
  performanceMode,
  onPerformanceModeChange,
}: PerformanceControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '72px',
        right: '24px',
        zIndex: 20,
        display: 'flex',
        gap: '12px',
        padding: '12px 16px',
        background: 'rgba(5,5,5,0.8)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '3px',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Auto-rotate toggle */}
      <button
        onClick={() => onAutoRotateToggle(!autoRotate)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: autoRotate ? '1px solid #2E2EFF' : '1px solid rgba(255,255,255,0.15)',
          color: autoRotate ? '#2E2EFF' : 'rgba(255,255,255,0.45)',
          padding: '4px 8px',
          borderRadius: '2px',
          cursor: 'pointer',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: autoRotate ? '#2E2EFF' : 'rgba(255,255,255,0.2)',
          flexShrink: 0,
        }} />
        Rotate
      </button>

      {/* Performance mode selector */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '2px',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {(['standard', 'low'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onPerformanceModeChange(mode)}
            style={{
              background: performanceMode === mode ? 'rgba(46,46,255,0.2)' : 'transparent',
              border: 'none',
              color: performanceMode === mode ? '#2E2EFF' : 'rgba(255,255,255,0.45)',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '9px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            {mode === 'standard' ? 'Std' : 'Low'}
          </button>
        ))}
      </div>
    </div>
  );
}
