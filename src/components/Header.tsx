import React from 'react';
import {
  FileText,
  HelpCircle,
  FolderOpen,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../types/document';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenHowItWorks: () => void;
  onOpenDashboard: () => void;
  savedCount: number;
  activeTab: 'analyzer' | 'dashboard';
  onSwitchTab: (tab: 'analyzer' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  isDark,
  onToggleDark,
  onOpenHowItWorks,
  savedCount,
  activeTab,
  onSwitchTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          onClick={() => onSwitchTab('analyzer')}
          className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 shadow-md shadow-indigo-500/20 text-white">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Sahayak
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                सहायक AI
              </span>
            </div>
            <p className="hidden text-xs font-medium text-slate-500 sm:block dark:text-slate-400">
              Citizen Paperwork & Life-Admin Copilot
            </p>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onSwitchTab('analyzer')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'analyzer'
                ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Document Scanner</span>
          </button>
          <button
            onClick={() => onSwitchTab('dashboard')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
            <span>My Papers</span>
            {savedCount > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {savedCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="relative flex items-center">
            <Globe className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
            <select
              aria-label="Select explanation language"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Dashboard button */}
          <button
            onClick={() => onSwitchTab(activeTab === 'analyzer' ? 'dashboard' : 'analyzer')}
            className="flex md:hidden items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title={activeTab === 'analyzer' ? 'View My Papers' : 'Back to Scanner'}
          >
            {activeTab === 'analyzer' ? <FolderOpen className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </button>

          {/* How It Works Button for Judges */}
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center space-x-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
