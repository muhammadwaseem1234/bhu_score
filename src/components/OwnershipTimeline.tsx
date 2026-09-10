import React from 'react';
import { OwnershipTransfer } from '../types';
import { History, FileText, CheckCircle2, AlertTriangle, ArrowDown, UserCheck, ShieldCheck, Scale } from 'lucide-react';

interface OwnershipTimelineProps {
  chain: OwnershipTransfer[];
  registrySource: string;
}

export const OwnershipTimeline: React.FC<OwnershipTimelineProps> = ({
  chain,
  registrySource
}) => {
  return (
    <div id="ownership-chain-timeline" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <History className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">30-Year Title Chain & Devolution Lineage</h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified against <span className="text-slate-800 font-semibold">{registrySource}</span> & State Registration Archives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-semibold">
            {chain.length} Registered Transfers
          </span>
        </div>
      </div>

      {/* Timeline entries */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {chain.map((item, index) => {
          const isLatest = index === chain.length - 1;
          return (
            <div key={item.id} className="relative group">
              {/* Timeline marker icon */}
              <div 
                className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  item.hasGapFlag 
                    ? 'bg-rose-100 border-rose-500 text-rose-800' 
                    : isLatest 
                    ? 'bg-emerald-600 border-emerald-200 text-white shadow-sm' 
                    : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                {index + 1}
              </div>

              {/* Card Container */}
              <div 
                className={`p-4 rounded-xl border transition-all ${
                  item.hasGapFlag 
                    ? 'bg-rose-50/50 border-rose-300 hover:border-rose-400' 
                    : isLatest 
                    ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row: Year & Transfer Type */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{item.year}</span>
                    <span className="text-slate-400">•</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                      item.transferType === 'Sale Deed' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : item.transferType === 'Partition Deed'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : item.transferType === 'Inheritance (Virasat)'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}>
                      {item.transferType}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full uppercase tracking-wider border border-emerald-300">
                        Current Record of Rights
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Registered: <strong className="text-slate-800">{item.date}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>Confidence: <strong className="text-emerald-700">{item.documentConfidence}%</strong></span>
                  </div>
                </div>

                {/* Parties flow (From -> To) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Transferor / Grantor</span>
                    <div className="font-semibold text-slate-800 mt-0.5">{item.fromParty}</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Transferee / Grantee</span>
                    <div className="font-semibold text-emerald-800 mt-0.5">{item.toParty}</div>
                  </div>
                </div>

                {/* Registration details & Mutation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 mb-2.5">
                  <div>
                    <span className="text-slate-500 text-[11px] font-medium">Sub-Registrar Doc No:</span>
                    <div className="font-mono font-bold text-slate-900">{item.registeredNumber}</div>
                    <div className="text-[10px] text-slate-500">{item.subRegistrarOffice}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] font-medium">Revenue Mutation (MR):</span>
                    <div className="font-mono font-bold text-slate-900">{item.mutationNumber}</div>
                    <div className="text-[10px] text-slate-500">{item.mutationDate}</div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] font-medium">Consideration Amount:</span>
                    <div className="font-bold text-slate-900">
                      {item.considerationAmountInr 
                        ? `₹ ${(item.considerationAmountInr / 100000).toLocaleString('en-IN')} Lakhs`
                        : 'Family Settlement / NIL'}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{item.mutationStatus}</div>
                  </div>
                </div>

                {/* Legal notes */}
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800">Auditor Notes: </span>
                  {item.remarks}
                </div>

                {/* Broken Chain or Coparcenary Gap Alert */}
                {item.hasGapFlag && (
                  <div className="mt-2.5 p-2.5 bg-rose-100/70 border border-rose-300 rounded-lg flex items-start gap-2 text-xs text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-rose-950">Title Lineage Gap Detected: </strong>
                      Coparcenary female heir omitted during partition without registered relinquishment deed. Potential vulnerability under Section 6 Hindu Succession Act.
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
