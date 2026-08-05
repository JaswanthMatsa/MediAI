import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 font-extrabold text-2xl flex items-center justify-center mx-auto">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-600">The healthcare page or medical resource you requested does not exist.</p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
}
