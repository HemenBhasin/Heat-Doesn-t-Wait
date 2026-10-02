"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Trees,
  Users,
  Building,
  Wind,
  Flame,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  FileDown,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MapPin,
  Layers,
} from 'lucide-react';
import { WardRecord, LayerId, RiskClass, GeoJSONFeature, WardGeoJSON } from '@/types/mapTypes';
import { LAYERS_REGISTRY, LAYER_IDS } from '@/lib/layersRegistry';
import {
  loadWardGeoJSON,
  coordinatesToSvgPath,
  getYamunaSvgPath,
  projectCoord,
  getRiskClass,
  matchesRiskClass,
  SVG_WIDTH,
  SVG_HEIGHT,
} from '@/lib/wardDataAdapter';
import { ScrollHeading } from '@/components/ui/ScrollHeading';

interface ProjectedWard {
  record: WardRecord;
  path: string;
  centroidProj: [number, number];
}

const LAYER_EXPLANATIONS: Record<LayerId, { title: string; desc: string }> = {
  avg_temperature_c: {
    title: "🌡 Temperature",
    desc: "Shows the average air temperature recorded or estimated for each ward. Higher values indicate areas experiencing greater heat.",
  },
  pop_density: {
    title: "👥 Population",
    desc: "Shows the number of people living in each ward. It helps identify how many residents may be exposed to extreme heat.",
  },
  green_cover_pct: {
    title: "🌿 Green Cover",
    desc: "Shows the share of an area covered by vegetation such as parks, trees, grass, and other greenery. More greenery can provide shade and natural cooling.",
  },
  built_up_pct: {
    title: "🏢 Built-up",
    desc: "Shows how much of a ward is covered by buildings and other constructed surfaces. Higher built-up areas generally indicate more densely developed surroundings.",
  },
  AQI: {
    title: "💨 AQI",
    desc: "Shows the Air Quality Index, which indicates how clean or polluted the air is. Higher values represent poorer air quality.",
  },
  heat_index_c: {
    title: "🔥 Heat Index",
    desc: "Shows how hot the conditions feel when temperature and humidity are considered together. Higher values indicate greater perceived heat stress.",
  },
  heat_risk_score: {
    title: "⚠️ Heat Risk",
    desc: "Combines relevant heat and environmental indicators to identify areas with greater overall heat exposure. Higher scores indicate greater heat risk.",
  },
  tree_cover_pct: {
    title: "🌳 Tree Cover",
    desc: "Shows the proportion of an area covered by tree canopy. Greater tree cover can provide shade and help reduce local heat.",
  },
  relative_humidity_pct: {
    title: "💧 Humidity",
    desc: "Shows the amount of moisture in the air. Higher humidity can make hot conditions feel more intense, though this layer may represent broader city-level conditions rather than individual wards.",
  },
};

export default function CityEvidenceMap() {
  const [geoData, setGeoData] = useState<WardGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLayerId, setActiveLayerId] = useState<LayerId>('avg_temperature_c');
  const [riskFilter, setRiskFilter] = useState<RiskClass>('ALL');
  const [showHotspots, setShowHotspots] = useState(false);
  const [hoveredWard, setHoveredWard] = useState<WardRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedWard, setSelectedWard] = useState<WardRecord | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Layer category hover explanation state
  const [hoveredLayerId, setHoveredLayerId] = useState<LayerId | null>(null);
  const [layerTooltipPos, setLayerTooltipPos] = useState<{ x: number; y: number; isNearTop: boolean } | null>(null);

  // Pan and Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load GeoJSON on mount
  useEffect(() => {
    let mounted = true;
    loadWardGeoJSON().then((data) => {
      if (mounted) {
        setGeoData(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const activeLayer = LAYERS_REGISTRY[activeLayerId];

  // Precompute projected SVG paths for all features
  const projectedWards = useMemo<ProjectedWard[]>(() => {
    if (!geoData) return [];
    return geoData.features.map((feature) => {
      const record = feature.properties as WardRecord;
      const path = coordinatesToSvgPath(feature.geometry);
      let centroidProj: [number, number] = [SVG_WIDTH / 2, SVG_HEIGHT / 2];
      if (record.centroid && Array.isArray(record.centroid) && record.centroid.length === 2) {
        centroidProj = projectCoord(record.centroid[0], record.centroid[1]);
      }
      return { record, path, centroidProj };
    });
  }, [geoData]);

  // Yamuna River path
  const yamunaPath = useMemo(() => getYamunaSvgPath(), []);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.35, 4.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.35, 0.85));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button if not clicking directly on controls
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({
        x: panStart.current.x + dx,
        y: panStart.current.y + dy,
      });
    }

    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation (Escape closes panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWard(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action feedback timeout
  const triggerAction = (label: string) => {
    setActionFeedback(label);
    setTimeout(() => setActionFeedback(null), 3200);
  };

  // Helper icon for layer selector
  const getLayerIcon = (id: LayerId) => {
    switch (id) {
      case 'avg_temperature_c':
        return <Thermometer className="layer-pill-icon" />;
      case 'pop_density':
        return <Users className="layer-pill-icon" />;
      case 'green_cover_pct':
        return <Trees className="layer-pill-icon" />;
      case 'built_up_pct':
        return <Building className="layer-pill-icon" />;
      case 'AQI':
        return <Wind className="layer-pill-icon" />;
      case 'heat_index_c':
        return <Flame className="layer-pill-icon" />;
      case 'heat_risk_score':
        return <AlertTriangle className="layer-pill-icon" />;
      case 'tree_cover_pct':
        return <Trees className="layer-pill-icon" />;
      case 'relative_humidity_pct':
        return <Wind className="layer-pill-icon" />;
    }
  };

  const handleLayerPillMouseEnter = (id: LayerId, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isNearTop = rect.top < 130;
    setLayerTooltipPos({
      x: rect.left + rect.width / 2,
      y: isNearTop ? rect.bottom + 12 : rect.top - 12,
      isNearTop,
    });
    setHoveredLayerId(id);
  };

  const handleLayerPillMouseLeave = () => {
    setHoveredLayerId(null);
  };

  return (
    <section className="city-map-section" id="city-map">
      {/* Editorial Section Label */}
      <div className="section-label">02 / THE CITY MAP</div>

      {/* Section Headline & Intro */}
      <div className="city-map-header">
        <div>
          <ScrollHeading textAlign="left">
            <h2>
              See where the heat<br />
              <em>concentrates.</em>
            </h2>
          </ScrollHeading>
        </div>
        <div className="city-map-intro-text">
          <p>
            Heat doesn&apos;t stop at the city average. Explore Delhi ward by ward to observe how land surface
            temperature, vegetation canopy, population density, built-up intensity, and priority risk shift across
            neighborhood boundaries.
          </p>
          <div className="map-intro-status">
            <span className="live-status-dot" />
            <span>250 MUNICIPAL WARDS LOADED · MCD DELIMITATION 2022</span>
          </div>
        </div>
      </div>

      {/* Primary Layer Selector Strip */}
      <div className="layer-selector-container">
        <div className="layer-selector-label">
          <Layers className="w-3.5 h-3.5" />
          <span>DATA LAYER:</span>
        </div>
        <div className="layer-selector-scroll">
          {LAYER_IDS.map((id) => {
            const cfg = LAYERS_REGISTRY[id];
            const isActive = activeLayerId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveLayerId(id)}
                onMouseEnter={(e) => handleLayerPillMouseEnter(id, e)}
                onMouseLeave={handleLayerPillMouseLeave}
                className={`layer-pill ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
              >
                {getLayerIcon(id)}
                <span>{cfg.shortLabel}</span>
                {isActive && <span className="layer-pill-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Layer Explanation Tooltip (Only on Hover) */}
      <AnimatePresence>
        {hoveredLayerId && layerTooltipPos && (
          <motion.div
            className={`layer-info-tooltip ${layerTooltipPos.isNearTop ? 'top-pointing' : 'bottom-pointing'}`}
            initial={{ opacity: 0, y: layerTooltipPos.isNearTop ? -6 : 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: layerTooltipPos.isNearTop ? -6 : 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: `${Math.max(155, Math.min(typeof window !== 'undefined' ? window.innerWidth - 155 : 1000, layerTooltipPos.x))}px`,
              top: `${layerTooltipPos.y}px`,
              transform: layerTooltipPos.isNearTop ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            <div className="layer-info-title">
              {LAYER_EXPLANATIONS[hoveredLayerId].title}
            </div>
            <p className="layer-info-desc">
              {LAYER_EXPLANATIONS[hoveredLayerId].desc}
            </p>
            <span
              className="layer-info-arrow"
              style={{
                left: `${Math.max(20, Math.min(270, layerTooltipPos.x - Math.max(155, Math.min(typeof window !== 'undefined' ? window.innerWidth - 155 : 1000, layerTooltipPos.x)) + 145))}px`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Overlay Controls Bar */}
      <div className="map-toolbar">
        <div className="toolbar-group">
          <span className="toolbar-label">RISK FILTER:</span>
          {(['ALL', 'HOTSPOT', 'HIGH', 'MODERATE', 'LOW'] as RiskClass[]).map((rClass) => (
            <button
              key={rClass}
              type="button"
              onClick={() => setRiskFilter(rClass)}
              className={`filter-btn ${riskFilter === rClass ? 'active' : ''}`}
            >
              {rClass}
            </button>
          ))}
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setShowHotspots((prev) => !prev)}
            className={`hotspot-toggle-btn ${showHotspots ? 'active' : ''}`}
          >
            <span className={`hotspot-badge ${showHotspots ? 'on' : ''}`} />
            <span>HOTSPOTS OVERLAY</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Frame */}
      <div
        className="map-viewport-frame"
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredWard(null);
        }}
      >
        {/* City Identity Callout on Left Side */}
        <div className="map-city-watermark">
          <div className="city-tag">
            <MapPin className="w-3 h-3 text-[var(--hot)]" />
            <span>NCT REGION</span>
          </div>
          <h3 className="city-title">DELHI</h3>
          <span className="city-subtitle">250 MUNICIPAL WARDS · 28.61° N, 77.21° E</span>
        </div>

        {loading ? (
          <div className="map-loading-state">
            <div className="spinner-orbit" />
            <p>Loading Delhi geospatial layers and 250 ward boundaries...</p>
          </div>
        ) : (
          <>
            <svg
              className="map-svg-canvas"
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Subtle radial background vignette */}
                <radialGradient id="delhiVignette" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#141815" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#0b0c0b" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#080908" stopOpacity="1" />
                </radialGradient>

                {/* Hotspot indicator glow filter */}
                <filter id="hotspotGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background fill */}
              <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#delhiVignette)" />

              {/* Transformable Group for Pan & Zoom */}
              <g
                transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                style={{ transformOrigin: '400px 420px', transition: isDragging ? 'none' : 'transform 0.15s ease-out' }}
              >
                {/* Background coordinate grid lines */}
                <g className="map-grid-lines" opacity="0.15">
                  <line x1="120" y1="40" x2="120" y2="800" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="260" y1="40" x2="260" y2="800" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="400" y1="40" x2="400" y2="800" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="540" y1="40" x2="540" y2="800" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="680" y1="40" x2="680" y2="800" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="40" y1="160" x2="760" y2="160" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="40" y1="320" x2="760" y2="320" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="40" y1="480" x2="760" y2="480" stroke="#fff" strokeDasharray="3 6" />
                  <line x1="40" y1="640" x2="760" y2="640" stroke="#fff" strokeDasharray="3 6" />
                </g>

                {/* Yamuna River Trace (Key geographic landmark of Delhi) */}
                <g className="yamuna-layer">
                  <path
                    d={yamunaPath}
                    fill="none"
                    stroke="#497c8c"
                    strokeWidth={4 / zoom}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                  />
                  <path
                    d={yamunaPath}
                    fill="none"
                    stroke="#76b8cb"
                    strokeWidth={1.8 / zoom}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                  />
                </g>

                {/* 250 Ward Polygons */}
                <g className="wards-layer">
                  {projectedWards.map(({ record, path }) => {
                    const val = record[activeLayer.field] as number;
                    const fillColor = activeLayer.getColor(val);
                    const isMatchesFilter = matchesRiskClass(record.heat_risk_score, riskFilter);
                    const isHovered = hoveredWard?.ward_id === record.ward_id;
                    const isSelected = selectedWard?.ward_id === record.ward_id;

                    let strokeColor = 'rgba(255, 255, 255, 0.12)';
                    let strokeWidth = 0.6 / zoom;
                    let opacity = isMatchesFilter ? 0.92 : 0.15;

                    if (isHovered) {
                      strokeColor = '#ffffff';
                      strokeWidth = 1.6 / zoom;
                      opacity = 1;
                    }
                    if (isSelected) {
                      strokeColor = 'var(--hot)';
                      strokeWidth = 2.2 / zoom;
                      opacity = 1;
                    }

                    return (
                      <path
                        key={record.ward_id}
                        d={path}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        opacity={opacity}
                        className="ward-polygon"
                        style={{
                          cursor: 'pointer',
                          transition: isDragging
                            ? 'none'
                            : 'fill 0.3s ease, opacity 0.25s ease, stroke 0.2s ease',
                        }}
                        onMouseEnter={() => setHoveredWard(record)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWard(record);
                        }}
                      />
                    );
                  })}
                </g>

                {/* Hotspot Markers Overlay (if toggled) */}
                {showHotspots && (
                  <g className="hotspots-overlay" filter="url(#hotspotGlow)">
                    {projectedWards
                      .filter(({ record }) => record.heat_risk_score >= 80)
                      .map(({ record, centroidProj }) => {
                        const [cx, cy] = centroidProj;
                        return (
                          <g key={`hotspot-${record.ward_id}`} transform={`translate(${cx}, ${cy})`}>
                            <circle
                              r={6 / zoom}
                              fill="none"
                              stroke="var(--hot)"
                              strokeWidth={1.5 / zoom}
                              opacity="0.85"
                            >
                              <animate
                                attributeName="r"
                                values={`${4 / zoom};${10 / zoom};${4 / zoom}`}
                                dur="2.4s"
                                repeatCount="indefinite"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.9;0.2;0.9"
                                dur="2.4s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle r={2.5 / zoom} fill="var(--hot)" />
                          </g>
                        );
                      })}
                  </g>
                )}

                {/* Selected Ward Indicator Ping */}
                {selectedWard && (
                  <g className="selected-ward-pin">
                    {(() => {
                      const sel = projectedWards.find((p) => p.record.ward_id === selectedWard.ward_id);
                      if (!sel) return null;
                      const [cx, cy] = sel.centroidProj;
                      return (
                        <g transform={`translate(${cx}, ${cy})`}>
                          <circle r={8 / zoom} fill="none" stroke="var(--hot)" strokeWidth={2 / zoom} opacity="0.9" />
                          <circle r={3 / zoom} fill="#fff" />
                        </g>
                      );
                    })()}
                  </g>
                )}
              </g>

              {/* Geographic Orientation Badge in corner */}
              <g className="compass-rose" transform="translate(740, 60)" opacity="0.6">
                <circle r="14" fill="#131513" stroke="var(--line)" />
                <path d="M 0,-10 L 3,-2 L -3,-2 Z" fill="var(--hot)" />
                <path d="M 0,10 L 3,2 L -3,2 Z" fill="#69665f" />
                <text x="0" y="-14" fill="#a19d94" fontSize="8" fontFamily="DM Mono" textAnchor="middle">
                  N
                </text>
              </g>
            </svg>

            {/* Map Zoom / Reset UI Controls */}
            <div className="map-view-controls">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                aria-label="Zoom In"
                className="map-control-btn"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                aria-label="Zoom Out"
                className="map-control-btn"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset View"
                aria-label="Reset View"
                className="map-control-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Hover Tooltip (Subtle & Compact) */}
            <AnimatePresence>
              {hoveredWard && tooltipPos && (
                <motion.div
                  className="ward-hover-tooltip"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    left: `${Math.min(tooltipPos.x + 16, (mapContainerRef.current?.clientWidth || 800) - 220)}px`,
                    top: `${Math.max(tooltipPos.y - 45, 15)}px`,
                  }}
                >
                  <div className="tooltip-head">
                    <span className="tooltip-title">{hoveredWard.ward_name}</span>
                    <span className="tooltip-id">W-{String(hoveredWard.ward_id).padStart(3, '0')}</span>
                  </div>
                  <div className="tooltip-metric">
                    <span className="tooltip-label">{activeLayer.label}</span>
                    <strong className="tooltip-val">
                      {activeLayer.formatValue(hoveredWard[activeLayer.field] as number)}
                    </strong>
                  </div>
                  <div className="tooltip-risk-tag">
                    <span
                      className={`risk-indicator-dot ${getRiskClass(hoveredWard.heat_risk_score).toLowerCase()}`}
                    />
                    <span>Risk: {hoveredWard.heat_risk_score.toFixed(1)}</span>
                    <small>({getRiskClass(hoveredWard.heat_risk_score)})</small>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dynamic Legend Card */}
            <div className="map-legend-card">
              <div className="legend-head">
                <span className="legend-layer-name">{activeLayer.label.toUpperCase()}</span>
                <span className="legend-unit">{activeLayer.unit}</span>
              </div>

              {/* Gradient Scale Bar */}
              <div
                className="legend-gradient-bar"
                style={{
                  background: `linear-gradient(90deg, ${activeLayer.gradientStops
                    .map((s) => `${s.color} ${Math.round(s.stop * 100)}%`)
                    .join(', ')})`,
                }}
              />

              <div className="legend-ticks">
                {activeLayer.gradientStops.map((stop, i) => (
                  <span key={i} className="legend-tick">
                    {stop.label || ''}
                  </span>
                ))}
              </div>

              {/* Special Context Note for Humidity */}
              {activeLayer.isCityContext ? (
                <div className="legend-caveat-box">
                  <span className="caveat-tag">CITY-SCALE CONTEXT</span>
                  <p>{activeLayer.contextNote}</p>
                </div>
              ) : (
                <div className="legend-meta">
                  <span className="legend-source">{activeLayer.sourceLabel}</span>
                  <span className="legend-disclosure">{activeLayer.dataStatus}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Ward Evidence Detail Drawer (Right slide-over) */}
      <AnimatePresence>
        {selectedWard && (
          <motion.div
            className="ward-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWard(null)}
          >
            <motion.aside
              className="ward-evidence-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Close Button */}
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setSelectedWard(null)}
                aria-label="Close ward evidence panel"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Ward Identity Header */}
              <div className="drawer-header">
                <div className="drawer-eyebrow">
                  <span>MUNICIPAL CORPORATION OF DELHI</span>
                  <b>WARD {String(selectedWard.ward_id).padStart(3, '0')}</b>
                </div>
                <h3>{selectedWard.ward_name}</h3>
                <div className="drawer-badges">
                  <div
                    className={`risk-badge ${getRiskClass(selectedWard.heat_risk_score).toLowerCase()}`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>HEAT RISK: {selectedWard.heat_risk_score.toFixed(1)} / 100</span>
                  </div>
                  <div className="risk-class-pill">
                    CLASS: {getRiskClass(selectedWard.heat_risk_score)}
                  </div>
                </div>
              </div>

              {/* Currently Selected Layer Focus Card */}
              <div className="drawer-active-layer-card">
                <div className="focus-layer-head">
                  <span>CURRENT ACTIVE LAYER</span>
                  <span className="focus-unit">{activeLayer.unit}</span>
                </div>
                <div className="focus-layer-body">
                  <div className="focus-val">
                    {activeLayer.formatValue(selectedWard[activeLayer.field] as number)}
                  </div>
                  <div className="focus-name">{activeLayer.label}</div>
                </div>
                <p className="focus-desc">{activeLayer.description}</p>
              </div>

              {/* Comprehensive Supporting Indicators Grid */}
              <div className="drawer-section-title">
                <span>SUPPORTING INDICATORS</span>
                <small>Evidence profile</small>
              </div>

              <div className="drawer-metrics-grid">
                <div
                  className={`metric-tile ${activeLayerId === 'avg_temperature_c' ? 'highlighted' : ''}`}
                >
                  <Thermometer className="metric-icon" />
                  <div>
                    <span className="metric-label">TEMPERATURE</span>
                    <strong className="metric-value">{selectedWard.avg_temperature_c.toFixed(1)}°C</strong>
                  </div>
                </div>

                <div
                  className={`metric-tile ${activeLayerId === 'heat_index_c' ? 'highlighted' : ''}`}
                >
                  <Flame className="metric-icon" />
                  <div>
                    <span className="metric-label">HEAT INDEX</span>
                    <strong className="metric-value">{selectedWard.heat_index_c.toFixed(1)}°C</strong>
                  </div>
                </div>

                <div className="metric-tile">
                  <Users className="metric-icon" />
                  <div>
                    <span className="metric-label">POPULATION</span>
                    <strong className="metric-value">
                      {selectedWard.population.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div
                  className={`metric-tile ${activeLayerId === 'pop_density' ? 'highlighted' : ''}`}
                >
                  <Users className="metric-icon" />
                  <div>
                    <span className="metric-label">POPULATION DENSITY</span>
                    <strong className="metric-value">
                      {Math.round(selectedWard.pop_density).toLocaleString()} / km²
                    </strong>
                  </div>
                </div>

                <div
                  className={`metric-tile ${activeLayerId === 'green_cover_pct' ? 'highlighted' : ''}`}
                >
                  <Trees className="metric-icon" />
                  <div>
                    <span className="metric-label">GREEN COVER</span>
                    <strong className="metric-value">{selectedWard.green_cover_pct.toFixed(1)}%</strong>
                  </div>
                </div>

                <div
                  className={`metric-tile ${activeLayerId === 'tree_cover_pct' ? 'highlighted' : ''}`}
                >
                  <Trees className="metric-icon" />
                  <div>
                    <span className="metric-label">TREE CANOPY</span>
                    <strong className="metric-value">{selectedWard.tree_cover_pct.toFixed(1)}%</strong>
                  </div>
                </div>

                <div
                  className={`metric-tile ${activeLayerId === 'built_up_pct' ? 'highlighted' : ''}`}
                >
                  <Building className="metric-icon" />
                  <div>
                    <span className="metric-label">BUILT-UP DENSITY</span>
                    <strong className="metric-value">{selectedWard.built_up_pct.toFixed(1)}%</strong>
                  </div>
                </div>

                <div className={`metric-tile ${activeLayerId === 'AQI' ? 'highlighted' : ''}`}>
                  <Wind className="metric-icon" />
                  <div>
                    <span className="metric-label">AIR QUALITY INDEX</span>
                    <strong className="metric-value">{Math.round(selectedWard.AQI)}</strong>
                  </div>
                </div>

                <div
                  className={`metric-tile ${activeLayerId === 'relative_humidity_pct' ? 'highlighted' : ''}`}
                >
                  <Wind className="metric-icon" />
                  <div>
                    <span className="metric-label">HUMIDITY (REGIONAL)</span>
                    <strong className="metric-value">{selectedWard.relative_humidity_pct.toFixed(1)}%</strong>
                  </div>
                </div>
              </div>

              {/* Factual, Restrained Evidence Commentary */}
              <div className="drawer-commentary-box">
                <div className="commentary-head">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--hot)]" />
                  <span>OBSERVED EVIDENCE PROFILE</span>
                </div>
                <p>
                  {selectedWard.green_cover_pct < 15
                    ? `Lower greenery (${selectedWard.green_cover_pct.toFixed(1)}%) is observed alongside higher heat exposure (${selectedWard.avg_temperature_c.toFixed(1)}°C) in this evidence profile. `
                    : `Moderate vegetative buffer (${selectedWard.green_cover_pct.toFixed(1)}%) correlates with measured surface conditions. `}
                  {selectedWard.built_up_pct > 75
                    ? `High built-up surface concentration (${selectedWard.built_up_pct.toFixed(1)}%) limits radiative nighttime cooling.`
                    : `Impervious land share stands at ${selectedWard.built_up_pct.toFixed(1)}%.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="drawer-actions">
                <button
                  type="button"
                  className="hot-button w-full justify-center"
                  onClick={() =>
                    triggerAction(
                      `Full evidence profile generated for ${selectedWard.ward_name} (Ward ${selectedWard.ward_id})`
                    )
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>View evidence</span>
                </button>

                <button
                  type="button"
                  className="nav-action w-full justify-center"
                  onClick={() =>
                    triggerAction(
                      `Synthesized PDF dossier ready for download: Ward_${selectedWard.ward_id}_Report.pdf`
                    )
                  }
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  <span>Download ward report</span>
                </button>
              </div>

              {/* Toast Feedback Notification */}
              <AnimatePresence>
                {actionFeedback && (
                  <motion.div
                    className="drawer-toast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--green)] flex-shrink-0" />
                    <span>{actionFeedback}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Data Source Footnote */}
              <div className="drawer-footer-note">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  DATA SOURCE: HARMONIZED FROM MULTI-SOURCE GEOSPATIAL, REMOTE SENSING & 2022 MCD DELIMITATION DATASETS.
                </span>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
