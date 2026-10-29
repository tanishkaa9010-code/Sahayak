import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High payload limit for base64 document images
app.use(express.json({ limit: '25mb' }));

// Initialize shared Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Response schema for structured document analysis
const documentAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Clear, concise title of the document in 4-8 words',
    },
    documentType: {
      type: Type.STRING,
      description: 'Category: Government Notice, Bank / Financial, Utility Bill, Medical Prescription, Legal / Tax Notice, or Other',
    },
    oneSentenceSummary: {
      type: Type.STRING,
      description: 'Crystal-clear "What is this?" in exactly 1 plain sentence understandable by a 6th grader',
    },
    sender: {
      type: Type.STRING,
      description: 'Organization, authority, doctor, or company that issued this (or claimed sender)',
    },
    dateReceivedOrIssued: {
      type: Type.STRING,
      description: 'Date found on document or empty string if not found',
    },
    amounts: {
      type: Type.ARRAY,
      description: 'List of all amounts or fees found in the document',
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: 'e.g. Total Due, Late Penalty, Subsidy Credit, Medicine Charge' },
          value: { type: Type.STRING, description: 'Formatted amount with currency symbol e.g. ₹3,450' },
          isSuspicious: { type: Type.BOOLEAN, description: 'True if exorbitant, unexpected, or part of a scam' },
        },
        required: ['label', 'value', 'isSuspicious'],
      },
    },
    deadlines: {
      type: Type.ARRAY,
      description: 'Important dates, due dates, or expiration dates',
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: 'e.g. Final Payment Date, Response Deadline, Prescription Duration' },
          dueDate: { type: Type.STRING, description: 'Date in YYYY-MM-DD or as written in document' },
          urgency: { type: Type.STRING, description: 'urgent, moderate, or relaxed' },
          consequenceOfMissing: { type: Type.STRING, description: 'Plain description of what happens if missed' },
        },
        required: ['label', 'dueDate', 'urgency', 'consequenceOfMissing'],
      },
    },
    actionChecklist: {
      type: Type.ARRAY,
      description: 'Ordered checklist of steps the person must take',
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING, description: 'Short action title e.g. "Do Not Click SMS Link"' },
          description: { type: Type.STRING, description: 'Clear step-by-step guidance in simple words' },
          whereOrHow: { type: Type.STRING, description: 'Official office, portal URL, or safe contact method' },
          contactOrLink: { type: Type.STRING, description: 'Safe official number, portal, or helpline' },
          isWarning: { type: Type.BOOLEAN, description: 'True if this is a cautionary warning' },
        },
        required: ['stepNumber', 'title', 'description', 'whereOrHow', 'isWarning'],
      },
    },
    riskScamAssessment: {
      type: Type.OBJECT,
      description: 'Trust and scam safety analysis',
      properties: {
        trustScore: { type: Type.INTEGER, description: '0 to 100. 100 is completely authentic. Below 50 is suspicious/scam.' },
        verdict: { type: Type.STRING, description: 'High Scam Risk, Suspicious, or Authentic & Legitimate' },
        redFlags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Reasons for suspicion (e.g., suspicious unverified domain, panic pressure, fake IFSC, unauthorized payment request)',
        },
        safetyRecommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Safe next steps to protect oneself',
        },
        isImpersonation: { type: Type.BOOLEAN, description: 'True if pretending to be a bank, government body, or utility' },
      },
      required: ['trustScore', 'verdict', 'redFlags', 'safetyRecommendations', 'isImpersonation'],
    },
    keyTermsGlossary: {
      type: Type.ARRAY,
      description: 'Difficult or jargon words in the document simplified for everyday people',
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          simplifiedMeaning: { type: Type.STRING, description: 'Plain language meaning in 1-2 sentences' },
          category: { type: Type.STRING, description: 'financial, legal, medical, or administrative' },
        },
        required: ['term', 'simplifiedMeaning', 'category'],
      },
    },
    fullTranscribedText: {
      type: Type.STRING,
      description: 'Key transcribed text extracted from the document',
    },
    prescriptionDetails: {
      type: Type.OBJECT,
      description: 'Only populated if this is a medical prescription or health report',
      properties: {
        doctorName: { type: Type.STRING },
        patientName: { type: Type.STRING },
        medicines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              dosage: { type: Type.STRING },
              timing: { type: Type.STRING, description: 'e.g., Morning after breakfast, Night before bed' },
              duration: { type: Type.STRING, description: 'e.g. 5 days' },
              instructions: { type: Type.STRING, description: 'With warm water, avoid dairy, etc.' },
            },
            required: ['name', 'dosage', 'timing'],
          },
        },
        dietaryAdvice: { type: Type.STRING },
        warningSymptoms: { type: Type.STRING },
      },
    },
  },
  required: [
    'title',
    'documentType',
    'oneSentenceSummary',
    'sender',
    'amounts',
    'deadlines',
    'actionChecklist',
    'riskScamAssessment',
    'keyTermsGlossary',
  ],
};

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिंदी)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  ta: 'Tamil (தமிழ்)',
  bn: 'Bengali (বাংলা)',
  mr: 'Marathi (मराठी)',
  te: 'Telugu (తెలుగు)',
};

// API: Analyze Document (multimodal image or raw text)
app.post('/api/document/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', textContent, targetLanguage = 'en' } = req.body;

    if (!imageBase64 && !textContent) {
      return res.status(400).json({ error: 'Please provide either an image or document text to analyze.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please check your environment variables.',
      });
    }

    const langName = LANGUAGE_NAMES[targetLanguage] || 'English';

    const systemInstruction = `You are "Sahayak" (सहायक), a compassionate, highly capable life-admin copilot and legal/financial document interpreter designed to help everyday citizens, senior citizens, and people who struggle with dense English, bureaucracy, legal jargon, bank fraud, and medical prescriptions.

CRITICAL INSTRUCTIONS:
1. Target Audience: Speak in simple, reassuring, 6th-grade language without condescension. Use the requested target language: ${langName}.
2. Scam & Fraud Detection: Scrutinize notices thoroughly for scam patterns:
   - Suspicious phishing links (e.g. fake domains like 'sbi-kyc-82.in' instead of legitimate bank portals)
   - Artificial panic & urgency ("Account blocked in 24 hours", "Immediate arrest/disconnection")
   - Requests for OTP, passwords, or downloading APKs/AnyDesk
   - Inconsistencies in official logos, grammar, or contact numbers.
   If scam is detected, set trustScore low (e.g. 5 to 25) with clear red flags and firm warnings.
   If authentic document (e.g. genuine electricity bill or real doctor prescription), give appropriate trust score (85-100) and highlight real deadlines and payment amounts.
3. Clarity:
   - "oneSentenceSummary" must be punchy, crystal-clear, answering "What is this?" in plain words.
   - Action checklist must be ordered and concrete: what to do first, what to avoid, where to go.
   - Key terms glossary: demystify difficult words (e.g. 'LPSC', 'subrogation', 'statutory', 'KYC', 'BID/TID', 'OD limit', 'dosage').
4. Language Requirement:
   - Provide all descriptions, summary, checklist instructions, glossaries, and recommendations in ${langName} using clean, natural script.`;

    const parts: any[] = [];

    if (imageBase64) {
      // Strip base64 header if present
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const promptText = textContent
      ? `Analyze this document text carefully in ${langName}:\n\n${textContent}`
      : `Examine this document image thoroughly. Extract all information, perform OCR, detect any risks or scams, identify amounts and deadlines, and break down action steps in ${langName}.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: documentAnalysisSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json({
      success: true,
      data: parsedData,
      language: targetLanguage,
    });
  } catch (error: any) {
    console.error('Document analysis error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze document. Please check the image quality and try again.',
    });
  }
});

// API: Grounded Follow-up Q&A
app.post('/api/document/qa', async (req: Request, res: Response) => {
  try {
    const { question, documentContext, targetLanguage = 'en' } = req.body;

    if (!question || !documentContext) {
      return res.status(400).json({ error: 'Question and document context are required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API client not configured.' });
    }

    const langName = LANGUAGE_NAMES[targetLanguage] || 'English';

    const qaSchema = {
      type: Type.OBJECT,
      properties: {
        answer: {
          type: Type.STRING,
          description: `Direct, simple answer in ${langName} grounded in the document`,
        },
        confidence: {
          type: Type.STRING,
          description: 'high, moderate, or low based on document evidence',
        },
        relevantQuoteOrDetail: {
          type: Type.STRING,
          description: 'The specific line or detail from the document this answer is based on',
        },
        actionableAdvice: {
          type: Type.STRING,
          description: 'A practical tip or next step for the user',
        },
      },
      required: ['answer', 'confidence', 'actionableAdvice'],
    };

    const prompt = `You are Sahayak. Answer the user's question about the following scanned document in ${langName}.
Stay STRICTLY grounded in the document data provided. If the document does not mention the answer, honestly say so and guide the user where to check safely.

DOCUMENT CONTEXT:
Title: ${documentContext.title}
Summary: ${documentContext.oneSentenceSummary}
Type: ${documentContext.documentType}
Sender: ${documentContext.sender}
Amounts: ${JSON.stringify(documentContext.amounts || [])}
Deadlines: ${JSON.stringify(documentContext.deadlines || [])}
Action Checklist: ${JSON.stringify(documentContext.actionChecklist || [])}
Risk Assessment: ${JSON.stringify(documentContext.riskScamAssessment || {})}
Transcribed Text: ${documentContext.fullTranscribedText || ''}

USER QUESTION: "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: qaSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No response from AI.');
    }

    return res.json({
      success: true,
      data: JSON.parse(responseText),
    });
  } catch (error: any) {
    console.error('Document Q&A error:', error);
    return res.status(500).json({ error: error.message || 'Failed to answer question.' });
  }
});

// API: Generate Ready-to-Send Draft Helper (Complaint, Dispute, Extension, Reply)
app.post('/api/document/draft', async (req: Request, res: Response) => {
  try {
    const { documentContext, draftType = 'complaint', userNotes = '', targetLanguage = 'en' } = req.body;

    if (!documentContext) {
      return res.status(400).json({ error: 'Document context is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API client not configured.' });
    }

    const langName = LANGUAGE_NAMES[targetLanguage] || 'English';

    const draftSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Formal heading of the letter/application' },
        recipientAuthority: { type: Type.STRING, description: 'Designation & department to address' },
        subjectLine: { type: Type.STRING, description: 'Clear formal subject line' },
        salutation: { type: Type.STRING, description: 'e.g. Respected Sir/Madam,' },
        bodyParagraphs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Formal, polite, legally sound paragraphs explaining the facts, quoting reference numbers, and requesting remedy',
        },
        enclosures: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'List of documents attached (e.g. copy of bill, transaction ID, medical slip)',
        },
        closing: { type: Type.STRING, description: 'e.g. Sincerely / Yours faithfully' },
        citizenRightsTip: {
          type: Type.STRING,
          description: 'A helpful note on citizen rights (e.g., Consumer Protection Act 2019, Cyber Crime 1930 Helpline, Electricity Ombudsman)',
        },
      },
      required: ['title', 'recipientAuthority', 'subjectLine', 'bodyParagraphs', 'closing', 'citizenRightsTip'],
    };

    const prompt = `Generate a formal, ready-to-send draft letter / official application based on the following document.
Draft Type requested: ${draftType} (Options: complaint, dispute_scam, extension_request, standard_reply)
Additional User Notes: "${userNotes}"
Language: Write the formal letter appropriately (in ${langName} or standard formal English with ${langName} guidance if requested, adhering to Indian administrative norms).

DOCUMENT DETAILS:
Title: ${documentContext.title}
Document Type: ${documentContext.documentType}
Sender: ${documentContext.sender}
Amounts: ${JSON.stringify(documentContext.amounts || [])}
Deadlines: ${JSON.stringify(documentContext.deadlines || [])}
Risk Assessment: ${JSON.stringify(documentContext.riskScamAssessment || {})}
Transcribed text: ${documentContext.fullTranscribedText || ''}

If this is a scam (riskScamAssessment.trustScore < 40), the draft MUST be a formal complaint to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and Bank Nodal Grievance Officer reporting phishing and unauthorized fraudulent communication.
If an electricity bill or utility notice with an issue, generate an appeal or payment extension application to the Executive Engineer / Customer Care.
If a prescription, generate a patient query note to the attending physician.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: draftSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No draft response received.');
    }

    return res.json({
      success: true,
      data: JSON.parse(responseText),
    });
  } catch (error: any) {
    console.error('Draft generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate draft.' });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sahayak backend server running on port ${PORT} (mode: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer();
