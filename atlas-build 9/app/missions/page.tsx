import Link from 'next/link';
import { ATLAS_MISSIONS, MISSION_STUBS } from '@/data/atlas/missions';
import MissionLink from '@/components/atlas/MissionLink';

export default function MissionsPage() {
  const allMissions = [...ATLAS_MISSIONS, ...MISSION_STUBS];

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{ fontSize: '11px', color: '#2E2EFF', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
            ← Back to Atlas
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
            Missions
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Core missions that convert geographic and ecological intelligence into concrete action across Earth.
          </p>
        </div>

        {/* Mission grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {allMissions.map((mission) => (
            <MissionLink key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </div>
  );
}
