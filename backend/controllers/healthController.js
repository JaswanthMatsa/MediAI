const Reminder = require('../models/Reminder');
const { getIsConnected } = require('../config/db');

// In-memory fallback for reminders
const inMemoryReminders = [];

// @desc Get User Reminders
// @route GET /api/health/reminders
const getReminders = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;

    if (getIsConnected() && userId) {
      const reminders = await Reminder.find({ user: userId }).sort({ time: 1 });
      return res.json({ success: true, count: reminders.length, reminders });
    } else {
      const filtered = userId ? inMemoryReminders.filter(r => r.user === userId) : inMemoryReminders;
      return res.json({ success: true, count: filtered.length, reminders: filtered });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create Medicine or Water Reminder
// @route POST /api/health/reminders
const createReminder = async (req, res, next) => {
  try {
    const { title, type, dosage, time, frequency } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!title || !time) {
      return res.status(400).json({ success: false, message: 'Title and time are required' });
    }

    const reminderData = {
      user: userId,
      title,
      type: type || 'medicine',
      dosage: dosage || '',
      time,
      frequency: frequency || 'Daily',
      active: true,
      completedToday: false
    };

    if (getIsConnected()) {
      const reminder = await Reminder.create(reminderData);
      return res.status(201).json({ success: true, reminder });
    } else {
      const reminder = { ...reminderData, id: `rem_${Date.now()}` };
      inMemoryReminders.push(reminder);
      return res.status(201).json({ success: true, reminder });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Toggle Reminder Completed Status
// @route PUT /api/health/reminders/:id/toggle
const toggleReminder = async (req, res, next) => {
  try {
    const reminderId = req.params.id;

    if (getIsConnected()) {
      const reminder = await Reminder.findById(reminderId);
      if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });

      reminder.completedToday = !reminder.completedToday;
      await reminder.save();
      return res.json({ success: true, reminder });
    } else {
      const reminder = inMemoryReminders.find(r => r.id === reminderId || r._id === reminderId);
      if (reminder) {
        reminder.completedToday = !reminder.completedToday;
      }
      return res.json({ success: true, reminder });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Calculate BMI
// @route POST /api/health/bmi
const calculateBMI = async (req, res, next) => {
  try {
    const { weightKg, heightCm } = req.body;
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm) / 100; // to meters

    if (!w || !h || h <= 0) {
      return res.status(400).json({ success: false, message: 'Valid weight (kg) and height (cm) required' });
    }

    const bmi = Math.round((w / (h * h)) * 10) / 10;
    let category = 'Normal weight';
    let color = 'emerald';
    let recommendations = [];

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'amber';
      recommendations = [
        'Focus on nutrient-dense meals with adequate healthy calories.',
        'Incorporate strength training to build lean muscle mass.',
        'Consult a nutritionist to develop a structured dietary plan.'
      ];
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Normal weight';
      color = 'emerald';
      recommendations = [
        'Great job! Maintain a balanced diet rich in whole foods, vegetables, and proteins.',
        'Aim for at least 150 minutes of moderate aerobic activity per week.',
        'Keep up regular annual health checkups.'
      ];
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = 'orange';
      recommendations = [
        'Adopt a balanced caloric deficit with portion control.',
        'Engage in regular physical exercise like brisk walking, cycling, or swimming.',
        'Reduce intake of processed sugars and refined carbohydrates.'
      ];
    } else {
      category = 'Obesity';
      color = 'red';
      recommendations = [
        'Consult your physician or endocrinologist for a personalized weight management strategy.',
        'Focus on sustainable, gradual weight loss through physician-guided diet and exercise.',
        'Monitor blood pressure, blood glucose, and lipid profiles regularly.'
      ];
    }

    return res.json({
      success: true,
      bmi,
      category,
      color,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get Curated Health Articles & Emergency Contacts
// @route GET /api/health/info
const getHealthInfo = async (req, res, next) => {
  try {
    const emergencyContacts = [
      { service: 'National Emergency Helpline', number: '911 / 112', type: 'Universal Emergency' },
      { service: 'Ambulance & Trauma Direct', number: '102 / 911', type: 'Medical Ambulance' },
      { service: 'Poison Control Center', number: '1-800-222-1222', type: 'Poison Emergency' },
      { service: 'Mental Health & Crisis Hotline', number: '988', type: 'Psychiatric / Crisis Care' }
    ];

    const articles = [
      {
        id: 1,
        title: 'Understanding Common OTC Pain Relievers: Acetaminophen vs Ibuprofen',
        category: 'Medication Safety',
        readTime: '4 min read',
        snippet: 'Learn when to choose paracetamol for fever versus ibuprofen for inflammation, along with liver and stomach warnings.',
        date: 'July 2026'
      },
      {
        id: 2,
        title: '5 Warning Signs You Should Visit the Emergency Room Immediately',
        category: 'Emergency Guide',
        readTime: '3 min read',
        snippet: 'Recognizing sudden onset symptoms like severe chest pain, facial drooping, high fever in infants, or breathing trouble.',
        date: 'July 2026'
      },
      {
        id: 3,
        title: 'Hydration Guidelines: How Much Water Do You Really Need Daily?',
        category: 'Preventative Wellness',
        readTime: '5 min read',
        snippet: 'The science behind daily fluid balance, electrolyte replacement, and signs of mild to moderate dehydration.',
        date: 'July 2026'
      }
    ];

    return res.json({
      success: true,
      emergencyContacts,
      articles
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReminders, createReminder, toggleReminder, calculateBMI, getHealthInfo };
