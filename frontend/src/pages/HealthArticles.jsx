import React from 'react';
import { BookOpen, Search, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function HealthArticles() {
  const articles = [
    {
      id: 1,
      title: 'Understanding Common Over-The-Counter Pain Relievers',
      category: 'Medication Safety',
      readTime: '5 min read',
      date: 'July 2026',
      snippet: 'A comprehensive breakdown of Acetaminophen versus Ibuprofen, when to use each for fever or pain, and safe daily dosage limits.',
      content: 'Acetaminophen (Tylenol) works in the brain to reduce fever and pain signals. Ibuprofen (Advil/Motrin) is an NSAID that reduces inflammation directly at the tissue level. Always check package warnings to avoid liver or stomach complications.'
    },
    {
      id: 2,
      title: '5 Warning Signs That Require Emergency Department Care',
      category: 'Emergency Guide',
      readTime: '4 min read',
      date: 'July 2026',
      snippet: 'Recognizing high-risk medical emergencies including sudden chest pressure, respiratory distress, facial numbness, or severe head injury.',
      content: 'If experiencing chest pressure radiating to arm or jaw, difficulty speaking in full sentences, or sudden loss of vision, call 911 or visit the nearest ER immediately.'
    },
    {
      id: 3,
      title: 'Dehydration & Electrolyte Replacement Science',
      category: 'Preventative Wellness',
      readTime: '6 min read',
      date: 'July 2026',
      snippet: 'The physiological balance of sodium, potassium, and glucose during illness, fever, or heavy physical exertion.',
      content: 'Oral Rehydration Salts (ORS) contain precisely balanced glucose and sodium to enable rapid intestinal fluid absorption.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="med-card p-6 sm:p-8 text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Mayo Clinic Inspired Health & Disease Articles
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Medically reviewed guides on disease prevention, medication safety, and wellness
        </p>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div key={art.id} className="med-card p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-teal-700 uppercase tracking-wider text-[10px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {art.category}
                </span>
                <span>{art.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-teal-700 transition">
                {art.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {art.snippet}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">{art.date}</span>
              <span className="font-semibold text-teal-700 flex items-center gap-1">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
