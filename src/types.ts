export type RiskGrade = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'D' | 'F';

export type RiskLevel = 'CLEAN' | 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';

export type LandUseZoning = 
  | 'Residential (R1/R2)' 
  | 'Commercial (C1/C2)' 
  | 'Industrial (I-Zone)' 
  | 'Agricultural (Dry/Wet)' 
  | 'Green Belt / Buffer' 
  | 'Public & Semi-Public (PSP)' 
  | 'Special Economic Zone (SEZ)';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface ParcelBoundary {
  type: 'Polygon';
  coordinates: GeoCoordinate[];
  centroid: GeoCoordinate;
  adjacentSurveys: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  totalAreaSqFt: number;
  totalAreaAcres: number;
  extentGuntas?: number;
}

export interface OwnershipTransfer {
  id: string;
  year: number;
  date: string;
  transferType: 'Sale Deed' | 'Partition Deed' | 'Gift Deed' | 'Inheritance (Virasat)' | 'Court Decree' | 'Government Grant' | 'Relinquishment';
  fromParty: string;
  toParty: string;
  registeredNumber: string;
  subRegistrarOffice: string;
  mutationNumber: string;
  mutationDate: string;
  mutationStatus: 'Sanctioned & Certified' | 'Disputed' | 'Pending' | 'Rejected';
  considerationAmountInr?: number;
  remarks: string;
  documentConfidence: number; // percentage
  hasGapFlag?: boolean;
}

export interface EncumbranceCharge {
  id: string;
  cersaiSecurityId: string;
  financialInstitution: string;
  branch: string;
  chargeType: 'Equitable Mortgage' | 'Registered Mortgage' | 'Hypothecation' | 'Statutory Lien' | 'Court Attachment';
  borrowerName: string;
  sanctionAmountInr: number;
  chargeCreationDate: string;
  status: 'ACTIVE_ENCUMBERED' | 'SATISFIED_NOC_FILED' | 'UNDER_DRT_RECOVERY' | 'DISPUTED_CHARGE';
  satisfactionDate?: string;
  drtCaseRef?: string;
  remarks: string;
}

export interface CourtLitigation {
  id: string;
  cnrNumber: string;
  courtName: string;
  courtLevel: 'Supreme Court' | 'High Court' | 'District & Sessions Court' | 'Civil Court Senior Division' | 'Debt Recovery Tribunal (DRT)' | 'Revenue Court / Tahsildar';
  caseType: string;
  caseNumber: string;
  filingYear: number;
  filingDate: string;
  petitioner: string;
  respondent: string;
  disputeCategory: 
    | 'Title & Ownership Declaration'
    | 'Partition & Separate Possession'
    | 'Injunction & Restraint on Alienation'
    | 'Specific Performance of Agreement to Sell'
    | 'SARFAESI Bank Recovery & Auction Challenge'
    | 'Land Acquisition Compensation Enhancement'
    | 'Revenue Mutation Appeal';
  currentStatus: 'PENDING_TRIAL' | 'INTERIM_STAY_GRANTED' | 'DISPOSED_DECREED' | 'DISPOSED_DISMISSED' | 'APPEAL_SUBMITTED';
  interimOrders?: string;
  nextHearingDate?: string;
  riskWeight: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'LOW';
  summary: string;
  source: 'eCourts Services' | 'NJDG' | 'High Court Portal' | 'DRT Registry' | 'Revenue Tribunal';
}

export interface PublicNotice {
  id: string;
  authority: string;
  noticeType: 
    | 'Land Acquisition Act Sec 4(1) Notification'
    | 'Land Acquisition Act Sec 6 Declaration'
    | 'NHAI Highway Right of Way Gazette'
    | 'Metro Rail Corridor Alignment'
    | 'Revenue Recovery Act Attachment'
    | 'SC/ST PTCL Act Non-Alienation Bar'
    | 'Rajakaluve / Stormwater Drain Encroachment'
    | 'Bank Auction Teaser Notice (Rule 8/9)';
  gazetteNumber: string;
  publishDate: string;
  affectedAreaAcres: number;
  status: 'ACTIVE_NOTIFICATION' | 'FINAL_AWARD_PASSED' | 'DENOTIFIED' | 'QUASHED_BY_HIGH_COURT';
  citationUrl?: string;
  details: string;
}

export interface RiskFlag {
  id: string;
  code: string;
  severity: 'CRITICAL_RED' | 'HIGH_AMBER' | 'MODERATE_YELLOW' | 'POSITIVE_GREEN';
  title: string;
  category: 'TITLE' | 'ENCUMBRANCE' | 'LITIGATION' | 'ZONING' | 'ACQUISITION' | 'MUTATION';
  description: string;
  sourceCitation: string;
  timestamp: string;
}

export interface ScorePillarBreakdown {
  titleIntegrity: number; // Max 100
  encumbranceRisk: number; // Max 100
  litigationClearance: number; // Max 100
  zoningBufferCompliance: number; // Max 100
  acquisitionImmunity: number; // Max 100
  revenueTaxClearance: number; // Max 100
}

export interface LandParcelProfile {
  id: string;
  ulpin: string; // Unique Land Parcel Identification Number (Bhu-Aadhaar)
  stateSurveyNo: string;
  hissaSubDivision: string;
  pattaKhataNo: string;
  villageName: string;
  talukTehsil: string;
  district: string;
  state: string;
  pincode: string;
  currentOwnerName: string;
  currentOwnerFatherName?: string;
  ownershipType: 'Individual Freehold' | 'Joint Family / Coparcenary' | 'Corporate Commercial' | 'Government Leased' | 'Trust / Wakf';
  rorRegistrySource: string; // e.g., "Bhoomi Karnataka", "Dharani TS", "Mahabhulekh 7/12"
  zoning: LandUseZoning;
  boundary: ParcelBoundary;
  bhuScore: number; // 300 - 900
  grade: RiskGrade;
  riskLevel: RiskLevel;
  verdictSummary: string;
  pillars: ScorePillarBreakdown;
  flags: RiskFlag[];
  ownershipChain: OwnershipTransfer[];
  encumbrances: EncumbranceCharge[];
  litigationHistory: CourtLitigation[];
  publicNotices: PublicNotice[];
  lastUpdated: string;
  recordVerificationHash: string;
  matchingConfidenceScore: number; // e.g. 98.6%
}

export interface ParcelAlertEvent {
  id: string;
  parcelId: string;
  ulpin: string;
  surveyNo: string;
  location: string;
  eventType: 'NEW_REGISTRATION' | 'NEW_CERSAI_MORTGAGE' | 'NEW_COURT_SUIT' | 'MUTATION_STATUS_CHANGE' | 'PUBLIC_GAZETTE_NOTICE' | 'TAX_DEFAULT';
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  title: string;
  description: string;
  sourceRegistry: string;
  timestamp: string;
  isRead: boolean;
  notifiedChannels: {
    email: boolean;
    push: boolean;
    webhook: boolean;
  };
}

export interface WatchlistSubscription {
  id: string;
  parcelId: string;
  ulpin: string;
  surveyNo: string;
  village: string;
  state: string;
  currentScore: number;
  riskGrade: RiskGrade;
  subscribedAt: string;
  alertOnLitigation: boolean;
  alertOnMortgage: boolean;
  alertOnRegistration: boolean;
  alertOnPublicNotice: boolean;
  notificationEmail: string;
  webhookUrl?: string;
  status: 'ACTIVE' | 'PAUSED';
}

export interface AiLegalOpinionRequest {
  parcelId: string;
  targetLoanAmountInr?: number;
  loanType?: 'Home Loan' | 'Commercial Project Construction' | 'LAP (Loan Against Property)' | 'Direct Land Acquisition';
  customLegalQuery?: string;
  customDocumentSnippet?: string;
}

export interface AiLegalOpinionResponse {
  opinionSummary: string;
  lawyerVerdict: 'TITLE_MARKETABLE_FIT_FOR_MORTGAGE' | 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS' | 'REJECT_UNMARKETABLE_TITLE';
  confidenceScore: number;
  keyLegalRisks: string[];
  recommendedConditionsPrecedent: string[];
  chainOfTitleAnalysis: string;
  courtDisputeImpact: string;
  encumbranceImpact: string;
  acquisitionVulnerability: string;
  statutoryIndemnityClauses: string[];
  generatedAt: string;
}
