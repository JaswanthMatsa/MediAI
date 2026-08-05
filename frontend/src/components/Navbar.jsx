import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import {
  Activity,
  MapPin,
  Pill,
  BookOpen,
  AlertCircle,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Stethoscope,
  Building2,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { userLocation, requestLocation } = useHealth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [findCareOpen, setFindCareOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5 font-extrabold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Medi<span className="text-teal-700">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                Healthcare Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/' ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Find Care Dropdown */}
            <div className="relative" onMouseLeave={() => setFindCareOpen(false)}>
              <button
                onMouseEnter={() => setFindCareOpen(true)}
                onClick={() => setFindCareOpen(!findCareOpen)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  location.pathname.startsWith('/hospitals') || location.pathname.startsWith('/clinics')
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <span>Find Care</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {findCareOpen && (
                <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <Link
                    to="/hospitals"
                    onClick={() => setFindCareOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium"
                  >
                    <Building2 className="w-4 h-4 text-teal-700" />
                    <span>Nearby Hospitals</span>
                  </Link>
                  <Link
                    to="/hospitals?type=clinic"
                    onClick={() => setFindCareOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                    <span>Nearby Clinics</span>
                  </Link>
                  <Link
                    to="/hospitals?type=pharmacy"
                    onClick={() => setFindCareOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium"
                  >
                    <Pill className="w-4 h-4 text-teal-700" />
                    <span>24/7 Pharmacies</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/medicines"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/medicines' ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              Medicines
            </Link>

            <Link
              to="/articles"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                location.pathname === '/articles' ? 'text-teal-700 bg-teal-50' : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
              }`}
            >
              Health Articles
            </Link>

            <Link
              to="/emergency"
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Emergency</span>
            </Link>

          </nav>

          {/* User Location & Auth Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* GPS Detector Chip */}
            <button
              onClick={requestLocation}
              title="Click to update location"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:border-teal-600 hover:text-teal-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span className="max-w-[110px] truncate font-medium">
                {userLocation.cityName || 'Detect Location'}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-teal-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/hospitals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Find Nearby Care
          </Link>
          <Link
            to="/medicines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Medicines
          </Link>
          <Link
            to="/articles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Health Articles
          </Link>
          <Link
            to="/emergency"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-red-600 bg-red-50"
          >
            Emergency Center
          </Link>

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center rounded-lg bg-teal-700 text-white font-bold text-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="block w-full py-2.5 text-center rounded-lg bg-slate-100 text-red-600 font-semibold text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-lg bg-slate-100 text-slate-800 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-lg bg-teal-700 text-white font-bold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
