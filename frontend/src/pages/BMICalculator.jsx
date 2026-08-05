import React, { useState } from 'react';
import { healthService } from '../services/healthService';
import { Calculator, Activity, Heart, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BMICalculator() {
  const [weightKg, setWeightKg] = useState('70');
  const [heightCm, setHeightCm] = useState('175');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await healthService.calculateBMI(weightKg, heightCm);
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.warn('[BMI Calc Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      
      {/* Header */}
      <div className="med-card p-6 text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto">
          <Calculator className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Body Mass Index (BMI) & Health Metrics</h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Calculate your BMI ratio to assess healthy body weight proportions and medical recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form Card */}
        <form onSubmit={handleCalculate} className="med-card p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Enter Parameters</h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Weight (in Kilograms)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g. 70"
              required
              className="w-full med-input px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Height (in Centimeters)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 175"
              required
              className="w-full med-input px-4 py-3 rounded-xl text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition shadow-sm"
          >
            {loading ? 'Calculating...' : 'Calculate Body Mass Index'}
          </button>
        </form>

        {/* Result Card */}
        <div className="med-card p-6 flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">BMI Assessment</h3>

          {result ? (
            <div className="space-y-4 text-center my-auto">
              <div className="text-5xl font-extrabold text-teal-700">{result.bmi}</div>
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {result.category}
              </div>

              {/* Recommendations */}
              <div className="text-left pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-900 block">Personalized Wellness Advice:</span>
                {result.recommendations?.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 text-xs my-auto space-y-2">
              <Activity className="w-8 h-8 mx-auto text-slate-400" />
              <p>Enter your weight and height to generate your BMI evaluation.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

