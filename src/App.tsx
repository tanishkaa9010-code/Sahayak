import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroUpload } from './components/HeroUpload';
import { DocumentView } from './components/DocumentView';
import { MyPapersDashboard } from './components/MyPapersDashboard';
import { HowItWorksModal } from './components/HowItWorksModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { DocumentAnalysis, SupportedLanguage } from './types/document';
import { SampleDocPreset, SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { loadSavedPapers, savePaper } from './utils/storage';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sahayak_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dashboard'>('analyzer');
  const [activeDocument, setActiveDocument] = useState<DocumentAnalysis | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [savedPapers, setSavedPapers] = useState<DocumentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync dark class to root document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sahayak_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sahayak_theme', 'light');
    }
  }, [isDark]);

  // Load saved papers from storage
  useEffect(() => {
    const papers = loadSavedPapers();
    setSavedPapers(papers);
  }, []);

  const handleToggleDark = () => {
    setIsDark(!isDark);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    if (activeDocument) {
      // If we have an active document, trigger a re-analysis in the new language
      handleReanalyzeWithLanguage(lang, activeDocument);
    }
  };

  const handleSelectSample = (sample: SampleDocPreset) => {
    setErrorMessage(null);
    setUploadedImageBase64(null);
    setActiveDocument(sample.document);
    setActiveTab('analyzer');
    savePaper(sample.document);
    setSavedPapers(loadSavedPapers());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyzeImage = async (base64: string, mimeType: string, filename: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setUploadedImageBase64(base64);

    try {
      const response = await fetch('/api/document/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          targetLanguage: currentLanguage,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to analyze document');
      }

      const analyzedDoc: DocumentAnalysis = {
        ...resData.data,
        id: `doc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        language: currentLanguage,
      };

      setActiveDocument(analyzedDoc);
      const updatedList = savePaper(analyzedDoc);
      setSavedPapers(updatedList);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(
        err.message || 'Unable to analyze document. Please ensure the image is clear and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeText = async (textContent: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setUploadedImageBase64(null);

    try {
      const response = await fetch('/api/document/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent,
          targetLanguage: currentLanguage,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to analyze text');
      }

      const analyzedDoc: DocumentAnalysis = {
        ...resData.data,
        id: `doc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        language: currentLanguage,
      };

      setActiveDocument(analyzedDoc);
      const updatedList = savePaper(analyzedDoc);
      setSavedPapers(updatedList);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(
        err.message || 'Unable to process notice text. Please verify the content and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReanalyzeWithLanguage = async (
    targetLang: SupportedLanguage,
    docContext?: DocumentAnalysis
  ) => {
    const doc = docContext || activeDocument;
    if (!doc) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/document/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: doc.fullTranscribedText || `${doc.title}\n${doc.oneSentenceSummary}`,
          imageBase64: uploadedImageBase64,
          targetLanguage: targetLang,
        }),
      });

      const resData = await response.json();
      if (response.ok && resData.data) {
        const updatedDoc: DocumentAnalysis = {
          ...resData.data,
          id: doc.id,
          createdAt: doc.createdAt,
          language: targetLang,
        };
        setActiveDocument(updatedDoc);
        savePaper(updatedDoc);
      }
    } catch (e) {
      console.error('Re-translation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDocument = (updated: DocumentAnalysis) => {
    setActiveDocument(updated);
    savePaper(updated);
    setSavedPapers(loadSavedPapers());
  };

  const handleSelectFromDashboard = (paper: DocumentAnalysis) => {
    setActiveDocument(paper);
    setActiveTab('analyzer');
    setUploadedImageBase64(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenDashboard={() => setActiveTab('dashboard')}
        savedCount={savedPapers.length}
        activeTab={activeTab}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mx-auto max-w-5xl px-4 pt-4">
            <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-xs sm:text-sm text-red-900 shadow-xs dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="ml-3 font-bold text-red-700 hover:text-red-900 dark:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton language={currentLanguage} />
        ) : activeTab === 'dashboard' ? (
          <MyPapersDashboard
            papers={savedPapers}
            onSelectPaper={handleSelectFromDashboard}
            onRefreshPapers={(papers) => setSavedPapers(papers)}
            onNewScan={() => {
              setActiveDocument(null);
              setActiveTab('analyzer');
            }}
            currentLanguage={currentLanguage}
          />
        ) : activeDocument ? (
          <DocumentView
            document={activeDocument}
            onBack={() => {
              setActiveDocument(null);
              setUploadedImageBase64(null);
            }}
            targetLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            uploadedImageBase64={uploadedImageBase64}
            onUpdateDocument={handleUpdateDocument}
            onReanalyzeWithLanguage={(lang) => handleReanalyzeWithLanguage(lang)}
          />
        ) : (
          <HeroUpload
            onAnalyzeImage={handleAnalyzeImage}
            onAnalyzeText={handleAnalyzeText}
            onSelectSample={handleSelectSample}
            isLoading={isLoading}
            selectedLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Sahayak (सहायक)
            </span>
            <span>•</span>
            <span>AI for Social Good</span>
            <span>•</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Multimodal Gemini 3.8 Flash Engine
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              How It Works & Architecture
            </button>
            <span>•</span>
            <span>Zero Server Data Retention Guarantee</span>
          </div>
        </div>
      </footer>

      {/* How it works modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
