import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { Link } from 'react-router-dom';
import LeafletMap from '../components/LeafletMap';
import HospitalCard from '../components/HospitalCard';
import {
  User,
  MapPin,
  Search,
  Stethoscope,
  Pill,
  Calendar,
  FileText,
  Building2,
  Phone,
  ShieldAlert,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { userLocation, savedHospitals, savedMedicines } = useHealth();
  const [searchQuery, setSearchQuery] = useState('');

  const sampleNearby = [
    {
      osmId: 'hosp_dash_1',
      name: 'Apollo Hospital & Speciality Center',
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
      osmId: 'hosp_dash_2',
      name: 'CityCare Family Clinic',
      address: '15 Medical Avenue, Block C',
      rating: 4.6,
      distanceKm: 1.8,
      timings: '9:00 AM - 9:00 PM',
      type: 'clinic',
      emergencyServices: false,
      phone: '+1 (555) 014-9821',
      coordinates: { latitude: userLocation.latitude - 0.01, longitude: userLocation.longitude + 0.015 }
    },
    {
      osmId: 'hosp_dash_3',
      name: 'Apollo 24|7 Pharmacy',
      address: '88 Wellness Boulevard',
      rating: 4.9,
      distanceKm: 0.9,
      timings: 'Open 24 Hours',
      type: 'pharmacy',
      emergencyServices: false,
      phone: '+1 (555) 018-7712',
      coordinates: { latitude: userLocation.latitude + 0.005, longitude: userLocation.longitude - 0.008 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="med-card p-6 sm:p-8 bg-gradient-to-r from-teal-800 to-teal-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/80 text-teal-100 text-xs font-semibold mb-3 border border-teal-600">
            <MapPin className="w-3.5 h-3.5 text-teal-300" />
            <span>📍 Current Location: <strong>{userLocation.cityName || 'Jalandhar'}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Jaswanth'} 👋
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            Access nearby healthcare services, manage prescriptions, and check symptoms.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals or clinics..."
            className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
          />
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/symptom-checker"
          className="med-card p-4 hover:border-teal-600 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition border border-teal-200">
            <Stethoscope className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Check Symptoms</span>
          <span className="text-[10px] text-slate-500">Analyze symptoms</span>
        </Link>

        <Link
          to="/medicines"
          className="med-card p-4 hover:border-teal-600 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition border border-blue-200">
            <Pill className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Find Medicine</span>
          <span className="text-[10px] text-slate-500">Medicine Database</span>
        </Link>

        <Link
          to="/hospitals"
          className="med-card p-4 hover:border-teal-600 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition border border-emerald-200">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Book Appointment</span>
          <span className="text-[10px] text-slate-500">Doctors & Clinics</span>
        </Link>

        <Link
          to="/profile"
          className="med-card p-4 hover:border-teal-600 transition flex flex-col items-center text-center space-y-2 group"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition border border-purple-200">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Medical History</span>
          <span className="text-[10px] text-slate-500">Allergies & Records</span>
        </Link>
      </div>

      {/* Main Map + Nearby Care Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Map Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Nearby Care Interactive Map</h2>
            <Link to="/hospitals" className="text-xs font-bold text-teal-700 hover:underline">Full Screen Map</Link>
          </div>
          <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <LeafletMap center={userLocation} hospitals={sampleNearby} />
          </div>
        </div>

        {/* Right: Hospital/Clinic/Pharmacy Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Nearby Facilities</h2>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Proximity Order
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {sampleNearby.map((hosp) => (
              <HospitalCard key={hosp.osmId} hospital={hosp} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
