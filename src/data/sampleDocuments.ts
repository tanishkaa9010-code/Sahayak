import { DocumentAnalysis } from '../types/document';

export interface SampleDocPreset {
  id: string;
  name: string;
  shortDesc: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  document: DocumentAnalysis;
  rawText: string;
  sampleVisual: {
    headerColor: string;
    subHeader: string;
    lines: string[];
    highlightBox?: string;
  };
}

export const SAMPLE_DOCUMENTS: SampleDocPreset[] = [
  {
    id: 'sample-scam-sms',
    name: 'Fake Bank Scam Notice',
    shortDesc: 'Urgent KYC Account Block Phishing SMS',
    badge: 'Scam Alert (14/100)',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-950/40 dark:text-red-400',
    iconName: 'AlertTriangle',
    rawText: `[URGENT BANK ALERT]
State Bank Customer Alert:
Dear SBI User, Your YONO SBI NetBanking account has been blocked today due to pending KYC verification.
Please update your PAN Card and Aadhaar details immediately within 24 hours at:
http://sbi-kyc-update82.in/verify
Failing which your account balance of ₹84,250.00 will be frozen permanently.
For urgent assistance call Helpline: +91-9876543210 immediately.
- SBI YONO Security Team`,
    sampleVisual: {
      headerColor: 'bg-red-900 text-white',
      subHeader: 'URGENT SECURITY NOTICE - SUSPECTED PHISHING',
      lines: [
        'Sender: +91-9876543210 (Unverified 10-digit mobile number)',
        'Message: "Dear Customer, Your SBI YONO Account has been blocked..."',
        'Suspicious Link: http://sbi-kyc-update82.in/verify',
        'Urgency: "Update within 24 hours or account frozen permanently"',
        'Claimed Balance: ₹84,250.00',
      ],
      highlightBox: 'CRITICAL WARNING: SBI never sends SMS from standard mobile numbers asking to update KYC on non-.sbi domains. DO NOT CLICK.',
    },
    document: {
      id: 'sample-scam-sms',
      createdAt: new Date().toISOString(),
      isSample: true,
      title: 'Fake SBI YONO KYC Phishing Alert',
      documentType: 'Bank / Financial',
      oneSentenceSummary: 'This is a fake bank notice trying to panic you into clicking an unauthorized website so scammers can steal your money and passwords.',
      sender: 'Unverified scammer impersonating State Bank of India (SBI)',
      dateReceivedOrIssued: 'Today (Urgent 24h deadline claim)',
      amounts: [
        {
          label: 'Claimed Account Balance to Freeze',
          value: '₹84,250.00',
          isSuspicious: true,
        },
        {
          label: 'Fake "Verification Fee" on Link',
          value: '₹10.00 to ₹500.00',
          isSuspicious: true,
        },
      ],
      deadlines: [
        {
          label: 'Scammer Threat Deadline',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          urgency: 'urgent',
          consequenceOfMissing: 'None in reality — this is a fake threat designed to cause panic.',
        },
      ],
      actionChecklist: [
        {
          stepNumber: 1,
          title: 'DO NOT click the link',
          description: 'Never tap on "http://sbi-kyc-update82.in". It is a phishing site designed to clone your banking credentials.',
          whereOrHow: 'Delete or disregard link',
          isWarning: true,
        },
        {
          stepNumber: 2,
          title: 'Never share OTP, PIN or Aadhaar',
          description: 'No legitimate bank manager or technical team will ever ask for OTP, debit card CVV, or NetBanking password over phone or SMS.',
          whereOrHow: 'Bank Security Protocol',
          isWarning: true,
        },
        {
          stepNumber: 3,
          title: 'Report to National Cyber Crime Helpline',
          description: 'Call 1930 immediately or file an incident at cybercrime.gov.in with the phone number and link.',
          whereOrHow: 'Government Cyber Crime Portal',
          contactOrLink: '1930 / cybercrime.gov.in',
          isWarning: false,
        },
        {
          stepNumber: 4,
          title: 'Verify safely with your local branch',
          description: 'If you are worried about your actual bank account, visit your nearest physical SBI branch or log into onlinesbi.sbi directly.',
          whereOrHow: 'Official Branch or onlinesbi.sbi',
          contactOrLink: '1800 1234 (SBI Official Toll-Free)',
          isWarning: false,
        },
      ],
      riskScamAssessment: {
        trustScore: 14,
        verdict: 'High Scam Risk',
        isImpersonation: true,
        redFlags: [
          'Fake domain: Uses "sbi-kyc-update82.in" instead of official "onlinesbi.sbi" or "sbi.co.in"',
          'Artificial urgency: Threats of permanent account block within 24 hours to bypass rational thinking',
          'Originating from standard 10-digit mobile number (+91-9876543210) rather than an official registered header (e.g. SBIBNK)',
          'Asks to input sensitive banking details & Aadhaar onto an unverified HTTP website',
        ],
        safetyRecommendations: [
          'Block this phone number immediately on your device.',
          'Do not forward this message to friends or family members.',
          'Forward the SMS to 1909 or report to cybercrime.gov.in.',
          'If you accidentally opened the link and entered details, immediately freeze your debit card using your official SBI YONO app or call 1800-112-211.',
        ],
      },
      keyTermsGlossary: [
        {
          term: 'KYC (Know Your Customer)',
          simplifiedMeaning: 'Official identity verification by your bank (Aadhaar/PAN). Banks only do this inside their branch or official verified app, never via random web links.',
          category: 'financial',
        },
        {
          term: 'Phishing',
          simplifiedMeaning: 'A trick where criminals pretend to be a trustworthy organization to steal your bank password, OTP, or money.',
          category: 'technical',
        },
        {
          term: 'OTP (One Time Password)',
          simplifiedMeaning: 'A secret 6-digit code sent to your phone. Sharing this is like giving a thief the keys to your bank account.',
          category: 'financial',
        },
      ],
      fullTranscribedText: 'URGENT BANK ALERT: SBI account blocked due to pending KYC. Update within 24 hrs at http://sbi-kyc-update82.in to avoid freeze.',
      language: 'en',
    },
  },
  {
    id: 'sample-power-bill',
    name: 'Electricity Overdue Bill',
    shortDesc: 'Final Disconnection Notice under Section 56',
    badge: 'Due in 5 Days',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400',
    iconName: 'Zap',
    rawText: `BSES RAJDHANI POWER LIMITED / MAHAVITARAN
ELECTRICITY CONSUMER BILL & STATUTORY DISCONNECTION NOTICE
Consumer No (CA): 0284719284 | Meter No: DEL-83721 | Tariff: Domestic (LT-1)
Billing Month: October 2024 | Units Consumed: 342 kWh
-----------------------------------------------------------
Current Energy Charges: ₹2,840.50
Fixed Monthly Charges: ₹420.00
Govt Electricity Duty & Cess: ₹295.00
Past Arrears Outstanding: ₹1,705.00
Late Payment Surcharge (LPSC): ₹285.00
TOTAL AMOUNT PAYABLE: ₹5,545.50
-----------------------------------------------------------
PAYMENT DUE DATE: November 05, 2024
DISCONNECTION DATE: November 12, 2024
NOTICE: In terms of Section 56(1) of the Electricity Act 2003, power supply will be disconnected without further intimation if total dues are not settled before the due date. Reconnection charges of ₹500 will apply.
Pay online at: www.bsesdelhi.com or Mahavitaran official counter.`,
    sampleVisual: {
      headerColor: 'bg-amber-800 text-white',
      subHeader: 'STATUTORY ELECTRICITY BILL & FINAL DISCONNECTION NOTICE',
      lines: [
        'Consumer ID: 0284719284 | Meter: DEL-83721 (Domestic LT-1)',
        'Units Consumed: 342 kWh | Billing Period: Oct 2024',
        'Current Charges: ₹2,840.50 | Fixed Charges: ₹420.00',
        'Past Arrears: ₹1,705.00 | Late Surcharge (LPSC): ₹285.00',
        'TOTAL DUE: ₹5,545.50 | DUE DATE: Nov 05, 2024',
      ],
      highlightBox: 'STATUTORY WARNING: Section 56(1) disconnection notice. Power cut scheduled on 12-Nov-2024 if ₹5,545.50 remains unpaid.',
    },
    document: {
      id: 'sample-power-bill',
      createdAt: new Date().toISOString(),
      isSample: true,
      title: 'Electricity Overdue Bill & Final Disconnection Notice',
      documentType: 'Utility Bill',
      oneSentenceSummary: 'Your power distribution company requires payment of ₹5,545.50 by November 5, or your electricity will be disconnected after 15 days.',
      sender: 'BSES Rajdhani Power Limited / Mahavitaran Distribution Co.',
      dateReceivedOrIssued: '20-Oct-2024',
      amounts: [
        {
          label: 'Total Amount Payable',
          value: '₹5,545.50',
          isSuspicious: false,
        },
        {
          label: 'Current Energy Charges',
          value: '₹2,840.50',
          isSuspicious: false,
        },
        {
          label: 'Past Arrears Outstanding',
          value: '₹1,705.00',
          isSuspicious: false,
        },
        {
          label: 'Late Payment Surcharge (LPSC)',
          value: '₹285.00',
          isSuspicious: false,
        },
      ],
      deadlines: [
        {
          label: 'Official Due Date',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          urgency: 'urgent',
          consequenceOfMissing: 'Late fee surcharge added and electricity disconnection scheduled under Section 56.',
        },
        {
          label: 'Power Cut Disconnection Date',
          dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          urgency: 'urgent',
          consequenceOfMissing: 'Physical disconnection of electric meter, requiring extra ₹500 fee plus full clearance to restore power.',
        },
      ],
      actionChecklist: [
        {
          stepNumber: 1,
          title: 'Pay total due of ₹5,545.50 before the due date',
          description: 'Settle the bill online via the official portal bsesdelhi.com, electricity board app, or authorized BillDesk/UPI counter to avoid power interruption.',
          whereOrHow: 'Official utility portal or authorized cash counter',
          contactOrLink: 'bsesdelhi.com / 19122 (Toll Free)',
          isWarning: false,
        },
        {
          stepNumber: 2,
          title: 'Verify meter reading (Units: 342 kWh)',
          description: 'Check your physical meter counter DEL-83721. If the current reading is significantly less than 342 units, you can dispute the bill.',
          whereOrHow: 'Check physical meter outside your house',
          isWarning: false,
        },
        {
          stepNumber: 3,
          title: 'Keep download payment receipt',
          description: 'Always download and screenshot the digital acknowledgment with Transaction ID in case the lineman visits for inspection.',
          whereOrHow: 'Download PDF receipt',
          isWarning: false,
        },
      ],
      riskScamAssessment: {
        trustScore: 96,
        verdict: 'Authentic & Legitimate',
        isImpersonation: false,
        redFlags: [],
        safetyRecommendations: [
          'Pay directly via the official electricity board website or authorized UPI apps (Google Pay/Paytm/PhonePe electricity biller).',
          'Never pay cash to any unauthorized person claiming to be a visiting lineman without an official receipt book.',
        ],
      },
      keyTermsGlossary: [
        {
          term: 'Section 56 of Electricity Act 2003',
          simplifiedMeaning: 'The legal rule giving power companies the right to cut off electricity if bills are unpaid after giving a written notice of at least 15 days.',
          category: 'legal',
        },
        {
          term: 'LPSC (Late Payment Surcharge)',
          simplifiedMeaning: 'An extra penalty interest charge added to your bill because a previous bill was not paid on time.',
          category: 'financial',
        },
        {
          term: 'Arrears',
          simplifiedMeaning: 'Unpaid money owed from previous months that has been carried over to your current bill.',
          category: 'financial',
        },
        {
          term: 'Tariff (LT-1)',
          simplifiedMeaning: 'Low Tension Domestic rate slab specifically meant for residential household lights and appliances.',
          category: 'administrative',
        },
      ],
      fullTranscribedText: 'BSES Consumer No: 0284719284. Due: ₹5,545.50. Due Date: 05-Nov-2024. Notice under Section 56 Electricity Act.',
      language: 'en',
    },
  },
  {
    id: 'sample-prescription',
    name: 'Doctor Prescription',
    shortDesc: 'Antibiotics, BP Care & Dosage Timetable',
    badge: 'Medical Care (98/100)',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400',
    iconName: 'FileText',
    rawText: `APOLLO CLINIC & HEALTH CENTRE
Dr. Rajesh Sharma, MBBS, MD (Internal Medicine)
Reg No: MCI-48291 | Delhi Medical Council
Patient: Ramesh Kumar | Age: 54 Yrs | Date: 28-Oct-2024
Vitals: BP 142/90 mmHg | Temp: 101.2°F | SpO2: 98%
Diagnosis: Acute Bronchial Respiratory Infection + Essential Hypertension
-----------------------------------------------------------
Rx (Medications):
1. Tab Augmentin (Amoxicillin + Clavulanate) 625mg
   - Dosage: 1 Tablet Twice Daily (Every 12 hours) AFTER meals (8:00 AM & 8:00 PM)
   - Duration: 5 Days (MUST complete full 5-day antibiotic course even if feeling better)

2. Tab Dolo 650mg (Paracetamol)
   - Dosage: 1 Tablet S.O.S (Only when fever > 100°F or severe body ache)
   - Note: Minimum 6 hours gap between tablets. Do not exceed 3 tablets in 24 hours.

3. Tab Telmisartan 40mg
   - Dosage: 1 Tablet Once Daily in Morning EMPTY STOMACH (7:00 AM) regularly
   - Duration: Daily (Continue long-term for Blood Pressure)

4. Syrup Grilinctus 100ml
   - Dosage: 2 teaspoons (10 ml) Thrice Daily after meals for 5 days.

Instructions: Drink warm fluids. Salt water gargle 3 times a day.
Avoid cold beverages. If fever persists past Day 3 or any skin allergic rash appears, stop antibiotic and visit clinic immediately.
Generic equivalents acceptable.`,
    sampleVisual: {
      headerColor: 'bg-emerald-800 text-white',
      subHeader: 'MEDICAL PRESCRIPTION & DOSAGE SCHEDULE',
      lines: [
        'Doctor: Dr. Rajesh Sharma, MD (Reg: MCI-48291)',
        'Patient: Ramesh Kumar, 54y | Diagnosis: Bronchial Infection & BP',
        '1. Augmentin 625mg: 1 tab twice daily AFTER meals x 5 days (Finish course)',
        '2. Dolo 650mg: 1 tab S.O.S (Only if fever > 100°F, max 3/day)',
        '3. Telmisartan 40mg: 1 tab Morning EMPTY STOMACH regularly for BP',
        '4. Syrup Grilinctus: 10ml thrice daily after food x 5 days',
      ],
      highlightBox: 'KEY MEDICAL WARNING: Finish the entire 5-day course of Augmentin even if you feel fine, to prevent antibiotic resistance. Take BP pill empty stomach.',
    },
    document: {
      id: 'sample-prescription',
      createdAt: new Date().toISOString(),
      isSample: true,
      title: 'Doctor Prescription: Bronchitis & Blood Pressure Regimen',
      documentType: 'Medical Prescription',
      oneSentenceSummary: 'This is a doctor’s prescription for a chest infection and high blood pressure, detailing a 5-day antibiotic schedule and daily morning BP medication.',
      sender: 'Dr. Rajesh Sharma, MD (Apollo Clinic, Reg: MCI-48291)',
      dateReceivedOrIssued: '28-Oct-2024',
      amounts: [
        {
          label: 'Estimated Pharmacy Cost',
          value: '₹650 - ₹850',
          isSuspicious: false,
        },
        {
          label: 'Generic Substitute Cost (Jan Aushadhi)',
          value: '₹180 - ₹260',
          isSuspicious: false,
        },
      ],
      deadlines: [
        {
          label: 'Antibiotic Course End Date',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          urgency: 'moderate',
          consequenceOfMissing: 'Stopping antibiotics early can cause the bacterial infection to return stronger (antibiotic resistance).',
        },
      ],
      actionChecklist: [
        {
          stepNumber: 1,
          title: 'Take Augmentin 625mg twice daily after food',
          description: 'Take 1 tablet at 8:00 AM after breakfast and 1 tablet at 8:00 PM after dinner. Must complete full 5 days.',
          whereOrHow: 'With water after food',
          isWarning: false,
        },
        {
          stepNumber: 2,
          title: 'Take Telmisartan 40mg every morning on empty stomach',
          description: 'Take with a glass of plain water at 7:00 AM before tea or breakfast. Do not miss doses as it regulates your blood pressure.',
          whereOrHow: 'Morning routine before meals',
          isWarning: false,
        },
        {
          stepNumber: 3,
          title: 'Use Dolo 650 only if you have fever or pain',
          description: 'Do not take Dolo routinely; only take if body temperature exceeds 100°F. Never take more than 3 tablets in one day.',
          whereOrHow: 'As needed (SOS)',
          isWarning: true,
        },
        {
          stepNumber: 4,
          title: 'Ask for generic medicines to save 70%',
          description: 'The doctor noted "Generic equivalents acceptable". You can buy Amoxicillin+Clavulanate and Telmisartan from any Pradhan Mantri Jan Aushadhi Kendra at 1/4th the price.',
          whereOrHow: 'Jan Aushadhi Kendra or local chemist',
          contactOrLink: 'janaushadhi.gov.in',
          isWarning: false,
        },
      ],
      riskScamAssessment: {
        trustScore: 98,
        verdict: 'Authentic & Legitimate',
        isImpersonation: false,
        redFlags: [],
        safetyRecommendations: [
          'If you develop any skin rash, swelling, or difficulty breathing after Augmentin, stop immediately and visit the emergency room.',
        ],
      },
      keyTermsGlossary: [
        {
          term: 'S.O.S (Si Opus Sit)',
          simplifiedMeaning: 'A medical term meaning "take only when needed", such as when you actually have fever or pain, not on a fixed schedule.',
          category: 'medical',
        },
        {
          term: 'Antibiotic Resistance',
          simplifiedMeaning: 'When bacteria learn to survive medicine because the patient stopped taking the pills too early before all germs were eliminated.',
          category: 'medical',
        },
        {
          term: 'Essential Hypertension',
          simplifiedMeaning: 'The clinical term for high blood pressure that requires steady daily control with tablets and low salt diet.',
          category: 'medical',
        },
        {
          term: 'Generic Equivalent',
          simplifiedMeaning: 'Medicines with the exact same active chemical formula and medical strength as branded ones, but sold at a fraction of the cost.',
          category: 'financial',
        },
      ],
      prescriptionDetails: {
        doctorName: 'Dr. Rajesh Sharma, MBBS, MD',
        patientName: 'Ramesh Kumar (54 Yrs)',
        dietaryAdvice: 'Drink warm water, warm salt water gargle 3x daily. Avoid oily food and cold drinks.',
        warningSymptoms: 'Seek urgent care if fever stays above 101°F after 3 days or allergic rash appears.',
        medicines: [
          {
            name: 'Augmentin 625mg',
            dosage: '1 tab (every 12h)',
            timing: '8:00 AM & 8:00 PM after meals',
            duration: '5 days',
            instructions: 'Complete full 5 days without skipping.',
          },
          {
            name: 'Telmisartan 40mg',
            dosage: '1 tab daily',
            timing: '7:00 AM empty stomach',
            duration: 'Ongoing',
            instructions: 'Keep taking regularly for blood pressure control.',
          },
          {
            name: 'Dolo 650mg',
            dosage: '1 tab as needed (SOS)',
            timing: 'Only if fever > 100°F',
            duration: 'As needed',
            instructions: 'Minimum 6 hours between pills; max 3/day.',
          },
          {
            name: 'Grilinctus Syrup',
            dosage: '10 ml (2 tsp)',
            timing: 'Thrice daily after food',
            duration: '5 days',
            instructions: 'For cough relief.',
          },
        ],
      },
      fullTranscribedText: 'Apollo Clinic. Dr. Rajesh Sharma. Augmentin 625mg, Dolo 650mg, Telmisartan 40mg, Grilinctus syrup.',
      language: 'en',
    },
  },
];
