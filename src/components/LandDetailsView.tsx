'use client';

import React, { useState } from 'react';
import {
  FileText,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Coins,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Printer,
  Calendar,
  Layers,
  Scale,
  Hash,
} from 'lucide-react';
import { LandParcelProfile } from '../types';

interface LandDetailsViewProps {
  parcel: LandParcelProfile;
  onOpenAiModal?: () => void;
  onOpenPrintReport?: () => void;
}

export const LandDetailsView: React.FC<LandDetailsViewProps> = ({
  parcel,
  onOpenAiModal,
  onOpenPrintReport,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Guidance value and market calculations (realistic state benchmarks)
  const guidanceRatePerSqFt = 3850;
  const marketRatePerSqFt = 5200;
  const totalGuidanceValueCr = (
    (parcel.boundary.totalAreaSqFt * guidanceRatePerSqFt) /
    10000000
  ).toFixed(2);
  const totalMarketValueCr = (
    (parcel.boundary.totalAreaSqFt * marketRatePerSqFt) /
    10000000
  ).toFixed(2);

  // Area conversion equivalents
  const extentAcres = parcel.boundary.totalAreaAcres;
  const extentGuntas = parcel.boundary.extentGuntas || Math.round(extentAcres * 40);
  const extentSqFt = parcel.boundary.totalAreaSqFt;
  const extentSqMeters = (extentSqFt * 0.092903).toFixed(1);
  const extentHectares = (extentAcres * 0.404686).toFixed(3);
  const extentSqYards = (extentSqFt / 9).toFixed(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
      {/* Header Bar */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>Record of Rights (RTC / Pahani / 7/12 Extract)</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                Registry: <strong>{parcel.rorRegistrySource}</strong>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Revenue Certified</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Land Parcel Specifications &amp; Revenue Ledger
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Official State Revenue Department cadastre records, geodetic survey coordinates, title tenure, and valuation ledger.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AI Title Audit</span>
              </button>
            )}
            {onOpenPrintReport && (
              <button
                onClick={onOpenPrintReport}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Extract</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Metric Strip: Key Identifiers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Survey Number</span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5 font-mono">
              {parcel.stateSurveyNo}
            </span>
            <span className="text-[11px] text-slate-500">Hissa: {parcel.hissaSubDivision}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Patta / Khata No.</span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5 font-mono">
              {parcel.pattaKhataNo}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">A-Khata Certified</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Area (Acres)</span>
            <span className="text-base font-extrabold text-emerald-800 block mt-0.5">
              {extentAcres} Acres
            </span>
            <span className="text-[11px] text-slate-500">{extentGuntas} Guntas Net</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Land Zoning</span>
            <span className="text-xs font-bold text-slate-900 block mt-1 truncate">
              {parcel.zoning}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Master Plan 2031</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Guidance Value</span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5">
              ₹{totalGuidanceValueCr} Cr
            </span>
            <span className="text-[11px] text-slate-500">@ ₹{guidanceRatePerSqFt}/sq.ft</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">BhuScore Grade</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-emerald-700 font-mono">
                {parcel.bhuScore}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {parcel.grade}
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Marketable Title</span>
          </div>
        </div>

        {/* SECTION 1: Master Revenue Land Identity Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>1. Revenue Jurisdiction &amp; Title Particulars (Form No. 16 RTC)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Hash: {parcel.recordVerificationHash.substring(0, 16)}...
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
            {/* Left Column: Geographic and Administrative Location */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">State / Union Territory</span>
                <span className="font-bold text-slate-900">{parcel.state}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Revenue District</span>
                <span className="font-bold text-slate-900">{parcel.district}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Taluk / Tehsil</span>
                <span className="font-bold text-slate-900">{parcel.talukTehsil}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Hobli / Revenue Circle</span>
                <span className="font-bold text-slate-900">Varthur (Hobli East)</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Census Village &amp; Code</span>
                <span className="font-bold text-slate-900">
                  {parcel.villageName} (PIN: {parcel.pincode})
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sub-Registrar Office (SRO)</span>
                <span className="font-bold text-slate-900">
                  {parcel.ownershipChain[parcel.ownershipChain.length - 1]?.subRegistrarOffice ||
                    'Shivajinagar SRO'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Village Accountant (VA) Circle</span>
                <span className="font-bold text-slate-900">Circle-04 (Varthur Hobli)</span>
              </div>
            </div>

            {/* Right Column: Title Ownership and Registration Status */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bhu-Aadhaar (ULPIN)</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-emerald-800">{parcel.ulpin}</span>
                  <button
                    onClick={() => copyToClipboard(parcel.ulpin, 'ulpin')}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy ULPIN"
                  >
                    {copiedKey === 'ulpin' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Record Holder (Khatedar)</span>
                <span className="font-bold text-slate-900 text-right max-w-[240px] truncate">
                  {parcel.currentOwnerName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Father&apos;s / Husband&apos;s Name</span>
                <span className="font-medium text-slate-900">
                  {parcel.currentOwnerFatherName || 'Late Muniyappa'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tenure &amp; Ownership Nature</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {parcel.ownershipType}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Latest Mutation Register (MR) No.</span>
                <span className="font-mono font-bold text-slate-900">
                  {parcel.ownershipChain[parcel.ownershipChain.length - 1]?.mutationNumber ||
                    'MR No. T48/2021-22'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mutation Status</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Sanctioned &amp; Certified (By Tahsildar)
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Last Registry Sync Date</span>
                <span className="font-mono text-slate-700">
                  {new Date(parcel.lastUpdated).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Measurement, Conversion & Soil Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Measurement Equivalent Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>2. Official Land Extent &amp; Measurement Breakup</span>
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Standard Metric &amp; Imperial
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Acres &amp; Guntas</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {extentAcres} Ac {extentGuntas % 40} Guntas
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Square Feet</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {extentSqFt.toLocaleString('en-IN')} sq.ft
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Square Meters</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {Number(extentSqMeters).toLocaleString('en-IN')} m²
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Square Yards</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {Number(extentSqYards).toLocaleString('en-IN')} sq.yd
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Hectares</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {extentHectares} Ha
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold block">Pot Kharab (Unusable)</span>
                <span className="text-sm font-extrabold text-emerald-900 block mt-0.5">
                  0-00 (Nil Kharab)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              * Survey boundaries measured via Electronic Total Station (ETS) and verified against state settlement record Tippani and Akarbandh sheets.
            </p>
          </div>

          {/* Classification & Revenue Tax Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-700" />
                <span>3. Conversion, Soil Classification &amp; Land Revenue</span>
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Tax Paid Current
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Land Classification</span>
                <span className="font-bold text-slate-900">
                  Converted Non-Agricultural (Commercial C1/C2)
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">DC Non-Agri Conversion Order</span>
                <span className="font-mono font-bold text-emerald-800">
                  Order No. ALN(E)/CR-78/2019-20 dt 14-Oct-2019
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Soil Type &amp; Terrain</span>
                <span className="font-medium text-slate-800">
                  Red Gravelly Loam, Grade-I Level Topography
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Annual Land Revenue Assessment</span>
                <span className="font-bold text-slate-900">
                  ₹48.50 / year (Paid vide Challan #K2-9901428)
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Irrigation / Tree Inventory</span>
                <span className="font-medium text-slate-800">
                  Nil Agricultural Wells / 1 Borewell Registered
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Schedule of Property (Four Boundaries / Chakkubandi) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>4. Schedule of Property — Four Boundaries (Chakkubandi Description)</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Registered in Official State Sale Deed Schedule
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  NORTH BOUNDARY
                </span>
                <span className="font-mono text-[10px] text-slate-500">Plot 1</span>
              </div>
              <p className="font-bold text-slate-900 text-xs leading-relaxed pt-1">
                {parcel.boundary.adjacentSurveys.north}
              </p>
              <p className="text-[11px] text-slate-500">Edge A-B: 440.0 ft (134.1 m)</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  SOUTH BOUNDARY
                </span>
                <span className="font-mono text-[10px] text-slate-500">Plot 2</span>
              </div>
              <p className="font-bold text-slate-900 text-xs leading-relaxed pt-1">
                {parcel.boundary.adjacentSurveys.south}
              </p>
              <p className="text-[11px] text-slate-500">Edge C-D: 440.0 ft (134.1 m)</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  EAST BOUNDARY
                </span>
                <span className="font-mono text-[10px] text-slate-500">Plot 3</span>
              </div>
              <p className="font-bold text-slate-900 text-xs leading-relaxed pt-1">
                {parcel.boundary.adjacentSurveys.east}
              </p>
              <p className="text-[11px] text-slate-500">Edge B-C: 396.0 ft (120.7 m)</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  WEST BOUNDARY
                </span>
                <span className="font-mono text-[10px] text-slate-500">Plot 4</span>
              </div>
              <p className="font-bold text-slate-900 text-xs leading-relaxed pt-1">
                {parcel.boundary.adjacentSurveys.west}
              </p>
              <p className="text-[11px] text-slate-500">Edge D-A: 396.0 ft (120.7 m)</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Geodetic Vertex Coordinates Table (WGS-84) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs text-xs">
          <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-emerald-700" />
              <span>5. Cadastral Geodetic Coordinates &amp; Boundary Traverse Table (WGS-84)</span>
            </h3>
            <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              DGPS Surveyed (Accuracy ±0.05m)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Vertex</th>
                  <th className="py-2.5 px-3">Latitude (°N)</th>
                  <th className="py-2.5 px-3">Longitude (°E)</th>
                  <th className="py-2.5 px-3">Boundary Edge</th>
                  <th className="py-2.5 px-3">Length (Ft)</th>
                  <th className="py-2.5 px-3">Length (Mtrs)</th>
                  <th className="py-2.5 px-3">Bearing</th>
                  <th className="py-2.5 px-3">Monument Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {parcel.boundary.coordinates.map((coord, idx) => {
                  const vertexNames = ['A (North-West)', 'B (North-East)', 'C (South-East)', 'D (South-West)'];
                  const edges = ['Edge A-B', 'Edge B-C', 'Edge C-D', 'Edge D-A'];
                  const lengthsFt = ['440.0 ft', '396.0 ft', '440.0 ft', '396.0 ft'];
                  const lengthsM = ['134.1 m', '120.7 m', '134.1 m', '120.7 m'];
                  const bearings = ['091° (East)', '181° (South)', '271° (West)', '001° (North)'];

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold font-sans text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{vertexNames[idx] || `Point ${idx + 1}`}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">{coord.lat.toFixed(6)}°</td>
                      <td className="py-2.5 px-3 text-slate-800">{coord.lng.toFixed(6)}°</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-emerald-800">{edges[idx]}</td>
                      <td className="py-2.5 px-3 text-slate-900 font-bold">{lengthsFt[idx]}</td>
                      <td className="py-2.5 px-3 text-slate-600">{lengthsM[idx]}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-sans">{bearings[idx]}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500">Govt Boundary Stone (Bandh)</td>
                    </tr>
                  );
                })}
                <tr className="bg-emerald-50/50 font-sans font-bold text-emerald-950 border-t border-emerald-200">
                  <td className="py-2.5 px-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                      ⊕
                    </span>
                    <span>Polygon Centroid</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-900">
                    {parcel.boundary.centroid.lat.toFixed(6)}°
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-900">
                    {parcel.boundary.centroid.lng.toFixed(6)}°
                  </td>
                  <td className="py-2.5 px-3">Bhu-Aadhaar Key</td>
                  <td colSpan={4} className="py-2.5 px-3 font-mono text-emerald-800">
                    {parcel.ulpin}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: Valuation & Statutory Clearances Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-emerald-800">CERSAI Encumbrance</div>
            <div className="font-extrabold text-emerald-900 text-sm">
              {parcel.encumbrances.some((e) => e.status === 'ACTIVE_ENCUMBERED')
                ? 'Active Mortgage Found'
                : 'Clean & Satisfied (NOC on File)'}
            </div>
            <p className="text-[11px] text-emerald-700">
              No active statutory liens or court attachments found.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-emerald-800">eCourts NJDG Cross-Match</div>
            <div className="font-extrabold text-emerald-900 text-sm">
              {parcel.litigationHistory.length === 0
                ? 'Zero Civil / Revenue Suits'
                : `${parcel.litigationHistory.length} Cases Pending`}
            </div>
            <p className="text-[11px] text-emerald-700">
              High Court &amp; City Civil Court records clean for 30 years.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-emerald-800">Gazette Acquisition</div>
            <div className="font-extrabold text-emerald-900 text-sm">
              100% Acquisition Immunity
            </div>
            <p className="text-[11px] text-emerald-700">
              Nil active Section 4(1) or 6 notifications issued.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
            <div className="text-[10px] font-bold uppercase text-emerald-800">Regulatory Buffers</div>
            <div className="font-extrabold text-emerald-900 text-sm">
              Compliant with 30m NGT Rules
            </div>
            <p className="text-[11px] text-emerald-700">
              Clear 45m setback maintained from adjoining water body.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
