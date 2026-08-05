import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Stethoscope,
  Pill,
  ShieldCheck,
  ArrowRight,
  Phone,
  BookOpen,
  Search,
  Building2,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import { useHealth } from '../context/HealthContext';

export default function Home() {
  const { userLocation } = useHealth();

  // Sample hospital preview cards as specified
  const previewHospitals = [
    {
      osmId: 'hosp_1',
      name: 'Apollo Hospital',
      address: '72 Healthcare Enclave, Main Road',
      rating: 4.8,
      distanceKm: 2.3,
      timings: 'Open 24 Hours',
      type: 'hospital',
      emergencyServices: true,
      phone: '+1 (555) 019-2834',
      coordinates: { latitude: userLocation.latitude + 0.01, longitude: userLocation.longitude + 0.01 }
    },
    {
      osmId: 'hosp_2',
      name: 'Max Super Speciality Clinic',
      address: '15 Medical Avenue, City Center',
      rating: 4.7,
      distanceKm: 3.1,
      timings: '8:00 AM - 10:00 PM',
      type: 'clinic',
      emergencyServices: false,
      phone: '+1 (555) 014-9821',
      coordinates: { latitude: userLocation.latitude - 0.01, longitude: userLocation.longitude + 0.015 }
    },
    {
      osmId: 'hosp_3',
      name: 'Apollo 24|7 Express Pharmacy',
      address: '88 Wellness Boulevard',
      rating: 4.9,
      distanceKm: 1.2,
      timings: 'Open 24 Hours',
      type: 'pharmacy',
      emergencyServices: false,
      phone: '+1 (555) 018-7712',
      coordinates: { latitude: userLocation.latitude + 0.005, longitude: userLocation.longitude - 0.008 }
    }
  ];

  const featuredArticles = [
    {
      id: 1,
      title: 'Understanding OTC Pain Relievers: Acetaminophen vs Ibuprofen',
      category: 'Medicine Guide',
      readTime: '4 min read',
      snippet: 'When to use paracetamol for fever versus ibuprofen for pain, along with stomach and liver warnings.',
      date: 'July 2026'
    },
    {
      id: 2,
      title: '5 Red Flag Symptoms Requiring Immediate Emergency Room Care',
      category: 'Emergency Guide',
      readTime: '3 min read',
      snippet: 'Recognizing sudden chest pressure, facial drooping, breathing difficulty, or severe head trauma.',
      date: 'July 2026'
    },
    {
      id: 3,
      title: 'Daily Hydration Science: Electrolyte Balance & Fluid Goals',
      category: 'Preventative Wellness',
      readTime: '5 min read',
      snippet: 'How much fluid your body really requires daily and recognizing early signs of dehydration.',
      date: 'July 2026'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Practo / Apollo Style Hero Section */}
      <section className="bg-gradient-to-b from-teal-50 via-teal-50/50 to-slate-50 border-b border-slate-200 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Trusted Medical Directory & Health Guidance</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your Health, <br />
            <span className="text-teal-700">One Smart Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find nearby hospitals, trusted clinics, 24/7 pharmacies, authentic FDA medicine information, and structured health guidance.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/hospitals"
              className="px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-lg shadow-teal-900/20 flex items-center gap-2 transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Find Nearby Care</span>
            </Link>

            <Link
              to="/symptom-checker"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-300 shadow-sm flex items-center gap-2 transition"
            >
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <span>Check Symptoms</span>
            </Link>
          </div>

          {/* Location Badge */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            <span>Location: <strong className="text-slate-800">{userLocation.cityName || 'Detecting GPS...'}</strong></span>
          </div>

        </div>
      </section>

      {/* Nearby Hospital Preview Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Nearby Hospitals & Clinics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top-rated medical centers in your vicinity</p>
          </div>
          <Link
            to="/hospitals"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Nearby Care</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewHospitals.map((hosp) => (
            <HospitalCard key={hosp.osmId} hospital={hosp} />
          ))}
        </div>
      </section>

      {/* Medical Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Medical & Wellness Articles</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified health guides & disease prevention</p>
          </div>
          <Link
            to="/articles"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <div key={article.id} className="med-card p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-teal-700 uppercase tracking-wider text-[10px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {article.category}
                  </span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-teal-700 transition">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {article.snippet}
                </p>
              </div>

              <Link
                to="/articles"
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 pt-2 border-t border-slate-100"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Numbers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Medical Emergency Direct Numbers</h3>
              <p className="text-xs text-red-700 mt-0.5">
                Universal Emergency: <strong>911 / 112</strong> | Poison Control: <strong>1-800-222-1222</strong>
              </p>
            </div>
          </div>

          <Link
            to="/emergency"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md shadow-red-600/20 whitespace-nowrap"
          >
            Access Emergency Center 🚨
          </Link>
        </div>
      </section>

    </div>
  );
}
