export type SupportedLanguage = 'en' | 'hi' | 'pa' | 'ta' | 'bn' | 'mr' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

export interface AmountItem {
  label: string;
  value: string;
  isSuspicious?: boolean;
}

export interface DeadlineItem {
  label: string;
  dueDate: string;
  urgency: 'urgent' | 'moderate' | 'relaxed';
  consequenceOfMissing: string;
}

export interface ActionItem {
  stepNumber: number;
  title: string;
  description: string;
  whereOrHow: string;
  contactOrLink?: string;
  isWarning?: boolean;
  completed?: boolean;
}

export interface RiskScamAssessment {
  trustScore: number; // 0 - 100
  verdict: 'High Scam Risk' | 'Suspicious' | 'Authentic & Legitimate' | string;
  redFlags: string[];
  safetyRecommendations: string[];
  isImpersonation: boolean;
}

export interface KeyTerm {
  term: string;
  simplifiedMeaning: string;
  category: 'financial' | 'legal' | 'medical' | 'administrative' | string;
}

export interface PrescriptionDetails {
  doctorName?: string;
  patientName?: string;
  medicines?: {
    name: string;
    dosage: string;
    timing: string;
    duration?: string;
    instructions?: string;
  }[];
  dietaryAdvice?: string;
  warningSymptoms?: string;
}

export interface DocumentAnalysis {
  id: string;
  createdAt: string;
  title: string;
  documentType: 'Government Notice' | 'Bank / Financial' | 'Utility Bill' | 'Medical Prescription' | 'Legal / Tax Notice' | 'Other' | string;
  oneSentenceSummary: string;
  sender: string;
  dateReceivedOrIssued?: string;
  amounts: AmountItem[];
  deadlines: DeadlineItem[];
  actionChecklist: ActionItem[];
  riskScamAssessment: RiskScamAssessment;
  keyTermsGlossary: KeyTerm[];
  fullTranscribedText?: string;
  prescriptionDetails?: PrescriptionDetails;
  previewImage?: string;
  language: SupportedLanguage;
  isSample?: boolean;
}

export interface QAResponse {
  answer: string;
  confidence: 'high' | 'moderate' | 'low';
  relevantQuoteOrDetail?: string;
  actionableAdvice: string;
}

export interface DraftResponse {
  title: string;
  recipientAuthority: string;
  subjectLine: string;
  salutation: string;
  bodyParagraphs: string[];
  enclosures?: string[];
  closing: string;
  citizenRightsTip: string;
}
