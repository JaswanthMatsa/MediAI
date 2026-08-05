import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, Navigation, Clock, ShieldAlert, ArrowRight, Bookmark } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export default function HospitalCard({ hospital, onSelect, isSelected }) {
  const { savedHospitals, addSavedHospital, removeSavedHospital } = useHealth();
  const isSaved = savedHospitals.some(h => h.name === hospital.name);

  const toggleSave = (e) => {
    e.stopPropagation();
    if (isSaved) {
      removeSavedHospital(hospital.name);
    } else {
      addSavedHospital(hospital);
    }
  };

  const isEmergency = hospital.type === 'emergency' || hospital.emergencyServices;
  const hLat = hospital.coordinates?.latitude || hospital.lat || 37.7749;
  const hLng = hospital.coordinates?.longitude || hospital.lng || -122.4194;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}`;

  return (
    <div
      onClick={() => onSelect && onSelect(hospital)}
      className={`med-card p-4 flex flex-col justify-between space-y-3 cursor-pointer ${
        isSelected ? 'border-teal-600 ring-2 ring-teal-600/20 bg-teal-50/20' : ''
      }`}
    >
      <div>
        {/* Top Title & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-teal-700 transition">
              {hospital.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {hospital.rating || 4.8}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Open Now
              </span>
              {isEmergency && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Emergency
                </span>
              )}
            </div>
          </div>

          <button
            onClick={toggleSave}
            className={`p-1.5 rounded-lg border transition ${
              isSaved
                ? 'bg-teal-50 border-teal-300 text-teal-700'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title={isSaved ? 'Saved' : 'Save Hospital'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-700' : ''}`} />
          </button>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-slate-600 my-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{hospital.address}</span>
        </div>

        {/* Distance & Hours */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {hospital.timings || '24/7 Hours'}
          </span>
          {hospital.distanceKm && (
            <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {hospital.distanceKm} km away
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        {hospital.phone && (
          <a
            href={`tel:${hospital.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition"
          >
            <Phone className="w-3.5 h-3.5 text-teal-700" />
            <span>Call</span>
          </a>
        )}

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-1.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Navigate</span>
        </a>

        <Link
          to={`/hospitals/${hospital.osmId || encodeURIComponent(hospital.name)}`}
          onClick={(e) => e.stopPropagation()}
          className="py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
