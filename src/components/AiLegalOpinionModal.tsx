import React, { useState } from 'react';
import { LandParcelProfile, AiLegalOpinionResponse, AiLegalOpinionRequest } from '../types';
import { api } from '../services/api';
import { Sparkles, Scale, X, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Send, Download, RefreshCw, Landmark } from 'lucide-react';

interface AiLegalOpinionModalProps {
  parcel: LandParcelProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const AiLegalOpinionModal: React.FC<AiLegalOpinionModalProps> = ({
  parcel,
  isOpen,
  onClose
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(50000000); // 5 Cr
  const [loanType, setLoanType] = useState<'Home Loan' | 'Commercial Project Construction' | 'LAP (Loan Against Property)' | 'Direct Land Acquisition'>('LAP (Loan Against Property)');
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [opinion, setOpinion] = useState<AiLegalOpinionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateOpinion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.generateAiLegalOpinion({
        parcelId: parcel.id,
        targetLoanAmountInr: loanAmount,
        loanType,
        customLegalQuery: customQuery.trim() || undefined,
      });
      setOpinion(res);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate AI legal due-diligence report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative my-8 text-slate-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">AI Legal Title Opinion & Due-Diligence Co-Pilot</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Automated High Court Advocate Title Search & Mortgageability Clearance for <strong className="text-slate-800">{parcel.ulpin}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Transaction / Facility Type</label>
            <select
              value={loanType}
              onChange={(e: any) => setLoanType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="LAP (Loan Against Property)">LAP (Loan Against Property)</option>
              <option value="Commercial Project Construction">Commercial Project Construction Loan</option>
              <option value="Home Loan">Individual Home Loan</option>
              <option value="Direct Land Acquisition">Direct Outright Land Acquisition</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Underwriting Amount (INR)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              placeholder="50000000"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              = ₹ {(loanAmount / 10000000).toFixed(2)} Crores
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Specific Counsel Instruction (Optional)</label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g. Verify daughter succession right or lake buffer compliance"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={handleGenerateOpinion}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing 30-Year Revenue Lineage, eCourts Suits & CERSAI Hypothecations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Lawyer-Grade Title Search & Due-Diligence Certificate</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Generated Legal Opinion View */}
        {opinion && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            {/* Verdict Banner */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              opinion.lawyerVerdict === 'TITLE_MARKETABLE_FIT_FOR_MORTGAGE'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : opinion.lawyerVerdict === 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {opinion.lawyerVerdict === 'TITLE_MARKETABLE_FIT_FOR_MORTGAGE' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : opinion.lawyerVerdict === 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm uppercase tracking-wider text-slate-900">
                    {opinion.lawyerVerdict.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-800 font-mono font-bold">
                    Confidence: {opinion.confidenceScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{opinion.opinionSummary}</p>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 30-Year Chain Analysis */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>30-Year Devolution & Title Flow</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">{opinion.chainOfTitleAnalysis}</p>
              </div>

              {/* Judicial / eCourts Impact */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-rose-600" />
                  <span>Judicial & eCourts Assessment</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">{opinion.courtDisputeImpact}</p>
              </div>

              {/* CERSAI Encumbrance Impact */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-amber-600" />
                  <span>CERSAI Encumbrance & Banking Charges</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">{opinion.encumbranceImpact}</p>
              </div>

              {/* Acquisition & Masterplan */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Public Acquisition & Master Plan Zoning</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">{opinion.acquisitionVulnerability}</p>
              </div>
            </div>

            {/* Conditions Precedent (CPs) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mandatory Conditions Precedent (CPs) Before Loan Disbursement</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {opinion.recommendedConditionsPrecedent.map((cp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-emerald-300">
                      {idx + 1}
                    </span>
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Statutory Indemnity Clauses */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recommended Statutory Borrower Indemnities
              </h4>
              <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                {opinion.statutoryIndemnityClauses.map((clause, idx) => (
                  <li key={idx}>{clause}</li>
                ))}
              </ul>
            </div>

            {/* Sign-off footer */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <div>
                Report Timestamp: <strong className="text-slate-900">{new Date(opinion.generatedAt).toLocaleString()}</strong> | Ref: <strong className="text-slate-900">BHU-LEGAL-{parcel.id}</strong>
              </div>
              <span className="text-emerald-700 font-bold">Digitally Signed by BhuScore Legal Engine</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
