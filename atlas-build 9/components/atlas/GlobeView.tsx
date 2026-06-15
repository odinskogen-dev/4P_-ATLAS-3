'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AtlasNode, LayerId } from '@/types/atlas';
import { getNodeColor, getNodeSize } from '@/lib/atlas';

// Import react-globe.gl as a client-only component
const ReactGlobe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <GlobeLoading />,
});

interface GlobeViewProps {
  nodes: AtlasNode[];
  activeLayers: LayerId[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  autoRotate?: boolean;
  onAutoRotateChange?: (value: boolean) => void;
  performanceMode?: 'standard' | 'low';
}

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  id: string;
  label: string;
}

function GlobeLoading() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.35)',
        fontSize: '12px',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          border: '2px solid rgba(46,46,255,0.3)',
          borderTop: '2px solid #2E2EFF',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p>Loading spatial interface...</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function GlobeFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <div style={{ color: '#FF7D50', fontSize: '14px', fontWeight: 600 }}>
        3D globe unavailable
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', maxWidth: '280px' }}>
        The atlas data is still available. Try exploring via the layers panel or routes below.
      </p>
    </div>
  );
}

export default function GlobeView({
  nodes,
  activeLayers,
  selectedId,
  onSelect,
  autoRotate = false,
  onAutoRotateChange,
  performanceMode = 'standard',
}: GlobeViewProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState(false);

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Use ResizeObserver for responsive sizing
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Memoize points to prevent unnecessary re-renders
  const points: GlobePoint[] = useMemo(() => {
    return nodes.map((node) => ({
      lat: node.coordinates.lat,
      lng: node.coordinates.lng,
      size: selectedId === node.id ? getNodeSize(true) : getNodeSize(false),
      color: selectedId === node.id ? '#ffffff' : getNodeColor(node, activeLayers),
      id: node.id,
      label: node.name,
    }));
  }, [nodes, selectedId, activeLayers]);

  // Handle point click
  const handlePointClick = (point: any) => {
    if (point?.id) {
      onSelect(point.id);
      // Fly to selected point
      if (globeRef.current) {
        globeRef.current.pointOfView(
          { lat: point.lat, lng: point.lng, altitude: 2.5 },
          1000
        );
      }
    }
  };

  // Handle globe ready - use useEffect instead
  useEffect(() => {
    if (globeRef.current?.controls()) {
      const controls = globeRef.current.controls();
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = performanceMode === 'low' ? 0.2 : 0.4;
      controls.enableZoom = true;
      controls.minDistance = 200;
      controls.maxDistance = 600;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
    }
  }, [autoRotate, performanceMode]);

  // Update auto-rotate when prop changes
  useEffect(() => {
    if (globeRef.current?.controls()) {
      globeRef.current.controls().autoRotate = autoRotate;
    }
  }, [autoRotate]);

  if (error) {
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <GlobeFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#050505',
      }}
      onError={() => setError(true)}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ReactGlobe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/textures/earth-blue-marble.jpg"
          atmosphereColor="#2E2EFF"
          atmosphereAltitude={0.10}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="size"
          pointResolution={performanceMode === 'low' ? 8 : 12}
          onPointClick={handlePointClick}
          onPointHover={(point: any) => {
            if (containerRef.current) {
              containerRef.current.style.cursor = point ? 'pointer' : 'grab';
            }
          }}
        />
      )}

      {/* Instruction text overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.05em',
          textAlign: 'center',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Drag to rotate · Scroll to zoom · Click to inspect
      </div>
    </div>
  );
}
