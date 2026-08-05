import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import {
  Building2,
  MapPin,
  Phone,
  Star,
  Clock,
  Navigation,
  ShieldAlert,
  UserCheck,
  Pill,
  MessageSquare,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function HospitalDetails() {
  const { id } = useParams();
  const { userLocation } = useHealth();
  const [activeTab, setActiveTab] = useState('overview');

  const hospitalName = id ? decodeURIComponent(id) : 'Apollo Hospital & Medical Center';

  const hospital = {
    name: hospitalName.startsWith('hosp_') ? 'Apollo Hospital & Super Speciality Center' : hospitalName,
    rating: 4.8,
    reviewsCount: 142,
    openNow: true,
    timings: 'Open 24 Hours (Emergency & ICU)',
    address: '72 Healthcare Enclave, Main Arterial Road, District 4',
    phone: '+1 (555) 019-2834',
    emergencyServices: true,
    distanceKm: 2.3,
    doctorsAvailable: [
      { name: 'Dr. Ananya Sharma', specialty: 'Cardiology', timing: '9:00 AM - 5:00 PM', rating: 4.9 },
      { name: 'Dr. Rajesh Verma', specialty: 'General Medicine & Trauma', timing: '24 Hours On Call', rating: 4.8 },
      { name: 'Dr. Meera Patel', specialty: 'Pediatrics & Neonatal Care', timing: '10:00 AM - 4:00 PM', rating: 4.9 }
    ],
    nearbyPharmacies: [
      { name: 'Apollo 24|7 Express Pharmacy', distance: '0.3 km', timings: '24 Hours' },
      { name: 'MediPlus Chemist & Wellness', distance: '0.6 km', timings: '8:00 AM - 11:00 PM' }
    ],
    reviews: [
      { user: 'Siddharth M.', rating: 5, date: 'July 2026', comment: 'Extremely quick emergency intake response. The ICU team was attentive and compassionate.' },
      { user: 'Priya K.', rating: 5, date: 'June 2026', comment: 'Clean facility, modern diagnostic labs, and professional doctors.' }
    ]
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${userLocation.latitude + 0.01},${userLocation.longitude + 0.01}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Button */}
      <Link to="/hospitals" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Hospital List
      </Link>

      {/* Main Header Banner (Google Maps Style) */}
      <div className="med-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {hospital.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {hospital.rating} ({hospital.reviewsCount} reviews)
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Open Now
              </span>
              {hospital.emergencyServices && (
                <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> 24/7 Emergency & ICU
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${hospital.phone}`}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition"
            >
              <Phone className="w-4 h-4 text-teal-700" />
              <span>Call</span>
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-900/20 transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </a>
          </div>
        </div>

        {/* Address & Info Sub-bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <span>{hospital.address}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Clock className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
            <span>{hospital.timings}</span>
          </div>
          <div className="flex items-start gap-1.5 font-bold text-teal-700">
            <Navigation className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{hospital.distanceKm} km from current location</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'overview' ? 'border-teal-700 text-teal-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview & Doctors
        </button>
        <button
          onClick={() => setActiveTab('pharmacies')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'pharmacies' ? 'border-teal-700 text-teal-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Nearby Pharmacies ({hospital.nearbyPharmacies.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'reviews' ? 'border-teal-700 text-teal-700 font-bold' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Patient Reviews ({hospital.reviews.length})
        </button>
      </div>

      {/* Tab 1: Overview & Doctors */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="med-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-700" />
              Doctors On Duty & Available Specialists
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hospital.doctorsAvailable.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{doc.name}</span>
                    <span className="text-[10px] font-bold text-amber-600">⭐ {doc.rating}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700 block">{doc.specialty}</span>
                  <span className="text-[10px] text-slate-500 block">⏰ {doc.timing}</span>
                  <Link
                    to="/symptom-checker"
                    className="inline-block w-full py-1.5 text-center rounded bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] transition"
                  >
                    Consult Doctor
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Nearby Pharmacies */}
      {activeTab === 'pharmacies' && (
        <div className="med-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-700" />
            Pharmacies Located Nearby
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospital.nearbyPharmacies.map((pharm, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{pharm.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{pharm.distance} away • {pharm.timings}</p>
                </div>
                <Link
                  to="/medicines"
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200"
                >
                  View Stock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Patient Reviews */}
      {activeTab === 'reviews' && (
        <div className="med-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            Verified Patient Reviews
          </h3>
          <div className="space-y-3">
            {hospital.reviews.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.user}</span>
                  <span className="text-amber-600 font-bold">{'★'.repeat(rev.rating)}</span>
                </div>
                <p className="text-slate-700">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block pt-1">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
