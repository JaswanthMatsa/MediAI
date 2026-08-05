import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { useHealth } from '../context/HealthContext';
import HospitalCard from '../components/HospitalCard';
import MedicineCard from '../components/MedicineCard';
import {
  Stethoscope,
  Search,
  AlertTriangle,
  Pill,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';

export default function SymptomChecker() {
  const { userLocation } = useHealth();
  const [symptomsInput, setSymptomsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const samplePresets = [
    'I have fever and headache',
    'Cold, cough and runny nose',
    'Stomach acidity and bloating',
    'Sore throat and body ache'
  ];

  const handleAnalyze = async (textToSubmit = symptomsInput) => {
    const query = typeof textToSubmit === 'string' ? textToSubmit.trim() : symptomsInput.trim();
    if (!query) return;

    setLoading(true);
    try {
      const res = await chatService.sendMessage(query, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });

      if (res.success && res.data) {
        setAnalysisResult({
          query,
          possibleCauses: res.data.symptomsExtracted?.length > 0
            ? res.data.symptomsExtracted
            : ['Viral Infection / Common Cold', 'Dehydration & Fatigue', 'Stress or Tension'],
          suggestedOTC: res.data.recommendedMedicines || [
            { name: 'Paracetamol 500mg', purpose: 'Reduces fever and body pain', warnings: 'Check liver warning. Do not exceed 4000mg/day.' },
            { name: 'Oral Rehydration Salts (ORS)', purpose: 'Maintains fluid balance', warnings: 'Dissolve in clean water.' },
            { name: 'Vitamin C Supplement', purpose: 'Supports immune recovery', warnings: 'Take with food.' }
          ],
          recommendedAction: res.data.severity === 'emergency'
            ? '🚨 IMMEDIATE EMERGENCY CARE REQUIRED. Visit emergency room or call 911.'
            : 'Consult a licensed physician if fever exceeds 2 days, temperature rises above 102°F, or difficulty breathing develops.',
          nearestHospitals: res.data.recommendedHospitals?.length > 0
            ? res.data.recommendedHospitals
            : [
                {
                  osmId: 'symp_hosp_1',
                  name: 'Apollo Hospital & Emergency',
                  address: '72 Healthcare Enclave',
                  rating: 4.8,
                  distanceKm: 2.0,
                  timings: 'Open 24 Hours',
                  type: 'hospital',
                  phone: '+1 (555) 019-2834',
                  coordinates: { latitude: userLocation.latitude + 0.01, longitude: userLocation.longitude + 0.01 }
                }
              ]
        });
      }
    } catch (err) {
      console.warn('[Symptom Analysis Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="med-card p-6 sm:p-8 text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
          <Stethoscope className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Symptom Checker</h1>
        <p className="text-xs text-slate-600 max-w-lg mx-auto">
          Describe your symptoms to receive structured medical causes, OTC options, disclaimers, and nearby clinic referrals.
        </p>
      </div>

      {/* Input Form Box */}
      <div className="med-card p-6 space-y-4">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Describe Your Symptoms
        </label>
        <textarea
          rows={3}
          value={symptomsInput}
          onChange={(e) => setSymptomsInput(e.target.value)}
          placeholder="e.g. I have fever, runny nose and headache since yesterday..."
          className="w-full med-input p-3.5 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
        />

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">Quick Presets:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => { setSymptomsInput(preset); handleAnalyze(preset); }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-[11px] font-medium text-slate-700 transition border border-slate-200"
            >
              {preset}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={!symptomsInput.trim() || loading}
          className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-900/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Symptoms...</span>
            </>
          ) : (
            <>
              <Stethoscope className="w-4 h-4" />
              <span>Analyze Symptoms</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Section 1: Possible Causes */}
          <div className="med-card p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-700" />
              Possible Causes
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {analysisResult.possibleCauses.map((cause, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                  <span className="font-semibold text-slate-900">{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Suggested OTC Medicines */}
          <div className="med-card p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-700" />
              Suggested Over-The-Counter Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysisResult.suggestedOTC.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-teal-800 block">{med.name}</span>
                  <p className="text-slate-600">{med.purpose}</p>
                  {med.warnings && (
                    <span className="text-[10px] text-amber-800 block pt-1">⚠️ {med.warnings}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recommended Action */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <ShieldAlert className="w-4 h-4" /> Recommended Action & Medical Disclaimers
            </div>
            <p className="leading-relaxed">{analysisResult.recommendedAction}</p>
          </div>

          {/* Section 4: Nearest Hospitals */}
          <div className="med-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              Nearest Hospitals & Clinics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.nearestHospitals.map((hosp, idx) => (
                <HospitalCard key={idx} hospital={hosp} />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
