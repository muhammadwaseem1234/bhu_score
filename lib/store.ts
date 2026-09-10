import { GoogleGenAI } from '@google/genai';
import { INITIAL_PARCELS, INITIAL_ALERTS, INITIAL_WATCHLIST } from '../src/data/mockParcels';
import { LandParcelProfile, ParcelAlertEvent, WatchlistSubscription, AiLegalOpinionResponse } from '../src/types';

// In-memory persistent state across Next.js API requests
interface GlobalStore {
  parcels: LandParcelProfile[];
  alerts: ParcelAlertEvent[];
  watchlist: WatchlistSubscription[];
}

const globalForStore = globalThis as unknown as {
  bhuScoreStore?: GlobalStore;
};

export const store: GlobalStore = globalForStore.bhuScoreStore ?? {
  parcels: [...INITIAL_PARCELS],
  alerts: [...INITIAL_ALERTS],
  watchlist: [...INITIAL_WATCHLIST],
};

if (process.env.NODE_ENV !== 'production') {
  globalForStore.bhuScoreStore = store;
}

// Gemini AI client initialization
let aiClient: GoogleGenAI | null = null;
export function getGeminiAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export function generateFallbackLegalOpinion(parcel: LandParcelProfile): AiLegalOpinionResponse {
  const isClean = parcel.riskLevel === 'CLEAN';
  const isCritical = parcel.riskLevel === 'CRITICAL_RISK';
  const hasLitigation = parcel.litigationHistory.length > 0;
  const hasActiveEncumbrance = parcel.encumbrances.some(
    (e) => e.status === 'ACTIVE_ENCUMBERED' || e.status === 'UNDER_DRT_RECOVERY'
  );

  let verdict: 'TITLE_MARKETABLE_FIT_FOR_MORTGAGE' | 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS' | 'REJECT_UNMARKETABLE_TITLE' =
    'TITLE_MARKETABLE_FIT_FOR_MORTGAGE';
  if (isCritical || (hasLitigation && parcel.litigationHistory.some((l) => l.riskWeight === 'CRITICAL'))) {
    verdict = 'REJECT_UNMARKETABLE_TITLE';
  } else if (hasLitigation || hasActiveEncumbrance || parcel.riskLevel === 'MODERATE_RISK' || parcel.riskLevel === 'HIGH_RISK') {
    verdict = 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS';
  }

  return {
    opinionSummary: isClean
      ? `Upon comprehensive search of the Sub-Registrar records, Revenue Pahani/RTC entries in ${parcel.rorRegistrySource}, and National Judicial Data Grid (NJDG), the title of ${parcel.currentOwnerName} over Survey No. ${parcel.stateSurveyNo} is found to be clean, clear, marketable, and free from any subsisting legal encumbrances.`
      : isCritical
      ? `CAUTION / REJECTION ADVISORY: The subject property Survey No. ${parcel.stateSurveyNo} bears severe statutory and judicial liabilities including active recovery proceedings and subordinate charges. Title is currently non-marketable for fresh credit underwriting.`
      : `The title over Survey No. ${parcel.stateSurveyNo} exhibits substantial prima-facie validity but requires strict Conditions Precedent (CPs) prior to loan disbursement due to pending partition issues or unreleased charges.`,
    lawyerVerdict: verdict,
    confidenceScore: parcel.matchingConfidenceScore || 96.5,
    keyLegalRisks: parcel.flags.map((f) => `[${f.category}] ${f.title}: ${f.description}`),
    recommendedConditionsPrecedent: isClean
      ? [
          'Deposit of original title deed and parent documents with the Bank under Section 58(f) of Transfer of Property Act, 1882.',
          'Obtain latest Encumbrance Certificate (Form 15/16) up to the date of mortgage registration.',
          'Registration of Security Interest in CERSAI within 30 days of sanction.',
          'Declaration on oath by borrower regarding vacant, peaceful physical possession.',
        ]
      : [
          'Certified copy of complete order sheet in pending suit / DRT proceedings to be vetted by panel advocate.',
          'Obtain Registered Relinquishment / Release Deed from all surviving class-I coparceners / sisters.',
          'Prior NOC and satisfaction certificate from existing charge holder registered in CERSAI.',
          'Public notice publication in two leading newspapers (one English, one vernacular) inviting claims within 14 days.',
        ],
    chainOfTitleAnalysis: `Title traced for ${
      parcel.ownershipChain.length > 0 ? new Date().getFullYear() - parcel.ownershipChain[0].year : 30
    } years through ${parcel.ownershipChain.length} registered devolution steps. Mutation entries in ${parcel.rorRegistrySource} correspond with registered instruments.`,
    courtDisputeImpact: hasLitigation
      ? `Subject to ${parcel.litigationHistory.length} active litigation matters in eCourts. Pending interim orders must be strictly monitored via BhuScore Bureau Watchlist.`
      : 'Zero civil, criminal, or debt recovery proceedings indexed in National Judicial Data Grid for this survey number or owner.',
    encumbranceImpact: hasActiveEncumbrance
      ? 'Active CERSAI charge detected. Creation of subordinate charge requires explicit No-Objection from first charge holder.'
      : 'No subsisting mortgages or court attachments. Prior charges stand lawfully discharged.',
    acquisitionVulnerability:
      parcel.publicNotices.length > 0
        ? `Subject to gazette notifications issued by ${parcel.publicNotices.map((p) => p.authority).join(', ')}.`
        : 'Nil government acquisition gazettes under RFCTLARR Act 2013 or NHAI/Metro master plan corridors.',
    statutoryIndemnityClauses: [
      'Indemnity against any claims by undisclosed legal heirs under Hindu Succession Act.',
      'Undertaking to pay all statutory revenue cesses, conversion fees, and municipal property taxes on demand.',
    ],
    generatedAt: new Date().toISOString(),
  };
}
