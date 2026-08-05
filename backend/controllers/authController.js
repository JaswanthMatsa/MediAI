const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

// In-memory fallback user store when MongoDB is disconnected
const inMemoryUsers = new Map();

function generateToken(userId, email, name) {
  const secret = process.env.JWT_SECRET || 'mediai_super_secret_jwt_key_2026_healthcare_app';
  return jwt.sign({ id: userId, email, name }, secret, { expiresIn: '7d' });
}

// @desc Register User
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, age, gender, medicalHistory, location } = req.body;

    const lowerEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: lowerEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: lowerEmail,
        password: hashedPassword,
        age: age || null,
        gender: gender || 'prefer_not_to_say',
        medicalHistory: medicalHistory || { allergies: [], chronicConditions: [], currentMedications: [] },
        location: location || {}
      });

      const token = generateToken(user._id, user.email, user.name);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          medicalHistory: user.medicalHistory,
          location: user.location,
          savedHospitals: user.savedHospitals || [],
          savedMedicines: user.savedMedicines || []
        }
      });
    } else {
      // In-Memory Fallback
      if (inMemoryUsers.has(lowerEmail)) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const mockId = `mem_user_${Date.now()}`;

      const userObj = {
        id: mockId,
        _id: mockId,
        name,
        email: lowerEmail,
        password: hashedPassword,
        age: age || null,
        gender: gender || 'prefer_not_to_say',
        medicalHistory: medicalHistory || { allergies: [], chronicConditions: [], currentMedications: [] },
        location: location || {},
        savedHospitals: [],
        savedMedicines: []
      };

      inMemoryUsers.set(lowerEmail, userObj);
      const token = generateToken(mockId, userObj.email, userObj.name);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (In-Memory Mode)',
        token,
        user: {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          age: userObj.age,
          gender: userObj.gender,
          medicalHistory: userObj.medicalHistory,
          location: userObj.location,
          savedHospitals: [],
          savedMedicines: []
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Login User
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      const user = await User.findOne({ email: lowerEmail });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.email, user.name);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          medicalHistory: user.medicalHistory,
          location: user.location,
          savedHospitals: user.savedHospitals || [],
          savedMedicines: user.savedMedicines || []
        }
      });
    } else {
      const user = inMemoryUsers.get(lowerEmail);
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials (User not found)' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.email, user.name);
      return res.json({
        success: true,
        message: 'Login successful (In-Memory Mode)',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          medicalHistory: user.medicalHistory,
          location: user.location,
          savedHospitals: user.savedHospitals || [],
          savedMedicines: user.savedMedicines || []
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get Current User Profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    if (getIsConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, user });
    } else {
      const user = Array.from(inMemoryUsers.values()).find(u => u.id === req.user.id || u.email === req.user.email);
      if (!user) {
        return res.json({
          success: true,
          user: {
            id: req.user.id,
            name: req.user.name || 'MediAI User',
            email: req.user.email,
            medicalHistory: { allergies: [], chronicConditions: [], currentMedications: [] },
            savedHospitals: [],
            savedMedicines: []
          }
        });
      }
      const { password, ...userWithoutPass } = user;
      return res.json({ success: true, user: userWithoutPass });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update Profile / Medical History
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, age, gender, medicalHistory, location } = req.body;

    if (getIsConnected()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (age) user.age = age;
      if (gender) user.gender = gender;
      if (medicalHistory) user.medicalHistory = { ...user.medicalHistory, ...medicalHistory };
      if (location) user.location = { ...user.location, ...location };

      await user.save();
      return res.json({ success: true, message: 'Profile updated', user });
    } else {
      let user = Array.from(inMemoryUsers.values()).find(u => u.id === req.user.id || u.email === req.user.email);
      if (user) {
        if (name) user.name = name;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (medicalHistory) user.medicalHistory = { ...user.medicalHistory, ...medicalHistory };
        if (location) user.location = { ...user.location, ...location };
      }
      return res.json({ success: true, message: 'Profile updated', user });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
