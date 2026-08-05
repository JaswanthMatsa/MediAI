import React from 'react';
import { useHealth } from '../context/HealthContext';
import HospitalCard from '../components/HospitalCard';
import { Bookmark, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SavedHospitals() {
  const { savedHospitals } = useHealth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="med-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-teal-700 fill-teal-700" />
            Your Saved Hospitals & Clinics ({savedHospitals.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Quick access to your bookmarked healthcare facilities and pharmacies
          </p>
        </div>
        <Link to="/hospitals" className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm">
          Find More Care
        </Link>
      </div>

      {savedHospitals.length === 0 ? (
        <div className="med-card p-12 text-center text-xs text-slate-500 space-y-2">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
          <p>You haven't saved any hospitals yet. Click the bookmark icon on any hospital card to save it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedHospitals.map((hosp, idx) => (
            <HospitalCard key={idx} hospital={hosp} />
          ))}
        </div>
      )}
    </div>
  );
}
