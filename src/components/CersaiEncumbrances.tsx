import React from 'react';
import { EncumbranceCharge } from '../types';
import { Landmark, ShieldAlert, CheckCircle2, AlertCircle, FileCheck, Banknote } from 'lucide-react';

interface CersaiEncumbrancesProps {
  encumbrances: EncumbranceCharge[];
}

export const CersaiEncumbrances: React.FC<CersaiEncumbrancesProps> = ({ encumbrances }) => {
  const activeCharges = encumbrances.filter(e => e.status === 'ACTIVE_ENCUMBERED' || e.status === 'UNDER_DRT_RECOVERY');
  const satisfiedCharges = encumbrances.filter(e => e.status === 'SATISFIED_NOC_FILED');

  const totalActiveExposure = activeCharges.reduce((sum, e) => sum + e.sanctionAmountInr, 0);

  return (
    <div id="cersai-encumbrances-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Landmark className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">CERSAI & Banking Mortgage Encumbrances</h3>
            <p className="text-xs text-slate-500 font-medium">
              Central Registry of Securitisation Asset Reconstruction and Security Interest of India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeCharges.length > 0 ? (
            <div className="px-3 py-1 bg-rose-50 border border-rose-300 rounded-lg text-xs font-semibold text-rose-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Active Exposure: ₹{(totalActiveExposure / 10000000).toFixed(2)} Cr</span>
            </div>
          ) : (
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Active Bank Encumbrances</span>
            </div>
          )}
        </div>
      </div>

      {encumbrances.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-90" />
          <h4 className="text-sm font-bold text-slate-900">No Mortgage Charges Registered</h4>
          <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
            Cross-referenced with CERSAI Central Security Registry & Sub-Registrar Form 15 Encumbrance Certificates. Title is 100% debt-free.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {encumbrances.map((charge) => {
            const isSatisfied = charge.status === 'SATISFIED_NOC_FILED';
            const isDrt = charge.status === 'UNDER_DRT_RECOVERY';

            return (
              <div 
                key={charge.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSatisfied 
                    ? 'bg-slate-50 border-slate-200' 
                    : isDrt 
                    ? 'bg-rose-50/70 border-rose-300 shadow-sm' 
                    : 'bg-amber-50/60 border-amber-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{charge.financialInstitution}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">{charge.branch}</span>
                  </div>

                  <div>
                    {isSatisfied ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Satisfied & Released
                      </span>
                    ) : isDrt ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        DRT Recovery / SARFAESI
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        Active Collateral Charge
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200 text-xs mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">CERSAI Security ID</span>
                    <div className="font-mono text-slate-900 font-semibold mt-0.5 truncate">{charge.cersaiSecurityId}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Charge Type</span>
                    <div className="text-slate-900 mt-0.5 font-medium">{charge.chargeType}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Sanctioned Amount</span>
                    <div className="text-emerald-700 font-mono font-bold mt-0.5">
                      ₹ {(charge.sanctionAmountInr / 10000000).toFixed(2)} Crores
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Borrower / Mortgagor</span>
                    <div className="text-slate-900 mt-0.5 font-medium truncate">{charge.borrowerName}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-start gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    Created: <strong className="text-slate-800">{charge.chargeCreationDate}</strong>
                    {charge.satisfactionDate && <> | Discharge Date: <strong className="text-emerald-700">{charge.satisfactionDate}</strong></>}
                    {charge.drtCaseRef && <> | <strong>Case Ref: {charge.drtCaseRef}</strong></>}
                    {' — '}{charge.remarks}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
