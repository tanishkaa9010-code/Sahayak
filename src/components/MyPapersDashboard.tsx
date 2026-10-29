import React, { useState } from 'react';
import {
  FolderOpen,
  Calendar,
  AlertTriangle,
  Zap,
  FileText,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Clock,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { DocumentAnalysis, SupportedLanguage } from '../types/document';
import { calculateMoneyAtStake, deletePaper } from '../utils/storage';
import { calculateCountdown } from '../utils/countdown';

interface MyPapersDashboardProps {
  papers: DocumentAnalysis[];
  onSelectPaper: (paper: DocumentAnalysis) => void;
  onRefreshPapers: (papers: DocumentAnalysis[]) => void;
  onNewScan: () => void;
  currentLanguage: SupportedLanguage;
}

export const MyPapersDashboard: React.FC<MyPapersDashboardProps> = ({
  papers,
  onSelectPaper,
  onRefreshPapers,
  onNewScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const moneySummary = calculateMoneyAtStake(papers);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deletePaper(id);
    onRefreshPapers(updated);
  };

  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.oneSentenceSummary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      (categoryFilter === 'Scams' && p.riskScamAssessment?.trustScore < 40) ||
      (categoryFilter === 'Deadlines' && p.deadlines && p.deadlines.length > 0) ||
      p.documentType === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort by urgency: overdue/urgent first, then created date
  const sortedPapers = [...filteredPapers].sort((a, b) => {
    const aUrgent = a.deadlines?.some((d) => d.urgency === 'urgent');
    const bUrgent = b.deadlines?.some((d) => d.urgency === 'urgent');
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-amber-500" />
            My Papers & Life-Admin Vault
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            All scanned bills, notices, prescriptions, and scam records saved privately on your device.
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="self-start sm:self-auto flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition-all"
        >
          <span>+ Scan New Paper</span>
        </button>
      </div>

      {/* Money at Stake Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Scam Loss Prevented */}
        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 shadow-xs dark:border-red-900/60 dark:from-red-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Scam Loss Prevented
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ₹{moneySummary.scamLossPrevented.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            From flagged phishing SMS & fake bank demands
          </p>
        </div>

        {/* Dues Payable */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-xs dark:border-amber-900/60 dark:from-amber-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Upcoming Legitimate Dues
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ₹{moneySummary.totalDuePayable.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Across active electricity & utility bills
          </p>
        </div>

        {/* Healthcare Savings */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-xs dark:border-emerald-900/60 dark:from-emerald-950/20 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Generic Medicine Savings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ₹{moneySummary.totalSavedDiscount.toLocaleString('en-IN') || '450'}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Estimated savings via Jan Aushadhi alternatives
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search papers, organizations, or notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          {['All', 'Scams', 'Deadlines', 'Utility Bill', 'Medical Prescription'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      {sortedPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPapers.map((paper) => {
            const isScam = paper.riskScamAssessment && paper.riskScamAssessment.trustScore < 40;
            const primaryDeadline = paper.deadlines?.[0];
            const countdown = primaryDeadline ? calculateCountdown(primaryDeadline.dueDate) : null;
            const completedCount = paper.actionChecklist?.filter((a) => a.completed).length || 0;
            const totalActions = paper.actionChecklist?.length || 0;

            return (
              <div
                key={paper.id}
                onClick={() => onSelectPaper(paper)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
                  isScam
                    ? 'border-red-300 bg-red-50/30 hover:border-red-400 dark:border-red-950 dark:bg-red-950/10'
                    : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {paper.documentType}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black border ${
                          isScam
                            ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {paper.riskScamAssessment?.trustScore}/100 Trust
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDelete(e, paper.id)}
                        title="Delete paper"
                        className="rounded-lg p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Sender */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {paper.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {paper.sender}
                  </p>

                  {/* Plain Summary */}
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {paper.oneSentenceSummary}
                  </p>
                </div>

                {/* Bottom Footer Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  {/* Deadlines if any */}
                  {countdown && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3" />
                        {primaryDeadline?.label}:
                      </span>
                      <span
                        className={`font-bold text-[11px] ${
                          countdown.isOverdue || countdown.urgencyLevel === 'urgent'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {countdown.formattedText}
                      </span>
                    </div>
                  )}

                  {/* Actions progress */}
                  {totalActions > 0 && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-indigo-500" />
                        Action Checklist
                      </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {completedCount}/{totalActions} done
                      </span>
                    </div>
                  )}

                  {/* Date saved */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>Saved: {new Date(paper.createdAt).toLocaleDateString()}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5 group-hover:underline">
                      Open Paper &gt;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            No papers found
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search query or upload a new notice to save it here.
          </p>
        </div>
      )}
    </div>
  );
};
