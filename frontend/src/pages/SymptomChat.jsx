import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { useHealth } from '../context/HealthContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  AlertTriangle,
  Pill,
  MapPin,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import SymptomBadge from '../components/SymptomBadge';

export default function SymptomChat() {
  const [searchParams] = useSearchParams();
  const { userLocation } = useHealth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const symptomPresets = [
    'Cold, cough and runny nose',
    'Mild fever and headache',
    'Sore throat and body ache',
    'Stomach acidity and bloating',
    'Seasonal allergy sneezing'
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history or initial symptom query from URL
  useEffect(() => {
    const initChat = async () => {
      try {
        const historyRes = await chatService.getHistory();
        if (historyRes.success && historyRes.chats?.length > 0) {
          // Convert backend chats format to UI messages
          const formatted = [];
          historyRes.chats.reverse().forEach(c => {
            formatted.push({ sender: 'user', text: c.message, timestamp: c.timestamp });
            formatted.push({
              sender: 'ai',
              text: c.response,
              severity: c.severity,
              recommendedMedicines: c.recommendedMedicines,
              recommendedHospitals: c.recommendedHospitals,
              timestamp: c.timestamp
            });
          });
          setMessages(formatted);
        } else {
          // Initial Welcome Message
          setMessages([
            {
              sender: 'ai',
              text: `### 👋 Welcome to MediAI Symptom Assistant!

I am your AI healthcare information companion. Tell me what symptoms you are experiencing (e.g. *"I have a headache and mild fever"*).

#### 🛡️ AI Safety Protocol:
* I **never diagnose** diseases or prescribe prescription-only antibiotics.
* I recommend common **FDA-documented OTC medicines** with dosage warnings.
* For **emergency symptoms** (severe chest pain, shortness of breath), I direct you to the nearest emergency hospital.`,
              timestamp: new Date()
            }
          ]);
        }

        // Check if symptom query passed in URL search param
        const paramSymptom = searchParams.get('symptom');
        if (paramSymptom) {
          handleSend(paramSymptom);
        }
      } catch (err) {
        console.warn('[Chat History Warning]', err.message);
      }
    };
    initChat();
  }, []);

  const handleSend = async (textToSend = inputMessage) => {
    const query = typeof textToSend === 'string' ? textToSend.trim() : inputMessage.trim();
    if (!query || loading) return;

    const userMsg = { sender: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(query, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });

      if (res.success && res.data) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.response,
          severity: res.data.severity,
          recommendedMedicines: res.data.recommendedMedicines,
          recommendedHospitals: res.data.recommendedHospitals,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ An error occurred while reaching the MediAI Healthcare Engine. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await chatService.clearHistory();
    } catch {}
    setMessages([
      {
        sender: 'ai',
        text: 'Chat history cleared. How can MediAI assist your health today?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="med-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              MediAI Symptom Checker
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                Gemini AI Protected
              </span>
            </h1>
            <p className="text-xs text-slate-600">
              Interactive healthcare assistant for symptom breakdown & OTC guidance
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="med-card h-[600px] flex flex-col overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-700 text-white'
                  : msg.severity === 'emergency'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-teal-700 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 font-bold" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`space-y-3 p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-700 text-white rounded-tr-none font-medium shadow-xs'
                  : msg.severity === 'emergency'
                  ? 'bg-red-50 border border-red-200 text-red-900 rounded-tl-none font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                
                {/* Text Body */}
                <div className="prose prose-xs max-w-none whitespace-pre-line text-inherit">
                  {msg.text}
                </div>

                {/* Suggested OTC Medicines Callout */}
                {msg.recommendedMedicines && msg.recommendedMedicines.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-teal-800 text-xs">
                      <Pill className="w-4 h-4 text-teal-700" /> Suggested Over-The-Counter Options:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedMedicines.map((med, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-100 text-[11px] space-y-1">
                          <span className="font-bold text-teal-900 block">{med.name}</span>
                          <p className="text-slate-600">{med.purpose}</p>
                          {med.warnings && (
                            <span className="text-[10px] text-amber-800 block font-medium">⚠️ {med.warnings}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Hospital Alert Callout */}
                {msg.recommendedHospitals && msg.recommendedHospitals.length > 0 && (
                  <div className="pt-3 border-t border-red-200 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-red-700 text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" /> Recommended Nearest Emergency Facilities:
                    </div>
                    <div className="space-y-2">
                      {msg.recommendedHospitals.map((hosp, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] flex items-center justify-between">
                          <div>
                            <span className="font-bold text-red-900">{hosp.name}</span>
                            <p className="text-red-700">{hosp.address} ({hosp.distanceKm} km away)</p>
                          </div>
                          <Link
                            to="/hospitals"
                            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition"
                          >
                            View Map
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-teal-800 font-medium bg-teal-50 p-3 rounded-xl border border-teal-200 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span>MediAI is analyzing symptoms & checking OpenFDA drug labels...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Symptom Chips */}
        <div className="px-6 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 font-semibold flex-shrink-0">Presets:</span>
          {symptomPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSend(preset)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 text-[11px] text-teal-800 border border-slate-200 hover:border-teal-300 font-medium flex-shrink-0 transition"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your symptoms (e.g. 'I have a fever and body aches')..."
            className="flex-1 med-input px-4 py-3 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || loading}
            className="px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition shadow-sm"
          >
            <span>Analyze</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

