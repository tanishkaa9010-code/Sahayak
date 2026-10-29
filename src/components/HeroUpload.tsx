import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  Camera,
  FileText,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ClipboardPaste,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleDocPreset } from '../data/sampleDocuments';
import { SupportedLanguage } from '../types/document';

interface HeroUploadProps {
  onAnalyzeImage: (base64: string, mimeType: string, filename: string) => void;
  onAnalyzeText: (text: string, title?: string) => void;
  onSelectSample: (sample: SampleDocPreset) => void;
  isLoading: boolean;
  selectedLanguage: SupportedLanguage;
}

export const HeroUpload: React.FC<HeroUploadProps> = ({
  onAnalyzeImage,
  onAnalyzeText,
  onSelectSample,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [textInputMode, setTextInputMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|heic|pdf)$/i)) {
      setErrorMessage('Please upload a clear photo or PDF document (JPG, PNG, WEBP, or PDF).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size is too large (max 20MB). Please select a compressed image or take a fresh photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      onAnalyzeImage(base64String, file.type || 'image/jpeg', file.name);
    };
    reader.onerror = () => {
      setErrorMessage('Unable to read this file. Please check device permissions and try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      setErrorMessage('Please paste the SMS or notice text before submitting.');
      return;
    }
    setErrorMessage(null);
    onAnalyzeText(pastedText.trim());
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Background glow decorative blobs */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 opacity-30 dark:opacity-20">
        <div className="h-[480px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-400 via-amber-300 to-emerald-400 blur-3xl transform -translate-y-12"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Pitch & Hero Header */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-800 shadow-sm dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span>AI for Social Good • Legal & Life-Admin Inclusion</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white leading-[1.15]">
            Never lose money, miss deadlines, or get{' '}
            <span className="bg-gradient-to-r from-red-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
              scammed by paperwork
            </span>{' '}
            again.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Snap a photo of any confusing government notice, bank SMS, utility bill, or doctor’s prescription.
            Sahayak decodes it into a <strong className="font-semibold text-slate-900 dark:text-white">6th-grade action checklist</strong>, checks for fraud, and speaks in your language.
          </p>
        </div>

        {/* Instant Demo Presets Bar */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Try Instant Demo (Zero Upload Needed)
            </span>
            <span className="text-[11px] text-slate-400">
              Click any sample below to test live analysis & voice mode:
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SAMPLE_DOCUMENTS.map((sample) => {
              const isAlert = sample.id === 'sample-scam-sms';
              const isBill = sample.id === 'sample-power-bill';

              return (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  disabled={isLoading}
                  className="group relative flex flex-col text-left rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-indigo-500 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${sample.badgeColor}`}
                    >
                      {isAlert && <AlertTriangle className="h-3 w-3" />}
                      {isBill && <Zap className="h-3 w-3" />}
                      {!isAlert && !isBill && <FileText className="h-3 w-3" />}
                      {sample.badge}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sample.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1 dark:text-slate-400">
                    {sample.shortDesc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Zone & Mode Selector */}
        <div className="mt-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <button
              onClick={() => setTextInputMode(false)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                !textInputMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Scan Photo / PDF
            </button>
            <button
              onClick={() => setTextInputMode(true)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                textInputMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Paste SMS / Notice Text
            </button>
          </div>

          {!textInputMode ? (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30'
                  : 'border-slate-300 bg-white/70 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600'
              } shadow-sm backdrop-blur`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-950/70 dark:text-indigo-400 mb-4">
                <UploadCloud className="h-8 w-8 stroke-[1.8]" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Drop your document photo or PDF here
              </h2>
              <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Supports notices, electricity bills, hospital slips, court papers, tax letters & SMS screenshots.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4" />
                  <span>Browse File</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <Camera className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>Take Photo with Camera</span>
                </button>
              </div>

              <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-400">
                <span>PNG, JPG, WEBP, PDF up to 20MB</span>
                <span>•</span>
                <span>Auto OCR & Multimodal Analysis</span>
              </div>
            </div>
          ) : (
            /* Text Paste Form */
            <form
              onSubmit={handleTextSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="pastedText"
                  className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ClipboardPaste className="h-3.5 w-3.5 text-indigo-500" />
                  Paste Full Notice / SMS Text
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setPastedText(text);
                    } catch (e) {
                      // clipboard access denied
                    }
                  }}
                  className="text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Paste from Clipboard
                </button>
              </div>
              <textarea
                id="pastedText"
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Example: Dear Customer, Your electricity connection DEL-83721 will be disconnected on 05-Nov for unpaid bill of ₹5,545.50..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !pastedText.trim()}
                  className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Text with Sahayak</span>
                </button>
              </div>
            </form>
          )}

          {/* Error Message with retry tip */}
          {errorMessage && (
            <div className="mt-4 flex items-start space-x-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <p className="mt-0.5 text-[11px] opacity-80">
                  Tip: Ensure good lighting, lay the paper flat, and keep all edges inside the frame.
                </p>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="mt-5 flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong className="font-semibold text-slate-700 dark:text-slate-300">Privacy Guarantee:</strong> Documents are processed securely per request and never stored on any external server.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
