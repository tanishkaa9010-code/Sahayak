import React from 'react';
import { Calendar, Clock, DollarSign, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AmountItem, DeadlineItem } from '../types/document';
import { calculateCountdown } from '../utils/countdown';

interface DeadlinesAndAmountsProps {
  amounts: AmountItem[];
  deadlines: DeadlineItem[];
}

export const DeadlinesAndAmounts: React.FC<DeadlinesAndAmountsProps> = ({
  amounts,
  deadlines,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Deadlines Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="h-4 w-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Deadlines & Due Dates
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live countdown & consequences
            </p>
          </div>
        </div>

        {deadlines && deadlines.length > 0 ? (
          <div className="mt-3.5 space-y-3">
            {deadlines.map((dl, idx) => {
              const countdown = calculateCountdown(dl.dueDate);

              let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
              if (countdown.isOverdue || dl.urgency === 'urgent') {
                badgeStyle = 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
              } else if (dl.urgency === 'moderate') {
                badgeStyle = 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
              } else {
                badgeStyle = 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
              }

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {dl.label}
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{dl.dueDate || 'Immediate'}</span>
                      </div>
                    </div>

                    {/* Countdown Badge */}
                    <span
                      className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${badgeStyle}`}
                    >
                      <Clock className="h-3 w-3" />
                      <span>{countdown.formattedText}</span>
                    </span>
                  </div>

                  {/* Consequence of missing */}
                  {dl.consequenceOfMissing && (
                    <div className="mt-2.5 flex items-start space-x-1.5 rounded-lg bg-white/80 p-2 text-[11px] text-slate-600 dark:bg-slate-900/60 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-slate-700 dark:text-slate-200">If missed: </strong>
                        {dl.consequenceOfMissing}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-slate-400">
            No strict deadlines found in this document.
          </p>
        )}
      </div>

      {/* Amounts Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="text-sm font-black">₹</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Amounts & Financial Impact
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dues, penalties & scam risks
            </p>
          </div>
        </div>

        {amounts && amounts.length > 0 ? (
          <div className="mt-3.5 space-y-2.5">
            {amounts.map((amt, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-xl p-3 border ${
                  amt.isSuspicious
                    ? 'border-red-300 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/30'
                    : 'border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {amt.isSuspicious && (
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {amt.label}
                    </span>
                    {amt.isSuspicious && (
                      <span className="block text-[10px] font-bold text-red-600 dark:text-red-400">
                        Suspicious / Unverified Demand
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`text-base font-black tracking-tight ${
                    amt.isSuspicious
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {amt.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-slate-400">
            No specific monetary amounts mentioned.
          </p>
        )}
      </div>
    </div>
  );
};
