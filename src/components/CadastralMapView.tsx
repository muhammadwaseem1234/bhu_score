'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ParcelBoundary, LandUseZoning, GeoCoordinate } from '../types';
import {
  Compass,
  MapPin,
  Layers,
  ShieldAlert,
  Download,
  Crosshair,
  Maximize2,
  Minimize2,
  Radio,
  Ruler,
  Info,
  RefreshCw,
  Copy,
  Check,
  Globe,
  SlidersHorizontal,
  Eye,
  Building2,
  Trees,
  Navigation,
  FileCheck,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

interface CadastralMapViewProps {
  ulpin: string;
  surveyNo: string;
  village: string;
  district: string;
  state: string;
  zoning: LandUseZoning;
  boundary: ParcelBoundary;
}

// Synthetic Cadastral Parcel Interface for interactive inspection
interface SyntheticParcel {
  id: string;
  surveyNo: string;
  owner: string;
  areaAcres: number;
  areaSqFt: number;
  zoning: string;
  status: 'CLEAR' | 'ENCUMBERED' | 'ROAD_RESERVE' | 'BUFFER_PROTECTED';
  mutationNo: string;
  lastRegistryYear: string;
  description: string;
  position: 'center' | 'north' | 'south' | 'east' | 'west' | 'north-west' | 'south-east';
}

export const CadastralMapView: React.FC<CadastralMapViewProps> = ({
  ulpin,
  surveyNo,
  village,
  district,
  state,
  zoning,
  boundary,
}) => {
  // Map View Mode: Synthetic Satellite Ortho, BhuNaksha Revenue Cadastre, or Engineering Blueprint
  const [mapTheme, setMapTheme] = useState<'satellite' | 'cadastre' | 'blueprint'>('satellite');

  // Layer toggles
  const [showBufferZones, setShowBufferZones] = useState<boolean>(true);
  const [showAdjacentPlots, setShowAdjacentPlots] = useState<boolean>(true);
  const [showVertices, setShowVertices] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showRoadNetwork, setShowRoadNetwork] = useState<boolean>(true);
  const [isSurveyorActive, setIsSurveyorActive] = useState<boolean>(true);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  // Zoom & Pan transformation state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // UI Modals & Drawers
  const [selectedParcel, setSelectedParcel] = useState<SyntheticParcel | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBhuAadhaarModalOpen, setIsBhuAadhaarModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Live HUD states
  const [cursorCoords, setCursorCoords] = useState<GeoCoordinate>({
    lat: boundary.centroid.lat,
    lng: boundary.centroid.lng,
  });

  // Surveyor Rover Simulation
  const [roverPosition, setRoverPosition] = useState<{ x: number; y: number }>({ x: 260, y: 150 });
  const [roverProgress, setRoverProgress] = useState<number>(0);
  const [currentTraverseEdge, setCurrentTraverseEdge] = useState<string>('Edge A-B (North)');
  const [surveyorTelemetry, setSurveyorTelemetry] = useState({
    satellites: 21,
    accuracyMeters: 0.02,
    speedKmh: 3.2,
    bearing: '091° E',
    fixType: 'RTK FIXED (Centimeter Grade)',
  });

  // Synthetic Surrounding Parcels Data for Interactive Demo
  const syntheticParcels: SyntheticParcel[] = [
    {
      id: 'subject',
      surveyNo: surveyNo,
      owner: 'Ramesh Muniyappa & Co-owners',
      areaAcres: boundary.totalAreaAcres,
      areaSqFt: boundary.totalAreaSqFt,
      zoning: `${zoning} (Commercial C1/C2 Approved)`,
      status: 'CLEAR',
      mutationNo: 'MR No. T48/2021-22',
      lastRegistryYear: '2021',
      description: 'Primary Subject Land Parcel. Sanctioned conversion order with clear marketable title and clean CERSAI report.',
      position: 'center',
    },
    {
      id: 'north-plot',
      surveyNo: 'Sy 141',
      owner: 'K. Rajasekhar Reddy',
      areaAcres: 3.2,
      areaSqFt: 139392,
      zoning: 'Semi-Urban / Agricultural Greenbelt',
      status: 'CLEAR',
      mutationNo: 'MR No. 22/2018-19',
      lastRegistryYear: '2018',
      description: 'Adjoining North Boundary. Cultivated coconut plantation with clear revenue boundary stone demarcation.',
      position: 'north',
    },
    {
      id: 'south-road',
      surveyNo: 'Sy 143 (Road Reserve)',
      owner: 'PWD / BBMP Infrastructure Corridor',
      areaAcres: 2.75,
      areaSqFt: 119790,
      zoning: 'Public Transport & Road Right-of-Way (40ft MDR)',
      status: 'ROAD_RESERVE',
      mutationNo: 'Gazette Acquisition #KA-2015-89',
      lastRegistryYear: '2015',
      description: 'Direct road access to subject parcel. 40-foot wide asphalt highway connecting to Varthur Main Road.',
      position: 'south',
    },
    {
      id: 'east-plot',
      surveyNo: 'Sy 142/1',
      owner: 'S. Muniyappa & Sons Heritage Trust',
      areaAcres: 1.85,
      areaSqFt: 80586,
      zoning: 'Residential Medium Density (R2)',
      status: 'CLEAR',
      mutationNo: 'MR No. 14/2017-18',
      lastRegistryYear: '2017',
      description: 'Original ancestral hissa subdivision. G+3 villa layout approval in place with registered partition deed.',
      position: 'east',
    },
    {
      id: 'west-stream',
      surveyNo: 'Sy 145 (Govt Poramboke & Canal)',
      owner: 'State Minor Irrigation & Revenue Dept',
      areaAcres: 4.1,
      areaSqFt: 178596,
      zoning: 'Natural Drainage & 30m NGT Buffer Zone',
      status: 'BUFFER_PROTECTED',
      mutationNo: 'Govt Kharab Ledger Bk-IV',
      lastRegistryYear: '1972',
      description: 'Natural seasonal Rajakaluve waterway. Strict 30-meter green buffer enforced per National Green Tribunal guidelines.',
      position: 'west',
    },
    {
      id: 'nw-plot',
      surveyNo: 'Sy 140',
      owner: 'Varthur Organic Agro Collective',
      areaAcres: 2.1,
      areaSqFt: 91476,
      zoning: 'Agricultural Horticultural',
      status: 'CLEAR',
      mutationNo: 'MR No. 08/2020-21',
      lastRegistryYear: '2020',
      description: 'North-West corner agricultural land with solar-powered micro-irrigation system.',
      position: 'north-west',
    },
    {
      id: 'se-plot',
      surveyNo: 'Sy 144',
      owner: 'Nexus Commercial Developments Pvt Ltd',
      areaAcres: 3.4,
      areaSqFt: 148104,
      zoning: 'IT Park / Commercial High Density',
      status: 'CLEAR',
      mutationNo: 'MR No. 51/2022-23',
      lastRegistryYear: '2022',
      description: 'Adjacent tech campus plot with ongoing Grade-A office building development.',
      position: 'south-east',
    },
  ];

  // Animated Surveyor Rover Loop along the 4 corners: A(260,150) -> B(540,150) -> C(540,350) -> D(260,350) -> A
  useEffect(() => {
    if (!isSurveyorActive) return;

    const corners = [
      { x: 260, y: 150, edge: 'Edge A-B (North Boundary)', bearing: '091° E' },
      { x: 540, y: 150, edge: 'Edge B-C (East Boundary)', bearing: '181° S' },
      { x: 540, y: 350, edge: 'Edge C-D (South Boundary)', bearing: '271° W' },
      { x: 260, y: 350, edge: 'Edge D-A (West Boundary)', bearing: '001° N' },
    ];

    let t = 0;
    const interval = setInterval(() => {
      t = (t + 1) % 400;
      const progressPercent = Math.round((t / 400) * 100);
      setRoverProgress(progressPercent);

      const segment = Math.floor(t / 100);
      const segT = (t % 100) / 100;

      const p1 = corners[segment];
      const p2 = corners[(segment + 1) % 4];

      const currentX = p1.x + (p2.x - p1.x) * segT;
      const currentY = p1.y + (p2.y - p1.y) * segT;

      setRoverPosition({ x: currentX, y: currentY });
      setCurrentTraverseEdge(p1.edge);
      setSurveyorTelemetry((prev) => ({
        ...prev,
        bearing: p1.bearing,
        speedKmh: +(3.0 + Math.sin(t / 10) * 0.4).toFixed(1),
      }));
    }, 80);

    return () => clearInterval(interval);
  }, [isSurveyorActive]);

  // Handle Canvas Mouse Move for Geodetic Coordinates calculation
  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    // Approximate WGS-84 interpolation around centroid
    const minLat = boundary.centroid.lat - 0.0018;
    const maxLat = boundary.centroid.lat + 0.0018;
    const minLng = boundary.centroid.lng - 0.0022;
    const maxLng = boundary.centroid.lng + 0.0022;

    const lat = maxLat - relY * (maxLat - minLat);
    const lng = minLng + relX * (maxLng - minLng);

    setCursorCoords({ lat, lng });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));

  // Copy Bhu-Aadhaar
  const copyUlpin = () => {
    navigator.clipboard.writeText(ulpin);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Export GeoJSON
  const handleExportGeoJson = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            ulpin,
            surveyNo,
            village,
            district,
            state,
            areaAcres: boundary.totalAreaAcres,
            areaSqFt: boundary.totalAreaSqFt,
            zoning,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                ...boundary.coordinates.map((c) => [c.lng, c.lat]),
                [boundary.coordinates[0].lng, boundary.coordinates[0].lat],
              ],
            ],
          },
        },
      ],
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Cadastre_${surveyNo.replace(/\//g, '-')}_${ulpin}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      id="cadastral-map-root"
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Synthetic Cadastral GIS Engine (Demo Mode)</span>
            </span>

            <button
              onClick={() => setIsBhuAadhaarModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-mono text-xs transition-colors cursor-pointer"
            >
              <Compass className="w-3 h-3 text-emerald-700" />
              <span>ULPIN: {ulpin}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>

            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>DGPS Survey Verified</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Survey No. {surveyNo}</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-slate-700 text-base font-semibold">{village}, {talukTehsilDisplay(village)}, {district}</span>
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Theme Selector Pills */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMapTheme('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mapTheme === 'satellite'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🛰️ Satellite Ortho</span>
            </button>
            <button
              onClick={() => setMapTheme('cadastre')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mapTheme === 'cadastre'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🗺️ BhuNaksha</span>
            </button>
            <button
              onClick={() => setMapTheme('blueprint')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mapTheme === 'blueprint'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📐 CAD Blueprint</span>
            </button>
          </div>

          {/* Export & Maximize */}
          <button
            onClick={handleExportGeoJson}
            title="Download Cadastral GeoJSON"
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Layer Controls Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 overflow-x-auto text-xs">
        <div className="flex items-center gap-2 flex-nowrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
            <span>Overlays:</span>
          </span>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={showAdjacentPlots}
              onChange={(e) => setShowAdjacentPlots(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">Adjacent Plots</span>
          </label>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={showBufferZones}
              onChange={(e) => setShowBufferZones(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-amber-800 font-medium">30m NGT Buffer</span>
          </label>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={showRoadNetwork}
              onChange={(e) => setShowRoadNetwork(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">Access Roads</span>
          </label>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={showDimensions}
              onChange={(e) => setShowDimensions(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">Dimensions</span>
          </label>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={showVertices}
              onChange={(e) => setShowVertices(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">Corner Stones</span>
          </label>

          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 select-none">
            <input
              type="checkbox"
              checked={isSurveyorActive}
              onChange={(e) => setIsSurveyorActive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-cyan-700 font-medium flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-600 animate-pulse" />
              <span>RTK Surveyor</span>
            </span>
          </label>
        </div>

        {/* Canvas Navigation Quick Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomIn}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer shadow-2xs"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={zoomOut}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer shadow-2xs"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={resetView}
            className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold cursor-pointer shadow-2xs flex items-center gap-1"
            title="Reset View"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div
        className={`relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${
          isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[500px]'
        } ${
          mapTheme === 'satellite'
            ? 'bg-[#1b2b1d]'
            : mapTheme === 'cadastre'
            ? 'bg-[#fcfaf2]'
            : 'bg-[#0b1120]'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Transform Container with Pan & Zoom */}
        <div
          className="w-full h-full transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* THE SVG MAP RENDERER */}
          <svg
            className="w-full h-full"
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleCanvasMouseMove}
          >
            <defs>
              {/* Pattern: Satellite Farmland Texture */}
              <pattern id="farmland-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="#2d402b" />
                <path d="M0 20 H80 M0 40 H80 M0 60 H80" stroke="#374d35" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="20" cy="15" r="3" fill="#3f583d" />
                <circle cx="60" cy="55" r="4" fill="#3a5238" />
                <circle cx="40" cy="70" r="2.5" fill="#446141" />
              </pattern>

              {/* Pattern: BhuNaksha Parchment Grid */}
              <pattern id="cadastre-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#faf6ea" />
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e8dfcb" strokeWidth="0.75" />
              </pattern>

              {/* Pattern: Blueprint Laser Grid */}
              <pattern id="blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill="#0b1120" />
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>

              {/* Diagonal Hatch for 30m NGT Buffer */}
              <pattern id="buffer-hatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="12" stroke="#d97706" strokeWidth="2.5" strokeOpacity="0.45" />
              </pattern>

              {/* Glow Filter for Primary Subject Parcel */}
              <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* BACKGROUND BASEMAP LAYER BASED ON THEME */}
            {mapTheme === 'satellite' && (
              <g id="satellite-basemap">
                {/* General regional earth background */}
                <rect width="800" height="500" fill="#1b2a1a" />
                <rect width="800" height="500" fill="url(#farmland-pattern)" opacity="0.8" />

                {/* Simulated Surrounding Agricultural Plots */}
                <rect x="30" y="30" width="180" height="140" fill="#253823" stroke="#354e32" strokeWidth="1" />
                <rect x="230" y="20" width="340" height="100" fill="#2c422a" stroke="#3f5c3c" strokeWidth="1" />
                <rect x="590" y="30" width="180" height="160" fill="#21331f" stroke="#334d31" strokeWidth="1" />

                {/* West Rajakaluve Stream & Tree Line */}
                <path
                  d="M 120 0 Q 140 160, 110 320 T 130 500"
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth="14"
                  opacity="0.8"
                />
                <path
                  d="M 120 0 Q 140 160, 110 320 T 130 500"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  opacity="0.7"
                />

                {/* Tree clumps along stream */}
                <circle cx="105" cy="80" r="10" fill="#1e391b" opacity="0.9" />
                <circle cx="135" cy="140" r="12" fill="#2d4f29" opacity="0.9" />
                <circle cx="100" cy="220" r="14" fill="#1e391b" opacity="0.9" />
                <circle cx="140" cy="300" r="11" fill="#284624" opacity="0.9" />
                <circle cx="115" cy="390" r="13" fill="#1e391b" opacity="0.9" />
              </g>
            )}

            {mapTheme === 'cadastre' && (
              <g id="bhunaksha-basemap">
                <rect width="800" height="500" fill="url(#cadastre-grid)" />
                {/* Authentic Village boundary lines */}
                <path
                  d="M 0 60 Q 200 40, 400 70 T 800 50"
                  fill="none"
                  stroke="#c5bbaa"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 0 440 Q 300 460, 500 430 T 800 450"
                  fill="none"
                  stroke="#c5bbaa"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* Natural Stream in Cadastre */}
                <path
                  d="M 120 0 Q 140 160, 110 320 T 130 500"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="10"
                  opacity="0.6"
                />
                <text x="135" y="240" fill="#1e40af" fontSize="9" fontWeight="bold" transform="rotate(75 135 240)">
                  RAJAKALUVE (GOVT DRAINAGE)
                </text>
              </g>
            )}

            {mapTheme === 'blueprint' && (
              <g id="blueprint-basemap">
                <rect width="800" height="500" fill="url(#blueprint-grid)" />
                {/* Laser Coordinate Grid Lines */}
                <line x1="260" y1="0" x2="260" y2="500" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="540" y1="0" x2="540" y2="500" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="150" x2="800" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="350" x2="800" y2="350" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                {/* Coordinates Markings */}
                <text x="265" y="20" fill="#64748b" fontSize="9" fontFamily="monospace">77.748500° E</text>
                <text x="545" y="20" fill="#64748b" fontSize="9" fontFamily="monospace">77.751340° E</text>
                <text x="10" y="145" fill="#64748b" fontSize="9" fontFamily="monospace">12.970800° N</text>
                <text x="10" y="345" fill="#64748b" fontSize="9" fontFamily="monospace">12.968900° N</text>
              </g>
            )}

            {/* ADJACENT REVENUE PARCELS (CLICKABLE FOR DEMO) */}
            {showAdjacentPlots && (
              <g id="adjacent-plots" className="transition-opacity duration-200">
                {/* NORTH PARCEL: Sy 141 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedParcel(syntheticParcels[1])}
                >
                  <polygon
                    points="260,30 540,30 540,140 260,140"
                    fill={mapTheme === 'satellite' ? 'rgba(37, 99, 235, 0.12)' : mapTheme === 'cadastre' ? '#f3ede0' : '#0f172a'}
                    stroke={mapTheme === 'satellite' ? '#60a5fa' : mapTheme === 'cadastre' ? '#78716c' : '#334155'}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="group-hover:fill-blue-500/25 transition-all"
                  />
                  <text
                    x="400"
                    y="75"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#94a3b8' : '#1e293b'}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Sy 141 (North Plot)
                  </text>
                  <text
                    x="400"
                    y="95"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#64748b' : '#64748b'}
                    fontSize="10"
                  >
                    3.20 Acres • K. Rajasekhar
                  </text>
                </g>

                {/* EAST PARCEL: Sy 142/1 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedParcel(syntheticParcels[3])}
                >
                  <polygon
                    points="550,150 740,150 740,350 550,350"
                    fill={mapTheme === 'satellite' ? 'rgba(147, 51, 234, 0.12)' : mapTheme === 'cadastre' ? '#f5eee3' : '#0f172a'}
                    stroke={mapTheme === 'satellite' ? '#c084fc' : mapTheme === 'cadastre' ? '#78716c' : '#334155'}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="group-hover:fill-purple-500/25 transition-all"
                  />
                  <text
                    x="645"
                    y="245"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#94a3b8' : '#1e293b'}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Sy 142/1 (East)
                  </text>
                  <text
                    x="645"
                    y="265"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#64748b' : '#64748b'}
                    fontSize="10"
                  >
                    1.85 Ac • Ancestral Hissa
                  </text>
                </g>

                {/* WEST PARCEL: Sy 145 (Govt Poramboke & Canal) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedParcel(syntheticParcels[4])}
                >
                  <polygon
                    points="60,150 250,150 250,350 60,350"
                    fill={mapTheme === 'satellite' ? 'rgba(14, 165, 233, 0.15)' : mapTheme === 'cadastre' ? '#edf4fa' : '#082f49'}
                    stroke={mapTheme === 'satellite' ? '#38bdf8' : mapTheme === 'cadastre' ? '#60a5fa' : '#0284c7'}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="group-hover:fill-cyan-500/25 transition-all"
                  />
                  <text
                    x="155"
                    y="245"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#38bdf8' : '#0369a1'}
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Sy 145 (West)
                  </text>
                  <text
                    x="155"
                    y="265"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#94a3b8' : '#475569'}
                    fontSize="10"
                  >
                    Govt Kharab / Drainage
                  </text>
                </g>

                {/* SOUTH PARCEL: Sy 143 (Road Reserve Corridor) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedParcel(syntheticParcels[2])}
                >
                  <polygon
                    points="260,360 540,360 540,430 260,430"
                    fill={mapTheme === 'satellite' ? 'rgba(71, 85, 105, 0.35)' : mapTheme === 'cadastre' ? '#e2e8f0' : '#1e293b'}
                    stroke={mapTheme === 'satellite' ? '#94a3b8' : '#64748b'}
                    strokeWidth="1.5"
                    className="group-hover:fill-slate-500/40 transition-all"
                  />
                  <text
                    x="400"
                    y="395"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#f1f5f9' : '#0f172a'}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    Sy 143 (South Road Reserve Corridor - 40ft MDR)
                  </text>
                  <text
                    x="400"
                    y="412"
                    textAnchor="middle"
                    fill={mapTheme === 'blueprint' ? '#94a3b8' : '#475569'}
                    fontSize="9.5"
                  >
                    Public Right-of-Way • BBMP / PWD Access Road
                  </text>
                </g>
              </g>
            )}

            {/* 30-METER NGT BUFFER ZONE OVERLAY */}
            {showBufferZones && (
              <g id="ngt-buffer-zone">
                <polygon
                  points="210,120 590,120 590,380 210,380"
                  fill="url(#buffer-hatch)"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />
                <text x="215" y="135" fill="#b45309" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  ⚠ 30m NGT Statutory Buffer Zone
                </text>
              </g>
            )}

            {/* ROAD NETWORK & VEHICLE ACCESS CORRIDOR */}
            {showRoadNetwork && (
              <g id="road-network">
                {/* South Main 40-ft MDR Road */}
                <rect x="0" y="440" width="800" height="40" fill="#334155" opacity={mapTheme === 'satellite' ? 0.9 : 0.75} />
                <line x1="0" y1="460" x2="800" y2="460" stroke="#facc15" strokeWidth="2" strokeDasharray="14 10" />
                <text x="400" y="465" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" letterSpacing="2">
                  40-FT VARTHUR MAIN ACCESS ROAD (MDR-09)
                </text>

                {/* Parcel Entrance Culvert */}
                <rect x="375" y="350" width="50" height="90" fill="#475569" opacity="0.6" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="400" y="375" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">
                  Entrance Gate
                </text>
              </g>
            )}

            {/* PRIMARY SUBJECT PARCEL POLYGON (SURVEY NO. 142/2B) */}
            <g
              id="subject-parcel-polygon"
              className="cursor-pointer group"
              onClick={() => setSelectedParcel(syntheticParcels[0])}
            >
              {/* Outer Glow in Satellite or Blueprint Mode */}
              <polygon
                points="260,150 540,150 540,350 260,350"
                fill={
                  mapTheme === 'satellite'
                    ? 'rgba(16, 185, 129, 0.28)'
                    : mapTheme === 'cadastre'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(16, 185, 129, 0.25)'
                }
                stroke="#10b981"
                strokeWidth={mapTheme === 'satellite' ? 3.5 : 3}
                filter="url(#emerald-glow)"
                className="group-hover:stroke-emerald-400 transition-all"
              />

              {/* Diagonal Hatching inside subject parcel */}
              <polygon
                points="260,150 540,150 540,350 260,350"
                fill="none"
                stroke="#059669"
                strokeWidth="0.8"
                strokeDasharray="4 8"
                opacity="0.3"
              />

              {/* Centroid Survey Marker & Badge */}
              <circle cx="400" cy="250" r="32" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
              <circle cx="400" cy="250" r="40" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

              <text x="400" y="244" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                Sy {surveyNo}
              </text>
              <text x="400" y="260" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                {boundary.totalAreaAcres} ACRES
              </text>
              <text x="400" y="273" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="mono">
                {boundary.totalAreaSqFt.toLocaleString('en-IN')} SQ.FT
              </text>

              {/* Registered Borewell point icon inside plot */}
              <g transform="translate(320, 290)">
                <circle cx="0" cy="0" r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">W</text>
                <text x="12" y="3" fill={mapTheme === 'blueprint' ? '#38bdf8' : '#0369a1'} fontSize="8" fontWeight="bold">BW-01</text>
              </g>
            </g>

            {/* CORNER VERTICES & REVENUE BOUNDARY STONES (BANDH STONES) */}
            {showVertices && (
              <g id="corner-vertices">
                {/* Vertex A (Top Left: North-West) */}
                <g transform="translate(260, 150)">
                  <circle cx="0" cy="0" r="12" fill="#047857" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-md" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">A</text>
                  <rect x="-65" y="-28" width="60" height="18" rx="4" fill="#0f172a" opacity="0.9" />
                  <text x="-35" y="-16" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    V-A (NW)
                  </text>
                </g>

                {/* Vertex B (Top Right: North-East) */}
                <g transform="translate(540, 150)">
                  <circle cx="0" cy="0" r="12" fill="#047857" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-md" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">B</text>
                  <rect x="5" y="-28" width="60" height="18" rx="4" fill="#0f172a" opacity="0.9" />
                  <text x="35" y="-16" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    V-B (NE)
                  </text>
                </g>

                {/* Vertex C (Bottom Right: South-East) */}
                <g transform="translate(540, 350)">
                  <circle cx="0" cy="0" r="12" fill="#047857" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-md" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">C</text>
                  <rect x="5" y="10" width="60" height="18" rx="4" fill="#0f172a" opacity="0.9" />
                  <text x="35" y="22" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    V-C (SE)
                  </text>
                </g>

                {/* Vertex D (Bottom Left: South-West) */}
                <g transform="translate(260, 350)">
                  <circle cx="0" cy="0" r="12" fill="#047857" stroke="#ffffff" strokeWidth="2.5" className="filter drop-shadow-md" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">D</text>
                  <rect x="-65" y="10" width="60" height="18" rx="4" fill="#0f172a" opacity="0.9" />
                  <text x="-35" y="22" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    V-D (SW)
                  </text>
                </g>
              </g>
            )}

            {/* DIMENSION CALLOUT LABELS (IN FEET & METERS) */}
            {showDimensions && (
              <g id="dimension-labels">
                {/* Edge A-B: North Edge (440 ft / 134.1 m) */}
                <g transform="translate(400, 138)">
                  <rect x="-85" y="-12" width="170" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                  <text x="0" y="3" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ↔ NORTH: 440.0 ft (134.1 m)
                  </text>
                </g>

                {/* Edge B-C: East Edge (396 ft / 120.7 m) */}
                <g transform="translate(552, 250)">
                  <rect x="0" y="-12" width="165" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                  <text x="82" y="3" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ↕ EAST: 396.0 ft (120.7 m)
                  </text>
                </g>

                {/* Edge C-D: South Edge (440 ft / 134.1 m) */}
                <g transform="translate(400, 362)">
                  <rect x="-85" y="-10" width="170" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                  <text x="0" y="5" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ↔ SOUTH: 440.0 ft (134.1 m)
                  </text>
                </g>

                {/* Edge D-A: West Edge (396 ft / 120.7 m) */}
                <g transform="translate(248, 250)">
                  <rect x="-165" y="-12" width="165" height="22" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                  <text x="-82" y="3" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    ↕ WEST: 396.0 ft (120.7 m)
                  </text>
                </g>
              </g>
            )}

            {/* ANIMATED GNSS RTK FIELD SURVEYOR ROVER */}
            {isSurveyorActive && (
              <g id="surveyor-rover" transform={`translate(${roverPosition.x}, ${roverPosition.y})`}>
                {/* Radar Ping Animation */}
                <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" values="8;24;36" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.3;0" dur="1.6s" repeatCount="indefinite" />
                </circle>

                {/* Central Rover Marker */}
                <circle cx="0" cy="0" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="filter drop-shadow-lg" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />

                {/* Surveyor Label Banner */}
                <rect x="-45" y="-26" width="90" height="16" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="-14" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                  RTK ROVER #01
                </text>
              </g>
            )}

            {/* NORTH COMPASS ARROW */}
            <g transform="translate(740, 55)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#334155" strokeWidth="1.5" className="filter drop-shadow-md" />
              <path d="M0 -15 L5 3 L0 0 L-5 3 Z" fill="#ef4444" />
              <path d="M0 15 L5 -3 L0 0 L-5 -3 Z" fill="#94a3b8" />
              <text x="0" y="-20" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace">
                N
              </text>
            </g>

            {/* METRIC GRAPHIC SCALE BAR */}
            <g transform="translate(50, 480)">
              <rect x="0" y="-8" width="140" height="14" rx="3" fill="#0f172a" opacity="0.85" />
              <line x1="10" y1="-1" x2="130" y2="-1" stroke="#ffffff" strokeWidth="2" />
              <line x1="10" y1="-5" x2="10" y2="3" stroke="#ffffff" strokeWidth="2" />
              <line x1="70" y1="-5" x2="70" y2="3" stroke="#ffffff" strokeWidth="2" />
              <line x1="130" y1="-5" x2="130" y2="3" stroke="#ffffff" strokeWidth="2" />
              <text x="10" y="-9" fill="#ffffff" fontSize="8" fontFamily="monospace">0m</text>
              <text x="70" y="-9" fill="#ffffff" fontSize="8" fontFamily="monospace">50m</text>
              <text x="130" y="-9" fill="#ffffff" fontSize="8" fontFamily="monospace">100m</text>
            </g>
          </svg>
        </div>

        {/* LIVE SURVEYOR TELEMETRY HUD (WHEN ACTIVE) */}
        {isSurveyorActive && (
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl border border-cyan-500/50 shadow-xl z-20 text-xs space-y-1.5 max-w-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>Field GNSS Surveyor</span>
              </div>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-mono font-bold">
                RTK FIXED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Precision</span>
                <span className="text-emerald-400 font-bold">±{surveyorTelemetry.accuracyMeters}m</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">NavIC/GPS</span>
                <span className="text-white font-bold">{surveyorTelemetry.satellites} Satellites</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Walk Speed</span>
                <span className="text-cyan-300 font-bold">{surveyorTelemetry.speedKmh} km/h</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Bearing</span>
                <span className="text-amber-300 font-bold">{surveyorTelemetry.bearing}</span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="truncate max-w-[170px]">{currentTraverseEdge}</span>
              <span className="text-cyan-300 font-mono font-bold">{roverProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${roverProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* LIVE COORDINATES HUD (BOTTOM LEFT) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 text-xs shadow-md z-10 pointer-events-none space-y-1">
          <div className="flex items-center gap-1.5 text-slate-900 font-bold">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cursor Geodetic Coordinates (WGS-84)</span>
          </div>
          <div className="font-mono text-slate-800 text-[11px] flex items-center gap-2">
            <span>Lat: {cursorCoords.lat.toFixed(6)}° N</span>
            <span>•</span>
            <span>Lng: {cursorCoords.lng.toFixed(6)}° E</span>
          </div>
          <div className="text-slate-600 text-[10px] flex items-center gap-2">
            <span>
              Zoom: <strong className="text-slate-900 font-mono">{(zoomLevel * 100).toFixed(0)}%</strong>
            </span>
            <span>•</span>
            <span>
              Zoning: <strong className="text-emerald-700">{zoning}</strong>
            </span>
            <span>•</span>
            <span>Click any plot to inspect</span>
          </div>
        </div>

        {/* MAP LEGEND (BOTTOM RIGHT) */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 text-xs shadow-md z-10 space-y-1.5 pointer-events-none">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Map Legend</div>
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 border-2 border-emerald-600"></span>
            <span>Subject Sy {surveyNo} (4.00 Ac)</span>
          </div>
          {showBufferZones && (
            <div className="flex items-center gap-2 text-slate-800">
              <span className="w-3.5 h-1 border-b-2 border-dashed border-amber-600"></span>
              <span>30m NGT Buffer Zone</span>
            </div>
          )}
          {showAdjacentPlots && (
            <div className="flex items-center gap-2 text-slate-800">
              <span className="w-3.5 h-3.5 rounded bg-blue-500/20 border border-dashed border-blue-400"></span>
              <span>Adjoining Surveys (#141, #142/1, #143, #145)</span>
            </div>
          )}
        </div>

        {/* PARCEL INSPECTION DRAWER (WHEN A PLOT IS CLICKED) */}
        {selectedParcel && (
          <div className="absolute top-3 right-3 z-30 w-80 max-w-sm bg-white rounded-2xl border border-slate-300 shadow-2xl p-4 text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>Cadastral Plot Details</span>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Survey Number:</span>
                <span className="font-extrabold text-slate-900 font-mono">{selectedParcel.surveyNo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Record Holder:</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[160px]">{selectedParcel.owner}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Extent:</span>
                <span className="font-bold text-emerald-800">
                  {selectedParcel.areaAcres} Acres ({selectedParcel.areaSqFt.toLocaleString('en-IN')} sq.ft)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Zoning Nature:</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">{selectedParcel.zoning}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mutation Ref:</span>
                <span className="font-mono text-slate-700">{selectedParcel.mutationNo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Title Status:</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    selectedParcel.status === 'CLEAR'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : selectedParcel.status === 'ROAD_RESERVE'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {selectedParcel.status === 'CLEAR'
                    ? 'Marketable & Certified'
                    : selectedParcel.status === 'ROAD_RESERVE'
                    ? 'Govt Road Corridor'
                    : 'Protected Water Buffer'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 leading-relaxed">
                {selectedParcel.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Geodetic Traverse & Boundary Coordinates Table */}
      <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden text-xs shadow-xs m-4">
        <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Survey Geodetic Traverse Points &amp; Edge Measurements (WGS-84)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Total Extent: {boundary.totalAreaAcres} Acres ({boundary.totalAreaSqFt.toLocaleString('en-IN')} sq.ft)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <th className="py-2 px-3">Corner Vertex</th>
                <th className="py-2 px-3">Geodetic Latitude</th>
                <th className="py-2 px-3">Geodetic Longitude</th>
                <th className="py-2 px-3">Edge Segment</th>
                <th className="py-2 px-3">Distance (Ft)</th>
                <th className="py-2 px-3">Distance (Meters)</th>
                <th className="py-2 px-3">Bearing</th>
                <th className="py-2 px-3">Adjoining Property</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {boundary.coordinates.map((coord, idx) => {
                const vertexLabels = ['Vertex A (NW)', 'Vertex B (NE)', 'Vertex C (SE)', 'Vertex D (SW)'];
                const edges = ['Edge A-B', 'Edge B-C', 'Edge C-D', 'Edge D-A'];
                const lengthsFt = ['440.0 ft', '396.0 ft', '440.0 ft', '396.0 ft'];
                const lengthsM = ['134.1 m', '120.7 m', '134.1 m', '120.7 m'];
                const bearings = ['091° (East)', '181° (South)', '271° (West)', '001° (North)'];
                const adjacent = [
                  boundary.adjacentSurveys.north,
                  boundary.adjacentSurveys.east,
                  boundary.adjacentSurveys.south,
                  boundary.adjacentSurveys.west,
                ];

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-sans font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{vertexLabels[idx] || `Pt ${idx + 1}`}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-800">{coord.lat.toFixed(6)}° N</td>
                    <td className="py-2 px-3 text-slate-800">{coord.lng.toFixed(6)}° E</td>
                    <td className="py-2 px-3 font-sans font-semibold text-emerald-800">{edges[idx]}</td>
                    <td className="py-2 px-3 text-slate-900 font-bold">{lengthsFt[idx]}</td>
                    <td className="py-2 px-3 text-slate-600">{lengthsM[idx]}</td>
                    <td className="py-2 px-3 font-sans text-slate-700">{bearings[idx]}</td>
                    <td className="py-2 px-3 font-sans text-slate-600 max-w-[200px] truncate" title={adjacent[idx]}>
                      {adjacent[idx]}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-emerald-50/60 font-sans font-bold text-emerald-950 border-t border-emerald-200">
                <td className="py-2 px-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    ⊕
                  </span>
                  <span>Centroid Center</span>
                </td>
                <td className="py-2 px-3 font-mono text-emerald-900">
                  {boundary.centroid.lat.toFixed(6)}° N
                </td>
                <td className="py-2 px-3 font-mono text-emerald-900">
                  {boundary.centroid.lng.toFixed(6)}° E
                </td>
                <td className="py-2 px-3">Bhu-Aadhaar Key</td>
                <td colSpan={4} className="py-2 px-3 font-mono text-emerald-800">
                  {ulpin}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bhu-Aadhaar / ULPIN Spatial Key Architecture Modal */}
      {isBhuAadhaarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Bhu-Aadhaar Spatial Key Architecture</h4>
                  <p className="text-xs text-slate-500">
                    Unique Land Parcel Identification Number (ULPIN) Standard (Govt. of India &amp; NIC)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBhuAadhaarModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Current Parcel Spatial Identifier
                </span>
                <div className="text-xl font-mono font-extrabold text-emerald-900 tracking-wider mt-1 flex items-center justify-between">
                  <span>{ulpin}</span>
                  <button
                    onClick={copyUlpin}
                    className="text-xs px-2.5 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  Standard: 14-Character Alphanumeric Geocode derived from Latitude/Longitude of polygon vertices
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Jurisdiction Header</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {ulpin.split('-').slice(0, 2).join('-')}
                  </div>
                  <p className="text-[11px] text-slate-500">ISO 3166-2 India State LGD Code ({state})</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Tehsil &amp; Village LGD</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {ulpin.split('-')[3] || 'LGD-5601'}
                  </div>
                  <p className="text-[11px] text-slate-500">Census Village Master Code ({village})</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Sub-Meter Geo-Hash</span>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {ulpin.split('-')[4] || '09412'}
                  </div>
                  <p className="text-[11px] text-slate-500">Sub-meter Centroid Geocoding Key</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsBhuAadhaarModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for village taluk display
function talukTehsilDisplay(village: string): string {
  if (village.toLowerCase().includes('varthur')) return 'Varthur Hobli / Bangalore East';
  if (village.toLowerCase().includes('whitefield')) return 'K.R. Puram Hobli / Bangalore East';
  if (village.toLowerCase().includes('devanahalli')) return 'Kasaba Hobli / Devanahalli';
  return 'East Taluk';
}
