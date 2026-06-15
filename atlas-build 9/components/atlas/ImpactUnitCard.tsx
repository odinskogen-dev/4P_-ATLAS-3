'use client';

import { ImpactUnit } from '@/types/atlas';

interface ImpactUnitCardProps {
  impact: ImpactUnit;
}

export default function ImpactUnitCard({ impact }: ImpactUnitCardProps) {
  return (
    <div
      style={{
        padding: '12px',
        border: '1px solid rgba(58,232,111,0.2)',
        borderRadius: '3px',
        background: 'rgba(58,232,111,0.04)',
        marginBottom: '12px',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#3AE86F', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em' }}>
          {impact.label}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
          {impact.unit}
        </div>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginBottom: '8px' }}>
        {impact.whatItFunds}
      </p>

      {impact.estimatedCostNOK && (
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
          <strong>Est. cost:</strong> {impact.estimatedCostNOK} NOK
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <span
          className="tag"
          style={{
            fontSize: '8px',
            color: impact.verificationStatus === 'verified' ? '#3AE86F' : '#FF7D50',
            background: impact.verificationStatus === 'verified' ? 'rgba(58,232,111,0.08)' : 'rgba(255,125,80,0.08)',
            border: impact.verificationStatus === 'verified' ? '1px solid rgba(58,232,111,0.3)' : '1px solid rgba(255,125,80,0.3)',
          }}
        >
          {impact.verificationStatus === 'verified' ? 'Verified' : 'Not live yet'}
        </span>
        {impact.partnerRequired && (
          <span
            className="tag"
            style={{
              fontSize: '8px',
              marginLeft: '4px',
              color: '#ADDD00',
              background: 'rgba(173,221,0,0.08)',
              border: '1px solid rgba(173,221,0,0.3)',
            }}
          >
            Partner required
          </span>
        )}
      </div>

      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
        <p style={{ fontStyle: 'italic', marginTop: '4px' }}>
          {impact.caveat}
        </p>
      </div>
    </div>
  );
}
