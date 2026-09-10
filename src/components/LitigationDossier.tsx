import React from 'react';
import { CourtLitigation } from '../types';
import { Scale, AlertTriangle, ShieldCheck, Calendar, Gavel, FileText, ExternalLink } from 'lucide-react';

interface LitigationDossierProps {
  litigations: CourtLitigation[];
  surveyNo: string;
}

export const LitigationDossier: React.FC<LitigationDossierProps> = ({
  litigations,
  surveyNo
}) => {
  const activeCases = litigations.filter(l => l.currentStatus === 'PENDING_TRIAL' || l.currentStatus === 'INTERIM_STAY_GRANTED' || l.currentStatus === 'APPEAL_SUBMITTED');

  return (
    <div id="litigation-dossier-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Scale className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">eCourts & NJDG Judicial Litigation Dossier</h3>
            <p className="text-xs text-slate-500 font-medium">
              National Judicial Data Grid, High Courts, District Courts, DRT & Revenue Tribunals
            </p>
          </div>
        </div>

        <div>
          {activeCases.length > 0 ? (
            <span className="px-3 py-1 bg-rose-50 border border-rose-300 rounded-lg text-xs font-bold text-rose-800 flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              {activeCases.length} Pending Civil Dispute(s)
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Zero Pending Suits in Indian Courts
            </span>
          )}
        </div>
      </div>

      {litigations.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-90" />
          <h4 className="text-sm font-bold text-slate-900">Litigation Free — 100% Judicial Clearance</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
            Automated deep search matching Survey No. <strong className="text-slate-800">{surveyNo}</strong> and owner names across 3,500+ court complexes returned zero pending or historical title disputes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {litigations.map((courtCase) => {
            const isCritical = courtCase.riskWeight === 'CRITICAL';
            const isStay = courtCase.currentStatus === 'INTERIM_STAY_GRANTED';

            return (
              <div 
                key={courtCase.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical 
                    ? 'bg-rose-50/70 border-rose-300 shadow-sm' 
                    : 'bg-amber-50/60 border-amber-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{courtCase.courtName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-mono font-semibold text-slate-700">{courtCase.caseNumber}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700 font-medium">
                      {courtCase.disputeCategory}
                    </span>
                    {isStay ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <Gavel className="w-3 h-3 text-rose-600" />
                        Injunction / Status Quo Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                        {courtCase.currentStatus.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Parties Involved */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-700">Petitioner / Plaintiff</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{courtCase.petitioner}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Respondent / Defendant</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{courtCase.respondent}</div>
                  </div>
                </div>

                {/* Court Case Data Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-2.5">
                  <div>
                    <span className="text-slate-500 text-[11px] font-medium">CNR Number (eCourts Key):</span>
                    <div className="font-mono text-emerald-700 font-bold">{courtCase.cnrNumber}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] font-medium">Filing Date & Year:</span>
                    <div className="font-bold text-slate-900">{courtCase.filingDate} (Year {courtCase.filingYear})</div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] font-medium">Next Listing / Hearing:</span>
                    <div className="font-bold text-amber-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {courtCase.nextHearingDate || 'To be listed'}
                    </div>
                  </div>
                </div>

                {/* Summary & Interim Orders */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong className="text-slate-900 font-semibold">Legal Summary: </strong>
                    {courtCase.summary}
                  </div>

                  {courtCase.interimOrders && (
                    <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-lg text-rose-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-rose-950">Binding Interim Restraint: </strong>
                        {courtCase.interimOrders}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
