import { DocumentAnalysis } from '../types/document';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

const STORAGE_KEY = 'sahayak_saved_papers_v1';

export function loadSavedPapers(): DocumentAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample documents on first load so the user sees a rich populated dashboard
      const initial = SAMPLE_DOCUMENTS.map((s) => s.document);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading papers from storage:', e);
    return [];
  }
}

export function savePaper(paper: DocumentAnalysis): DocumentAnalysis[] {
  try {
    const papers = loadSavedPapers();
    const existingIndex = papers.findIndex((p) => p.id === paper.id);
    let updated: DocumentAnalysis[];

    if (existingIndex >= 0) {
      updated = [...papers];
      updated[existingIndex] = paper;
    } else {
      updated = [paper, ...papers];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving paper:', e);
    return [];
  }
}

export function deletePaper(id: string): DocumentAnalysis[] {
  try {
    const papers = loadSavedPapers();
    const filtered = papers.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Error deleting paper:', e);
    return [];
  }
}

export function toggleActionChecklist(paperId: string, stepNumber: number): DocumentAnalysis | null {
  try {
    const papers = loadSavedPapers();
    const paper = papers.find((p) => p.id === paperId);
    if (!paper) return null;

    const checklist = paper.actionChecklist.map((item) => {
      if (item.stepNumber === stepNumber) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    const updated = { ...paper, actionChecklist: checklist };
    savePaper(updated);
    return updated;
  } catch (e) {
    console.error('Error toggling checklist:', e);
    return null;
  }
}

export interface MoneyAtStakeSummary {
  totalDuePayable: number;
  scamLossPrevented: number;
  totalSavedDiscount: number;
  currency: string;
}

export function calculateMoneyAtStake(papers: DocumentAnalysis[]): MoneyAtStakeSummary {
  let totalDuePayable = 0;
  let scamLossPrevented = 0;
  let totalSavedDiscount = 0;

  for (const paper of papers) {
    const isScam = paper.riskScamAssessment && paper.riskScamAssessment.trustScore < 40;

    for (const amt of paper.amounts || []) {
      // Parse numbers from strings like "₹5,545.50" or "84,250"
      const cleaned = amt.value.replace(/[^0-9.]/g, '');
      const num = parseFloat(cleaned) || 0;

      if (isScam) {
        scamLossPrevented += num;
      } else if (amt.label.toLowerCase().includes('due') || amt.label.toLowerCase().includes('payable') || amt.label.toLowerCase().includes('bill')) {
        totalDuePayable += num;
      } else if (amt.label.toLowerCase().includes('generic') || amt.label.toLowerCase().includes('subsidy')) {
        totalSavedDiscount += num;
      }
    }
  }

  return {
    totalDuePayable,
    scamLossPrevented,
    totalSavedDiscount,
    currency: '₹',
  };
}
