import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import HospitalCard from '../components/HospitalCard';
import MedicineCard from '../components/MedicineCard';
import { User, MapPin, Pill, Bookmark, FileText, Heart, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { savedHospitals, savedMedicines } = useHealth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Notion Style Profile Header */}
      <div className="med-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'J'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{user?.name || 'Jaswanth'}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'jaswanth@example.com'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                Age: {user?.age || '28'}
              </span>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 capitalize">
                Gender: {user?.gender || 'Male'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Medical History & Saved Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Saved Hospitals */}
        <div className="med-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-700" />
            Saved Hospitals ({savedHospitals.length})
          </h2>
          {savedHospitals.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No saved hospitals yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {savedHospitals.map((hosp, idx) => (
                <HospitalCard key={idx} hospital={hosp} />
              ))}
            </div>
          )}
        </div>

        {/* Saved Medicines */}
        <div className="med-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-700" />
            Saved OTC Medicines ({savedMedicines.length})
          </h2>
          {savedMedicines.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No saved medicines yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {savedMedicines.map((med, idx) => (
                <MedicineCard key={idx} medicine={med} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
