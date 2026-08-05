import React from 'react';
import { Link } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';
import { Phone, AlertTriangle, Navigation, ShieldAlert, HeartPulse, Stethoscope, Compass } from 'lucide-react';

export default function Emergency() {
  const { userLocation } = useHealth();

  const emergencyNumbers = [
    { title: 'Universal Emergency', number: '911', desc: 'Police, Fire, Emergency Medical Response', color: 'bg-red-600' },
    { title: 'Ambulance Dispatch', number: '911 / 102', desc: 'Direct Ambulance & Trauma Transport Unit', color: 'bg-red-700' },
    { title: 'Poison Control Center', number: '1-800-222-1222', desc: '24/7 Chemical, Drug & Substance Ingestion Help', color: 'bg-amber-600' },
    { title: 'Crisis & Mental Health Hotline', number: '988', desc: 'Free 24/7 Confidential Psychiatric & Crisis Support', color: 'bg-blue-600' }
  ];

  const erDirectionsUrl = `https://www.google.com/maps/search/emergency+room+hospital/@${userLocation.latitude},${userLocation.longitude},13z`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      
      {/* Alert Header */}
      <div className="p-6 rounded-2xl bg-red-600 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-red-600/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Emergency Health Center 🚨</h1>
            <p className="text-xs text-red-100 mt-0.5">
              If experiencing chest pain, severe shortness of breath, or heavy bleeding call 911 immediately.
            </p>
          </div>
        </div>

        <a
          href={erDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-xl bg-white text-red-700 font-extrabold text-xs flex items-center gap-2 hover:bg-slate-100 transition shadow-sm whitespace-nowrap"
        >
          <Navigation className="w-4 h-4 text-red-600" />
          <span>Route to Nearest ER</span>
        </a>
      </div>

      {/* Quick Emergency Phone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyNumbers.map((item, idx) => (
          <div key={idx} className="med-card p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600">{item.desc}</p>
              <span className="text-lg font-extrabold text-red-600 block pt-1">{item.number}</span>
            </div>
            <a
              href={`tel:${item.number.split(' ')[0]}`}
              className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md hover:scale-105 transition flex-shrink-0`}
            >
              <Phone className="w-6 h-6" />
            </a>
          </div>
        ))}
      </div>

      {/* Red Flag Symptoms Guide */}
      <div className="med-card p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          Critical Symptoms Requiring Immediate Emergency Care
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-slate-800">
            <strong className="text-red-800 block mb-1">🫀 Chest Pain / Pressure</strong>
            Squeezing chest pain radiating to jaw, neck, or left arm with cold sweats.
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-slate-800">
            <strong className="text-red-800 block mb-1">🫁 Breathing Difficulty</strong>
            Inability to speak complete sentences, gasping for air, or blue lips.
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-slate-800">
            <strong className="text-red-800 block mb-1">🧠 Stroke Symptoms (F.A.S.T.)</strong>
            Facial drooping, arm weakness, slurred speech, sudden loss of vision.
          </div>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-slate-800">
            <strong className="text-red-800 block mb-1">🩸 Uncontrolled Bleeding</strong>
            Heavy arterial bleeding that does not stop after 5 minutes of direct pressure.
          </div>
        </div>
      </div>

    </div>
  );
}

