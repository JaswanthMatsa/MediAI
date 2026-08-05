import React, { useState, useEffect } from 'react';
import { healthService } from '../services/healthService';
import { Bell, Droplets, Plus, CheckCircle2, Clock, Trash2, Pill, Sparkles } from 'lucide-react';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [newType, setNewType] = useState('medicine');

  // Water Tracker State
  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('mediai_water_glasses');
      return saved ? parseInt(saved) : 3;
    } catch {
      return 3;
    }
  });

  const waterGoal = 8; // 8 glasses goal

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await healthService.getReminders();
      if (res.success && res.reminders) {
        setReminders(res.reminders);
      }
    } catch (err) {
      console.warn('[Reminders Fetch Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await healthService.createReminder({
        title: newTitle,
        dosage: newDosage,
        time: newTime,
        type: newType,
        frequency: 'Daily'
      });
      if (res.success && res.reminder) {
        setReminders(prev => [...prev, res.reminder]);
        setNewTitle('');
        setNewDosage('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.warn('[Add Reminder Error]', err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await healthService.toggleReminder(id);
      if (res.success && res.reminder) {
        setReminders(prev => prev.map(r => (r._id === id || r.id === id ? res.reminder : r)));
      }
    } catch (err) {
      // Local fallback toggle
      setReminders(prev => prev.map(r => r._id === id || r.id === id ? { ...r, completedToday: !r.completedToday } : r));
    }
  };

  const updateWater = (delta) => {
    const nextVal = Math.max(0, Math.min(12, waterGlasses + delta));
    setWaterGlasses(nextVal);
    localStorage.setItem('mediai_water_glasses', nextVal.toString());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      
      {/* Header */}
      <div className="med-card p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-700" />
            Medication & Hydration Tracker
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Keep track of daily medicine schedules and water intake goals
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Add Reminder Modal Form */}
      {showAddForm && (
        <form onSubmit={handleAddReminder} className="med-card p-6 border-teal-200 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-teal-800">Set New Medication Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Medicine Name</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Paracetamol 500mg"
                required
                className="w-full med-input px-3 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Dosage Guidance</label>
              <input
                type="text"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g. 1 Tablet after breakfast"
                className="w-full med-input px-3 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Schedule Time</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 08:00 AM"
                required
                className="w-full med-input px-3 py-2 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full med-input px-3 py-2 rounded-xl text-xs bg-white focus:outline-none"
              >
                <option value="medicine">Medicine</option>
                <option value="water">Water</option>
                <option value="appointment">Doctor Appointment</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-sm"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Reminders List & Water Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Medicine Reminders Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Daily Medication Schedule ({reminders.length})
          </h2>

          {loading ? (
            <div className="med-card p-8 text-center text-xs text-slate-500">Loading reminders...</div>
          ) : reminders.length === 0 ? (
            <div className="med-card p-8 text-center text-xs text-slate-500 space-y-2">
              <Pill className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No medication schedules set yet. Click "Add Reminder" above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((rem) => {
                const id = rem._id || rem.id;
                return (
                  <div
                    key={id}
                    className={`med-card p-4 flex items-center justify-between gap-4 ${
                      rem.completedToday ? 'border-emerald-300 bg-emerald-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggle(id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                          rem.completedToday ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 border border-slate-300 text-slate-400 hover:text-teal-700'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <div>
                        <h4 className={`text-sm font-bold ${rem.completedToday ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {rem.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 text-teal-700 font-semibold">
                            <Clock className="w-3 h-3" /> {rem.time}
                          </span>
                          {rem.dosage && <span>• {rem.dosage}</span>}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      rem.completedToday ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {rem.completedToday ? 'Completed Today' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Water Tracker Column (1 col) */}
        <div className="med-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Daily Hydration Goal</h3>
            </div>
            <span className="text-xs font-bold text-blue-700">{waterGlasses} / {waterGoal} Glasses</span>
          </div>

          {/* Progress Visual Bar */}
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200 p-0.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (waterGlasses / waterGoal) * 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-xl flex items-center justify-center transition ${
                  i < waterGlasses
                    ? 'bg-blue-50 border-blue-200 text-blue-600 scale-105 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-300'
                }`}
              >
                💧
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateWater(-1)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
            >
              - 1 Glass
            </button>
            <button
              onClick={() => updateWater(1)}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition"
            >
              + Drink Glass
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

