import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { KeyTerm } from '../types/document';

interface KeyTermsGlossaryProps {
  terms: KeyTerm[];
}

export const KeyTermsGlossary: React.FC<KeyTermsGlossaryProps> = ({ terms }) => {
  const [selectedTerm, setSelectedTerm] = useState<KeyTerm | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!terms || terms.length === 0) return null;

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'financial':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'legal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'medical':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Key Terms Glossary
            <span className="text-[10px] rounded-full bg-slate-100 px-2 py-0.2 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {terms.length} jargon words simplified
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tap any term below to reveal what it actually means in plain words:
          </p>
        </div>
      </div>

      {/* Pill buttons for quick tap */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {terms.map((item, idx) => {
          const isSelected = expandedIndex === idx;

          return (
            <button
              key={idx}
              onClick={() => toggleExpand(idx)}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{item.term}</span>
              {isSelected ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3 opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded Term Details */}
      {expandedIndex !== null && terms[expandedIndex] && (
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/40 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-indigo-900 dark:text-indigo-200">
              {terms[expandedIndex].term}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(
                terms[expandedIndex].category
              )}`}
            >
              {terms[expandedIndex].category}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
            💡 {terms[expandedIndex].simplifiedMeaning}
          </p>
        </div>
      )}
    </div>
  );
};
