import Link from 'next/link';
import { ATLAS_PARTNERS } from '@/data/atlas/partners';

export default function PartnersPage() {
  const byStatus = {
    partner: ATLAS_PARTNERS.filter((p) => p.partnershipStatus === 'partner'),
    'in-dialogue': ATLAS_PARTNERS.filter((p) => p.partnershipStatus === 'in-dialogue'),
    potential: ATLAS_PARTNERS.filter((p) => p.partnershipStatus === 'potential'),
    'reference-only': ATLAS_PARTNERS.filter((p) => p.partnershipStatus === 'reference-only'),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: '11px', color: '#2E2EFF', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Back to Atlas
        </Link>

        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
          Partners & References
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: 1.6 }}>
          Organizations and projects that inform and support 4PLANET's mission.
        </p>

        {Object.entries(byStatus).map(([status, partners]) => {
          if (partners.length === 0) return null;

          const statusLabel = {
            partner: 'Official Partners',
            'in-dialogue': 'In Dialogue',
            potential: 'Potential',
            'reference-only': 'References',
          }[status];

          const statusColor = {
            partner: '#C8FF6B',
            'in-dialogue': '#ADDD00',
            potential: '#2E2EFF',
            'reference-only': 'rgba(255,255,255,0.35)',
          }[status];

          return (
            <div key={status} style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: statusColor, marginBottom: '16px', letterSpacing: '0.05em' }}>
                {statusLabel}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    style={{
                      padding: '16px',
                      border: `1px solid ${statusColor}30`,
                      borderRadius: '6px',
                      background: `${statusColor}08`,
                    }}
                  >
                    <h3 style={{ fontSize: '12px', fontWeight: 600, color: statusColor, marginBottom: '4px' }}>
                      {partner.name}
                    </h3>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                      {partner.type}
                      {partner.region && ` · ${partner.region}`}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginBottom: '8px' }}>
                      {partner.whyRelevantTo4PLANET}
                    </p>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '10px',
                          color: statusColor,
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
