'use client';

interface AtlasHeaderProps {
  locationCount: number;
  selectedName?: string;
}

export default function AtlasHeader({ locationCount, selectedName }: AtlasHeaderProps) {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        paddingBottom: '16px',
      }}
    >
      {/* Left: Wordmark */}
      <div className="flex items-center gap-4" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-2" style={{ whiteSpace: 'nowrap' }}>
          <span style={{
            fontWeight: 700,
            fontSize: 'clamp(12px, 4vw, 15px)',
            letterSpacing: '0.08em',
            color: '#ffffff',
          }}>
            4PLANET
          </span>
          <span style={{
            fontWeight: 300,
            fontSize: 'clamp(12px, 4vw, 15px)',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.45)',
          }}>
            ATLAS
          </span>
        </div>
        {/* Hide subtitle on mobile */}
        <div style={{
          width: '1px',
          height: '14px',
          background: 'rgba(255,255,255,0.12)',
          display: 'none',
        }} />
        <span style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.04em',
          fontWeight: 400,
          display: 'none',
        }}>
          Spatial Intelligence Interface
        </span>

        {/* Mobile-only: show node count inline */}
        <span
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.04em',
            display: 'block',
          }}
          className="mobile-node-count"
        >
          {locationCount} / 19
        </span>
      </div>

      {/* Right: Status (hide long items on mobile) */}
      <div className="flex items-center gap-2" style={{ whiteSpace: 'nowrap', marginLeft: '12px' }}>
        {/* Hide selected name on mobile */}
        {selectedName && (
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.04em',
            display: 'none',
          }}>
            {selectedName}
          </span>
        )}
        {/* Hide node count visual on mobile */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
          }}
          className="desktop-only-flex"
        >
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#2E2EFF',
            boxShadow: '0 0 6px #2E2EFF',
          }} />
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            {locationCount} NODES ACTIVE
          </span>
        </div>
        {/* Hide badge on mobile */}
        <div
          className="tag tag-blue"
          style={{
            fontSize: '8px',
            display: 'none',
          }}
        >
          v2.4
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .mobile-node-count {
            display: none !important;
          }
          .desktop-only-flex {
            display: flex !important;
          }
          .tag {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
