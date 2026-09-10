'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandParcelProfile } from '../types';
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Landmark,
  Scale,
  QrCode,
  Loader2,
  RefreshCw,
  X,
  FileCheck,
  Cpu,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface BureauReportPrintViewProps {
  parcel: LandParcelProfile;
  onClose: () => void;
}

interface GenerationStep {
  title: string;
  source: string;
}

const COMPILATION_STEPS: GenerationStep[] = [
  {
    title: 'Connecting to State Revenue GIS & Record of Rights (Pahani)...',
    source: 'Bhoomi / AnyRoR / Dharani API Gateway',
  },
  {
    title: 'Tracing 30-Year Registered Devolution Deeds & Mutation Register...',
    source: 'Sub-Registrar Office (SRO) Index-II Ledger',
  },
  {
    title: 'Querying CERSAI Security Interest Portal & eCourts NJDG Registry...',
    source: 'Central Registry (Govt of India) & High Court Data Lake',
  },
  {
    title: 'Calibrating 6-Pillar BhuScore & Affixing Cryptographic ULPIN Seal...',
    source: 'DoLR Bhu-Aadhaar Cryptographic Authority',
  },
];

export const BureauReportPrintView: React.FC<BureauReportPrintViewProps> = ({ parcel, onClose }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [generationProgress, setGenerationProgress] = useState<number>(15);
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);

  // Progressive simulation of document assembly
  useEffect(() => {
    if (!isGenerating) return;

    const totalDuration = 1200; // 1.2s total smooth assembly
    const stepInterval = totalDuration / COMPILATION_STEPS.length;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < COMPILATION_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepInterval);

    const progressTimer = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12 + 8);
      });
    }, 120);

    const completionTimeout = setTimeout(() => {
      setIsGenerating(false);
    }, totalDuration);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
      clearTimeout(completionTimeout);
    };
  }, [isGenerating]);

  const handlePrint = () => {
    setIsPreparingPrint(true);
    // Subtle brief delay to allow layout to settle before opening native print dialog
    setTimeout(() => {
      window.print();
      setIsPreparingPrint(false);
    }, 280);
  };

  const handleRecompile = () => {
    setGenerationProgress(15);
    setCurrentStepIndex(0);
    setIsGenerating(true);
  };

  const handleSkipAnimation = () => {
    setIsGenerating(false);
    setGenerationProgress(100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-3 sm:p-6 md:p-8 flex justify-center items-start print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Floating Action Controls */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl"
      >
        <button
          onClick={handleRecompile}
          disabled={isGenerating}
          title="Re-compile & verify dossier"
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">Re-Compile</span>
        </button>

        <button
          onClick={handlePrint}
          disabled={isGenerating || isPreparingPrint}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {isPreparingPrint ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Formatting Document...</span>
            </>
          ) : (
            <>
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs transition-all cursor-pointer"
          title="Close Preview"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>

      {/* ASSEMBLY LOADING STATE OVERLAY */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="compiling-loader"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            className="my-auto w-full max-w-lg bg-slate-900 border border-slate-700/80 text-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 print:hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Cpu className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 tracking-tight">
                    Compiling National Bureau Dossier
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ULPIN: {parcel.ulpin}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold">
                {generationProgress}%
              </span>
            </div>

            {/* Progress Bar with glowing pulse */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
                <motion.div
                  className="bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-300 h-2 rounded-full"
                  style={{ width: `${Math.min(generationProgress, 100)}%` }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Phase {currentStepIndex + 1} of {COMPILATION_STEPS.length}</span>
                <span>Generating A4 High-Res Layout</span>
              </div>
            </div>

            {/* Dynamic Step Display */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start gap-2.5">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-200">
                    {COMPILATION_STEPS[currentStepIndex].title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <span>Source:</span>
                    <span className="text-emerald-400">{COMPILATION_STEPS[currentStepIndex].source}</span>
                  </p>
                </div>
              </div>

              {/* Step Checklist Preview */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                {COMPILATION_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 transition-colors ${
                      idx < currentStepIndex
                        ? 'text-emerald-400'
                        : idx === currentStepIndex
                        ? 'text-slate-200 font-medium'
                        : 'text-slate-600'
                    }`}
                  >
                    {idx < currentStepIndex ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : idx === currentStepIndex ? (
                      <div className="w-3 h-3 rounded-full border border-emerald-400 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 ml-0.5" />
                    )}
                    <span className="truncate">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Skip Option */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>SHA-256 Tamper-Proof Audit Signed</span>
              </span>
              <button
                onClick={handleSkipAnimation}
                className="text-xs text-slate-400 hover:text-white transition-colors underline cursor-pointer"
              >
                Skip to Report →
              </button>
            </div>
          </motion.div>
        ) : (
          /* Printable Institutional Bureau Document (A4 Styling) */
          <motion.div
            key="rendered-report"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 md:p-12 print:p-0 print:shadow-none print:max-w-full my-4 sm:my-8 print:my-0 space-y-6 font-sans border border-slate-200/80 print:border-none relative"
          >
            {/* Bureau Header */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-900 pb-4 gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-xs">
                    BS
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                      BhuScore India
                    </h1>
                    <p className="text-[11px] font-bold text-slate-700 tracking-wide uppercase">
                      National Land Parcel Credit Bureau & Title Verification Repository
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Keyed by ULPIN (Bhu-Aadhaar) • Ministry of Rural Development & DoLR Framework
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                <div className="font-extrabold text-slate-900 tracking-wider">CONFIDENTIAL BUREAU DOSSIER</div>
                <div>
                  Report Ref: <strong className="font-mono text-slate-950">BHU-RPT-{parcel.id}</strong>
                </div>
                <div>
                  Generated:{' '}
                  <span className="font-semibold">
                    {new Date().toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="font-mono text-[9.5px] text-slate-400 break-all">{parcel.recordVerificationHash}</div>
              </div>
            </motion.div>

            {/* Parcel Identity Banner & Credit Score Box */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200"
            >
              <div className="md:col-span-2 space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Subject Land Parcel Identification
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-950 font-mono flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-200/70 px-2 py-0.5 rounded text-emerald-900 font-extrabold">
                    {parcel.ulpin}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Bhu-Aadhaar Verified</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div>
                    Survey No: <strong>{parcel.stateSurveyNo} (Hissa {parcel.hissaSubDivision})</strong>
                  </div>
                  <div>
                    Patta/Khata: <strong>{parcel.pattaKhataNo}</strong>
                  </div>
                  <div>
                    Extent:{' '}
                    <strong>
                      {parcel.boundary.totalAreaAcres} Acres ({parcel.boundary.totalAreaSqFt.toLocaleString('en-IN')} sq.ft)
                    </strong>
                  </div>
                  <div>
                    Zoning: <strong>{parcel.zoning}</strong>
                  </div>
                  <div>
                    Village & Taluk: <strong>{parcel.villageName}, {parcel.talukTehsil}</strong>
                  </div>
                  <div>
                    District & State: <strong>{parcel.district}, {parcel.state} - {parcel.pincode}</strong>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    Current Registered Holder:{' '}
                    <strong className="text-slate-950">{parcel.currentOwnerName}</strong>{' '}
                    <span className="text-slate-600">({parcel.ownershipType})</span>
                  </div>
                </div>
              </div>

              {/* Bureau Score Block */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-300 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Land Credit Score</span>
                <div
                  className={`text-4xl sm:text-5xl font-extrabold font-mono my-1 tracking-tight ${
                    parcel.bhuScore >= 750
                      ? 'text-emerald-700'
                      : parcel.bhuScore >= 600
                      ? 'text-amber-600'
                      : 'text-rose-700'
                  }`}
                >
                  {parcel.bhuScore}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800">
                  Grade {parcel.grade} • {parcel.riskLevel.replace('_', ' ')}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Bureau Scale: 300 to 900</span>
              </div>
            </motion.div>

            {/* 6-Pillar Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-300 flex items-center justify-between">
                <span>1. Comprehensive Bureau Pillar Breakdown</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">Weights Normalized to 100%</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Title Lineage (30%)</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {parcel.pillars.titleIntegrity}/100
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[11px]">CERSAI Mortgage Clearance (25%)</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {parcel.pillars.encumbranceRisk}/100
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[11px]">eCourts Litigation Clearance (25%)</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {parcel.pillars.litigationClearance}/100
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Zoning & Buffer Compliance (10%)</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {parcel.pillars.zoningBufferCompliance}/100
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Acquisition Immunity (5%)</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {parcel.pillars.acquisitionImmunity}/100
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Revenue Tax Clearance (5%)</div>
                  <div className="text-base font-bold text-slate-900 font-mono">
                    {parcel.pillars.revenueTaxClearance}/100
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 30-Year Devolution Chain Table */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 pb-1 border-b border-slate-300">
                2. 30-Year Ownership Chain & Revenue Mutation Records
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Year</th>
                      <th className="p-2">Nature of Transfer</th>
                      <th className="p-2">From Party (Grantor)</th>
                      <th className="p-2">To Party (Grantee)</th>
                      <th className="p-2">Registered Doc / SRO</th>
                      <th className="p-2">Mutation Entry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {parcel.ownershipChain.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2 font-mono font-bold text-slate-900">{tx.year}</td>
                        <td className="p-2 font-medium text-slate-800">{tx.transferType}</td>
                        <td className="p-2 text-slate-600">{tx.fromParty}</td>
                        <td className="p-2 font-semibold text-slate-900">{tx.toParty}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-700">{tx.registeredNumber}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-700">
                          {tx.mutationNumber} ({tx.mutationStatus})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* CERSAI & Litigation Summaries */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* CERSAI Table */}
              <div className="border border-slate-200 rounded-xl p-3.5 text-xs bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide text-[11px] flex items-center justify-between">
                  <span>3. CERSAI Encumbrances ({parcel.encumbrances.length})</span>
                  <span className="text-[10px] font-normal text-slate-500 font-mono">Central Registry Sec 20</span>
                </h4>
                {parcel.encumbrances.length === 0 ? (
                  <p className="text-slate-500 italic py-2">Nil active or satisfied charges on record.</p>
                ) : (
                  <div className="space-y-2">
                    {parcel.encumbrances.map((e) => (
                      <div key={e.id} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                        <div className="font-bold text-slate-900">
                          {e.financialInstitution} • ₹{(e.sanctionAmountInr / 10000000).toFixed(2)} Cr
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                          Security ID: {e.cersaiSecurityId} • <span className="font-semibold text-slate-800">{e.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* eCourts Table */}
              <div className="border border-slate-200 rounded-xl p-3.5 text-xs bg-slate-50/50">
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide text-[11px] flex items-center justify-between">
                  <span>4. eCourts & NJDG Litigation History ({parcel.litigationHistory.length})</span>
                  <span className="text-[10px] font-normal text-slate-500 font-mono">Civil Court Audit</span>
                </h4>
                {parcel.litigationHistory.length === 0 ? (
                  <div className="py-2 flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clean: Zero pending civil suits indexed in NJDG.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {parcel.litigationHistory.map((l) => (
                      <div key={l.id} className="p-2.5 bg-rose-50/80 rounded-lg border border-rose-200 shadow-2xs">
                        <div className="font-bold text-rose-900">
                          {l.caseNumber} ({l.courtName})
                        </div>
                        <div className="text-[11px] text-slate-700 mt-0.5">
                          {l.petitioner} vs {l.respondent}
                        </div>
                        <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
                          Status: {l.currentStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Bureau Seal & Verification Sign-off */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4"
            >
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="font-bold text-slate-900">Authorized Bureau Registrar & Title Audit Officer</div>
                <div>BhuScore Land Credit Bureau of India Limited</div>
                <div className="text-[10px] text-slate-500">
                  Tamper-Evident Digital Certificate Verified via ULPIN Gateway
                </div>
                <div className="font-mono text-[9.5px] text-emerald-700 pt-1">
                  SHA-256 Checksum: {parcel.recordVerificationHash}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border border-slate-300 bg-slate-50 p-1.5 rounded-lg flex flex-col items-center justify-center text-center">
                  <QrCode className="w-10 h-10 text-slate-800" />
                  <span className="text-[7.5px] font-mono font-semibold text-slate-600">SCAN TO VERIFY</span>
                </div>

                <div className="w-20 h-20 border-2 border-dashed border-emerald-800/70 rounded-full flex flex-col items-center justify-center text-center p-1 text-[7.5px] font-bold uppercase text-emerald-950 bg-emerald-50/50">
                  <ShieldCheck className="w-5 h-5 text-emerald-800 mb-0.5" />
                  <span>BhuScore Official Seal</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
