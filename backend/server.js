const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/healthcheck', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MediAI Healthcare Backend API',
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/health', healthRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[MediAI Server] Running on http://localhost:${PORT}`);
});

module.exports = app;
