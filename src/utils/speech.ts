import { SupportedLanguage } from '../types/document';

const LANG_BCP47_MAP: Record<SupportedLanguage, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US'],
  hi: ['hi-IN', 'hi'],
  pa: ['pa-IN', 'pa'],
  ta: ['ta-IN', 'ta'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  mr: ['mr-IN', 'mr'],
  te: ['te-IN', 'te'],
};

export class SpeechSpeaker {
  private static utterance: SpeechSynthesisUtterance | null = null;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static speak(
    text: string,
    language: SupportedLanguage = 'en',
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.isSupported()) {
      if (onError) onError(new Error('Speech synthesis not supported in this browser.'));
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.utterance = utterance;

    // Pick best matching voice
    const preferredLocales = LANG_BCP47_MAP[language] || ['en-IN', 'en-US'];
    const voices = window.speechSynthesis.getVoices();

    let matchedVoice = voices.find((v) =>
      preferredLocales.some((locale) => v.lang.toLowerCase().startsWith(locale.toLowerCase()))
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = preferredLocales[0];
    }

    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.utterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.utterance = null;
      if (onError) onError(e);
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stop() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.utterance = null;
  }

  public static isSpeaking(): boolean {
    return this.isSupported() && window.speechSynthesis.speaking;
  }
}

// Voice Recognition helper
export function createSpeechRecognizer(
  language: SupportedLanguage,
  onResult: (transcript: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRec) {
    return null;
  }

  const recognition = new SpeechRec();
  const preferredLocales = LANG_BCP47_MAP[language] || ['en-IN'];
  recognition.lang = preferredLocales[0];
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript) {
      onResult(finalTranscript);
    }
  };

  recognition.onerror = (event: any) => {
    onError(event.error || 'Speech recognition error');
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
