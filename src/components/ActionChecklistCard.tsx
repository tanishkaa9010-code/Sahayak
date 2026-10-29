import React from 'react';
import { CheckSquare, Square, AlertCircle, ExternalLink, PhoneCall, CheckCircle2 } from 'lucide-react';
import { ActionItem } from '../types/document';

interface ActionChecklistCardProps {
  items: ActionItem[];
  onToggleItem: (stepNumber: number) => void;
}

export const ActionChecklistCard: React.FC<ActionChecklistCardProps> = ({
  items,
  onToggleItem,
}) => {
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              What do I need to do? (Action Steps)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Follow these ordered steps one by one. Tap to mark as done:
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full dark:bg-indigo-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const isDone = !!item.completed;

          return (
            <div
              key={item.stepNumber}
              onClick={() => onToggleItem(item.stepNumber)}
              className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/40 text-slate-500 dark:border-emerald-950 dark:bg-emerald-950/20 dark:text-slate-400'
                  : item.isWarning
                  ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 dark:border-amber-900/60 dark:bg-amber-950/20'
                  : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Checkbox button */}
                <button
                  type="button"
                  aria-label={`Mark step ${item.stepNumber} ${isDone ? 'incomplete' : 'complete'}`}
                  className="mt-0.5 shrink-0 focus:outline-none"
                >
                  {isDone ? (
                    <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        isDone
                          ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
                      }`}
                    >
                      {item.stepNumber}
                    </span>
                    <h3
                      className={`text-sm font-bold transition-all ${
                        isDone
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}
                    >
                      {item.title}
                    </h3>

                    {item.isWarning && (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <AlertCircle className="h-3 w-3" />
                        <span>Caution</span>
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-1.5 text-xs leading-relaxed ${
                      isDone
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Location or Contact link */}
                  {(item.whereOrHow || item.contactOrLink) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/50 text-[11px] dark:border-slate-800/60">
                      {item.whereOrHow && (
                        <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          📍 {item.whereOrHow}
                        </span>
                      )}
                      {item.contactOrLink && (
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                          <PhoneCall className="h-3 w-3" />
                          {item.contactOrLink}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
