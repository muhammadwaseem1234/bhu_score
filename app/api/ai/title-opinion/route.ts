import { NextRequest, NextResponse } from 'next/server';
import { store, getGeminiAI, generateFallbackLegalOpinion } from '@/lib/store';
import { AiLegalOpinionResponse } from '@/src/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parcelId, targetLoanAmountInr, loanType, customLegalQuery } = body;
    const parcel = store.parcels.find((p) => p.id === parcelId);

    if (!parcel) {
      return NextResponse.json({ error: 'Parcel not found' }, { status: 404 });
    }

    const ai = getGeminiAI();
    if (ai) {
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
  "keyLegalRisks": ["string item 1", "string item 2"],
  "recommendedConditionsPrecedent": ["Condition 1 for loan sanction/disbursal", "Condition 2"],
  "chainOfTitleAnalysis": "Detailed 30-year flow of title analysis from parent deeds to present.",
  "courtDisputeImpact": "Analysis of eCourts suits, injunctions, or clear certificate.",
  "encumbranceImpact": "Status of CERSAI charges and satisfaction requirements.",
  "acquisitionVulnerability": "Analysis of Section 4/6 or master plan alignment risk.",
  "statutoryIndemnityClauses": ["Indemnity against unknown legal heirs", "Declaration of possession"],
  "generatedAt": "${new Date().toISOString()}"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text) as AiLegalOpinionResponse;
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error('Gemini API call error:', err);
      }
    }

    // Fallback Lawyer Legal Opinion Engine
    const fallback = generateFallbackLegalOpinion(parcel);
    return NextResponse.json(fallback);
  } catch {
    return NextResponse.json({ error: 'Failed to generate legal opinion' }, { status: 500 });
  }
}
