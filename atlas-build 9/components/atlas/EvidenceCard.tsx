'use client';

import { Claim, Source } from '@/types/atlas';

interface EvidenceCardProps {
  claims: Claim[];
  sources: Source[];
}

const confidenceMap: Record<string, { color: string; bg: string }> = {
  verified: { color: '#3AE86F', bg: 'rgba(58,232,111,0.08)' },
  sourced: { color: '#2E2EFF', bg: 'rgba(46,46,255,0.08)' },
  curated: { color: '#ADDD00', bg: 'rgba(173,221,0,0.08)' },
  draft: { color: '#FF7D50', bg: 'rgba(255,125,80,0.08)' },
};

export default function EvidenceCard({ claims, sources }: EvidenceCardProps) {
  return (
    <div style={{ marginTop: '12px' }}>
      {/* Sources */}
      {sources.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>
            Source{sources.length > 1 ? 's' : ''}
          </div>
          {sources.map((source) => (
            <div
              key={source.id}
              style={{
                fontSize: '10px',
                padding: '8px',
                border: '1px solid rgba(46,46,255,0.15)',
                borderRadius: '2px',
                marginBottom: '6px',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginBottom: '2px' }}>
                {source.title}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>
                {source.organisation} {source.year && `(${source.year})`}
              </div>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2E2EFF', fontSize: '9px', display: 'block', marginTop: '3px' }}
                >
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Claims */}
      {claims.length > 0 && (
        <div>
          <div className="section-label" style={{ marginBottom: '8px' }}>
            Evidence
          </div>
          {claims.map((claim) => {
            const conf = confidenceMap[claim.confidence] || confidenceMap.draft;
            return (
              <div
                key={claim.id}
                style={{
                  fontSize: '10px',
                  padding: '8px',
                  borderLeft: `2px solid ${conf.color}`,
                  marginBottom: '6px',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                <p style={{ marginBottom: '4px', lineHeight: 1.3 }}>
                  "{claim.text}"
                </p>
                <span
                  className="tag"
                  style={{
                    fontSize: '8px',
                    color: conf.color,
                    background: conf.bg,
                    border: `1px solid ${conf.color}40`,
                  }}
                >
                  {claim.confidence}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {claims.length === 0 && sources.length === 0 && (
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
          No sources or claims recorded
        </p>
      )}
    </div>
  );
}
