import React, { useState } from 'react';
import { LandParcelProfile } from '../types';
import { Building2, ShieldCheck, AlertTriangle, ShieldAlert, ArrowRight, Download, Filter, Search, CheckCircle2 } from 'lucide-react';

interface LenderPortfolioViewProps {
  parcels: LandParcelProfile[];
  onSelectParcel: (parcelId: string) => void;
}

export const LenderPortfolioView: React.FC<LenderPortfolioViewProps> = ({
  parcels,
  onSelectParcel
}) => {
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredParcels = parcels.filter(p => {
    if (selectedState !== 'ALL' && p.state.toLowerCase() !== selectedState.toLowerCase()) return false;
    if (riskFilter !== 'ALL' && p.riskLevel !== riskFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.ulpin.toLowerCase().includes(q) ||
        p.stateSurveyNo.toLowerCase().includes(q) ||
        p.currentOwnerName.toLowerCase().includes(q) ||
        p.villageName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = parcels.length;
  const avgScore = totalCount > 0 ? Math.round(parcels.reduce((sum, p) => sum + p.bhuScore, 0) / totalCount) : 0;
  const cleanCount = parcels.filter(p => p.riskLevel === 'CLEAN').length;
  const moderateCount = parcels.filter(p => p.riskLevel === 'MODERATE_RISK').length;
  const highRiskCount = parcels.filter(p => p.riskLevel === 'HIGH_RISK' || p.riskLevel === 'CRITICAL_RISK').length;
  const activeLitigationCount = parcels.filter(p => p.litigationHistory.length > 0).length;

  return (
    <div id="lender-portfolio-screen" className="space-y-6">
      {/* Portfolio Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Collateral Parcels</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">100% ULPIN Indexed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Portfolio Avg BhuScore</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{avgScore}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Grade A2 / Prime</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Clean Marketable</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{cleanCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Ready for Disbursal</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Moderate Caution</div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{moderateCount}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Requires CP Conditions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">High / Stressed Risk</div>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-1">{highRiskCount}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">{activeLitigationCount} with Active Suits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ULPIN, Survey No, Owner, or Village..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">All States</option>
            <option value="Karnataka">Karnataka (Bhoomi)</option>
            <option value="Telangana">Telangana (Dharani)</option>
            <option value="Maharashtra">Maharashtra (Mahabhulekh)</option>
            <option value="Tamil Nadu">Tamil Nadu (TamilNilam)</option>
            <option value="Haryana">Haryana (Jamabandi)</option>
            <option value="Gujarat">Gujarat (AnyRoR)</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">All Risk Grades</option>
            <option value="CLEAN">Clean (Grade A1/A2)</option>
            <option value="MODERATE_RISK">Moderate (Grade B/C1)</option>
            <option value="HIGH_RISK">High Risk (Grade C2)</option>
            <option value="CRITICAL_RISK">Critical (Grade D/F)</option>
          </select>
        </div>
      </div>

      {/* Portfolio Parcels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParcels.map((parcel) => (
          <div
            key={parcel.id}
            onClick={() => onSelectParcel(parcel.id)}
            className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-emerald-500 p-5 rounded-2xl shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">{parcel.ulpin}</span>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Survey No. {parcel.stateSurveyNo}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {parcel.villageName}, {parcel.district}, {parcel.state}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xl font-bold font-mono ${
                    parcel.bhuScore >= 750 ? 'text-emerald-700' : parcel.bhuScore >= 600 ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {parcel.bhuScore}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Grade {parcel.grade}
                  </span>
                </div>
              </div>

              {/* Owner & Extent */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs my-3 space-y-1">
                <div className="text-slate-800 truncate font-medium">
                  Owner: <strong className="text-slate-900">{parcel.currentOwnerName}</strong>
                </div>
                <div className="text-slate-500 text-[11px] flex justify-between">
                  <span>Extent: {parcel.boundary.totalAreaAcres} Acres</span>
                  <span>Zoning: {parcel.zoning.split(' ')[0]}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 font-normal">
                {parcel.verdictSummary}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Open Land Dossier <ArrowRight className="w-3.5 h-3.5" />
              </span>

              {parcel.litigationHistory.length > 0 && (
                <span className="text-[10px] text-rose-800 font-bold px-2 py-0.5 bg-rose-50 rounded-full border border-rose-200">
                  {parcel.litigationHistory.length} Court Suit(s)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
