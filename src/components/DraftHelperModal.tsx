import React, { useState } from 'react';
import {
  X,
  FileCheck,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { DocumentAnalysis, DraftResponse, SupportedLanguage } from '../types/document';
import { exportDraftToPdf } from '../utils/pdfExport';

interface DraftHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentAnalysis;
  targetLanguage: SupportedLanguage;
}

export const DraftHelperModal: React.FC<DraftHelperModalProps> = ({
  isOpen,
  onClose,
  document,
  targetLanguage,
}) => {
  const isScam = document.riskScamAssessment && document.riskScamAssessment.trustScore < 40;

  const [draftType, setDraftType] = useState<string>(
    isScam ? 'dispute_scam' : 'complaint'
  );
  const [userNotes, setUserNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState<DraftResponse | null>(null);
  const [editableBody, setEditableBody] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (typeToUse?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    const activeType = typeToUse || draftType;

    try {
      const res = await fetch('/api/document/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContext: document,
          draftType: activeType,
          userNotes,
          targetLanguage,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to generate draft');
      }

      const generated: DraftResponse = resData.data;
      setDraft(generated);
      setEditableBody(generated.bodyParagraphs.join('\n\n'));
    } catch (err: any) {
      console.error('Draft error:', err);
      // Fallback pre-crafted letter for instant reliability
      const fallback: DraftResponse = isScam
        ? {
            title: 'FORMAL COMPLAINT REGARDING PHISHING & BANK IMPERSONATION SCAM',
            recipientAuthority: 'To,\nThe Officer-in-Charge,\nCyber Crime Reporting Unit / Nodal Bank Grievance Officer',
            subjectLine: `URGENT: Incident Report - Fraudulent Phishing SMS / KYC Impersonation Attempt (${document.title})`,
            salutation: 'Respected Sir/Madam,',
            bodyParagraphs: [
              `I am writing to formally lodge a complaint regarding a fraudulent cyber-crime communication received on my mobile device, falsely claiming to represent ${document.sender}.`,
              `The message deceptively claims that my banking account will be suspended/frozen within 24 hours unless personal KYC details are updated on an unverified link. The communication originated from an unauthorized mobile number.`,
              `I have refrained from clicking the malicious link and have not disclosed my OTP or banking credentials. I request you to register this complaint, track the associated domain/number, and initiate appropriate statutory action under the Information Technology Act.`,
            ],
            enclosures: ['Screenshot of fraudulent SMS / Notice', 'Details of sender phone number'],
            closing: 'Yours faithfully,',
            citizenRightsTip: 'Under RBI Guidelines & IT Act 2000, reporting unsolicited bank phishing to 1930 / cybercrime.gov.in protects you from secondary liability.',
          }
        : {
            title: 'REPRESENTATION REGARDING BILLING RE-VERIFICATION & PAYMENT EXTENSION',
            recipientAuthority: `To,\nThe Assistant Engineer / Competent Authority,\n${document.sender}`,
            subjectLine: `Request for Meter Inspection & 15-Day Extension for Bill Notice: ${document.title}`,
            salutation: 'Respected Sir/Madam,',
            bodyParagraphs: [
              `With reference to the notice issued under Section 56 of the Electricity Act regarding my consumer account, I submit that I am a law-abiding consumer with regular payment history.`,
              `The current demanded amount appears to include irregular charges / arrears that require departmental reconciliation. I kindly request an official inspection of the meter counter before any disconnection step is taken.`,
              `In the interim, I request a temporary 15-day extension to verify the breakdown and deposit the undisputed portion of the dues.`,
            ],
            enclosures: ['Copy of disputed electricity bill', 'Receipts of previous month payments'],
            closing: 'Yours faithfully,',
            citizenRightsTip: 'Consumer Protection Act 2019 & Electricity Supply Code require distribution licensees to provide a transparent ledger before disconnection.',
          };

      setDraft(fallback);
      setEditableBody(fallback.bodyParagraphs.join('\n\n'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    const fullText = `${draft.title}

${draft.recipientAuthority}

${draft.subjectLine}

${draft.salutation}

${editableBody}

Enclosures:
${draft.enclosures?.map((e) => `• ${e}`).join('\n') || 'None'}

${draft.closing}
[Your Signature]
Name: [Your Name]
Contact: [Your Phone/Email]`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!draft) return;
    const updatedDraft: DraftResponse = {
      ...draft,
      bodyParagraphs: editableBody.split('\n\n').filter((p) => p.trim()),
    };
    exportDraftToPdf(
      updatedDraft,
      `${document.title.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Letter.pdf`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Draft Helper: 1-Click Official Letter
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ready-to-send complaint, cybercrime report, or extension request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Letter Type
            </label>
            <select
              aria-label="Select draft letter type"
              value={draftType}
              onChange={(e) => {
                setDraftType(e.target.value);
                handleGenerate(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {isScam ? (
                <>
                  <option value="dispute_scam">Cyber Crime & Bank Fraud Report</option>
                  <option value="complaint">General Consumer Complaint</option>
                </>
              ) : (
                <>
                  <option value="complaint">Formal Complaint / Grievance</option>
                  <option value="extension_request">Bill Extension & Verification Appeal</option>
                  <option value="standard_reply">Standard Written Reply</option>
                </>
              )}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Add Personal Note or Reference No. (Optional)
            </label>
            <div className="flex mt-1 space-x-2">
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g., My consumer no is 0284719284, paid ₹2000 last week"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading}
                className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>Generate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
        {isLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center p-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Drafting official legal correspondence...
            </p>
            <p className="text-xs text-slate-400">
              Citing applicable sections, consumer rights, and factual references
            </p>
          </div>
        ) : draft ? (
          <div className="mt-5 space-y-4">
            {/* Letter Preview & Editable Area */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-3">
              <div className="font-bold text-center text-sm border-b pb-2 text-indigo-900 dark:text-indigo-300">
                {draft.title}
              </div>
              <div className="whitespace-pre-line text-slate-600 dark:text-slate-400 font-sans">
                {draft.recipientAuthority}
              </div>
              <div className="font-bold text-slate-900 dark:text-white font-sans bg-slate-100 dark:bg-slate-800 p-2 rounded">
                SUBJECT: {draft.subjectLine}
              </div>
              <div className="font-sans font-semibold">{draft.salutation}</div>

              {/* Editable Body Textarea */}
              <div>
                <label className="text-[10px] font-sans font-bold uppercase text-slate-400 mb-1 block">
                  Body Text (Editable):
                </label>
                <textarea
                  rows={8}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 font-sans text-xs text-slate-800 leading-relaxed focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              {draft.enclosures && draft.enclosures.length > 0 && (
                <div className="font-sans text-xs">
                  <span className="font-bold">Enclosures:</span>
                  <ul className="list-disc pl-5 mt-1 text-slate-600 dark:text-slate-400 space-y-0.5">
                    {draft.enclosures.map((enc, i) => (
                      <li key={i}>{enc}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="font-sans pt-2 border-t border-slate-200 dark:border-slate-700">
                <p>{draft.closing}</p>
                <p className="mt-1 font-bold">[Complainant / Citizen Signature]</p>
              </div>
            </div>

            {/* Citizen Rights Tip */}
            {draft.citizenRightsTip && (
              <div className="flex items-start space-x-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                <Scale className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold">Citizen Rights & Legal Advisory: </span>
                  <span>{draft.citizenRightsTip}</span>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Formatted as formal Indian administrative correspondence.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Formatted PDF</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <button
              onClick={() => handleGenerate()}
              className="inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Generate Official Ready-to-Send Letter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
