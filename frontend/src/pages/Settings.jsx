import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, ShieldCheck, Bell, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [allergies, setAllergies] = useState(user?.medicalHistory?.allergies?.join(', ') || '');
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        age: parseInt(age),
        medicalHistory: { allergies: allergies ? allergies.split(',').map(a => a.trim()) : [] }
      });
      setSavedMsg('Settings updated successfully!');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="med-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-teal-700" />
            Account & Health Settings
          </h1>
          <p className="text-xs text-slate-600 mt-1">Manage your personal profile and medical history parameters</p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="med-card p-6 space-y-4 text-xs">
        <div>
          <label className="font-bold text-slate-900 block mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full med-input px-3.5 py-2.5 rounded-xl"
          />
        </div>

        <div>
          <label className="font-bold text-slate-900 block mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full med-input px-3.5 py-2.5 rounded-xl"
          />
        </div>

        <div>
          <label className="font-bold text-slate-900 block mb-1">Drug Allergies (Comma separated)</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full med-input px-3.5 py-2.5 rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition shadow-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
