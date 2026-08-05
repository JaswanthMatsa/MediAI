import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowLeft, Trash2 } from 'lucide-react';
import API from '../services/api';

export default function SearchHistory() {
  const [history, setHistory] = useState([
    { query: 'Fever and headache', type: 'symptom', date: 'Just now' },
    { query: 'Paracetamol 500mg', type: 'medicine', date: '2 hours ago' },
    { query: 'Apollo Hospital', type: 'hospital', date: 'Yesterday' }
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="med-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-700" />
            Search & Query History
          </h1>
          <p className="text-xs text-slate-600 mt-1">Audit of your recent symptom, medicine, and hospital searches</p>
        </div>
        <button
          onClick={() => setHistory([])}
          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="med-card p-6 space-y-3">
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">Your search history is empty.</p>
        ) : (
          history.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-teal-700" />
                <div>
                  <span className="font-bold text-slate-900">{item.query}</span>
                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">{item.type}</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">{item.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
