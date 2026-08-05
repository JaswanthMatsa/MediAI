import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SymptomBadge({ label, icon, onClick, active }) {
  return (
    <button
      onClick={() => onClick(label)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 shadow-sm ${
        active
          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-teal-500/20 scale-105'
          : 'glass-card text-slate-300 hover:text-white hover:border-teal-500/40 hover:bg-slate-800'
      }`}
    >
      {icon ? <span>{icon}</span> : <Sparkles className="w-3 h-3 text-teal-400" />}
      <span>{label}</span>
    </button>
  );
}
