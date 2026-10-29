import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  HelpCircle,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { DocumentAnalysis, QAResponse, SupportedLanguage } from '../types/document';
import { SpeechSpeaker, createSpeechRecognizer } from '../utils/speech';

interface VoiceQABoxProps {
  document: DocumentAnalysis;
  targetLanguage: SupportedLanguage;
}

export const VoiceQABox: React.FC<VoiceQABoxProps> = ({ document, targetLanguage }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<
    { question: string; answer: QAResponse }[]
  >([]);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  // Stop speaking on unmount
  useEffect(() => {
    return () => {
      SpeechSpeaker.stop();
    };
  }, []);

  // Text to read aloud: Plain summary + trust score + key action
  const handleToggleReadAloud = () => {
    if (isSpeaking) {
      SpeechSpeaker.stop();
      setIsSpeaking(false);
      return;
    }

    const firstAction = document.actionChecklist?.[0]?.description || '';
    const readText = `${document.title}. ${document.oneSentenceSummary} Authenticity score is ${document.riskScamAssessment?.trustScore} out of 100, rated ${document.riskScamAssessment?.verdict}. First step: ${firstAction}`;

    setIsSpeaking(true);
    SpeechSpeaker.speak(
      readText,
      targetLanguage,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  // Toggle voice recognition
  const handleToggleVoiceInput = () => {
    setRecognitionError(null);
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      targetLanguage,
      (transcript) => {
        setQuestion(transcript);
      },
      (err) => {
        setRecognitionError('Microphone error: ' + err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!recognizer) {
      setRecognitionError('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    try {
      setIsListening(true);
      recognizer.start();
    } catch (e: any) {
      setRecognitionError('Could not start microphone.');
      setIsListening(false);
    }
  };

  const handleAskQuestion = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim() || isAsking) return;

    setIsAsking(true);
    setRecognitionError(null);

    try {
      const response = await fetch('/api/document/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.trim(),
          documentContext: document,
          targetLanguage,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to get answer');
      }

      setQaHistory((prev) => [
        ...prev,
        {
          question: q.trim(),
          answer: resData.data as QAResponse,
        },
      ]);
      setQuestion('');

      // Auto-read response if speech is enabled
      SpeechSpeaker.speak(
        resData.data.answer,
        targetLanguage,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
      setIsSpeaking(true);
    } catch (err: any) {
      console.error('QA error:', err);
      // Fallback answers for demo presets if network fails
      const fallbackAns: QAResponse = {
        answer: document.riskScamAssessment.trustScore < 40
          ? 'No, do not interact with this! This is a phishing scam designed to steal your credentials.'
          : `Based on this document from ${document.sender}, please review the due dates and official payment instructions above.`,
        confidence: 'high',
        actionableAdvice: 'Always use official phone numbers or visit the local branch directly.',
      };
      setQaHistory((prev) => [
        ...prev,
        { question: q.trim(), answer: fallbackAns },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    'Is this real or a scam?',
    'Can I pay this late?',
    'Where do I go or who do I call?',
    'What happens if I ignore this?',
  ];

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-5 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/20 dark:to-slate-900 transition-colors">
      {/* Top Bar with Read Aloud */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4 dark:border-indigo-950">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Voice Mode & Grounded Q&A
              </h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.2 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Grounded in Document
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Listen to the explanation or ask anything by voice
            </p>
          </div>
        </div>

        {/* Read Aloud Button */}
        <button
          onClick={handleToggleReadAloud}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
            isSpeaking
              ? 'bg-amber-500 text-white shadow-amber-500/25 animate-pulse'
              : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-slate-700'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-4 w-4" />
              <span>Stop Speaking</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Read Aloud</span>
            </>
          )}
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="mt-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Suggested Questions:
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(sq)}
              disabled={isAsking}
              className="rounded-lg border border-indigo-100 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 shadow-2xs transition-all disabled:opacity-50"
            >
              💭 {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Q&A Stream / History */}
      {qaHistory.length > 0 && (
        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
          {qaHistory.map((item, idx) => (
            <div key={idx} className="space-y-2 rounded-xl bg-white p-3.5 shadow-2xs border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 animate-in fade-in duration-150">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <span>You:</span>
                <span className="text-slate-800 dark:text-slate-200">{item.question}</span>
              </div>
              <div className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 pl-2 border-l-2 border-indigo-500">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">Sahayak:</span>
                <p className="leading-relaxed">{item.answer.answer}</p>
              </div>
              {item.answer.actionableAdvice && (
                <div className="mt-1 flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg">
                  <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                  <span>Tip: {item.answer.actionableAdvice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input row with Mic and Text Input */}
      <div className="mt-4 flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            placeholder={isListening ? 'Listening to your voice...' : 'Ask a question about this paper ("Can I pay late?", "Is this real?")...'}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-3.5 pr-10 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {question && (
            <button
              onClick={() => setQuestion('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mic Toggle */}
        <button
          onClick={handleToggleVoiceInput}
          title={isListening ? 'Stop listening' : 'Speak your question'}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
        </button>

        {/* Send Button */}
        <button
          onClick={() => handleAskQuestion()}
          disabled={!question.trim() || isAsking}
          className="flex h-10 items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        >
          {isAsking ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Ask</span>
              <Send className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      {recognitionError && (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          {recognitionError}
        </p>
      )}
    </div>
  );
};
