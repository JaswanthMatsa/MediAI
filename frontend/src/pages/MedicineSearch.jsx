import React, { useState, useEffect } from 'react';
import { medicineService } from '../services/medicineService';
import MedicineCard from '../components/MedicineCard';
import { Pill, Search, ShieldCheck, Sparkles, Filter, RefreshCw, AlertCircle } from 'lucide-react';

export default function MedicineSearch() {
  const [query, setQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { label: 'All OTC Drugs', query: '' },
    { label: 'Pain & Fever (Paracetamol/Ibuprofen)', query: 'pain' },
    { label: 'Cough & Cold', query: 'cough' },
    { label: 'Allergies & Anti-histamines', query: 'allergy' },
    { label: 'Heartburn & Antacids', query: 'antacid' },
    { label: 'Dehydration & Rehydration', query: 'rehydration' }
  ];

  const handleSearch = async (searchTerm = query) => {
    setLoading(true);
    try {
      const res = await medicineService.search(searchTerm);
      if (res.success && res.medicines) {
        setMedicines(res.medicines);
      }
    } catch (err) {
      console.warn('[Medicine Search Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.label);
    setQuery(cat.query);
    handleSearch(cat.query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="med-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" /> Official FDA Label Database Connector
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-700" />
            Authentic OTC Medicine Search
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Search official US Food & Drug Administration (OpenFDA) drug label records & safety warnings
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search brand name or ingredient..."
            className="w-full med-input pl-9 pr-20 py-2.5 rounded-2xl text-xs placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => handleSearch()}
            className="absolute right-1.5 top-1.5 px-3 py-1 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-sm"
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <Filter className="w-4 h-4 text-teal-700 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition border ${
              activeCategory === cat.label
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50 hover:text-teal-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Medicines */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-xs space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-teal-700" />
          <span>Fetching official OpenFDA drug labels...</span>
        </div>
      ) : medicines.length === 0 ? (
        <div className="med-card p-12 text-center text-slate-500 text-xs space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <p>No matching FDA medicine records found for "{query}". Try searching a common ingredient like "Paracetamol" or "Ibuprofen".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med, idx) => (
            <MedicineCard key={med.fdaId || idx} medicine={med} />
          ))}
        </div>
      )}

    </div>
  );
}

