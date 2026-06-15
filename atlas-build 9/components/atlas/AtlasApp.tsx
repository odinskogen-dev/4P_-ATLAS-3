'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ATLAS_NODES } from '@/data/atlas/nodes';
import { ATLAS_LAYERS } from '@/data/atlas/layers';
import { ATLAS_MISSIONS, MISSION_STUBS } from '@/data/atlas/missions';
import { ATLAS_PARTNERS } from '@/data/atlas/partners';
import { ATLAS_SOURCES } from '@/data/atlas/sources';
import { ATLAS_CLAIMS } from '@/data/atlas/claims';
import { ATLAS_IMPACT_UNITS } from '@/data/atlas/impact-units';
import { ATLAS_FUNDING_GAPS } from '@/data/atlas/funding-gaps';
import { ATLAS_LIVING_SYSTEMS_CHAINS } from '@/data/atlas/living-systems-chains';
import { AtlasLayer, LayerId, AtlasNode } from '@/types/atlas';
import { filterNodesByLayers } from '@/lib/atlas';
import AtlasHeader from './AtlasHeader';
import LayerControls from './LayerControls';
import IntelligencePanel from './IntelligencePanel';
import MobileIntelligencePanel from './MobileIntelligencePanel';
import AtlasLegend from './AtlasLegend';
import PerformanceControls from './PerformanceControls';
import MobileBottomSheet from './MobileBottomSheet';
import MobileLayerSheet from './MobileLayerSheet';
import { ErrorBoundary } from './ErrorBoundary';

const GlobeView = dynamic(() => import('./GlobeView'), {
  ssr: false,
  loading: () => null,
});

interface AtlasAppProps {
  embed?: boolean;
}

export default function AtlasApp({ embed = false }: AtlasAppProps) {
  const [layers, setLayers] = useState<AtlasLayer[]>(ATLAS_LAYERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<'standard' | 'low'>('standard');
  const [mobileLayerSheetOpen, setMobileLayerSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Computed values
  const activeLayers = useMemo(
    () => layers.filter((l) => l.active).map((l) => l.id as LayerId),
    [layers]
  );

  const visibleNodes = useMemo(
    () => filterNodesByLayers(ATLAS_NODES, activeLayers),
    [activeLayers]
  );

  const selectedNode: AtlasNode | null = useMemo(
    () => visibleNodes.find((n) => n.id === selectedId) ?? null,
    [selectedId, visibleNodes]
  );

  // Get related data for selected node
  const selectedMissions = useMemo(() => {
    if (!selectedNode) return [];
    const ALL_MISSIONS = [...ATLAS_MISSIONS, ...MISSION_STUBS];
    return selectedNode.missionIds
      .map((id) => ALL_MISSIONS.find((m) => m.id === id))
      .filter(Boolean);
  }, [selectedNode]);

  const selectedPartners = useMemo(() => {
    if (!selectedNode) return [];
    return selectedNode.partnerIds
      ?.map((id) => ATLAS_PARTNERS.find((p) => p.id === id))
      .filter(Boolean) || [];
  }, [selectedNode]);

  const selectedSources = useMemo(() => {
    if (!selectedNode) return [];
    return selectedNode.sourceIds
      .map((id) => ATLAS_SOURCES.find((s) => s.id === id))
      .filter(Boolean);
  }, [selectedNode]);

  const selectedClaims = useMemo(() => {
    if (!selectedNode) return [];
    return selectedNode.claimIds
      .map((id) => ATLAS_CLAIMS.find((c) => c.id === id))
      .filter(Boolean);
  }, [selectedNode]);

  const selectedChains = useMemo(() => {
    if (!selectedNode) return [];
    return ATLAS_LIVING_SYSTEMS_CHAINS.filter((chain) =>
      chain.nodeId === selectedNode.id
    );
  }, [selectedNode]);

  // Handlers
  const handleLayerToggle = useCallback((id: LayerId) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, active: !layer.active } : layer))
    );
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  const panelOpen = selectedId !== null;

  return (
    <div
      className="atlas-grid-bg"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        overflow: 'hidden',
        background: '#050505',
      }}
    >
      {/* Radial vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Header */}
      {!embed && (
        <AtlasHeader
          locationCount={visibleNodes.length}
          selectedName={selectedNode?.name}
        />
      )}

      {/* Globe container — responsive */}
      <ErrorBoundary>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            top: isMobile ? 0 : 0,
            left: isMobile ? 0 : 0,
            right: isMobile ? 0 : panelOpen ? '340px' : 0,
            bottom: 0,
            transition: isMobile ? 'none' : 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 0,
          }}
        >
          <GlobeView
            nodes={visibleNodes}
            activeLayers={activeLayers}
            selectedId={selectedId}
            onSelect={handleSelect}
            autoRotate={autoRotate}
            onAutoRotateChange={setAutoRotate}
            performanceMode={performanceMode}
          />
        </div>
      </ErrorBoundary>

      {/* Performance controls — desktop only */}
      {!isMobile && (
        <PerformanceControls
          autoRotate={autoRotate}
          onAutoRotateToggle={setAutoRotate}
          performanceMode={performanceMode}
          onPerformanceModeChange={setPerformanceMode}
        />
      )}

      {/* Layer controls — desktop only */}
      {!isMobile && <LayerControls layers={layers} onToggle={handleLayerToggle} />}

      {/* Mobile Layer Button */}
      {isMobile && (
        <button
          onClick={() => setMobileLayerSheetOpen(true)}
          style={{
            position: 'fixed',
            top: 'calc(56px + env(safe-area-inset-top))',
            left: '16px',
            zIndex: 20,
            padding: '8px 12px',
            background: 'rgba(5,5,5,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '3px',
            color: '#2E2EFF',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          LAYERS
        </button>
      )}

      {/* Mobile Layer Sheet */}
      {isMobile && (
        <MobileLayerSheet
          open={mobileLayerSheetOpen}
          onClose={() => setMobileLayerSheetOpen(false)}
          layers={layers}
          onToggle={handleLayerToggle}
        />
      )}

      {/* Intelligence panel — desktop only */}
      {!isMobile && (
        <IntelligencePanel
          node={selectedNode}
          missions={selectedMissions}
          partners={selectedPartners}
          sources={selectedSources}
          claims={selectedClaims}
          chains={selectedChains}
          onClose={handleClose}
        />
      )}

      {/* Mobile Bottom Sheet */}
      {isMobile && (
        <MobileBottomSheet
          open={panelOpen}
          onClose={handleClose}
          title={selectedNode?.name}
        >
          <MobileIntelligencePanel
            node={selectedNode}
            missions={selectedMissions}
            partners={selectedPartners}
            sources={selectedSources}
            claims={selectedClaims}
            chains={selectedChains}
          />
        </MobileBottomSheet>
      )}

      {/* Bottom legend */}
      {!embed && (
        <AtlasLegend
          activeLayerCount={activeLayers.length}
          nodeCount={visibleNodes.length}
          totalNodeCount={ATLAS_NODES.length}
        />
      )}

      {/* Intro copy — top right, hide when panel open on desktop */}
      {!embed && !isMobile && !panelOpen && (
        <div
          style={{
            position: 'absolute',
            top: '72px',
            right: '24px',
            textAlign: 'right',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.04em',
              lineHeight: 1.8,
            }}
          >
            Spatial intelligence interface for<br />
            living systems, threats, solutions,<br />
            missions and impact across Earth.
          </p>
        </div>
      )}

      {/* Empty state */}
      {activeLayers.length === 0 && !panelOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 8,
            background: 'rgba(5,5,5,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '380px' }}>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: '1.8',
                marginBottom: '16px',
              }}
            >
              No layers active. Select a layer to explore the atlas.
            </p>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              Try: Living Systems or Missions
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
