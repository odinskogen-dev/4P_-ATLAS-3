'use client';

import Link from 'next/link';
import { Mission } from '@/types/atlas';

interface MissionLinkProps {
  mission: Mission;
}

export default function MissionLink({ mission }: MissionLinkProps) {
  return (
    <Link
      href={`/missions/${mission.id}`}
      style={{
        padding: '20px',
        border: '1px solid rgba(200,255,107,0.15)',
        borderRadius: '6px',
        background: 'rgba(200,255,107,0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,255,107,0.3)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(200,255,107,0.08)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,255,107,0.15)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(200,255,107,0.05)';
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#C8FF6B', fontWeight: 600, fontSize: '14px', letterSpacing: '0.05em' }}>
          {mission.name}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
          {mission.domain}
        </div>
      </div>
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
        {mission.shortDescription}
      </p>
      <div style={{ marginTop: '12px', fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>
        {mission.nodeIds.length} nodes · {mission.impactUnitIds.length} impact units
      </div>
    </Link>
  );
}
