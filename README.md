# Sahayak (सहायक) - AI Document & Life-Admin Copilot
> **Hackathon Theme:** AI for Social Good • Legal & Life-Admin Inclusion

---

## 📌 Problem Statement
Over 500 million people across India receive complex government notices, bank KYC alerts, electricity disconnection warnings, court summons, and medical prescriptions written in dense English or technical legalese. Every year, millions miss statutory deadlines, face unfair electricity disconnects, lose their life savings to phishing scams, or take wrong medicine dosages because they could not understand what the document demanded.

---

## 💡 Solution
**Sahayak** is a multimodal AI document interpreter and life-admin copilot powered by **Google Gemini 3.8 Flash**. Citizens simply snap a photo or paste any notice or SMS. Sahayak instantly delivers:
1. **"What is this?" in 1 Plain Sentence:** Crystal-clear explanation in 6th-grade language.
2. **"What do I need to do?" Action Checklist:** Ordered, step-by-step checklist with interactive tracking, safe portal links, and cautionary warnings.
3. **Deadlines & Amounts:** Real-time countdown timer ("Due in 5 days", "Overdue") with explicit warnings on the consequences of missing deadlines.
4. **Scam & Fraud Trust Score (0-100):** Visual trust gauge detecting fake bank domains (e.g., non-.sbi phishing links), urgency pressure tactics, and unverified sender numbers.
5. **Key Terms Glossary:** Tap any jargon term (e.g., *KYC*, *LPSC*, *Section 56*, *Contraindication*, *SOS*) for an everyday plain-words definition.
6. **Voice Mode & Grounded Q&A:** Browser speech synthesis ("Read Aloud") and microphone button for follow-up questions ("Can I pay late?", "Is this real?") strictly grounded in the document.
7. **Multi-Lingual Engine:** Decodes documents into English, Hindi (हिन्दी), Punjabi (ਪੰਜਾਬੀ), Tamil (தமிழ்), Bengali (বাংলা), Marathi (मराठी), and Telugu (తెలుగు).
8. **1-Click Draft Helper & PDF Export:** Automatically generates ready-to-dispatch formal complaints to the National Cyber Crime Portal (1930 / cybercrime.gov.in), bank nodal officers, or electricity bill extension appeals, downloadable as formatted PDFs.
9. **"My Papers" Life-Admin Vault:** Saved privately in `localStorage` with a total "Money at Stake" summary (dues payable vs. scam loss prevented vs. generic medicine savings).

---

## 🏗️ Technical Architecture
- **Multimodal AI Reasoning:** `gemini-3.8-flash` via `@google/genai` TypeScript SDK with strict `responseSchema` JSON structures.
- **Backend Server:** Express.js (`server.ts`) mounting Vite middleware in development and serving production assets.
- **Frontend:** React 19 SPA, Tailwind CSS v4, Lucide Icons, `jspdf` for official PDF letter generation.
- **Voice Stack:** Browser Web Speech Synthesis (`speechSynthesis`) and Web Speech Recognition (`webkitSpeechRecognition`).
- **Privacy First:** Ephemeral document processing. No personal document images or transcripts stored on external servers.

---

## 🚀 Judge Demo Walkthrough (Zero Upload Friction)
1. **Instant Scam Demo:** Click the **"Fake Bank Scam Notice"** sample on the home screen. Notice how the Trust Score plummets to **14/100**, red flags identify the phishing domain `sbi-kyc-update82.in`, and the action checklist warns against sharing OTP.
2. **Language Switch:** Select **Hindi (हिन्दी)** in the header to view the document decoded into simple everyday Hindi.
3. **Voice Read Aloud:** Click **"Read Aloud"** to listen to the audible summary via browser speech synthesis.
4. **Voice / Text Follow-up:** Type or speak *"Can I ignore this?"* in the Q&A box to get a grounded answer from Sahayak.
5. **Generate Complaint PDF:** Click **"Generate Official Draft"**, review the ready-to-send complaint to the Cyber Crime cell, and click **"Download Formatted PDF"**.
6. **Inspect "My Papers" Vault:** Click **"My Papers"** to view saved records, upcoming deadlines, and the total money-at-stake financial summary.
