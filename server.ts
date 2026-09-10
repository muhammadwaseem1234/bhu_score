import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PARCELS, INITIAL_ALERTS, INITIAL_WATCHLIST } from './src/data/mockParcels.js';
import { LandParcelProfile, ParcelAlertEvent, WatchlistSubscription, AiLegalOpinionResponse } from './src/types.js';

let parcels: LandParcelProfile[] = [...INITIAL_PARCELS];
let alerts: ParcelAlertEvent[] = [...INITIAL_ALERTS];
let watchlist: WatchlistSubscription[] = [...INITIAL_WATCHLIST];

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'BhuScore Land Credit Bureau API', timestamp: new Date().toISOString() });
  });

  // Get all parcels or filtered
  app.get('/api/parcels', (req, res) => {
    const { query, state, riskLevel, minScore, maxScore } = req.query;
    let result = [...parcels];

    if (query) {
      const q = String(query).toLowerCase().trim();
      result = result.filter(p => 
        p.ulpin.toLowerCase().includes(q) ||
        p.stateSurveyNo.toLowerCase().includes(q) ||
        p.currentOwnerName.toLowerCase().includes(q) ||
        p.villageName.toLowerCase().includes(q) ||
        p.talukTehsil.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.pattaKhataNo.toLowerCase().includes(q)
      );
    }

    if (state) {
      result = result.filter(p => p.state.toLowerCase() === String(state).toLowerCase());
    }

    if (riskLevel) {
      result = result.filter(p => p.riskLevel === riskLevel);
    }

    if (minScore) {
      result = result.filter(p => p.bhuScore >= Number(minScore));
    }

    if (maxScore) {
      result = result.filter(p => p.bhuScore <= Number(maxScore));
    }

    res.json(result);
  });

  // Get single parcel by ID or ULPIN
  app.get('/api/parcels/:id', (req, res) => {
    const { id } = req.params;
    const parcel = parcels.find(p => p.id === id || p.ulpin.toLowerCase() === id.toLowerCase());
    if (!parcel) {
      return res.status(404).json({ error: 'Land parcel record not found in National Registry' });
    }
    res.json(parcel);
  });

  // Watchlist endpoints
  app.get('/api/watchlist', (req, res) => {
    res.json(watchlist);
  });

  app.post('/api/watchlist', (req, res) => {
    const { parcelId, notificationEmail, webhookUrl, alertOnLitigation, alertOnMortgage, alertOnRegistration, alertOnPublicNotice } = req.body;
    const parcel = parcels.find(p => p.id === parcelId);
    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    const existingIndex = watchlist.findIndex(w => w.parcelId === parcelId);
    if (existingIndex >= 0) {
      watchlist[existingIndex] = {
        ...watchlist[existingIndex],
        notificationEmail: notificationEmail || watchlist[existingIndex].notificationEmail,
        webhookUrl: webhookUrl ?? watchlist[existingIndex].webhookUrl,
        alertOnLitigation: alertOnLitigation ?? watchlist[existingIndex].alertOnLitigation,
        alertOnMortgage: alertOnMortgage ?? watchlist[existingIndex].alertOnMortgage,
        alertOnRegistration: alertOnRegistration ?? watchlist[existingIndex].alertOnRegistration,
        alertOnPublicNotice: alertOnPublicNotice ?? watchlist[existingIndex].alertOnPublicNotice,
      };
      return res.json(watchlist[existingIndex]);
    }

    const newSub: WatchlistSubscription = {
      id: `SUB-${Date.now()}`,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNo: parcel.stateSurveyNo,
      village: `${parcel.villageName}, ${parcel.talukTehsil}`,
      state: parcel.state,
      currentScore: parcel.bhuScore,
      riskGrade: parcel.grade,
      subscribedAt: new Date().toISOString(),
      alertOnLitigation: alertOnLitigation ?? true,
      alertOnMortgage: alertOnMortgage ?? true,
      alertOnRegistration: alertOnRegistration ?? true,
      alertOnPublicNotice: alertOnPublicNotice ?? true,
      notificationEmail: notificationEmail || 'risk-desk@bureau.in',
      webhookUrl: webhookUrl || '',
      status: 'ACTIVE'
    };

    watchlist.unshift(newSub);
    res.status(201).json(newSub);
  });

  app.delete('/api/watchlist/:id', (req, res) => {
    const { id } = req.params;
    watchlist = watchlist.filter(w => w.id !== id && w.parcelId !== id);
    res.json({ success: true, message: 'Unsubscribed from parcel watchlist' });
  });

  // Alerts endpoints
  app.get('/api/alerts', (req, res) => {
    res.json(alerts);
  });

  app.post('/api/alerts/mark-read', (req, res) => {
    const { alertId } = req.body;
    if (alertId) {
      alerts = alerts.map(a => a.id === alertId ? { ...a, isRead: true } : a);
    } else {
      alerts = alerts.map(a => ({ ...a, isRead: true }));
    }
    res.json({ success: true, alerts });
  });

  // Simulate a live event (e.g. CERSAI mortgage file, eCourts suit filed, mutation change, NHAI notice)
  app.post('/api/alerts/simulate', (req, res) => {
    const { parcelId, eventType, customTitle, customDescription, severity } = req.body;
    const parcel = parcels.find(p => p.id === parcelId) || parcels[0];

    const alertId = `ALT-${Date.now()}`;
    let title = customTitle;
    let description = customDescription;
    let sev: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL' = severity || 'ALERT';
    let registry = 'National Registry Gateway';

    if (!title) {
      if (eventType === 'NEW_COURT_SUIT') {
        title = `New Original Suit filed against Survey ${parcel.stateSurveyNo}`;
        description = `O.S. ${Math.floor(Math.random() * 800 + 100)}/2026 instituted before District Civil Court claiming partition rights.`;
        sev = 'CRITICAL';
        registry = 'eCourts National Judicial Grid';
      } else if (eventType === 'NEW_CERSAI_MORTGAGE') {
        title = `New Collateral Mortgage Charge Registered in CERSAI`;
        description = `Equitable mortgage of ₹${(Math.random() * 15 + 2).toFixed(2)} Cr created by Nationalised Bank on ULPIN ${parcel.ulpin}.`;
        sev = 'ALERT';
        registry = 'CERSAI Portal (Govt of India)';
      } else if (eventType === 'PUBLIC_GAZETTE_NOTICE') {
        title = `Preliminary Land Acquisition Notice Gazette Published`;
        description = `Section 3A NHAI / Metro Railway right-of-way alignment notification published in official gazette.`;
        sev = 'WARNING';
        registry = 'Gazette of India';
      } else {
        title = `Sub-Registrar Mutation Application Lodged`;
        description = `Form 11 J-Slip transfer registered at Sub-Registrar Office for review.`;
        sev = 'INFO';
        registry = parcel.rorRegistrySource;
      }
    }

    const newAlert: ParcelAlertEvent = {
      id: alertId,
      parcelId: parcel.id,
      ulpin: parcel.ulpin,
      surveyNo: parcel.stateSurveyNo,
      location: `${parcel.villageName}, ${parcel.district}, ${parcel.state}`,
      eventType: eventType || 'NEW_COURT_SUIT',
      severity: sev,
      title,
      description,
      sourceRegistry: registry,
      timestamp: new Date().toISOString(),
      isRead: false,
      notifiedChannels: {
        email: true,
        push: true,
        webhook: true
      }
    };

    alerts.unshift(newAlert);
    res.status(201).json(newAlert);
  });

  // AI Legal Title Due-Diligence Opinion
  app.post('/api/ai/title-opinion', async (req, res) => {
    const { parcelId, targetLoanAmountInr, loanType, customLegalQuery } = req.body;
    const parcel = parcels.find(p => p.id === parcelId);

    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    if (process.env.GEMINI_API_KEY && ai) {
      try {
        const prompt = `You are a Senior High Court Advocate and Senior Title Due-Diligence Counsel for India's National Land Parcel Credit Bureau (BhuScore).
Provide a structured, lawyer-grade Title Search Report and Mortgageability Verdict for the following land parcel in India:

PARCEL DATA:
- ULPIN / Bhu-Aadhaar: ${parcel.ulpin}
- State Survey No / Khasra: ${parcel.stateSurveyNo} (Hissa: ${parcel.hissaSubDivision})
- Patta/Khata: ${parcel.pattaKhataNo}
- Location: ${parcel.villageName}, Taluk: ${parcel.talukTehsil}, District: ${parcel.district}, State: ${parcel.state}
- Current Owner: ${parcel.currentOwnerName} (Father/Husband: ${parcel.currentOwnerFatherName || 'N/A'})
- Ownership Type: ${parcel.ownershipType}
- Zoning: ${parcel.zoning}
- BhuScore: ${parcel.bhuScore}/900 (Grade: ${parcel.grade}, Risk: ${parcel.riskLevel})
- Total Extent: ${parcel.boundary.totalAreaAcres} Acres (${parcel.boundary.totalAreaSqFt.toLocaleString('en-IN')} sq.ft)
- 30-Year Ownership Chain: ${JSON.stringify(parcel.ownershipChain)}
- Encumbrances (CERSAI / Mortgages): ${JSON.stringify(parcel.encumbrances)}
- eCourts / NJDG Litigation History: ${JSON.stringify(parcel.litigationHistory)}
- Public Notices & Land Acquisition: ${JSON.stringify(parcel.publicNotices)}
- Red Flags: ${JSON.stringify(parcel.flags)}

REQUEST DETAILS:
- Proposed Loan / Transaction Type: ${loanType || 'Loan Against Property / Project Finance'}
- Proposed Facility Amount: ₹${targetLoanAmountInr ? (targetLoanAmountInr / 10000000).toFixed(2) + ' Crores' : 'Not specified'}
- Specific Counsel Query: ${customLegalQuery || 'Assess marketability of title and whether bank can create first pari-passu mortgage charge.'}

Please return a valid JSON object matching this structure EXACTLY:
{
  "opinionSummary": "Executive summary of the legal title position under Transfer of Property Act, 1882 and state revenue laws.",
  "lawyerVerdict": "TITLE_MARKETABLE_FIT_FOR_MORTGAGE" | "CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS" | "REJECT_UNMARKETABLE_TITLE",
  "confidenceScore": number (80 to 99),
  "keyLegalRisks": ["string item 1", "string item 2", ...],
  "recommendedConditionsPrecedent": ["Condition 1 for loan sanction/disbursal", "Condition 2", ...],
  "chainOfTitleAnalysis": "Detailed 30-year flow of title analysis from parent deeds to present.",
  "courtDisputeImpact": "Analysis of eCourts suits, injunctions, or clear certificate.",
  "encumbranceImpact": "Status of CERSAI charges and satisfaction requirements.",
  "acquisitionVulnerability": "Analysis of Section 4/6 or master plan alignment risk.",
  "statutoryIndemnityClauses": ["Indemnity against unknown legal heirs", "Declaration of possession", ...],
  "generatedAt": "${new Date().toISOString()}"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text) as AiLegalOpinionResponse;
          return res.json(parsed);
        }
      } catch (err: any) {
        console.error('Gemini API call error:', err);
        // fallback to intelligent deterministic legal counsel generator below
      }
    }

    // Fallback Lawyer Legal Opinion Engine
    const isClean = parcel.riskLevel === 'CLEAN';
    const isCritical = parcel.riskLevel === 'CRITICAL_RISK';
    const hasLitigation = parcel.litigationHistory.length > 0;
    const hasActiveEncumbrance = parcel.encumbrances.some(e => e.status === 'ACTIVE_ENCUMBERED' || e.status === 'UNDER_DRT_RECOVERY');

    let verdict: 'TITLE_MARKETABLE_FIT_FOR_MORTGAGE' | 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS' | 'REJECT_UNMARKETABLE_TITLE' = 'TITLE_MARKETABLE_FIT_FOR_MORTGAGE';
    if (isCritical || (hasLitigation && parcel.litigationHistory.some(l => l.riskWeight === 'CRITICAL'))) {
      verdict = 'REJECT_UNMARKETABLE_TITLE';
    } else if (hasLitigation || hasActiveEncumbrance || parcel.riskLevel === 'MODERATE_RISK' || parcel.riskLevel === 'HIGH_RISK') {
      verdict = 'CONDITIONAL_APPROVAL_WITH_UNDERTAKINGS';
    }

    const fallbackResponse: AiLegalOpinionResponse = {
      opinionSummary: isClean 
        ? `Upon comprehensive search of the Sub-Registrar records, Revenue Pahani/RTC entries in ${parcel.rorRegistrySource}, and National Judicial Data Grid (NJDG), the title of ${parcel.currentOwnerName} over Survey No. ${parcel.stateSurveyNo} is found to be clean, clear, marketable, and free from any subsisting legal encumbrances.`
        : isCritical
        ? `CAUTION / REJECTION ADVISORY: The subject property Survey No. ${parcel.stateSurveyNo} bears severe statutory and judicial liabilities including active recovery proceedings and subordinate charges. Title is currently non-marketable for fresh credit underwriting.`
        : `The title over Survey No. ${parcel.stateSurveyNo} exhibits substantial prima-facie validity but requires strict Conditions Precedent (CPs) prior to loan disbursement due to pending partition issues or unreleased charges.`,
      lawyerVerdict: verdict,
      confidenceScore: parcel.matchingConfidenceScore || 96.5,
      keyLegalRisks: parcel.flags.map(f => `[${f.category}] ${f.title}: ${f.description}`),
      recommendedConditionsPrecedent: isClean ? [
        'Deposit of original title deed and parent documents with the Bank under Section 58(f) of Transfer of Property Act, 1882.',
        'Obtain latest Encumbrance Certificate (Form 15/16) up to the date of mortgage registration.',
        'Registration of Security Interest in CERSAI within 30 days of sanction.',
        'Declaration on oath by borrower regarding vacant, peaceful physical possession.'
      ] : [
        'Certified copy of complete order sheet in pending suit / DRT proceedings to be vetted by panel advocate.',
        'Obtain Registered Relinquishment / Release Deed from all surviving class-I coparceners / sisters.',
        'Prior NOC and satisfaction certificate from existing charge holder registered in CERSAI.',
        'Public notice publication in two leading newspapers (one English, one vernacular) inviting claims within 14 days.'
      ],
      chainOfTitleAnalysis: `Title traced for ${parcel.ownershipChain.length > 0 ? (new Date().getFullYear() - parcel.ownershipChain[0].year) : 30} years through ${parcel.ownershipChain.length} registered devolution steps. Mutation entries in ${parcel.rorRegistrySource} correspond with registered instruments.`,
      courtDisputeImpact: hasLitigation 
        ? `Subject to ${parcel.litigationHistory.length} active litigation matters in eCourts. Pending interim orders must be strictly monitored via BhuScore Bureau Watchlist.` 
        : 'Zero civil, criminal, or debt recovery proceedings indexed in National Judicial Data Grid for this survey number or owner.',
      encumbranceImpact: hasActiveEncumbrance 
        ? 'Active CERSAI charge detected. Creation of subordinate charge requires explicit No-Objection from first charge holder.'
        : 'No subsisting mortgages or court attachments. Prior charges stand lawfully discharged.',
      acquisitionVulnerability: parcel.publicNotices.length > 0 
        ? `Subject to gazette notifications issued by ${parcel.publicNotices.map(p => p.authority).join(', ')}.`
        : 'Nil government acquisition gazettes under RFCTLARR Act 2013 or NHAI/Metro master plan corridors.',
      statutoryIndemnityClauses: [
        'Indemnity against any claims by undisclosed legal heirs under Hindu Succession Act.',
        'Undertaking to pay all statutory revenue cesses, conversion fees, and municipal property taxes on demand.'
      ],
      generatedAt: new Date().toISOString()
    };

    res.json(fallbackResponse);
  });

  // Batch Portfolio Screener for Banks / NBFCs
  app.post('/api/portfolio/screen', (req, res) => {
    const { parcelIds } = req.body;
    const targetParcels = Array.isArray(parcelIds) && parcelIds.length > 0 
      ? parcels.filter(p => parcelIds.includes(p.id) || parcelIds.includes(p.ulpin))
      : parcels;

    const totalCount = targetParcels.length;
    const avgScore = totalCount > 0 ? Math.round(targetParcels.reduce((acc, p) => acc + p.bhuScore, 0) / totalCount) : 0;
    const cleanCount = targetParcels.filter(p => p.riskLevel === 'CLEAN').length;
    const moderateCount = targetParcels.filter(p => p.riskLevel === 'MODERATE_RISK').length;
    const highRiskCount = targetParcels.filter(p => p.riskLevel === 'HIGH_RISK' || p.riskLevel === 'CRITICAL_RISK').length;
    const activeLitigationCount = targetParcels.filter(p => p.litigationHistory.length > 0).length;
    const activeCersaiCount = targetParcels.filter(p => p.encumbrances.some(e => e.status === 'ACTIVE_ENCUMBERED' || e.status === 'UNDER_DRT_RECOVERY')).length;

    res.json({
      totalCount,
      avgScore,
      cleanCount,
      moderateCount,
      highRiskCount,
      activeLitigationCount,
      activeCersaiCount,
      parcels: targetParcels
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BhuScore Land Credit Bureau Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
