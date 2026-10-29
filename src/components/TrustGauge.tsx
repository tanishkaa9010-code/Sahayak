import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { RiskScamAssessment } from '../types/document';

interface TrustGaugeProps {
  assessment: RiskScamAssessment;
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({ assessment }) => {
  const score = Math.max(0, Math.min(100, assessment.trustScore || 0));

  // Determine severity tier
  let statusColor = 'text-emerald-600 dark:text-emerald-400';
  let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
  let gaugeBarColor = '#10b981'; // emerald-500
  let isDanger = false;
  let isWarning = false;

  if (score < 40) {
    statusColor = 'text-red-600 dark:text-red-400';
    badgeBg = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800';
    gaugeBarColor = '#ef4444'; // red-500
    isDanger = true;
  } else if (score < 75) {
    statusColor = 'text-amber-600 dark:text-amber-400';
    badgeBg = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
    gaugeBarColor = '#f59e0b'; // amber-500
    isWarning = true;
  }

  // SVG gauge calculations (semi-circle)
  const radius = 45;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-sm ${
        isDanger
          ? 'border-red-300 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20'
          : isWarning
          ? 'border-amber-300 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              isDanger
                ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                : isWarning
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
            }`}
          >
            {isDanger ? (
              <ShieldAlert className="h-6 w-6 stroke-[2.2] animate-bounce" />
            ) : isWarning ? (
              <Shield className="h-6 w-6 stroke-[2.2]" />
            ) : (
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Authenticity & Scam Check
              </h2>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${badgeBg}`}>
                {assessment.verdict}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isDanger
                ? 'Urgent red flags detected. Highly probable scam or phishing attempt.'
                : isWarning
                ? 'Exercise caution. Contains elements requiring manual verification.'
                : 'Verified characteristics match legitimate official paperwork.'}
            </p>
          </div>
        </div>

        {/* Circular Radial Gauge */}
        <div className="flex items-center space-x-3 self-center sm:self-auto">
          <div className="relative flex flex-col items-center">
            <svg width="110" height="65" viewBox="0 0 110 65" className="overflow-visible">
              {/* Background semi-circle */}
              <path
                d="M 10 60 A 45 45 0 0 1 100 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                className="text-slate-200 dark:text-slate-800"
              />
              {/* Animated Progress semi-circle */}
              <path
                d="M 10 60 A 45 45 0 0 1 100 60"
                fill="none"
                stroke={gaugeBarColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className={`text-2xl font-black tracking-tight ${statusColor}`}>
                {score}
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Trust Score
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      {assessment.redFlags && assessment.redFlags.length > 0 && (
        <div className="mt-4 rounded-xl bg-red-100/70 p-3.5 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-900 dark:text-red-300 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>Identified Red Flags ({assessment.redFlags.length})</span>
          </div>
          <ul className="space-y-1.5 text-xs text-red-800 dark:text-red-300">
            {assessment.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="font-medium">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Recommendations */}
      {assessment.safetyRecommendations && assessment.safetyRecommendations.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Recommended Safety Actions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {assessment.safetyRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 rounded-lg bg-slate-50 p-2.5 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800"
              >
                <span className="mt-0.5 text-emerald-500 font-bold shrink-0">✓</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {assessment.isImpersonation && (
        <div className="mt-3 flex items-center space-x-2 text-xs font-semibold text-red-700 dark:text-red-400">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Warning: Document falsely impersonates a registered government or financial authority.</span>
        </div>
      )}
    </div>
  );
};
