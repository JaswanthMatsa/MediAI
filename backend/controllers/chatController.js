const { analyzeSymptomsWithAI } = require('../services/geminiService');
const { searchMedicines } = require('../services/medicineService');
const { fetchNearbyHospitalsFromOSM } = require('../services/overpassService');
const Chat = require('../models/Chat');
const SearchHistory = require('../models/SearchHistory');
const { getIsConnected } = require('../config/db');

// In-memory chat store fallback
const inMemoryChats = [];

// @desc Process AI Symptom Analysis & Healthcare Chatbot
// @route POST /api/chat/message
const sendMessage = async (req, res, next) => {
  try {
    const { message, location } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Step 1: Query local medicine service for OTC drug context matching user symptoms
    const otcMedicines = await searchMedicines(message);

    // Step 2: Pass symptoms + OTC drug data through Gemini AI Healthcare Guardrails Engine
    const aiResult = await analyzeSymptomsWithAI(message, otcMedicines);

    // Step 3: If emergency or severe, automatically fetch nearby hospital data
    let recommendedHospitals = [];
    if (aiResult.severity === 'emergency' || aiResult.severity === 'severe') {
      const userLat = location?.latitude || 37.7749;
      const userLng = location?.longitude || -122.4194;
      const rawHospitals = await fetchNearbyHospitalsFromOSM(userLat, userLng, 8000);
      recommendedHospitals = rawHospitals.slice(0, 3).map(h => ({
        name: h.name,
        address: h.address,
        phone: h.phone,
        distanceKm: h.distanceKm,
        type: h.type
      }));
    }

    const chatResponseData = {
      user: userId,
      message,
      response: aiResult.response,
      severity: aiResult.severity,
      safetyNotice: aiResult.safetyNotice,
      symptomsExtracted: aiResult.symptomsExtracted,
      recommendedMedicines: aiResult.recommendedMedicines,
      recommendedHospitals,
      timestamp: new Date()
    };

    // Step 4: Persist chat log and search record
    if (getIsConnected()) {
      await Chat.create(chatResponseData);
      await SearchHistory.create({
        user: userId,
        query: message,
        type: 'symptom',
        resultCount: aiResult.recommendedMedicines.length
      });
    } else {
      inMemoryChats.unshift({ ...chatResponseData, id: `chat_${Date.now()}` });
    }

    return res.json({
      success: true,
      data: chatResponseData
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get User Chat History
// @route GET /api/chat/history
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (getIsConnected()) {
      const chats = await Chat.find(userId ? { user: userId } : {})
        .sort({ timestamp: -1 })
        .limit(20);
      return res.json({ success: true, count: chats.length, chats });
    } else {
      const filtered = userId ? inMemoryChats.filter(c => c.user === userId) : inMemoryChats;
      return res.json({ success: true, count: filtered.length, chats: filtered.slice(0, 20) });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Clear Chat History
// @route DELETE /api/chat/history
const clearHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (getIsConnected() && userId) {
      await Chat.deleteMany({ user: userId });
    }
    return res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getHistory, clearHistory };
