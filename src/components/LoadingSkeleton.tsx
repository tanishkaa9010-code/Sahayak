import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, FileSearch, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage } from '../types/document';

interface LoadingSkeletonProps {
  language: SupportedLanguage;
}

const STEPS = [
  'Extracting text & visual details with Gemini Multimodal OCR...',
  'Analyzing authenticity & scanning for phishing/fraud triggers...',
  'Calculating deadlines, penalties, and payment countdowns...',
  'Converting dense paperwork into 6th-grade action checklist...',
];

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-3xl border border-indigo-200 bg-white p-8 sm:p-12 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900 transition-colors">
        {/* Animated Scanner Visual */}
        <div className="relative mx-auto h-28 w-24 rounded-2xl border-2 border-indigo-300 bg-indigo-50/50 p-3 shadow-inner dark:border-indigo-800 dark:bg-indigo-950/30 overflow-hidden">
          {/* Document lines simulation */}
          <div className="space-y-2 opacity-40">
            <div className="h-2 w-3/4 rounded bg-indigo-400" />
            <div className="h-2 w-full rounded bg-indigo-300" />
            <div className="h-2 w-5/6 rounded bg-indigo-300" />
            <div className="h-2 w-2/3 rounded bg-indigo-300" />
            <div className="h-2 w-4/5 rounded bg-indigo-300" />
          </div>

          {/* Animated laser scanning line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-md shadow-amber-400/50 animate-bounce top-2" />
        </div>

        <h2 className="mt-6 text-xl font-black text-slate-900 dark:text-white">
          Sahayak is decoding your document...
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Powered by Gemini 3.8 Flash • Multimodal Structured Reasoning
        </p>

        {/* Step Progress indicators */}
        <div className="mx-auto mt-6 max-w-md space-y-2.5 text-left text-xs">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-2.5 rounded-xl p-2.5 transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-900'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full border border-slate-300 dark:border-slate-700" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
