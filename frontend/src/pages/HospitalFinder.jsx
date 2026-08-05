import React, { useState, useEffect } from 'react';
import { hospitalService } from '../services/hospitalService';
import { useHealth } from '../context/HealthContext';
import LeafletMap from '../components/LeafletMap';
import HospitalCard from '../components/HospitalCard';
import {
  MapPin,
  Search,
  Compass,
  Filter,
  RefreshCw,
  Building2,
  AlertCircle,
  Pill,
  SlidersHorizontal
} from 'lucide-react';

export default function HospitalFinder() {
  const { userLocation, requestLocation } = useHealth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [radiusMeters, setRadiusMeters] = useState(5000);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await hospitalService.getNearby(
        userLocation.latitude,
        userLocation.longitude,
        radiusMeters,
        selectedType
      );
      if (res.success && res.hospitals) {
        setHospitals(res.hospitals);
      }
    } catch (err) {
      console.warn('[Hospital Finder Fetch Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [userLocation.latitude, userLocation.longitude, selectedType, radiusMeters]);

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header & Controls */}
      <div className="med-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-700" />
            OpenStreetMap Hospital & Clinic Finder
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time GIS map powered by browser Geolocation & OpenStreetMap Overpass API
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={requestLocation}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Compass className="w-4 h-4 text-teal-700" />
            <span>Refresh GPS</span>
          </button>
          <button
            onClick={fetchHospitals}
            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Search Area</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="med-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clinic or hospital name..."
            className="w-full med-input pl-9 pr-4 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full med-input px-3 py-2 rounded-xl text-xs bg-white text-slate-900 focus:outline-none"
          >
            <option value="all">All Healthcare Facilities</option>
            <option value="hospital">Hospitals & Trauma Centers</option>
            <option value="clinic">Outpatient Clinics</option>
            <option value="pharmacy">24/7 Pharmacies</option>
            <option value="emergency">Emergency Rooms (ER)</option>
          </select>
        </div>

        {/* Search Radius */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-teal-700 flex-shrink-0" />
          <select
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            className="w-full med-input px-3 py-2 rounded-xl text-xs bg-white text-slate-900 focus:outline-none"
          >
            <option value={3000}>Within 3 km</option>
            <option value={5000}>Within 5 km</option>
            <option value={10000}>Within 10 km</option>
            <option value={20000}>Within 20 km</option>
          </select>
        </div>
      </div>

      {/* Main Map + List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left / Top: Interactive Leaflet Map (2 columns) */}
        <div className="lg:col-span-2 h-[550px]">
          <LeafletMap
            center={userLocation}
            hospitals={filteredHospitals}
            selectedHospital={selectedHospital}
            onSelectHospital={setSelectedHospital}
          />
        </div>

        {/* Right / Bottom: Hospital List */}
        <div className="med-card p-4 h-[550px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nearby Facilities ({filteredHospitals.length})
            </span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Sorted by Proximity
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-700" />
                <span>Querying OpenStreetMap Overpass API...</span>
              </div>
            ) : filteredHospitals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs text-center p-6 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400" />
                <span>No facilities found within the selected criteria. Try expanding search radius.</span>
              </div>
            ) : (
              filteredHospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.osmId || hosp.name}
                  hospital={hosp}
                  isSelected={selectedHospital?.name === hosp.name}
                  onSelect={setSelectedHospital}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

