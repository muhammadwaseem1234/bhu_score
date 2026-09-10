import React, { useState } from 'react';
import { LandParcelProfile, ParcelAlertEvent } from '../types';
import { ShieldCheck, Search, Bell, Sparkles, Printer, Building2, Cpu, FileText, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  parcels: LandParcelProfile[];
  currentParcel: LandParcelProfile;
  activeTab: 'dossier' | 'portfolio' | 'watchlist' | 'pipeline';
  setActiveTab: (tab: 'dossier' | 'portfolio' | 'watchlist' | 'pipeline') => void;
  onSelectParcel: (parcelId: string) => void;
  onOpenAiModal: () => void;
  onOpenPrintReport: () => void;
  alerts: ParcelAlertEvent[];
  unreadAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  parcels,
  currentParcel,
  activeTab,
  setActiveTab,
  onSelectParcel,
  onOpenAiModal,
  onOpenPrintReport,
  alerts,
  unreadAlertCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = parcels.filter(p => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      p.ulpin.toLowerCase().includes(q) ||
      p.stateSurveyNo.toLowerCase().includes(q) ||
      p.currentOwnerName.toLowerCase().includes(q) ||
      p.villageName.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shadow-sm">
      {/* Top Registry Status Strip */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-1.5 text-[11px] text-slate-600 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live National Registry Ingestion:
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Bhoomi (KA)
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Dharani (TS)
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Mahabhulekh (MH)
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CERSAI Registry
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> eCourts / NJDG
          </span>
          <span className="flex items-center gap-1 text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> SVAMITVA GIS
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[10px] font-medium">
          ULPIN Bhu-Aadhaar Gateway Connected
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('dossier')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  BhuScore
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  INDIA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">
                Land Parcel Credit Bureau
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dossier' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Land Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'portfolio' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Lender Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative cursor-pointer ${
                activeTab === 'watchlist' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Watchlist & Alerts</span>
              {unreadAlertCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pipeline' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Data Pipeline</span>
            </button>
          </nav>
        </div>

        {/* Center: Search input */}
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search by ULPIN, Survey No, Owner name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 max-h-72 overflow-y-auto space-y-1">
              {searchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectParcel(p.id);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full p-2.5 rounded-lg hover:bg-slate-100 text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-mono text-xs text-emerald-700 font-bold">{p.ulpin}</div>
                    <div className="text-xs text-slate-900 font-medium">Sy {p.stateSurveyNo} • {p.currentOwnerName}</div>
                    <div className="text-[10px] text-slate-500">{p.villageName}, {p.district}, {p.state}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-slate-900">{p.bhuScore}</span>
                    <div className="text-[10px] text-slate-500">Grade {p.grade}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Legal Opinion */}
          <button
            onClick={onOpenAiModal}
            className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-sm text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="AI Legal Due-Diligence Opinion"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Legal Opinion</span>
          </button>

          {/* Print Dossier */}
          <button
            onClick={onOpenPrintReport}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl border border-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download Official Bureau Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Bureau Dossier</span>
          </button>

          {/* Watchlist Quick Tab */}
          <button
            onClick={() => setActiveTab('watchlist')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 relative transition-colors cursor-pointer"
            title="Watchlist Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
