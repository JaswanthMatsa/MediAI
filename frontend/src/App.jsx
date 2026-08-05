import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HealthAssistantWidget from './components/HealthAssistantWidget';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import HospitalFinder from './pages/HospitalFinder';
import HospitalDetails from './pages/HospitalDetails';
import MedicineSearch from './pages/MedicineSearch';
import HealthArticles from './pages/HealthArticles';
import Emergency from './pages/Emergency';
import Reminders from './pages/Reminders';
import BMICalculator from './pages/BMICalculator';
import Profile from './pages/Profile';
import SavedHospitals from './pages/SavedHospitals';
import SearchHistory from './pages/SearchHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
                <Route path="/chat" element={<SymptomChecker />} />
                <Route path="/hospitals" element={<HospitalFinder />} />
                <Route path="/hospitals/:id" element={<HospitalDetails />} />
                <Route path="/medicines" element={<MedicineSearch />} />
                <Route path="/articles" element={<HealthArticles />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/bmi" element={<BMICalculator />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved-hospitals" element={<SavedHospitals />} />
                <Route path="/search-history" element={<SearchHistory />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Floating Health Assistant Bottom-Right Widget */}
            <HealthAssistantWidget />

            <Footer />
          </div>
        </Router>
      </HealthProvider>
    </AuthProvider>
  );
}
