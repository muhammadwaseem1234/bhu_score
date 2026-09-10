import { LandParcelProfile, ParcelAlertEvent, WatchlistSubscription } from '../types';

export const INITIAL_PARCELS: LandParcelProfile[] = [
  {
    id: 'PARCEL-KA-BLR-001',
    ulpin: 'IN-KA-BLR-560103-09412',
    stateSurveyNo: '48/2B',
    hissaSubDivision: '2B-1',
    pattaKhataNo: 'KT-8849/2021',
    villageName: 'Varthur (Hobli East)',
    talukTehsil: 'Bengaluru East',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560103',
    currentOwnerName: 'Brigade Horizon Ventures LLP & M. Narayanaswamy',
    currentOwnerFatherName: 'Late Muniyappa',
    ownershipType: 'Corporate Commercial',
    rorRegistrySource: 'Bhoomi Portal (Govt of Karnataka)',
    zoning: 'Commercial (C1/C2)',
    bhuScore: 845,
    grade: 'A1',
    riskLevel: 'CLEAN',
    verdictSummary: 'Immaculate 35-year clear marketable title. Nil pending civil suits in eCourts, CERSAI charge fully satisfied by State Bank of India with registered reconveyance deed. 0% government acquisition risk.',
    matchingConfidenceScore: 99.4,
    lastUpdated: '2026-08-28T14:30:00Z',
    recordVerificationHash: 'SHA256:7e88a91cf23b490d182049b14c6e9a0f',
    boundary: {
      type: 'Polygon',
      totalAreaSqFt: 174240,
      totalAreaAcres: 4.0,
      extentGuntas: 160,
      centroid: { lat: 12.9428, lng: 77.7462 },
      adjacentSurveys: {
        north: 'Survey No. 48/1 (Private Layout Road 60ft)',
        south: 'Survey No. 49/2 (G. Jayaram Reddy Agricultural Land)',
        east: 'Survey No. 47 (Varthur Lake Buffer - 45m Clear)',
        west: 'State Highway 35 (Bengaluru-Sarjapur Main Road)'
      },
      coordinates: [
        { lat: 12.9438, lng: 77.7452 },
        { lat: 12.9439, lng: 77.7475 },
        { lat: 12.9418, lng: 77.7472 },
        { lat: 12.9417, lng: 77.7450 }
      ]
    },
    pillars: {
      titleIntegrity: 96,
      encumbranceRisk: 95,
      litigationClearance: 100,
      zoningBufferCompliance: 92,
      acquisitionImmunity: 98,
      revenueTaxClearance: 94
    },
    flags: [
      {
        id: 'FL-001',
        code: 'POSITIVE_CERSAI_NOC',
        severity: 'POSITIVE_GREEN',
        title: 'CERSAI Mortgage Charge Satisfied',
        category: 'ENCUMBRANCE',
        description: 'Prior working capital mortgage of ₹18.5 Cr with State Bank of India marked Satisfied on 14-Jan-2025.',
        sourceCitation: 'CERSAI Registry ID #990142851',
        timestamp: '2025-01-14T11:20:00Z'
      },
      {
        id: 'FL-002',
        code: 'POSITIVE_ECOURTS_CLEAN',
        severity: 'POSITIVE_GREEN',
        title: 'Zero Litigation in eCourts / NJDG',
        category: 'LITIGATION',
        description: 'Comprehensive cross-match across Karnataka High Court & Bangalore City Civil Court found 0 active or historical suits.',
        sourceCitation: 'National Judicial Data Grid (NJDG)',
        timestamp: '2026-08-20T08:00:00Z'
      },
      {
        id: 'FL-003',
        code: 'BUFFER_ZONE_VERIFIED',
        severity: 'MODERATE_YELLOW',
        title: 'Proximity to Varthur Lake Wetland',
        category: 'ZONING',
        description: 'Plot boundary is 45 meters from lake boundary. BDA/NGT mandatory 30-meter buffer is safely respected.',
        sourceCitation: 'Karnataka Remote Sensing Centre (KSRSAC)',
        timestamp: '2026-06-11T10:00:00Z'
      }
    ],
    ownershipChain: [
      {
        id: 'TX-001',
        year: 1988,
        date: '1988-04-12',
        transferType: 'Government Grant',
        fromParty: 'Special Deputy Commissioner (Inams Abolition), Bengaluru',
        toParty: 'Muniyappa s/o Venkatappa',
        registeredNumber: 'Grant Order Inam.CR.42/1987-88',
        subRegistrarOffice: 'K.R. Puram SRO',
        mutationNumber: 'MR No. 14/1988-89',
        mutationDate: '1988-09-02',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 0,
        remarks: 'Permanent occupancy rights granted under Section 5 of Mysore Inams Abolition Act, 1954. No alienation restriction clause.',
        documentConfidence: 98
      },
      {
        id: 'TX-002',
        year: 2004,
        date: '2004-11-20',
        transferType: 'Partition Deed',
        fromParty: 'Muniyappa & Sons Joint Family',
        toParty: 'M. Narayanaswamy (Branch A)',
        registeredNumber: 'Doc No. KRP-1-08912-2004-05',
        subRegistrarOffice: 'K.R. Puram SRO',
        mutationNumber: 'MR No. 22/2004-05',
        mutationDate: '2005-02-15',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 0,
        remarks: 'Registered Family Settlement Partition Deed amongst all class-1 legal heirs with signed affidavits & minor releases.',
        documentConfidence: 99
      },
      {
        id: 'TX-003',
        year: 2021,
        date: '2021-08-14',
        transferType: 'Sale Deed',
        fromParty: 'M. Narayanaswamy',
        toParty: 'Brigade Horizon Ventures LLP (50% undivided share) & M. Narayanaswamy',
        registeredNumber: 'Doc No. SHV-1-04289-2021-22',
        subRegistrarOffice: 'Shivajinagar SRO',
        mutationNumber: 'MR No. T48/2021-22',
        mutationDate: '2021-12-05',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 320000000,
        remarks: 'Joint Development Agreement cum Registered Conveyance Deed. Stamp duty ₹2.12 Cr paid in full.',
        documentConfidence: 100
      }
    ],
    encumbrances: [
      {
        id: 'ENC-001',
        cersaiSecurityId: 'CERSAI-KA-2018-990142851',
        financialInstitution: 'State Bank of India',
        branch: 'Commercial Branch, MG Road, Bengaluru',
        chargeType: 'Equitable Mortgage',
        borrowerName: 'Brigade Horizon Ventures LLP',
        sanctionAmountInr: 185000000,
        chargeCreationDate: '2022-03-10',
        status: 'SATISFIED_NOC_FILED',
        satisfactionDate: '2025-01-14',
        remarks: 'Mortgage loan fully closed. Deed of Reconveyance registered vide Doc No. SHV-1-00312-2025 at Shivajinagar SRO.'
      }
    ],
    litigationHistory: [],
    publicNotices: [
      {
        id: 'PN-001',
        authority: 'Bruhat Bengaluru Mahanagara Palike (BBMP) & BDA',
        noticeType: 'NHAI Highway Right of Way Gazette',
        gazetteNumber: 'BDA/TP/CDP-2031/REV/04',
        publishDate: '2023-04-10',
        affectedAreaAcres: 0,
        status: 'DENOTIFIED',
        details: 'Revised Master Plan 2031 confirmed no road widening impact on Survey 48/2B. Setback guidelines compliant.'
      }
    ]
  },
  {
    id: 'PARCEL-TS-HYD-002',
    ulpin: 'IN-TS-HYD-500081-18293',
    stateSurveyNo: '102/1',
    hissaSubDivision: '102/1-A',
    pattaKhataNo: 'PT-90142',
    villageName: 'Madhapur / Guttala Begumpet',
    talukTehsil: 'Serilingampally',
    district: 'Ranga Reddy',
    state: 'Telangana',
    pincode: '500081',
    currentOwnerName: 'K. Venkateshwara Rao & Brothers',
    currentOwnerFatherName: 'Late K. Subba Rao',
    ownershipType: 'Joint Family / Coparcenary',
    rorRegistrySource: 'Dharani Portal (Govt of Telangana)',
    zoning: 'Commercial (C1/C2)',
    bhuScore: 512,
    grade: 'C1',
    riskLevel: 'MODERATE_RISK',
    verdictSummary: 'Caution: Active civil suit in City Civil Court Hyderabad (O.S. 384/2023) by estranged sister claiming 1/4th coparcenary share under Hindu Succession (Amendment) Act. Interim status quo in place.',
    matchingConfidenceScore: 94.8,
    lastUpdated: '2026-08-25T10:15:00Z',
    recordVerificationHash: 'SHA256:39a8c1f92b704e9081a2512bb49c30f1',
    boundary: {
      type: 'Polygon',
      totalAreaSqFt: 87120,
      totalAreaAcres: 2.0,
      extentGuntas: 80,
      centroid: { lat: 17.4486, lng: 78.3908 },
      adjacentSurveys: {
        north: 'Survey No. 101 (TSIIC Cyber Park Phase II)',
        south: 'Survey No. 103/1 (Gated Tech Residency)',
        east: 'Survey No. 102/2 (R.K. Reddy Land)',
        west: '100 Feet Durgam Cheruvu Link Road'
      },
      coordinates: [
        { lat: 17.4495, lng: 78.3898 },
        { lat: 17.4496, lng: 78.3918 },
        { lat: 17.4476, lng: 78.3916 },
        { lat: 17.4475, lng: 78.3896 }
      ]
    },
    pillars: {
      titleIntegrity: 62,
      encumbranceRisk: 88,
      litigationClearance: 32,
      zoningBufferCompliance: 90,
      acquisitionImmunity: 95,
      revenueTaxClearance: 84
    },
    flags: [
      {
        id: 'FL-004',
        code: 'CRITICAL_LITIGATION_STAY',
        severity: 'CRITICAL_RED',
        title: 'Active Injunction / Status Quo Order',
        category: 'LITIGATION',
        description: 'OS 384/2023 pending before IV Senior Civil Judge Ranga Reddy. Restrains alienation until disposal of partition trial.',
        sourceCitation: 'eCourts Telangana / CNR TSHC020084122023',
        timestamp: '2023-09-18T15:45:00Z'
      },
      {
        id: 'FL-005',
        code: 'COPARCENARY_GAP',
        severity: 'HIGH_AMBER',
        title: 'Missing Daughter Relinquishment Deed',
        category: 'TITLE',
        description: 'Ancestral partition deed of 2008 omitted female heirs despite binding SC ruling in Vineeta Sharma v. Rakesh Sharma (2020).',
        sourceCitation: 'BhuScore Lineage Rule Engine',
        timestamp: '2026-08-25T10:15:00Z'
      }
    ],
    ownershipChain: [
      {
        id: 'TX-004',
        year: 1974,
        date: '1974-06-18',
        transferType: 'Inheritance (Virasat)',
        fromParty: 'K. Venkatapathi (Paternal Grandfather)',
        toParty: 'K. Subba Rao',
        registeredNumber: 'Faisal Patti 1974-75 Serilingampally',
        subRegistrarOffice: 'Vallabhanagar SRO',
        mutationNumber: 'Dharani RoR Passbook #TS88190',
        mutationDate: '1975-01-10',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 0,
        remarks: 'Ancestral patta passbook entry endorsed in Pahani records.',
        documentConfidence: 91
      },
      {
        id: 'TX-005',
        year: 2008,
        date: '2008-03-24',
        transferType: 'Partition Deed',
        fromParty: 'Legal Heirs of Late K. Subba Rao',
        toParty: 'K. Venkateshwara Rao & K. Srinivas Rao (Sons only)',
        registeredNumber: 'Doc No. 2481/2008',
        subRegistrarOffice: 'Serilingampally SRO',
        mutationNumber: 'MR-2008-SR-912',
        mutationDate: '2008-08-19',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 0,
        remarks: 'Partition carried out without joining surviving sister Smt. K. Lalitha. Subject of current O.S. 384/2023.',
        documentConfidence: 82,
        hasGapFlag: true
      }
    ],
    encumbrances: [
      {
        id: 'ENC-002',
        cersaiSecurityId: 'CERSAI-TS-2019-10294819',
        financialInstitution: 'HDFC Bank Ltd',
        branch: 'Jubilee Hills Branch, Hyderabad',
        chargeType: 'Equitable Mortgage',
        borrowerName: 'K. Venkateshwara Rao',
        sanctionAmountInr: 45000000,
        chargeCreationDate: '2019-11-04',
        status: 'ACTIVE_ENCUMBERED',
        remarks: 'Existing LAP loan running regular. No NPA default reported on CIBIL.'
      }
    ],
    litigationHistory: [
      {
        id: 'LIT-001',
        cnrNumber: 'TSRR020084122023',
        courtName: 'IV Senior Civil Judge Court, Ranga Reddy',
        courtLevel: 'Civil Court Senior Division',
        caseType: 'Original Suit (O.S.)',
        caseNumber: 'O.S. 384/2023',
        filingYear: 2023,
        filingDate: '2023-08-11',
        petitioner: 'Smt. K. Lalitha w/o P. Ramamurthy',
        respondent: 'K. Venkateshwara Rao, K. Srinivas Rao & HDFC Bank',
        disputeCategory: 'Partition & Separate Possession',
        currentStatus: 'INTERIM_STAY_GRANTED',
        interimOrders: 'Status quo granted in I.A. 1/2023 restraining sale or additional mortgage until framing of preliminary decree.',
        nextHearingDate: '2026-09-14',
        riskWeight: 'CRITICAL',
        summary: 'Petitioner claims 1/3rd undivided share in ancestral survey 102/1 citing Section 6 Hindu Succession Act 2005.',
        source: 'eCourts Services'
      }
    ],
    publicNotices: []
  },
  {
    id: 'PARCEL-MH-PUN-003',
    ulpin: 'IN-MH-PUN-411057-04819',
    stateSurveyNo: '72/4',
    hissaSubDivision: '4A',
    pattaKhataNo: '7/12 Gat No. 72',
    villageName: 'Hinjawadi (Phase 1)',
    talukTehsil: 'Mulshi',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    currentOwnerName: 'TechPark Infra Ventures Pvt Ltd & S. B. Patil',
    currentOwnerFatherName: 'Balasaheb Patil',
    ownershipType: 'Corporate Commercial',
    rorRegistrySource: 'Mahabhulekh 7/12 (Govt of Maharashtra)',
    zoning: 'Special Economic Zone (SEZ)',
    bhuScore: 340,
    grade: 'D',
    riskLevel: 'CRITICAL_RISK',
    verdictSummary: 'HIGH RISK RED FLAG: Double mortgage detected across ICICI Bank (₹60 Cr) and Kotak Mahindra Bank (₹45 Cr). DRT Recovery application pending. High Court Writ petition filed against MIDC resumption notice.',
    matchingConfidenceScore: 98.1,
    lastUpdated: '2026-08-27T09:00:00Z',
    recordVerificationHash: 'SHA256:91b490f23a88c11e7492c1024a5b6c89',
    boundary: {
      type: 'Polygon',
      totalAreaSqFt: 217800,
      totalAreaAcres: 5.0,
      extentGuntas: 200,
      centroid: { lat: 18.5912, lng: 73.7389 },
      adjacentSurveys: {
        north: 'MIDC Hinjawadi Main Spine Road (120ft)',
        south: 'Gat No. 73 (MIDC Substation)',
        east: 'Gat No. 72/5 (Under MIDC Acquisition)',
        west: 'Mula River Flood Line Buffer (High Risk)'
      },
      coordinates: [
        { lat: 18.5925, lng: 73.7375 },
        { lat: 18.5927, lng: 73.7402 },
        { lat: 18.5898, lng: 73.7400 },
        { lat: 18.5896, lng: 73.7372 }
      ]
    },
    pillars: {
      titleIntegrity: 45,
      encumbranceRisk: 18,
      litigationClearance: 25,
      zoningBufferCompliance: 40,
      acquisitionImmunity: 52,
      revenueTaxClearance: 38
    },
    flags: [
      {
        id: 'FL-006',
        code: 'CRITICAL_DUAL_CERSAI_CHARGE',
        severity: 'CRITICAL_RED',
        title: 'Unreleased Dual CERSAI Mortgages',
        category: 'ENCUMBRANCE',
        description: 'Two separate financial institutions have active pari-passu / disputed equitable mortgages totaling ₹105 Cr.',
        sourceCitation: 'CERSAI Security IDs #MH90184 & #MH94821',
        timestamp: '2026-08-15T12:00:00Z'
      },
      {
        id: 'FL-007',
        code: 'DRT_SARFAESI_ACTION',
        severity: 'CRITICAL_RED',
        title: 'DRT-Pune Recovery Suit & Section 13(4) Notice',
        category: 'LITIGATION',
        description: 'Kotak Mahindra Bank has issued symbolic possession notice under SARFAESI Act for default of ₹45.2 Cr.',
        sourceCitation: 'DRT Pune Registry / OA 192/2024',
        timestamp: '2024-11-20T16:00:00Z'
      },
      {
        id: 'FL-008',
        code: 'MIDC_RESUMPTION_NOTICE',
        severity: 'HIGH_AMBER',
        title: 'MIDC Non-Utilization Default Notice',
        category: 'ACQUISITION',
        description: 'Notice issued for cancellation of 95-year industrial lease due to failure to complete construction within 3 years.',
        sourceCitation: 'MIDC Pune Regional Office Gaz. No. 441',
        timestamp: '2025-05-18T10:00:00Z'
      }
    ],
    ownershipChain: [
      {
        id: 'TX-006',
        year: 1999,
        date: '1999-05-14',
        transferType: 'Sale Deed',
        fromParty: 'Balasaheb Patil & Sons',
        toParty: 'Maharashtra Industrial Development Corporation (MIDC)',
        registeredNumber: 'Haveli SRO Doc No. 4192/1999',
        subRegistrarOffice: 'Haveli SRO, Pune',
        mutationNumber: 'Ferfar No. 1892',
        mutationDate: '1999-08-11',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 12500000,
        remarks: 'Land acquired by MIDC for Infotech Park development under Maharashtra Industrial Development Act, 1961.',
        documentConfidence: 99
      },
      {
        id: 'TX-007',
        year: 2017,
        date: '2017-02-08',
        transferType: 'Government Grant',
        fromParty: 'MIDC (Lessor)',
        toParty: 'TechPark Infra Ventures Pvt Ltd (Lessee)',
        registeredNumber: 'Haveli SRO Doc No. 11094/2017',
        subRegistrarOffice: 'Haveli SRO, Pune',
        mutationNumber: 'Ferfar No. 4421',
        mutationDate: '2017-06-03',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 180000000,
        remarks: '95-year registered lease with building covenant. Mandatory condition: 50% built-up completion by 2022.',
        documentConfidence: 95
      }
    ],
    encumbrances: [
      {
        id: 'ENC-003',
        cersaiSecurityId: 'CERSAI-MH-2020-0090184',
        financialInstitution: 'ICICI Bank Ltd',
        branch: 'Bandra-Kurla Complex, Mumbai',
        chargeType: 'Registered Mortgage',
        borrowerName: 'TechPark Infra Ventures Pvt Ltd',
        sanctionAmountInr: 600000000,
        chargeCreationDate: '2020-09-12',
        status: 'UNDER_DRT_RECOVERY',
        drtCaseRef: 'OA 118/2024 (DRT Pune)',
        remarks: 'Non-performing asset (NPA). Bank recalled credit facility on 12-Feb-2024.'
      },
      {
        id: 'ENC-004',
        cersaiSecurityId: 'CERSAI-MH-2022-0094821',
        financialInstitution: 'Kotak Mahindra Bank',
        branch: 'Senapati Bapat Road, Pune',
        chargeType: 'Equitable Mortgage',
        borrowerName: 'TechPark Infra Ventures Pvt Ltd',
        sanctionAmountInr: 450000000,
        chargeCreationDate: '2022-01-18',
        status: 'UNDER_DRT_RECOVERY',
        drtCaseRef: 'OA 192/2024 (DRT Pune)',
        remarks: 'Subordinate charge contested by ICICI Bank for priority dispute.'
      }
    ],
    litigationHistory: [
      {
        id: 'LIT-002',
        cnrNumber: 'MHPB010029142024',
        courtName: 'Debt Recovery Tribunal (DRT-1), Pune',
        courtLevel: 'Debt Recovery Tribunal (DRT)',
        caseType: 'Original Application (O.A.)',
        caseNumber: 'O.A. 118/2024',
        filingYear: 2024,
        filingDate: '2024-03-15',
        petitioner: 'ICICI Bank Ltd',
        respondent: 'TechPark Infra Ventures Pvt Ltd & S. B. Patil',
        disputeCategory: 'SARFAESI Bank Recovery & Auction Challenge',
        currentStatus: 'PENDING_TRIAL',
        interimOrders: 'Receiver appointed by DRT to take inventory on 14-Aug-2024.',
        nextHearingDate: '2026-09-22',
        riskWeight: 'CRITICAL',
        summary: 'Bank claim of ₹71.4 Cr inclusive of penal interest with attachment of leasehold rights.',
        source: 'DRT Registry'
      },
      {
        id: 'LIT-003',
        cnrNumber: 'MHBOM010098412025',
        courtName: 'High Court of Judicature at Bombay',
        courtLevel: 'High Court',
        caseType: 'Writ Petition (Civil)',
        caseNumber: 'WP (C) 4120/2025',
        filingYear: 2025,
        filingDate: '2025-06-02',
        petitioner: 'TechPark Infra Ventures Pvt Ltd',
        respondent: 'State of Maharashtra, MIDC & ICICI Bank',
        disputeCategory: 'Title & Ownership Declaration',
        currentStatus: 'PENDING_TRIAL',
        interimOrders: 'Ad-interim protection against coercive physical eviction granted till next date.',
        nextHearingDate: '2026-10-05',
        riskWeight: 'HIGH',
        summary: 'Challenging MIDC lease resumption notice on grounds of COVID-19 Force Majeure relief circulars.',
        source: 'High Court Portal'
      }
    ],
    publicNotices: [
      {
        id: 'PN-002',
        authority: 'MIDC Pune Division',
        noticeType: 'Revenue Recovery Act Attachment',
        gazetteNumber: 'MIDC/ENG/LEAS-RES/098/2025',
        publishDate: '2025-05-18',
        affectedAreaAcres: 5.0,
        status: 'ACTIVE_NOTIFICATION',
        details: 'Show-cause notice for re-entry into plot Gat 72/4 for breach of Clause 4(b) of Lease Agreement.'
      },
      {
        id: 'PN-003',
        authority: 'Kotak Mahindra Bank Stressed Asset Management',
        noticeType: 'Bank Auction Teaser Notice (Rule 8/9)',
        gazetteNumber: 'SARFAESI/KOTAK/PUN/2025/11',
        publishDate: '2025-10-12',
        affectedAreaAcres: 5.0,
        status: 'ACTIVE_NOTIFICATION',
        details: 'Public e-auction notice issued with reserve price ₹92.00 Cr. Currently stayed by DRT Pune.'
      }
    ]
  },
  {
    id: 'PARCEL-TN-CHE-004',
    ulpin: 'IN-TN-KNC-603103-08214',
    stateSurveyNo: '214/1B',
    hissaSubDivision: '1B',
    pattaKhataNo: 'Patta No. 1092',
    villageName: 'Navalur (OMR IT Corridor)',
    talukTehsil: 'Thiruporur',
    district: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '603103',
    currentOwnerName: 'Dr. R. Ananthakrishnan & Smt. V. Meenakshi',
    currentOwnerFatherName: 'K. Rajagopal',
    ownershipType: 'Individual Freehold',
    rorRegistrySource: 'TamilNilam e-Services (Govt of Tamil Nadu)',
    zoning: 'Residential (R1/R2)',
    bhuScore: 810,
    grade: 'A2',
    riskLevel: 'CLEAN',
    verdictSummary: 'High quality freehold title with unbroken 40-year TamilNilam lineage. Encumbrance Certificate (EC) clean for 30 years with Nil sub-registrar charges.',
    matchingConfidenceScore: 98.9,
    lastUpdated: '2026-08-20T11:00:00Z',
    recordVerificationHash: 'SHA256:22c091ea44b918a20948c10941829101',
    boundary: {
      type: 'Polygon',
      totalAreaSqFt: 43560,
      totalAreaAcres: 1.0,
      extentGuntas: 40,
      centroid: { lat: 12.8458, lng: 80.2268 },
      adjacentSurveys: {
        north: 'Survey No. 214/1A (Approved DTP Layout)',
        south: 'Survey No. 214/2 (P. Jayaraman Plot)',
        east: 'Old Mahabalipuram Road (OMR 6-Lane Expressway)',
        west: 'Survey No. 213 (Panchayat Grazing Land)'
      },
      coordinates: [
        { lat: 12.8465, lng: 80.2258 },
        { lat: 12.8467, lng: 80.2278 },
        { lat: 12.8449, lng: 80.2275 },
        { lat: 12.8448, lng: 80.2256 }
      ]
    },
    pillars: {
      titleIntegrity: 94,
      encumbranceRisk: 96,
      litigationClearance: 98,
      zoningBufferCompliance: 86,
      acquisitionImmunity: 92,
      revenueTaxClearance: 95
    },
    flags: [
      {
        id: 'FL-009',
        code: 'POSITIVE_EC_NIL',
        severity: 'POSITIVE_GREEN',
        title: '30-Year Nil Encumbrance Certificate',
        category: 'ENCUMBRANCE',
        description: 'Inspector General of Registration (TN Reginet) certified zero registered mortgages or attachments from 1994 to 2026.',
        sourceCitation: 'TN Reginet EC Ref #TN-TP-2026-091482',
        timestamp: '2026-08-10T14:00:00Z'
      }
    ],
    ownershipChain: [
      {
        id: 'TX-008',
        year: 1984,
        date: '1984-07-21',
        transferType: 'Sale Deed',
        fromParty: 'K. Govindasamy Gramani',
        toParty: 'K. Rajagopal',
        registeredNumber: 'Thiruporur SRO Doc No. 892/1984',
        subRegistrarOffice: 'Thiruporur SRO',
        mutationNumber: 'Patta Transfer TR-112/1984',
        mutationDate: '1984-10-15',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 45000,
        remarks: 'Registered sale deed backed by parent 1968 Settlement Deed. Mutation in Village A-Register completed.',
        documentConfidence: 96
      },
      {
        id: 'TX-009',
        year: 2012,
        date: '2012-09-03',
        transferType: 'Gift Deed',
        fromParty: 'K. Rajagopal',
        toParty: 'Dr. R. Ananthakrishnan & Smt. V. Meenakshi',
        registeredNumber: 'Thiruporur SRO Doc No. 4912/2012',
        subRegistrarOffice: 'Thiruporur SRO',
        mutationNumber: 'TamilNilam Patta #1092',
        mutationDate: '2013-01-20',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 0,
        remarks: 'Registered Settlement/Gift deed within immediate family. Stamp duty concession availed under TN Stamp Act.',
        documentConfidence: 99
      }
    ],
    encumbrances: [],
    litigationHistory: [],
    publicNotices: []
  },
  {
    id: 'PARCEL-HR-GUR-005',
    ulpin: 'IN-HR-GUR-122002-09183',
    stateSurveyNo: 'Khasra No. 14//8/2',
    hissaSubDivision: 'Mustatil 14 / Killa 8/2',
    pattaKhataNo: 'Khewat 48 / Khatoni 92',
    villageName: 'Sikanderpur Ghosi (Golf Course Road)',
    talukTehsil: 'Wazirabad',
    district: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    currentOwnerName: 'Apex Prime Realtors India LLP',
    currentOwnerFatherName: 'N/A',
    ownershipType: 'Corporate Commercial',
    rorRegistrySource: 'Jamabandi Haryana (Govt of Haryana)',
    zoning: 'Commercial (C1/C2)',
    bhuScore: 420,
    grade: 'C2',
    riskLevel: 'HIGH_RISK',
    verdictSummary: 'HIGH RISK: Sub-judice under Land Acquisition Act Section 4(1) challenge before Supreme Court of India. Gap of 6 years in Jamabandi mutation between 2002-2008 without sanctioned Inteqal.',
    matchingConfidenceScore: 92.3,
    lastUpdated: '2026-08-22T16:30:00Z',
    recordVerificationHash: 'SHA256:55f019a82e9104812bc9048a12049102',
    boundary: {
      type: 'Polygon',
      totalAreaSqFt: 65340,
      totalAreaAcres: 1.5,
      extentGuntas: 60,
      centroid: { lat: 28.4795, lng: 77.0984 },
      adjacentSurveys: {
        north: 'Khasra 14//8/1 (HSVP Green Belt)',
        south: 'Khasra 14//9 (DLF Cyber City Sector Road 24m)',
        east: 'Rapid Metro Gurugram Pillar Alignment',
        west: 'Khasra 14//7 (Commercial High-Rise Plot)'
      },
      coordinates: [
        { lat: 28.4805, lng: 77.0975 },
        { lat: 28.4806, lng: 77.0995 },
        { lat: 28.4785, lng: 77.0992 },
        { lat: 28.4784, lng: 77.0972 }
      ]
    },
    pillars: {
      titleIntegrity: 58,
      encumbranceRisk: 65,
      litigationClearance: 22,
      zoningBufferCompliance: 78,
      acquisitionImmunity: 28,
      revenueTaxClearance: 60
    },
    flags: [
      {
        id: 'FL-010',
        code: 'CRITICAL_ACQUISITION_GAZETTE',
        severity: 'CRITICAL_RED',
        title: 'HSVP / HUDA Section 4 Acquisition Dispute',
        category: 'ACQUISITION',
        description: 'Subject to Haryana Urban Development Authority notification for Sector 42 commercial corridor. Release of land contested in Supreme Court.',
        sourceCitation: 'Haryana Govt Gazette / SLP (C) 19821/2022',
        timestamp: '2022-11-10T10:00:00Z'
      },
      {
        id: 'FL-011',
        code: 'INTEQAL_MUTATION_GAP',
        severity: 'HIGH_AMBER',
        title: '6-Year Gap in Jamabandi Revenue Record',
        category: 'MUTATION',
        description: 'Sale deed of 2002 was not entered in Jamabandi until Inteqal No. 1420 was belatedly certified in 2008 without sanction order.',
        sourceCitation: 'Jamabandi Gurugram Revenue Audit',
        timestamp: '2026-08-22T16:30:00Z'
      }
    ],
    ownershipChain: [
      {
        id: 'TX-010',
        year: 1991,
        date: '1991-03-12',
        transferType: 'Sale Deed',
        fromParty: 'Ramji Lal & Jai Singh',
        toParty: 'O. P. Chawla & Sons',
        registeredNumber: 'Gurugram SRO Vasika No. 1290/1991',
        subRegistrarOffice: 'Gurugram Tehsil SRO',
        mutationNumber: 'Inteqal No. 892',
        mutationDate: '1991-07-20',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 350000,
        remarks: 'Standard agricultural land conveyance prior to urban corridor declaration.',
        documentConfidence: 89
      },
      {
        id: 'TX-011',
        year: 2002,
        date: '2002-10-18',
        transferType: 'Sale Deed',
        fromParty: 'O. P. Chawla & Sons',
        toParty: 'Apex Prime Realtors India LLP',
        registeredNumber: 'Wazirabad SRO Vasika No. 4912/2002',
        subRegistrarOffice: 'Wazirabad SRO',
        mutationNumber: 'Inteqal No. 1420 (Belated)',
        mutationDate: '2008-04-14',
        mutationStatus: 'Disputed',
        considerationAmountInr: 45000000,
        remarks: 'Revenue Inteqal sanction was contested by original farmers claiming non-payment of full consideration.',
        documentConfidence: 74,
        hasGapFlag: true
      }
    ],
    encumbrances: [
      {
        id: 'ENC-005',
        cersaiSecurityId: 'CERSAI-HR-2023-019482',
        financialInstitution: 'Axis Bank Ltd',
        branch: 'Sector 29, Gurugram',
        chargeType: 'Registered Mortgage',
        borrowerName: 'Apex Prime Realtors India LLP',
        sanctionAmountInr: 120000000,
        chargeCreationDate: '2023-06-25',
        status: 'ACTIVE_ENCUMBERED',
        remarks: 'Construction finance loan secured against mortgage of Khasra 14//8/2.'
      }
    ],
    litigationHistory: [
      {
        id: 'LIT-004',
        cnrNumber: 'SCIN010041202022',
        courtName: 'Supreme Court of India',
        courtLevel: 'Supreme Court',
        caseType: 'Special Leave Petition (Civil)',
        caseNumber: 'SLP (C) 19821/2022',
        filingYear: 2022,
        filingDate: '2022-10-14',
        petitioner: 'Haryana Shehri Vikas Pradhikaran (HSVP) & State of Haryana',
        respondent: 'Apex Prime Realtors India LLP & Ors.',
        disputeCategory: 'Land Acquisition Compensation Enhancement',
        currentStatus: 'PENDING_TRIAL',
        interimOrders: 'Status quo on construction activities on disputed parcel until next hearing.',
        nextHearingDate: '2026-11-18',
        riskWeight: 'CRITICAL',
        summary: 'State challenging High Court judgment that quashed acquisition notification under Section 24(2) of 2013 RFCTLARR Act.',
        source: 'NJDG'
      }
    ],
    publicNotices: [
      {
        id: 'PN-004',
        authority: 'Haryana Shehri Vikas Pradhikaran (HSVP)',
        noticeType: 'Land Acquisition Act Sec 6 Declaration',
        gazetteNumber: 'HR-GAZ-HUDA-SEC42-2021-99',
        publishDate: '2021-08-19',
        affectedAreaAcres: 1.5,
        status: 'ACTIVE_NOTIFICATION',
        details: 'Section 6 declaration for public infrastructure and right of way expansion.'
      }
    ]
  },
  {
    id: 'PARCEL-GJ-AHM-006',
    ulpin: 'IN-GJ-AHM-380054-03912',
    stateSurveyNo: 'Survey No. 312/1',
    hissaSubDivision: '312/1-Paiki',
    pattaKhataNo: 'Khata No. 719',
    villageName: 'Bodakdev (SG Highway Corridor)',
    talukTehsil: 'Daskroi / Ghatlodiya',
    district: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
    currentOwnerName: 'Zydus Horizon Realty Pvt Ltd',
    currentOwnerFatherName: 'N/A',
    ownershipType: 'Corporate Commercial',
    rorRegistrySource: 'AnyRoR Gujarat (Govt of Gujarat)',
    zoning: 'Commercial (C1/C2)',
    bhuScore: 880,
    grade: 'A1',
    riskLevel: 'CLEAN',
    verdictSummary: 'Pristine Tier-1 institutional grade title. Non-Agricultural (NA) Premium Order certified under Section 65 Bombay Land Revenue Code. 100% CERSAI and eCourts clear.',
    matchingConfidenceScore: 99.8,
    lastUpdated: '2026-08-28T08:00:00Z',
    recordVerificationHash: 'SHA256:88e0419bc1284910248a0149bb881901',
    boundary: {
      type: 'Polygon',
      totalAreaSqFt: 130680,
      totalAreaAcres: 3.0,
      extentGuntas: 120,
      centroid: { lat: 23.0384, lng: 72.5098 },
      adjacentSurveys: {
        north: 'Survey No. 311 (AUDA 36m Town Planning Road)',
        south: 'Survey No. 312/2 (Commercial Plaza)',
        east: 'Sarkhej - Gandhinagar Highway (SG Highway Service Road)',
        west: 'Survey No. 313 (AUDA Reserved Urban Green Park)'
      },
      coordinates: [
        { lat: 23.0395, lng: 72.5085 },
        { lat: 23.0396, lng: 72.5112 },
        { lat: 23.0372, lng: 72.5110 },
        { lat: 23.0371, lng: 72.5082 }
      ]
    },
    pillars: {
      titleIntegrity: 98,
      encumbranceRisk: 95,
      litigationClearance: 100,
      zoningBufferCompliance: 96,
      acquisitionImmunity: 99,
      revenueTaxClearance: 97
    },
    flags: [
      {
        id: 'FL-012',
        code: 'POSITIVE_NA_PERMISSION',
        severity: 'POSITIVE_GREEN',
        title: 'NA Commercial Conversion Order Certified',
        category: 'ZONING',
        description: 'District Collector Ahmedabad issued final NA Permission Order No. NA/REV/DASK/2019/8412 under Section 65.',
        sourceCitation: 'Ahmedabad Collectorate Revenue Records',
        timestamp: '2019-11-14T10:00:00Z'
      }
    ],
    ownershipChain: [
      {
        id: 'TX-012',
        year: 1978,
        date: '1978-02-10',
        transferType: 'Inheritance (Virasat)',
        fromParty: 'Tribhovandas Patel',
        toParty: 'Manilal Tribhovandas Patel & Brothers',
        registeredNumber: 'Ghatlodiya Hak-Patrak Entry #412',
        subRegistrarOffice: 'Ahmedabad SRO-4',
        mutationNumber: 'AnyRoR Entry No. 412',
        mutationDate: '1978-05-18',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 0,
        remarks: 'Ancestral succession registered without dispute.',
        documentConfidence: 98
      },
      {
        id: 'TX-013',
        year: 2019,
        date: '2019-06-22',
        transferType: 'Sale Deed',
        fromParty: 'Manilal Patel & All Legal Heirs',
        toParty: 'Zydus Horizon Realty Pvt Ltd',
        registeredNumber: 'Ahmedabad SRO-4 Doc No. 8419/2019',
        subRegistrarOffice: 'Ahmedabad SRO-4 (Memnagar)',
        mutationNumber: 'AnyRoR Entry No. 1842',
        mutationDate: '2019-09-30',
        mutationStatus: 'Sanctioned & Certified',
        considerationAmountInr: 480000000,
        remarks: 'All 11 Class-I legal heirs appeared and executed registered conveyance deed. Full consideration transferred via RTGS.',
        documentConfidence: 100
      }
    ],
    encumbrances: [],
    litigationHistory: [],
    publicNotices: []
  }
];

export const INITIAL_ALERTS: ParcelAlertEvent[] = [
  {
    id: 'ALT-901',
    parcelId: 'PARCEL-TS-HYD-002',
    ulpin: 'IN-TS-HYD-500081-18293',
    surveyNo: '102/1',
    location: 'Madhapur, Ranga Reddy, Telangana',
    eventType: 'NEW_COURT_SUIT',
    severity: 'ALERT',
    title: 'New Interlocutory Application filed in O.S. 384/2023',
    description: 'Petitioner filed I.A. No. 4/2026 seeking appointment of Court Commissioner for local survey of Survey 102/1.',
    sourceRegistry: 'eCourts Telangana Services',
    timestamp: '2026-08-28T16:45:00Z',
    isRead: false,
    notifiedChannels: { email: true, push: true, webhook: true }
  },
  {
    id: 'ALT-902',
    parcelId: 'PARCEL-MH-PUN-003',
    ulpin: 'IN-MH-PUN-411057-04819',
    surveyNo: '72/4',
    location: 'Hinjawadi Phase 1, Pune, Maharashtra',
    eventType: 'NEW_CERSAI_MORTGAGE',
    severity: 'CRITICAL',
    title: 'Secondary Charge Registration Attempt Detected',
    description: 'Third-party NBFC attempted creation of second hypothecation charge on Hinjawadi Gat 72/4; flagged by CERSAI gateway.',
    sourceRegistry: 'CERSAI National Portal',
    timestamp: '2026-08-27T11:20:00Z',
    isRead: false,
    notifiedChannels: { email: true, push: true, webhook: true }
  },
  {
    id: 'ALT-903',
    parcelId: 'PARCEL-HR-GUR-005',
    ulpin: 'IN-HR-GUR-122002-09183',
    surveyNo: 'Khasra 14//8/2',
    location: 'Sikanderpur Ghosi, Gurugram, Haryana',
    eventType: 'PUBLIC_GAZETTE_NOTICE',
    severity: 'WARNING',
    title: 'Supreme Court Hearing Date Re-scheduled',
    description: 'SLP (C) 19821/2022 listed before Bench No. 4 of Supreme Court of India on 18-Nov-2026.',
    sourceRegistry: 'Supreme Court Case Status Portal',
    timestamp: '2026-08-26T09:30:00Z',
    isRead: true,
    notifiedChannels: { email: true, push: false, webhook: false }
  },
  {
    id: 'ALT-904',
    parcelId: 'PARCEL-KA-BLR-001',
    ulpin: 'IN-KA-BLR-560103-09412',
    surveyNo: '48/2B',
    location: 'Varthur, Bengaluru East, Karnataka',
    eventType: 'MUTATION_STATUS_CHANGE',
    severity: 'INFO',
    title: 'Annual Revenue Cess Tax Receipt Verified',
    description: 'BBMP Khata tax assessment for FY 2026-27 credited and reconciled with nil outstanding balance.',
    sourceRegistry: 'Bhoomi Karnataka / BBMP e-Aasthi',
    timestamp: '2026-08-24T14:10:00Z',
    isRead: true,
    notifiedChannels: { email: true, push: false, webhook: true }
  }
];

export const INITIAL_WATCHLIST: WatchlistSubscription[] = [
  {
    id: 'SUB-101',
    parcelId: 'PARCEL-KA-BLR-001',
    ulpin: 'IN-KA-BLR-560103-09412',
    surveyNo: '48/2B',
    village: 'Varthur, Bengaluru',
    state: 'Karnataka',
    currentScore: 845,
    riskGrade: 'A1',
    subscribedAt: '2026-07-15T09:00:00Z',
    alertOnLitigation: true,
    alertOnMortgage: true,
    alertOnRegistration: true,
    alertOnPublicNotice: true,
    notificationEmail: 'credit-risk-desk@hdfcbank.com',
    webhookUrl: 'https://api.hdfcbank.com/webhooks/bhuscore/land-risk',
    status: 'ACTIVE'
  },
  {
    id: 'SUB-102',
    parcelId: 'PARCEL-TS-HYD-002',
    ulpin: 'IN-TS-HYD-500081-18293',
    surveyNo: '102/1',
    village: 'Madhapur, Hyderabad',
    state: 'Telangana',
    currentScore: 512,
    riskGrade: 'C1',
    subscribedAt: '2026-08-01T12:30:00Z',
    alertOnLitigation: true,
    alertOnMortgage: true,
    alertOnRegistration: true,
    alertOnPublicNotice: true,
    notificationEmail: 'underwriting.south@sbi.co.in',
    webhookUrl: 'https://fintech.sbiyono.sbi/api/v2/land-alerts',
    status: 'ACTIVE'
  },
  {
    id: 'SUB-103',
    parcelId: 'PARCEL-MH-PUN-003',
    ulpin: 'IN-MH-PUN-411057-04819',
    surveyNo: '72/4',
    village: 'Hinjawadi, Pune',
    state: 'Maharashtra',
    currentScore: 340,
    riskGrade: 'D',
    subscribedAt: '2026-08-10T14:15:00Z',
    alertOnLitigation: true,
    alertOnMortgage: true,
    alertOnRegistration: true,
    alertOnPublicNotice: true,
    notificationEmail: 'stressed-assets@kotak.com',
    webhookUrl: 'https://recovery.kotak.com/webhook/cersai-bhuscore',
    status: 'ACTIVE'
  }
];
