'use client';

import { Mission } from '@/types/atlas';

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  return (
    <div
      style={{
        padding: '12px',
        border: '1px solid rgba(200,255,107,0.2)',
        borderRadius: '3px',
        background: 'rgba(200,255,107,0.04)',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ color: '#C8FF6B', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em' }}>
            {mission.name}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {mission.domain}
          </div>
        </div>
        <span
          className="tag"
          style={{
            fontSize: '8px',
            color: mission.status === 'active' ? '#3AE86F' : '#ADDD00',
            background: mission.status === 'active' ? 'rgba(58,232,111,0.08)' : 'rgba(173,221,0,0.08)',
            border: mission.status === 'active' ? '1px solid rgba(58,232,111,0.3)' : '1px solid rgba(173,221,0,0.3)',
          }}
        >
          {mission.status}
        </span>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginBottom: '8px' }}>
        {mission.shortDescription}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '10px' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '2px' }}>Problem</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.3, fontSize: '9px' }}>
            {mission.problem}
          </p>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginBottom: '2px' }}>Solution</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.3, fontSize: '9px' }}>
            {mission.solutionSummary}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
        <span>Nodes: {mission.nodeIds.length}</span>
        <span style={{ marginLeft: '8px' }}>Partners: {mission.partnerIds.length}</span>
        <span style={{ marginLeft: '8px' }}>Impact units: {mission.impactUnitIds.length}</span>
      </div>
    </div>
  );
}
