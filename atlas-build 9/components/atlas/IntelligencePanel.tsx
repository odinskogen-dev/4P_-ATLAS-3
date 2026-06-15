'use client';

import { AtlasNode, Mission, PartnerProject, Source, Claim, LivingSystemsChain } from '@/types/atlas';
import MissionCard from './MissionCard';
import ImpactUnitCard from './ImpactUnitCard';
import FundingGapCard from './FundingGapCard';
import EvidenceCard from './EvidenceCard';
import PartnerProjectCard from './PartnerProjectCard';
import LivingSystemsChainComponent from './LivingSystemsChain';

interface IntelligencePanelProps {
  node: AtlasNode | null;
  missions: Mission[];
  partners: PartnerProject[];
  sources: Source[];
  claims: Claim[];
  chains: LivingSystemsChain[];
  onClose: () => void;
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const labelMap: Record<string, { label: string; color: string; bg: string }> = {
    verified: { label: 'Verified', color: '#3AE86F', bg: 'rgba(58,232,111,0.08)' },
    sourced: { label: 'Sourced', color: '#2E2EFF', bg: 'rgba(46,46,255,0.08)' },
    curated: { label: 'Curated', color: '#ADDD00', bg: 'rgba(173,221,0,0.08)' },
    draft: { label: 'Draft', color: '#FF7D50', bg: 'rgba(255,125,80,0.08)' },
  };

  const info = labelMap[confidence] || labelMap.draft;

  return (
    <span
      className="tag"
      style={{
        color: info.color,
        background: info.bg,
        border: `1px solid ${info.color}40`,
        fontSize: '9px',
      }}
    >
      {info.label}
    </span>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div className="section-label">{label}</div>
      {children}
    </div>
  );
}

function TagGroup({ items, color }: { items: string[]; color?: string }) {
  if (!items || items.length === 0) return <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>None recorded</p>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items.map((item) => (
        <span
          key={item}
          className="tag"
          style={{
            fontSize: '10px',
            border: `1px solid rgba(255,255,255,0.15)`,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function IntelligencePanel({
  node,
  missions,
  partners,
  sources,
  claims,
  chains,
  onClose,
}: IntelligencePanelProps) {
  if (!node) {
    return (
      <div
        className="atlas-panel"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '340px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: '40px 20px 20px',
        }}
      >
        <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '16px' }}>Select a node to inspect</p>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
            Click a marker on the globe to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="atlas-panel"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '340px',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'sticky',
          top: 0,
          background: 'rgba(5,5,5,0.95)',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            {node.type}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              width: '20px',
              height: '20px',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.2 }}>
          {node.name}
        </h2>
        {node.subtitle && (
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
            {node.subtitle}
          </p>
        )}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <ConfidenceBadge confidence={node.confidence} />
          <span className="tag" style={{ fontSize: '9px' }}>
            {node.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {/* Description */}
        <Section label="Description">
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            {node.shortDescription}
          </p>
        </Section>

        <Section label="Why It Matters">
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
            {node.whyItMatters}
          </p>
        </Section>

        {node.region && (
          <Section label="Region">
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
              {node.region}
            </p>
          </Section>
        )}

        {node.domain && (
          <Section label="Domain">
            <span className="tag">{node.domain}</span>
          </Section>
        )}

        {/* Missions */}
        {missions.length > 0 && (
          <Section label={`Related Mission${missions.length > 1 ? 's' : ''}`}>
            {missions.map((mission) => (
              <div
                key={mission.id}
                style={{
                  fontSize: '11px',
                  padding: '8px',
                  border: '1px solid rgba(200,255,107,0.2)',
                  borderRadius: '2px',
                  marginBottom: '6px',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                <div style={{ color: '#C8FF6B', fontWeight: 500, marginBottom: '3px' }}>
                  {mission.name}
                </div>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>
                  {mission.shortDescription}
                </p>
                <ConfidenceBadge confidence={mission.status} />
              </div>
            ))}
          </Section>
        )}

        {/* Living Systems Chain */}
        {chains.length > 0 && (
          <Section label="Living Systems Chain">
            {chains.map((chain) => (
              <div key={chain.id} style={{ fontSize: '11px', lineHeight: '1.8', color: 'rgba(255,255,255,0.55)' }}>
                {chain.chain.map((element, idx) => (
                  <div key={idx}>
                    <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                      {element.label}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {' '}
                      — {element.description}
                    </span>
                    {idx < chain.chain.length - 1 && (
                      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', margin: '3px 0' }}>
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </Section>
        )}

        {/* Sources & Evidence */}
        {sources.length > 0 && (
          <Section label={`Source${sources.length > 1 ? 's' : ''}`}>
            {sources.map((source) => (
              <div
                key={source.id}
                style={{
                  fontSize: '10px',
                  padding: '6px',
                  border: '1px solid rgba(46,46,255,0.15)',
                  borderRadius: '2px',
                  marginBottom: '4px',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                <div style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2px' }}>
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
                    style={{
                      color: '#2E2EFF',
                      fontSize: '9px',
                      display: 'block',
                      marginTop: '2px',
                    }}
                  >
                    View →
                  </a>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Claims */}
        {claims.length > 0 && (
          <Section label={`Claim${claims.length > 1 ? 's' : ''}`}>
            {claims.map((claim) => (
              <div
                key={claim.id}
                style={{
                  fontSize: '10px',
                  padding: '6px',
                  borderLeft: '2px solid rgba(46,46,255,0.3)',
                  marginBottom: '6px',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                <p style={{ marginBottom: '4px', lineHeight: 1.4 }}>"{claim.text}"</p>
                <ConfidenceBadge confidence={claim.confidence} />
              </div>
            ))}
          </Section>
        )}

        {/* Partners */}
        {partners.length > 0 && (
          <Section label={`Partner${partners.length > 1 ? 's' : ''}`}>
            {partners.map((partner) => (
              <div
                key={partner.id}
                style={{
                  fontSize: '10px',
                  padding: '6px',
                  border: '1px solid rgba(173,221,0,0.15)',
                  borderRadius: '2px',
                  marginBottom: '4px',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                <div style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2px' }}>
                  {partner.name}
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '3px' }}>
                  {partner.type} · {partner.partnershipStatus}
                </div>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#ADDD00',
                      fontSize: '9px',
                      display: 'block',
                    }}
                  >
                    Visit →
                  </a>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Missions with card format */}
        {missions.length > 0 && (
          <Section label={`Mission${missions.length > 1 ? 's' : ''}`}>
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </Section>
        )}

        {/* Evidence Card */}
        {(sources.length > 0 || claims.length > 0) && (
          <EvidenceCard claims={claims} sources={sources} />
        )}

        {/* Partners with card format */}
        {partners.length > 0 && (
          <Section label={`Partner${partners.length > 1 ? 's' : ''}`}>
            {partners.map((partner) => (
              <PartnerProjectCard key={partner.id} partner={partner} />
            ))}
          </Section>
        )}

        {/* Living Systems Chains */}
        {chains.length > 0 && (
          <LivingSystemsChainComponent chains={chains} />
        )}
      </div>
    </div>
  );
}
