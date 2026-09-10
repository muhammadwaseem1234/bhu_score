import React, { useState, useEffect } from 'react';
import { LandParcelProfile, WatchlistSubscription, ParcelAlertEvent } from './types';
import { api } from './services/api';
import { INITIAL_PARCELS } from './data/mockParcels';
import { Navbar } from './components/Navbar';
import { ScoreGauge } from './components/ScoreGauge';
import { CadastralMapView } from './components/CadastralMapView';
import { OwnershipTimeline } from './components/OwnershipTimeline';
import { CersaiEncumbrances } from './components/CersaiEncumbrances';
import { LitigationDossier } from './components/LitigationDossier';
import { PublicNoticesView } from './components/PublicNoticesView';
import { WatchlistManager } from './components/WatchlistManager';
import { AiLegalOpinionModal } from './components/AiLegalOpinionModal';
import { BureauReportPrintView } from './components/BureauReportPrintView';
import { LenderPortfolioView } from './components/LenderPortfolioView';
import { EntityMatchingVisualizer } from './components/EntityMatchingVisualizer';
import { 
  ShieldCheck, 
  MapPin, 
  FileText, 
  Sparkles, 
  Printer, 
  Scale, 
  Landmark, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Calendar,
  Layers,
  Building,
  RefreshCw
} from 'lucide-react';

export function App() {
  const [parcels, setParcels] = useState<LandParcelProfile[]>(INITIAL_PARCELS);
  const [currentParcelId, setCurrentParcelId] = useState<string>(INITIAL_PARCELS[0].id);
  const [activeTab, setActiveTab] = useState<'dossier' | 'portfolio' | 'watchlist' | 'pipeline'>('dossier');
  const [activeSubSection, setActiveSubSection] = useState<'overview' | 'lineage' | 'encumbrance' | 'litigation' | 'notices' | 'cadastral'>('overview');
  
  const [watchlist, setWatchlist] = useState<WatchlistSubscription[]>([]);
  const [alerts, setAlerts] = useState<ParcelAlertEvent[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentParcel = parcels.find(p => p.id === currentParcelId) || parcels[0];

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [fetchedParcels, fetchedWatchlist, fetchedAlerts] = await Promise.all([
          api.getParcels(),
          api.getWatchlist(),
          api.getAlerts()
        ]);
        if (fetchedParcels.length > 0) setParcels(fetchedParcels);
        setWatchlist(fetchedWatchlist);
        setAlerts(fetchedAlerts);
      } catch (e) {
        console.warn('Using local mock data fallback:', e);
      }
    };
    loadInitialData();
  }, []);

  const handleSelectParcel = (parcelId: string) => {
    setCurrentParcelId(parcelId);
    setActiveTab('dossier');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribeWatchlist = async (data: {
    parcelId: string;
    notificationEmail: string;
    webhookUrl?: string;
    alertOnLitigation: boolean;
    alertOnMortgage: boolean;
    alertOnRegistration: boolean;
    alertOnPublicNotice: boolean;
  }) => {
    try {
      const newSub = await api.addToWatchlist(data);
      setWatchlist(prev => [newSub, ...prev.filter(w => w.parcelId !== data.parcelId)]);
    } catch (err) {
      console.error('Failed to subscribe:', err);
    }
  };

  const handleUnsubscribeWatchlist = async (id: string) => {
    try {
      await api.removeFromWatchlist(id);
      setWatchlist(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
    }
  };

  const handleSimulateAlertEvent = async (data: {
    parcelId: string;
    eventType: 'NEW_REGISTRATION' | 'NEW_CERSAI_MORTGAGE' | 'NEW_COURT_SUIT' | 'MUTATION_STATUS_CHANGE' | 'PUBLIC_GAZETTE_NOTICE';
    customTitle?: string;
    customDescription?: string;
    severity?: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  }) => {
    try {
      const newEvent = await api.simulateAlertEvent(data);
      setAlerts(prev => [newEvent, ...prev]);
    } catch (err) {
      console.error('Failed to simulate event:', err);
    }
  };

  const unreadAlerts = alerts.filter(a => !a.isRead).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-16">
      {/* Top Navbar */}
      <Navbar
        parcels={parcels}
        currentParcel={currentParcel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectParcel={handleSelectParcel}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenPrintReport={() => setIsPrintModalOpen(true)}
        alerts={alerts}
        unreadAlertCount={unreadAlerts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* TAB 1: LAND DOSSIER (SINGLE PARCEL DEEP DIVE) */}
        {activeTab === 'dossier' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Parcel Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap pl-1">
                Sample Land Files:
              </span>
              {parcels.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentParcelId(p.id)}
                  className={`px-3 py-1.5 rounded-xl border font-mono transition-all whitespace-nowrap flex items-center gap-2 ${
                    currentParcel.id === p.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-sm'
                      : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400'
                  }`}
                >
                  <span>{p.stateSurveyNo} ({p.state.split(' ')[0]})</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${
                    p.bhuScore >= 750 ? 'bg-emerald-100 text-emerald-800' : p.bhuScore >= 600 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {p.bhuScore}
                  </span>
                </button>
              ))}
            </div>

            {/* Parcel Identity Hero Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300">
                      ULPIN: {currentParcel.ulpin}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      State Registry: {currentParcel.rorRegistrySource}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                      Patta / Khata: <strong className="text-slate-900">{currentParcel.pattaKhataNo}</strong>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Survey No. {currentParcel.stateSurveyNo}{' '}
                    <span className="text-slate-500 text-lg font-normal">
                      (Hissa {currentParcel.hissaSubDivision})
                    </span>
                  </h1>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {currentParcel.villageName}, {currentParcel.talukTehsil}, {currentParcel.district}, {currentParcel.state} - {currentParcel.pincode}
                    </span>
                    <span>•</span>
                    <span>Extent: <strong className="text-slate-900">{currentParcel.boundary.totalAreaAcres} Acres</strong> ({currentParcel.boundary.totalAreaSqFt.toLocaleString('en-IN')} sq.ft)</span>
                    <span>•</span>
                    <span>Zoning: <strong className="text-emerald-700">{currentParcel.zoning}</strong></span>
                  </div>
                </div>

                {/* Hero Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Title Search</span>
                  </button>

                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-300 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print Bureau File</span>
                  </button>
                </div>
              </div>

              {/* Summary Description & Verification Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="md:col-span-2 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Bureau Underwriter Summary</span>
                  <p className="text-slate-700 leading-relaxed">{currentParcel.verdictSummary}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Current Record of Rights Holder</div>
                  <div className="text-slate-900 font-bold text-sm truncate">{currentParcel.currentOwnerName}</div>
                  <div className="text-slate-600 text-[11px]">Ownership: {currentParcel.ownershipType}</div>
                  <div className="font-mono text-[10px] text-slate-500 truncate pt-0.5">
                    Hash: {currentParcel.recordVerificationHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Gauge & 6-Pillar Risk Breakdown */}
            <ScoreGauge
              score={currentParcel.bhuScore}
              grade={currentParcel.grade}
              riskLevel={currentParcel.riskLevel}
              confidenceScore={currentParcel.matchingConfidenceScore}
              pillars={currentParcel.pillars}
            />

            {/* Sub-Section Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs font-semibold">
              <button
                onClick={() => setActiveSubSection('overview')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeSubSection === 'overview' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Complete Dossier</span>
              </button>

              <button
                onClick={() => setActiveSubSection('cadastral')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeSubSection === 'cadastral' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>GIS Cadastral Map</span>
              </button>

              <button
                onClick={() => setActiveSubSection('lineage')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeSubSection === 'lineage' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>30-Year Devolution ({currentParcel.ownershipChain.length})</span>
              </button>

              <button
                onClick={() => setActiveSubSection('encumbrance')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeSubSection === 'encumbrance' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>CERSAI Encumbrances ({currentParcel.encumbrances.length})</span>
              </button>

              <button
                onClick={() => setActiveSubSection('litigation')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeSubSection === 'litigation' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>eCourts Litigation ({currentParcel.litigationHistory.length})</span>
              </button>

              <button
                onClick={() => setActiveSubSection('notices')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeSubSection === 'notices' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Public Gazettes ({currentParcel.publicNotices.length})</span>
              </button>
            </div>

            {/* Sub-Section Content Render */}
            {activeSubSection === 'overview' && (
              <div className="space-y-6">
                {/* Cadastral Polygon */}
                <CadastralMapView
                  ulpin={currentParcel.ulpin}
                  surveyNo={currentParcel.stateSurveyNo}
                  village={currentParcel.villageName}
                  district={currentParcel.district}
                  state={currentParcel.state}
                  zoning={currentParcel.zoning}
                  boundary={currentParcel.boundary}
                />

                {/* 30-Year Lineage */}
                <OwnershipTimeline
                  chain={currentParcel.ownershipChain}
                  registrySource={currentParcel.rorRegistrySource}
                />

                {/* CERSAI & Litigation in 2 cols */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CersaiEncumbrances encumbrances={currentParcel.encumbrances} />
                  <LitigationDossier litigations={currentParcel.litigationHistory} surveyNo={currentParcel.stateSurveyNo} />
                </div>

                {/* Gazettes & Public Notices */}
                <PublicNoticesView notices={currentParcel.publicNotices} state={currentParcel.state} />
              </div>
            )}

            {activeSubSection === 'cadastral' && (
              <CadastralMapView
                ulpin={currentParcel.ulpin}
                surveyNo={currentParcel.stateSurveyNo}
                village={currentParcel.villageName}
                district={currentParcel.district}
                state={currentParcel.state}
                zoning={currentParcel.zoning}
                boundary={currentParcel.boundary}
              />
            )}

            {activeSubSection === 'lineage' && (
              <OwnershipTimeline
                chain={currentParcel.ownershipChain}
                registrySource={currentParcel.rorRegistrySource}
              />
            )}

            {activeSubSection === 'encumbrance' && (
              <CersaiEncumbrances encumbrances={currentParcel.encumbrances} />
            )}

            {activeSubSection === 'litigation' && (
              <LitigationDossier litigations={currentParcel.litigationHistory} surveyNo={currentParcel.stateSurveyNo} />
            )}

            {activeSubSection === 'notices' && (
              <PublicNoticesView notices={currentParcel.publicNotices} state={currentParcel.state} />
            )}
          </div>
        )}

        {/* TAB 2: LENDER PORTFOLIO SCREENER */}
        {activeTab === 'portfolio' && (
          <div className="animate-in fade-in duration-300">
            <LenderPortfolioView
              parcels={parcels}
              onSelectParcel={handleSelectParcel}
            />
          </div>
        )}

        {/* TAB 3: WATCHLIST & 24/7 AUTOMATED ALERTS */}
        {activeTab === 'watchlist' && (
          <div className="animate-in fade-in duration-300">
            <WatchlistManager
              currentParcel={currentParcel}
              watchlist={watchlist}
              alerts={alerts}
              onSubscribe={handleSubscribeWatchlist}
              onUnsubscribe={handleUnsubscribeWatchlist}
              onSimulateEvent={handleSimulateAlertEvent}
              onSelectParcel={handleSelectParcel}
            />
          </div>
        )}

        {/* TAB 4: DATA INGESTION & ENTITY MATCHING PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="animate-in fade-in duration-300">
            <EntityMatchingVisualizer />
          </div>
        )}
      </main>

      {/* AI Legal Opinion Modal */}
      <AiLegalOpinionModal
        parcel={currentParcel}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Printable Institutional Bureau Dossier */}
      {isPrintModalOpen && (
        <BureauReportPrintView
          parcel={currentParcel}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
