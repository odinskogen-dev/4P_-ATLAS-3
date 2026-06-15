'use client';

import { PartnerProject } from '@/types/atlas';

interface PartnerProjectCardProps {
  partner: PartnerProject;
}

export default function PartnerProjectCard({ partner }: PartnerProjectCardProps) {
  const statusColor = {
    'partner': '#C8FF6B',
    'in-dialogue': '#ADDD00',
    'potential': '#2E2EFF',
    'reference-only': 'rgba(255,255,255,0.35)',
  }[partner.partnershipStatus];

  return (
    <div
      style={{
        padding: '12px',
        border: `1px solid ${statusColor}30`,
        borderRadius: '3px',
        background: `${statusColor}08`,
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div style={{ color: statusColor, fontWeight: 600, fontSize: '12px', letterSpacing: '0.05em' }}>
            {partner.name}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
            {partner.type}
          </div>
        </div>
        <span
          className="tag"
          style={{
            fontSize: '8px',
            color: statusColor,
            background: `${statusColor}15`,
            border: `1px solid ${statusColor}40`,
          }}
        >
          {partner.partnershipStatus === 'reference-only' ? 'Reference' : partner.partnershipStatus}
        </span>
      </div>

      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginBottom: '8px' }}>
        {partner.whyRelevantTo4PLANET}
      </p>

      {partner.region && (
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>
          <strong>Region:</strong> {partner.region}
        </div>
      )}

      {partner.solutionTypes.length > 0 && (
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>Solutions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {partner.solutionTypes.map((type) => (
              <span
                key={type}
                className="tag"
                style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontSize: '10px',
            color: statusColor,
            marginTop: '6px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Visit website →
        </a>
      )}
    </div>
  );
}
