'use client';

import { AtlasNode, Mission, PartnerProject, Source, Claim, LivingSystemsChain } from '@/types/atlas';

interface MobileIntelligencePanelProps {
  node: AtlasNode | null;
  missions: Mission[];
  partners: PartnerProject[];
  sources: Source[];
  claims: Claim[];
  chains: LivingSystemsChain[];
}

const confidenceColor = {
  verified: '#3AE86F',
  sourced: '#2E2EFF',
  curated: '#ADDD00',
  draft: '#FF7D50',
};

export default function MobileIntelligencePanel({
  node,
  missions,
  partners,
  sources,
  claims,
  chains,
}: MobileIntelligencePanelProps) {
  if (!node) {
    return (
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
        <p>Select a node to inspect</p>
      </div>
    );
  }

  return (
    <div style={{ color: '#fff', fontSize: '12px', lineHeight: 1.6 }}>
      {/* Node Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              border: `1px solid ${confidenceColor[node.confidence] || '#2E2EFF'}`,
              borderRadius: '2px',
              color: confidenceColor[node.confidence] || '#2E2EFF',
              background: `${confidenceColor[node.confidence] || '#2E2EFF'}15`,
            }}
          >
            {node.confidence}
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '2px',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {node.type}
          </span>
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0', color: '#C8FF6B' }}>
          {node.name}
        </h3>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '4px 0' }}>
          {node.region}
        </p>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
          {node.shortDescription}
        </p>
      </div>

      {/* Why It Matters */}
      {node.whyItMatters && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
            Why It Matters
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
            {node.whyItMatters}
          </p>
        </div>
      )}

      {/* Missions */}
      {missions.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#C8FF6B', marginBottom: '6px' }}>
            Mission{missions.length > 1 ? 's' : ''}
          </div>
          {missions.map((m) => (
            <div
              key={m.id}
              style={{
                fontSize: '10px',
                padding: '6px 8px',
                background: 'rgba(200,255,107,0.05)',
                border: '1px solid rgba(200,255,107,0.15)',
                borderRadius: '3px',
                marginBottom: '4px',
              }}
            >
              <div style={{ color: '#C8FF6B', fontWeight: 500 }}>{m.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px' }}>{m.domain}</div>
            </div>
          ))}
        </div>
      )}

      {/* Living Systems Chain */}
      {chains.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#3CD6CE', marginBottom: '6px' }}>
            Living Systems Chain
          </div>
          {chains.map((chain) => (
            <div
              key={chain.id}
              style={{
                fontSize: '9px',
                padding: '8px',
                background: 'rgba(60,214,206,0.05)',
                border: '1px solid rgba(60,214,206,0.15)',
                borderRadius: '3px',
              }}
            >
              {chain.chain.slice(0, 4).map((el, idx) => (
                <div key={idx}>
                  <span style={{ color: '#3CD6CE', fontWeight: 500 }}>{el.label}</span>
                  {idx < Math.min(3, chain.chain.length - 1) && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', margin: '2px 0' }}>↓</div>
                  )}
                </div>
              ))}
              {chain.chain.length > 4 && (
                <div style={{ color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>... and more</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
            Partner{partners.length > 1 ? 's' : ''}
          </div>
          {partners.map((p) => (
            <div
              key={p.id}
              style={{
                fontSize: '9px',
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                marginBottom: '4px',
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{p.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>
                {p.type} · {p.partnershipStatus}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evidence */}
      {(sources.length > 0 || claims.length > 0) && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#2E2EFF', marginBottom: '6px' }}>
            Evidence
          </div>
          {sources.map((s) => (
            <div
              key={s.id}
              style={{
                fontSize: '9px',
                padding: '6px 8px',
                background: 'rgba(46,46,255,0.05)',
                border: '1px solid rgba(46,46,255,0.15)',
                borderRadius: '3px',
                marginBottom: '4px',
              }}
            >
              <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '8px' }}>
                {s.organisation} {s.year && `(${s.year})`}
              </div>
            </div>
          ))}
          {claims.map((c) => (
            <div
              key={c.id}
              style={{
                fontSize: '9px',
                padding: '6px 8px',
                borderLeft: `2px solid ${confidenceColor[c.confidence] || '#2E2EFF'}`,
                marginBottom: '4px',
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.55)', margin: '0 0 3px 0' }}>"{c.text}"</p>
              <span
                style={{
                  fontSize: '8px',
                  padding: '2px 4px',
                  background: `${confidenceColor[c.confidence] || '#2E2EFF'}15`,
                  color: confidenceColor[c.confidence] || '#2E2EFF',
                  borderRadius: '2px',
                  display: 'inline-block',
                }}
              >
                {c.confidence}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* End padding for scroll */}
      <div style={{ height: '8px' }} />
    </div>
  );
}
