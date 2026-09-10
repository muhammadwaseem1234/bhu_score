import React, { useState } from 'react';
import { Database, Cpu, HardDrive, ShieldCheck, ArrowRight, Layers, RefreshCw, FileText, CheckCircle2, Zap, Share2 } from 'lucide-react';

export const EntityMatchingVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      id: 0,
      title: '1. Multi-Registry Ingestion & ETL',
      subtitle: 'Bhoomi • Dharani • eCourts • NJDG • CERSAI • SVAMITVA',
      description: 'Automated continuous ingestion of state land records, court CNR case files, CERSAI hypothecations, and SVAMITVA drone cadastral coordinates.',
      tech: ['OCR & Vernacular Normalization', 'Indic Script Transliteration', 'Court Order NLP Parsing', 'Cadastral Geocoding']
    },
    {
      id: 1,
      title: '2. Parcel Matching & Entity Resolution Engine',
      subtitle: 'ULPIN Keys • Spatial Geometry Intersect • AI Fuzzy Entity Resolution',
      description: 'Resolves conflicting spellings across English and regional scripts (e.g. Kannada, Marathi, Telugu), cross-matching court suit parties with Survey No. & ULPIN polygons.',
      tech: ['ULPIN 14-Digit Key Matching', 'Polygon Boundary Intersect', 'Fuzzy Levenshtein & Soundex', 'Coparcenary Heirs Graph']
    },
    {
      id: 2,
      title: '3. Parcel Profile Store (CIBIL for Land)',
      subtitle: 'Comprehensive Land Dossier with Real-Time Confidence Scores',
      description: 'Single-source-of-truth Land Credit File indexed by ULPIN + Geo-Polygon + State Survey Number with automated 30-year lineage, encumbrance register, and litigation dossier.',
      tech: ['BhuScore 300-900 Algorithm', '6-Pillar Risk Engine', 'Tamper-Evident SHA256 Hash', 'Confidence Calibration (98.9%)']
    },
    {
      id: 3,
      title: '4. Risk APIs & 24/7 Automated Alerts',
      subtitle: 'Webhook Triggers • Email / Push Notifications • Batch Underwriting API',
      description: 'Real-time alert dispatch to lenders, NBFCs, and law firms upon any fresh suit filing in eCourts, new CERSAI mortgage, or revenue mutation attempt.',
      tech: ['Sub-Second Webhooks', 'Automated Email & Push Engine', 'Bank Core Integration', 'Title Due-Diligence PDF Export']
    }
  ];

  return (
    <div id="data-architecture-pipeline" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">National Land Ingestion & AI Entity Resolution Pipeline</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Architectural implementation solving India's presumptive title challenge & parcel-level court matching
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Pipeline Live (1.2M+ Ingested Deeds)
          </span>
        </div>
      </div>

      {/* Interactive Flow Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(idx)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
              activeStep === idx 
                ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                activeStep === idx ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
              }`}>
                Step 0{idx + 1}
              </span>
              {activeStep === idx && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>

            <div className="font-bold text-xs text-slate-900 mb-1">{s.title}</div>
            <div className="text-[11px] text-slate-600 line-clamp-2">{s.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Active Step Deep-Dive Box */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-sm font-bold text-emerald-800">
            {steps[activeStep].title} — <span className="text-slate-700 font-medium">{steps[activeStep].subtitle}</span>
          </h4>
          <span className="text-xs text-slate-500 font-medium">Deep Ingestion Spec</span>
        </div>

        <p className="text-xs text-slate-700 mb-4 leading-relaxed font-medium">
          {steps[activeStep].description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {steps[activeStep].tech.map((t, idx) => (
            <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-800 font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ingestion Source Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="font-bold text-slate-900">Land Records</div>
          <div className="text-[11px] text-slate-600 mt-0.5">Bhoomi • Dharani • Mahabhulekh • AnyRoR</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="font-bold text-slate-900">Court Litigation</div>
          <div className="text-[11px] text-slate-600 mt-0.5">eCourts • NJDG • High Courts • DRT</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="font-bold text-slate-900">Banking Charges</div>
          <div className="text-[11px] text-slate-600 mt-0.5">CERSAI National Registry • Sub-Registrar EC</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="font-bold text-slate-900">Cadastral & GIS</div>
          <div className="text-[11px] text-slate-600 mt-0.5">SVAMITVA • ULPIN Bhu-Aadhaar • KSRSAC</div>
        </div>
      </div>
    </div>
  );
};
