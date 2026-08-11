import React, { useState } from 'react';
import { Pill, ShieldAlert, CheckCircle2, Bookmark, Info, Store } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export default function MedicineCard({ medicine }) {
  const { savedMedicines, addSavedMedicine, removeSavedMedicine } = useHealth();
  const isSaved = savedMedicines.some(m => m.name === medicine.name);
  const [expanded, setExpanded] = useState(false);

  const toggleSave = () => {
    if (isSaved) {
      removeSavedMedicine(medicine.name);
    } else {
      addSavedMedicine({
        name: medicine.name,
        brandName: medicine.brandName,
        uses: medicine.uses
      });
    }
  };

  return (
    <div className="med-card p-5 flex flex-col justify-between space-y-4">
      <div>
        {/* Title Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {medicine.name}
            </h3>
            {medicine.brandName && (
              <span className="text-xs text-teal-700 font-semibold block mt-0.5">
                Brand: {medicine.brandName}
              </span>
            )}
          </div>

          <button
            onClick={toggleSave}
            className={`p-1.5 rounded-lg border transition ${
              isSaved
                ? 'bg-teal-50 border-teal-300 text-teal-700'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title={isSaved ? 'Saved' : 'Save Medicine'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-700' : ''}`} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> OTC Medicine
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            <Store className="w-3 h-3 text-blue-600" /> Available at Nearby Pharmacy
          </span>
        </div>

        {/* Primary Uses */}
        <div className="text-xs text-slate-700 leading-relaxed mb-3">
          <strong className="text-slate-900">Primary Uses: </strong>
          {medicine.uses}
        </div>

        {/* Warnings Box */}
        {medicine.warnings && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1">
            <div className="flex items-center gap-1 font-bold text-amber-800">
              <ShieldAlert className="w-3.5 h-3.5" /> Warning & Dosage Notes
            </div>
            <p className="text-[11px] text-amber-800 line-clamp-3">{medicine.warnings}</p>
          </div>
        )}

        {/* Expanded Info */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700 animate-fadeIn">
            {medicine.dosage && (
              <div>
                <strong className="text-slate-900">Dosage Guidance: </strong>
                <p className="text-slate-600 mt-0.5">{medicine.dosage}</p>
              </div>
            )}
            {medicine.sideEffects && (
              <div>
                <strong className="text-slate-900">Side Effects: </strong>
                <p className="text-slate-600 mt-0.5">{medicine.sideEffects}</p>
              </div>
            )}
            {medicine.ingredients && medicine.ingredients.length > 0 && (
              <div>
                <strong className="text-slate-900">Active Ingredients: </strong>
                <span className="text-slate-600">{medicine.ingredients.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition flex items-center justify-center gap-1"
      >
        <Info className="w-3.5 h-3.5" />
        <span>{expanded ? 'Hide Details' : 'View Full Dosage & Side Effects'}</span>
      </button>
    </div>
  );
}
