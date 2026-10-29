import React from 'react';
import { Pill, Sun, Moon, AlertOctagon, Utensils, HeartPulse, Sparkles } from 'lucide-react';
import { PrescriptionDetails } from '../types/document';

interface PrescriptionScheduleProps {
  details: PrescriptionDetails;
}

export const PrescriptionSchedule: React.FC<PrescriptionScheduleProps> = ({ details }) => {
  if (!details || (!details.medicines && !details.dietaryAdvice)) return null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900/60 dark:bg-slate-900 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3 dark:border-emerald-950">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <HeartPulse className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Prescription & Medication Timetable
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {details.doctorName ? `Prescribed by ${details.doctorName}` : 'Doctor prescription schedule'}
            </p>
          </div>
        </div>

        {details.patientName && (
          <span className="self-start sm:self-auto rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Patient: {details.patientName}
          </span>
        )}
      </div>

      {/* Medicines Table / Cards */}
      {details.medicines && details.medicines.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {details.medicines.map((med, idx) => {
            const isMorning = med.timing?.toLowerCase().includes('morning') || med.timing?.toLowerCase().includes('8 am') || med.timing?.toLowerCase().includes('7 am');
            const isNight = med.timing?.toLowerCase().includes('night') || med.timing?.toLowerCase().includes('bed') || med.timing?.toLowerCase().includes('pm');
            const isSOS = med.timing?.toLowerCase().includes('sos') || med.dosage?.toLowerCase().includes('sos');

            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Pill className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {med.name}
                    </span>
                  </div>
                  <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-xs dark:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                    {med.dosage}
                  </span>
                </div>

                {/* Timing Badge */}
                <div className="mt-2.5 flex items-center space-x-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {isSOS ? (
                    <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      ⚠️ Take only when fever or pain occurs
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isMorning && (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px]">
                          <Sun className="h-3 w-3" /> Morning
                        </span>
                      )}
                      {isNight && (
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-[11px]">
                          <Moon className="h-3 w-3" /> Night
                        </span>
                      )}
                      <span className="text-slate-500">• {med.timing}</span>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                {med.instructions && (
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    ℹ️ {med.instructions}
                  </p>
                )}

                {med.duration && (
                  <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Duration: {med.duration}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dietary & Warning Notes */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {details.dietaryAdvice && (
          <div className="rounded-xl bg-amber-50/70 p-3 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
              <Utensils className="h-3.5 w-3.5" />
              <span>Dietary Care</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {details.dietaryAdvice}
            </p>
          </div>
        )}

        {details.warningSymptoms && (
          <div className="rounded-xl bg-red-50/70 p-3 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/50">
            <div className="flex items-center space-x-1.5 font-bold text-red-900 dark:text-red-300 mb-1">
              <AlertOctagon className="h-3.5 w-3.5 text-red-600" />
              <span>When to Seek Immediate Help</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {details.warningSymptoms}
            </p>
          </div>
        )}
      </div>

      {/* Jan Aushadhi generic savings banner */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-3 text-white shadow-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span className="text-xs font-medium">
            <strong>Save 50-80% on this prescription:</strong> Ask your local chemist for Generic PM-Jan Aushadhi equivalents.
          </span>
        </div>
      </div>
    </div>
  );
};
