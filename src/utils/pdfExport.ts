import { jsPDF } from 'jspdf';
import { DraftResponse } from '../types/document';

export function exportDraftToPdf(draft: DraftResponse, filename: string = 'Sahayak_Official_Draft.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 50;

  // Header banner
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, cursorY, contentWidth, 36, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('SAHAYAK CITIZEN ASSIST - OFFICIAL CORRESPONDENCE', margin + 14, cursorY + 22);

  cursorY += 56;

  // Document Date & Meta
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Date of Generation: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, cursorY);
  doc.text('Status: Ready to Dispatch', pageWidth - margin - 120, cursorY);

  cursorY += 24;

  // Recipient Authority
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('To,', margin, cursorY);
  cursorY += 16;
  doc.setFont('helvetica', 'normal');
  const recipientLines = doc.splitTextToSize(draft.recipientAuthority || 'The Competent Grievance Officer', contentWidth);
  doc.text(recipientLines, margin, cursorY);
  cursorY += recipientLines.length * 15 + 16;

  // Subject line
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, cursorY - 10, contentWidth, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138); // blue-900
  const subjectText = `SUBJECT: ${draft.subjectLine}`;
  const subjectLines = doc.splitTextToSize(subjectText, contentWidth - 20);
  doc.text(subjectLines, margin + 10, cursorY + 8);
  cursorY += Math.max(30, subjectLines.length * 15) + 20;

  // Salutation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(draft.salutation || 'Respected Sir/Madam,', margin, cursorY);
  cursorY += 20;

  // Body Paragraphs
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);

  for (const para of draft.bodyParagraphs) {
    const wrappedLines = doc.splitTextToSize(para, contentWidth);
    // Check page overflow
    if (cursorY + wrappedLines.length * 15 > 740) {
      doc.addPage();
      cursorY = 50;
    }
    doc.text(wrappedLines, margin, cursorY);
    cursorY += wrappedLines.length * 15 + 14;
  }

  // Enclosures
  if (draft.enclosures && draft.enclosures.length > 0) {
    if (cursorY > 700) {
      doc.addPage();
      cursorY = 50;
    }
    cursorY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('Enclosures Attached:', margin, cursorY);
    cursorY += 16;
    doc.setFont('helvetica', 'normal');
    for (const item of draft.enclosures) {
      doc.text(`• ${item}`, margin + 10, cursorY);
      cursorY += 14;
    }
  }

  // Closing Sign-off
  if (cursorY > 710) {
    doc.addPage();
    cursorY = 50;
  }
  cursorY += 20;
  doc.setFont('helvetica', 'normal');
  doc.text(draft.closing || 'Yours faithfully,', margin, cursorY);
  cursorY += 32;
  doc.text('[Complainant / Citizen Signature]', margin, cursorY);
  cursorY += 14;
  doc.text('Name & Contact Details: ___________________________', margin, cursorY);

  // Bottom Citizen Rights Footer
  if (draft.citizenRightsTip) {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.rect(margin, 770, contentWidth, 38, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15); // amber-900
    const tipLines = doc.splitTextToSize(`Legal / Citizen Advisory: ${draft.citizenRightsTip}`, contentWidth - 16);
    doc.text(tipLines, margin + 8, 784);
  }

  doc.save(filename);
}
