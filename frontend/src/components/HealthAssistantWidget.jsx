import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ShieldCheck, MapPin, Pill, Clock, Sparkles, Navigation } from 'lucide-react';
import { chatService } from '../services/chatService';
import { useHealth } from '../context/HealthContext';
import { Link } from 'react-router-dom';

export default function HealthAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! 👋\n\nI'm MediAI Health Assistant.\n\nDescribe your symptoms in simple words, for example:\n• Fever and headache\n• Cough for 3 days\n• Stomach pain after eating\n• Sore throat\n\nI'll provide:\n✓ General health guidance\n✓ OTC medicine information\n✓ Advice on when to see a doctor\n\nI don't replace professional medical care.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { userLocation } = useHealth();
  const messagesEndRef = useRef(null);

  const quickChips = [
    { label: '🤒 Fever', query: 'I have fever and body temperature' },
    { label: '🤧 Cold', query: 'I have a cold and runny nose' },
    { label: '🤕 Headache', query: 'I have a headache' },
    { label: '🤢 Stomach Pain', query: 'I have stomach pain after eating' },
    { label: '😷 Cough', query: 'I have a cough for 3 days' },
    { label: '💊 Medicine Info', query: 'Information on Paracetamol dosage' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, loading]);

  const handleSend = async (queryText = input) => {
    const textToSend = typeof queryText === 'string' ? queryText.trim() : input.trim();
    if (!textToSend || loading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: textToSend, timestamp: timeString }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(textToSend, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });

      if (res.success && res.data) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.response,
            severity: res.data.severity,
            urgencyBadge: res.data.urgencyBadge || (res.data.severity === 'emergency' ? '🔴 Emergency' : '🟢 Low'),
            recommendedMedicines: res.data.recommendedMedicines,
            recommendedHospitals: res.data.recommendedHospitals,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered a temporary connection issue. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipQuery) => {
    setInput(chipQuery);
    handleSend(chipQuery);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      
      {/* Expanded Widget Window */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[420px] h-[560px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Widget Header */}
          <div className="bg-teal-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">MediAI Health Assistant</h3>
                <div className="flex items-center gap-1 text-[10px] text-teal-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active & Safe Guidance</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-teal-700 text-teal-100 transition"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Safety Notice Sub-bar */}
          <div className="bg-teal-50 border-b border-teal-100 px-3 py-1.5 text-[11px] text-teal-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span>Provides OTC info & health guidance. Non-diagnostic.</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-teal-700 text-white rounded-tr-none font-medium shadow-sm'
                      : msg.severity === 'emergency'
                      ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Urgency Badge */}
                  {msg.urgencyBadge && (
                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800 mb-1">
                      Urgency: {msg.urgencyBadge}
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Response Cards: Suggested Medicines */}
                  {msg.recommendedMedicines && msg.recommendedMedicines.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <span className="font-bold text-teal-800 text-[11px] flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-teal-700" /> Suggested OTC Remedies:
                      </span>
                      <div className="space-y-1">
                        {msg.recommendedMedicines.map((med, mIdx) => (
                          <div key={mIdx} className="p-2 rounded-lg bg-teal-50/80 border border-teal-100 text-[11px]">
                            <strong className="text-teal-900 block">{med.name}</strong>
                            <p className="text-slate-600">{med.purpose}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response Cards: Nearby Hospitals */}
                  {msg.recommendedHospitals && msg.recommendedHospitals.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <span className="font-bold text-red-700 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-600" /> Recommended Nearby Facilities:
                      </span>
                      <div className="space-y-1">
                        {msg.recommendedHospitals.map((hosp, hIdx) => (
                          <div key={hIdx} className="p-2 rounded-lg bg-red-50 border border-red-200 text-[11px] flex items-center justify-between">
                            <div>
                              <strong className="text-red-900 block">{hosp.name}</strong>
                              <span className="text-red-700 text-[10px]">{hosp.distanceKm} km away</span>
                            </div>
                            <Link to="/hospitals" className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[10px]">
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className={`text-[9px] block text-right pt-1 ${msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Quick Action Chips (Right below onboarding message) */}
            {messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Suggested Topics:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickChips.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleChipClick(chip.query)}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 text-teal-800 text-[11px] font-medium border border-slate-200 shadow-sm transition hover:border-teal-300"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-teal-800 font-medium bg-teal-50 p-2.5 rounded-xl border border-teal-100 animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>MediAI is analyzing symptoms...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder='Describe your symptoms... e.g. "I have fever and cough for 2 days"'
              className="flex-1 med-input px-3.5 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Floating Button */
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xl shadow-teal-900/20 border border-teal-600 transition-all duration-300 hover:scale-105"
        >
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <span>Health Assistant</span>
        </button>
      )}

    </div>
  );
}
