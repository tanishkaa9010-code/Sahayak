import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Heart, Scale, Cpu, Lock } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                How Sahayak Works
              </h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                AI for Social Good
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The Architecture & Social Impact behind the Copilot
            </p>
          </div>
        </div>

        {/* The Problem */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              ⚠️ The Problem in Numbers
            </h3>
            <p>
              Over 500 million people across India receive complex government notices, bank KYC alerts, disconnection threats, and hospital prescriptions written in dense English or technical legalese. Every year, millions miss statutory deadlines, face unfair electricity disconnects, lose their savings to phishing scams, or take wrong medicine dosages because they could not decode what the paper was demanding.
            </p>
          </div>

          {/* 4-Step Solution Pipeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              🛠️ 4-Step Multimodal Engine
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-200 p-3 bg-white dark:border-slate-800 dark:bg-slate-850">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  1. Multimodal OCR & Vision
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Powered by <strong>Gemini 3.8 Flash</strong> to transcribe crumpled receipts, prescription handwriting, printed notices, and SMS screenshots with zero loss of nuance.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 bg-white dark:border-slate-800 dark:bg-slate-850">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  2. Scam & Fraud Engine (0-100)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Detects phishing domains (e.g. non-.sbi links), urgency panic tactics, unverified mobile headers, and advises reporting to 1930 / cybercrime.gov.in.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 bg-white dark:border-slate-800 dark:bg-slate-850">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  3. 6th-Grade Checklist & Voice
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Strictly structured JSON schemas force plain 1-sentence summaries, ordered checklists, interactive jargons glossary, and browser speech synthesis in 7 Indian languages.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 bg-white dark:border-slate-800 dark:bg-slate-850">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                  4. 1-Click Draft Helper & PDF
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Turns panic into immediate action by drafting formal complaints, cybercrime reports, or electricity billing extension letters formatted as official PDFs.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Architecture */}
          <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-200/80 dark:bg-indigo-950/40 dark:border-indigo-900/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Privacy & Local-First Philosophy
            </h3>
            <p className="text-indigo-950 dark:text-indigo-200 text-[11px] leading-relaxed">
              Documents are processed ephemerally on request. None of the citizen's personal paperwork or images are stored on external server databases. The "My Papers" vault resides 100% locally in browser storage on the user's phone or computer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
          >
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
