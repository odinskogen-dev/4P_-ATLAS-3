import Link from 'next/link';
import { ATLAS_SOURCES } from '@/data/atlas/sources';

export default function SourcesPage() {
  const byType = ATLAS_SOURCES.reduce((acc, source) => {
    const type = source.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(source);
    return acc;
  }, {} as Record<string, typeof ATLAS_SOURCES>);

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: '11px', color: '#2E2EFF', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Back to Atlas
        </Link>

        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
          Sources & Evidence
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: 1.6 }}>
          Verified sources and data that inform 4PLANET ATLAS.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {ATLAS_SOURCES.map((source) => (
            <div
              key={source.id}
              style={{
                padding: '20px',
                border: '1px solid rgba(46,46,255,0.15)',
                borderRadius: '6px',
                background: 'rgba(46,46,255,0.05)',
              }}
            >
              <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#2E2EFF', marginBottom: '4px' }}>
                {source.title}
              </h3>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>
                {source.organisation}
                {source.year && ` · ${source.year}`}
              </p>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '10px',
                    color: '#2E2EFF',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Access source →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
