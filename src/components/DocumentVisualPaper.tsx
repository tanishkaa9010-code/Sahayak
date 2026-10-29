import React from 'react';
import { FileText, Smartphone, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { DocumentAnalysis } from '../types/document';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

interface DocumentVisualPaperProps {
  document: DocumentAnalysis;
  uploadedImageBase64?: string | null;
}

export const DocumentVisualPaper: React.FC<DocumentVisualPaperProps> = ({
  document,
  uploadedImageBase64,
}) => {
  // Check if this matches one of our sample presets
  const samplePreset = SAMPLE_DOCUMENTS.find((s) => s.id === document.id);
  const isSMS = document.documentType === 'Bank / Financial' || document.title.toLowerCase().includes('sms') || document.title.toLowerCase().includes('phishing');

  if (uploadedImageBase64) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Scanned Document Image
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">Gemini Multimodal OCR Verified</span>
        </div>
        <div className="max-h-96 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center dark:border-slate-800 dark:bg-slate-950">
          <img
            src={uploadedImageBase64}
            alt="Scanned document"
            className="w-full h-auto object-contain max-h-96"
          />
        </div>
      </div>
    );
  }

  if (samplePreset) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 text-xs font-bold text-slate-500 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            {isSMS ? <Smartphone className="h-3.5 w-3.5 text-red-500" /> : <FileText className="h-3.5 w-3.5 text-indigo-500" />}
            {isSMS ? 'Simulated Mobile Alert / SMS' : 'Simulated Official Document'}
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
            Interactive Preset
          </span>
        </div>

        {/* Paper or Phone frame */}
        <div
          className={`rounded-xl border p-4 font-mono text-xs shadow-inner leading-relaxed ${
            samplePreset.id === 'sample-scam-sms'
              ? 'border-red-300 bg-gradient-to-b from-red-950 to-slate-900 text-red-100'
              : samplePreset.id === 'sample-power-bill'
              ? 'border-amber-300 bg-amber-50/50 text-slate-800 dark:bg-slate-950 dark:text-amber-100'
              : 'border-emerald-300 bg-emerald-50/40 text-slate-800 dark:bg-slate-950 dark:text-emerald-100'
          }`}
        >
          <div className="font-sans font-bold text-xs uppercase tracking-wider mb-2 border-b pb-1 opacity-80">
            {samplePreset.sampleVisual.subHeader}
          </div>
          <div className="space-y-1.5 text-[11px]">
            {samplePreset.sampleVisual.lines.map((line, idx) => (
              <p key={idx} className="whitespace-pre-wrap">{line}</p>
            ))}
          </div>
          {samplePreset.sampleVisual.highlightBox && (
            <div className="mt-3 p-2.5 rounded-lg bg-black/20 text-[10px] font-sans font-semibold border border-white/10">
              {samplePreset.sampleVisual.highlightBox}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback visual paper card
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b pb-2 mb-3 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Document Overview
        </span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
        {document.fullTranscribedText || document.oneSentenceSummary}
      </div>
    </div>
  );
};
