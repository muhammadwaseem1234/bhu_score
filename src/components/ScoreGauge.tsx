import React from 'react';
import { RiskGrade, RiskLevel, ScorePillarBreakdown } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface ScoreGaugeProps {
  score: number; // 300 - 900
  grade: RiskGrade;
  riskLevel: RiskLevel;
  confidenceScore: number;
  pillars: ScorePillarBreakdown;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  grade,
  riskLevel,
  confidenceScore,
  pillars
}) => {
  // Normalize score between 300 and 900 to 0 - 100%
  const normalized = Math.min(Math.max((score - 300) / 600, 0), 1);
  const strokeDashoffset = 280 - (280 * (normalized * 0.75)); // 270 deg arc

  const getScoreColor = () => {
    if (score >= 800) return { text: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-300', stroke: '#059669', label: 'Prime Marketable Title' };
    if (score >= 700) return { text: 'text-teal-700', bg: 'bg-teal-100', border: 'border-teal-300', stroke: '#0d9488', label: 'Good Marketable Title' };
    if (score >= 600) return { text: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300', stroke: '#d97706', label: 'Moderate Title Risk' };
    if (score >= 450) return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300', stroke: '#ea580c', label: 'High Risk / Pending Disputes' };
    return { text: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-300', stroke: '#e11d48', label: 'Critical Risk / Broken Title' };
  };

  const colorConfig = getScoreColor();

  const getPillarColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500 text-emerald-700';
    if (val >= 60) return 'bg-amber-500 text-amber-700';
    return 'bg-rose-500 text-rose-700';
  };

  return (
    <div id="bhuscore-gauge-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      {/* Background subtle tint */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: colorConfig.stroke }}
      />

      <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
        {/* Left: Score Dial */}
        <div className="flex flex-col items-center text-center relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 100 100">
              {/* Background Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="9"
                strokeDasharray="251.2"
                strokeDashoffset="62.8"
                strokeLinecap="round"
              />
              {/* Progress Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={colorConfig.stroke}
                strokeWidth="9"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (188.4 * normalized)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">BhuScore</span>
              <span className={`text-4xl font-extrabold font-mono tracking-tight ${colorConfig.text}`}>
                {score}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border}`}>
                  Grade {grade}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-medium">Scale 300 – 900</span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <div className="text-sm font-bold text-slate-900">{colorConfig.label}</div>
            <div className="text-xs text-slate-600 flex items-center justify-center gap-1 mt-0.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matching Confidence: <strong className="text-slate-900">{confidenceScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* Right: 6-Pillar Risk Radar Breakdown */}
        <div className="w-full flex-1 max-w-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              6-Pillar Credit & Risk Clearance
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Weighted Bureau Score Model</span>
          </div>

          <div className="space-y-2.5">
            {/* Title Lineage */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">1. Title Lineage & Succession (30%)</span>
                <span className="font-mono text-slate-900 font-bold">{pillars.titleIntegrity}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div 
                  className={`h-full transition-all duration-700 ${getPillarColor(pillars.titleIntegrity).split(' ')[0]}`}
                  style={{ width: `${pillars.titleIntegrity}%` }}
                />
              </div>
            </div>

            {/* Encumbrance & CERSAI */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">2. CERSAI & Banking Charges (25%)</span>
                <span className="font-mono text-slate-900 font-bold">{pillars.encumbranceRisk}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div 
                  className={`h-full transition-all duration-700 ${getPillarColor(pillars.encumbranceRisk).split(' ')[0]}`}
                  style={{ width: `${pillars.encumbranceRisk}%` }}
                />
              </div>
            </div>

            {/* Litigation & NJDG */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">3. eCourts Litigation Clearance (25%)</span>
                <span className="font-mono text-slate-900 font-bold">{pillars.litigationClearance}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div 
                  className={`h-full transition-all duration-700 ${getPillarColor(pillars.litigationClearance).split(' ')[0]}`}
                  style={{ width: `${pillars.litigationClearance}%` }}
                />
              </div>
            </div>

            {/* Zoning & Buffer Compliance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">4. Zoning, Masterplan & Buffer (10%)</span>
                <span className="font-mono text-slate-900 font-bold">{pillars.zoningBufferCompliance}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div 
                  className={`h-full transition-all duration-700 ${getPillarColor(pillars.zoningBufferCompliance).split(' ')[0]}`}
                  style={{ width: `${pillars.zoningBufferCompliance}%` }}
                />
              </div>
            </div>

            {/* Land Acquisition Immunity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">5. Public Acquisition Immunity (5%)</span>
                <span className="font-mono text-slate-900 font-bold">{pillars.acquisitionImmunity}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div 
                  className={`h-full transition-all duration-700 ${getPillarColor(pillars.acquisitionImmunity).split(' ')[0]}`}
                  style={{ width: `${pillars.acquisitionImmunity}%` }}
                />
              </div>
            </div>

            {/* Revenue & Tax Clearances */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">6. Revenue Taxes & Cess (5%)</span>
                <span className="font-mono text-slate-900 font-bold">{pillars.revenueTaxClearance}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div 
                  className={`h-full transition-all duration-700 ${getPillarColor(pillars.revenueTaxClearance).split(' ')[0]}`}
                  style={{ width: `${pillars.revenueTaxClearance}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
