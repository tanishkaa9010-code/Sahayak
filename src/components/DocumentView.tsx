import React, { useState } from 'react';
import {
  ArrowLeft,
  FileCheck,
  Volume2,
  Share2,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Printer,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { DocumentAnalysis, SupportedLanguage } from '../types/document';
import { TrustGauge } from './TrustGauge';
import { ActionChecklistCard } from './ActionChecklistCard';
import { DeadlinesAndAmounts } from './DeadlinesAndAmounts';
import { KeyTermsGlossary } from './KeyTermsGlossary';
import { PrescriptionSchedule } from './PrescriptionSchedule';
import { VoiceQABox } from './VoiceQABox';
import { DocumentVisualPaper } from './DocumentVisualPaper';
import { DraftHelperModal } from './DraftHelperModal';
import { toggleActionChecklist } from '../utils/storage';

interface DocumentViewProps {
  document: DocumentAnalysis;
  onBack: () => void;
  targetLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  uploadedImageBase64?: string | null;
  onUpdateDocument: (updated: DocumentAnalysis) => void;
  onReanalyzeWithLanguage: (lang: SupportedLanguage) => void;
  isReanalyzing?: boolean;
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  document,
  onBack,
  targetLanguage,
  onLanguageChange,
  uploadedImageBase64,
  onUpdateDocument,
  onReanalyzeWithLanguage,
  isReanalyzing,
}) => {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const handleToggleChecklist = (stepNumber: number) => {
    const updated = toggleActionChecklist(document.id, stepNumber);
    if (updated) {
      onUpdateDocument(updated);
    } else {
      // Local state fallback
      const newItems = document.actionChecklist.map((it) =>
        it.stepNumber === stepNumber ? { ...it, completed: !it.completed } : it
      );
      onUpdateDocument({ ...document, actionChecklist: newItems });
    }
  };

  const isScam = document.riskScamAssessment && document.riskScamAssessment.trustScore < 40;

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Scanner</span>
        </button>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Generate Official Draft</span>
          </button>
        </div>
      </div>

      {/* Main Pitch Card: "What is this?" in one plain sentence */}
      <div
        className={`rounded-3xl p-6 sm:p-8 shadow-sm border transition-all ${
          isScam
            ? 'border-red-300 bg-gradient-to-br from-red-500/10 via-red-500/5 to-white dark:from-red-950/40 dark:to-slate-900 dark:border-red-900/60'
            : 'border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/30 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-slate-900'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-black uppercase tracking-wider dark:bg-white dark:text-slate-900">
              {document.documentType}
            </span>
            {document.sender && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Issued by: <strong className="text-slate-800 dark:text-slate-200">{document.sender}</strong>
              </span>
            )}
          </div>

          {document.dateReceivedOrIssued && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Date: {document.dateReceivedOrIssued}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {document.title}
        </h1>

        {/* "What is this?" in 1 Plain Sentence */}
        <div className="mt-4 rounded-2xl bg-white/90 p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            What is this? (Plain 6th-Grade Explanation)
          </span>
          <p className="mt-1.5 text-base sm:text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-100">
            {document.oneSentenceSummary}
          </p>
        </div>
      </div>

      {/* Grid Layout: Visual Paper & Core Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Paper + Voice QA + Glossaries */}
        <div className="lg:col-span-1 space-y-6">
          {/* Visual Paper / Preview */}
          <DocumentVisualPaper
            document={document}
            uploadedImageBase64={uploadedImageBase64}
          />

          {/* Voice Mode & Q&A Box */}
          <VoiceQABox
            document={document}
            targetLanguage={targetLanguage}
          />

          {/* Key Terms Glossary */}
          <KeyTermsGlossary terms={document.keyTermsGlossary} />
        </div>

        {/* Right Column: Trust Score + Action Checklist + Deadlines/Amounts + Medical */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trust Gauge / Scam Alert */}
          <TrustGauge assessment={document.riskScamAssessment} />

          {/* Prescription Schedule (if medical prescription) */}
          {document.prescriptionDetails && (
            <PrescriptionSchedule details={document.prescriptionDetails} />
          )}

          {/* "What do I need to do?" Action Checklist */}
          <ActionChecklistCard
            items={document.actionChecklist}
            onToggleItem={handleToggleChecklist}
          />

          {/* Deadlines & Financial Amounts */}
          <DeadlinesAndAmounts
            amounts={document.amounts}
            deadlines={document.deadlines}
          />

          {/* One-click Draft Prompt Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-amber-600 p-5 text-white shadow-md gap-4">
            <div>
              <h2 className="text-base font-bold">
                Need to respond, appeal, or report this?
              </h2>
              <p className="mt-0.5 text-xs text-indigo-100">
                Sahayak creates an official ready-to-dispatch complaint, dispute, or extension letter in seconds.
              </p>
            </div>
            <button
              onClick={() => setIsDraftModalOpen(true)}
              className="whitespace-nowrap rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-indigo-900 shadow-md hover:bg-indigo-50 transition-all"
            >
              Draft Official Letter &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Draft Helper Modal */}
      <DraftHelperModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        document={document}
        targetLanguage={targetLanguage}
      />
    </div>
  );
};
