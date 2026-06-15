'use client';

import { FundingGap } from '@/types/atlas';

interface FundingGapCardProps {
  gap: FundingGap;
}

export default function FundingGapCard({ gap }: FundingGapCardProps) {
  return (
    <div
      style={{
        padding: '12px',
        border: '1px solid rgba(255,125,80,0.2)',
        borderRadius: '3px',
        background: 'rgba(255,125,80,0.04)',
        marginBottom: '12px',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#FF7D50', fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em' }}>
          Funding Gap
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
          {gap.title}
        </div>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginBottom: '8px' }}>
        {gap.summary}
      </p>

      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
        <div style={{ fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
          Underfunded area
        </div>
        <p>{gap.underfundedArea}</p>
      </div>

      {gap.whyMarketsFail && (
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
          <div style={{ fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            Why markets fail
          </div>
          <p>{gap.whyMarketsFail}</p>
        </div>
      )}

      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>
        <div style={{ fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
          Sponsor opportunity
        </div>
        <p>{gap.sponsorOpportunity}</p>
      </div>
    </div>
  );
}
