import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, ExternalLink, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Important Healthcare Safety Disclaimer Box */}
        <div className="mb-10 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-800 mr-2">Medical Disclaimer:</span>
            MediAI is a medical information platform. MediAI does NOT provide formal medical diagnoses, prescribe controlled antibiotics, or replace professional medical advice. Always consult a licensed physician or emergency services for urgent symptoms.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">Medi<span className="text-teal-700">AI</span></span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowering individuals with instant location-aware hospital discovery, OTC medicine database, and structured symptom guidance.
            </p>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Healthcare Care</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/hospitals" className="hover:text-teal-700 transition">Find Nearby Hospitals</Link></li>
              <li><Link to="/symptom-checker" className="hover:text-teal-700 transition">Symptom Checker</Link></li>
              <li><Link to="/medicines" className="hover:text-teal-700 transition">OTC Medicine Database</Link></li>
              <li><Link to="/articles" className="hover:text-teal-700 transition">Health Articles</Link></li>
              <li><Link to="/reminders" className="hover:text-teal-700 transition">Medication Reminders</Link></li>
            </ul>
          </div>

          {/* Authentic Data Sources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Authentic Data APIs</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1">
                <span>OTC Medicine Catalog</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1">
                <span>OpenStreetMap Overpass GIS</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1">
                <span>Google Gemini AI Engine</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
            </ul>
          </div>

          {/* Emergency Box */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-red-600" /> Emergency Hotline
            </h4>
            <p className="text-[11px] text-slate-700 mb-3">
              Experiencing severe chest pain, shortness of breath, or trauma?
            </p>
            <Link
              to="/emergency"
              className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
            >
              Emergency Center 🚨
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MediAI Platform. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-600">
            Built with <Heart className="w-3.5 h-3.5 text-teal-700 fill-teal-700" /> for Healthcare Innovation
          </p>
        </div>

      </div>
    </footer>
  );
}
