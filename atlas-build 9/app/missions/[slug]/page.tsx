import Link from 'next/link';
import { ATLAS_MISSIONS, MISSION_STUBS } from '@/data/atlas/missions';
import { ATLAS_NODES } from '@/data/atlas/nodes';
import { ATLAS_PARTNERS } from '@/data/atlas/partners';
import { ATLAS_SOURCES } from '@/data/atlas/sources';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const allMissions = [...ATLAS_MISSIONS, ...MISSION_STUBS];
  return allMissions.map((mission) => ({
    slug: mission.id,
  }));
}

export default async function MissionDetailPage({ params }: Props) {
  const { slug } = await params;
  const allMissions = [...ATLAS_MISSIONS, ...MISSION_STUBS];
  const mission = allMissions.find((m) => m.id === slug);

  if (!mission) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px' }}>
        <Link href="/missions" style={{ fontSize: '11px', color: '#2E2EFF', textDecoration: 'none' }}>
          ← Back to Missions
        </Link>
        <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.5)' }}>Mission not found</p>
      </div>
    );
  }

  const relatedNodes = mission.nodeIds
    .map((id) => ATLAS_NODES.find((n) => n.id === id))
    .filter(Boolean);
  const relatedPartners = mission.partnerIds
    .map((id) => ATLAS_PARTNERS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/missions" style={{ fontSize: '11px', color: '#2E2EFF', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Back to Missions
        </Link>

        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em', color: '#C8FF6B' }}>
          {mission.name}
        </h1>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>
          {mission.domain}
        </p>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            Overview
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            {mission.shortDescription}
          </p>
        </div>

        {mission.problem && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Problem
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              {mission.problem}
            </p>
          </div>
        )}

        {mission.solutionSummary && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Solution
            </h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              {mission.solutionSummary}
            </p>
          </div>
        )}

        {relatedNodes.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Geographic Focus
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {relatedNodes.map((node) => (
                <span
                  key={node!.id}
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '3px',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {node!.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {relatedPartners.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              Partners
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {relatedPartners.map((partner) => (
                <div key={partner!.id} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  <strong>{partner!.name}</strong> — {partner!.type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
