'use client';

import { LivingSystemsChain } from '@/types/atlas';

interface LivingSystemsChainProps {
  chains: LivingSystemsChain[];
}

const typeColors: Record<string, string> = {
  species: '#3CD6CE',
  function: '#2E2EFF',
  'ecosystem-service': '#3AE86F',
  'human-system': '#ADDD00',
  threat: '#FF5023',
  solution: '#3AE86F',
  mission: '#C8FF6B',
  impact: '#3AE86F',
};

export default function LivingSystemsChainComponent({ chains }: LivingSystemsChainProps) {
  if (!chains || chains.length === 0) return null;

  return (
    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
      <div className="section-label" style={{ marginBottom: '8px' }}>
        Living Systems Chain
      </div>

      {chains.map((chain) => (
        <div
          key={chain.id}
          style={{
            padding: '12px',
            border: '1px solid rgba(60,214,206,0.2)',
            borderRadius: '3px',
            background: 'rgba(60,214,206,0.04)',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontSize: '11px', lineHeight: '1.8', color: 'rgba(255,255,255,0.55)' }}>
            {chain.chain.map((element, idx) => (
              <div key={idx}>
                <span
                  style={{
                    color: typeColors[element.type] || '#2E2EFF',
                    fontWeight: 500,
                    fontSize: '12px',
                  }}
                >
                  {element.label}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: '6px', fontSize: '10px' }}>
                  {element.description}
                </span>
                {idx < chain.chain.length - 1 && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.15)',
                      margin: '4px 0',
                      fontSize: '14px',
                    }}
                  >
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
