# 🩺 MediAI — Next-Gen Smart Healthcare & GIS Discovery Platform

**MediAI** is a full-stack AI-driven healthcare web application designed to connect users with nearby medical facilities, authentic FDA drug safety information, medication/hydration tracking, and structured symptom analysis backed by clinical guardrails.

Built with **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, **OpenStreetMap (Overpass GIS)**, **US OpenFDA API**, and **Google Gemini AI**.

---

## 🌟 Key Features

### 📍 Real-Time GIS Hospital & Clinic Finder
- **Interactive OpenStreetMap (Leaflet)**: Live map interface displaying nearby hospitals, emergency rooms, outpatient clinics, and 24/7 pharmacies.
- **Proximity & Radius Search**: Calculates exact distance (in km and miles) using the Haversine formula. Filter facilities within 3km, 5km, 10km, or 20km.
- **One-Tap Route Navigation**: Direct link to Google Maps driving/walking directions based on live GPS coordinates.

### 💊 Authentic US OpenFDA Drug Search
- **Official FDA Labels**: Queries the US Food & Drug Administration API for brand names, active ingredients, dosage rules, and black-box warnings.
- **Category Quick Filters**: Pain & Fever (Paracetamol/Ibuprofen), Cough & Cold, Allergies, Antacids, and Oral Rehydration.
- **Save Favorite Remedies**: Bookmark essential OTC medicines to your personal profile.

### 🤖 AI Symptom Checker & Clinical Safety Guardrails
- **Powered by Google Gemini AI**: Natural language symptom analysis returning probable causes, home care steps, and recommended OTC remedies.
- **Strict Medical Guardrails Engine**: Non-diagnostic design that never prescribes controlled antibiotics or definitive diagnoses.
- **Automatic Emergency Detection**: Detects acute keywords (chest pain, stroke, severe bleeding) and immediately elevates urgency badges to 🔴 Emergency while presenting the nearest trauma facilities.

### ⏰ Daily Medication & Hydration Tracker
- **Custom Reminders**: Set daily medicine intake times with dosage instructions and mark tasks as completed.
- **Interactive Water Tracker**: Visual progress bar tracking 8-glass daily hydration goals with local storage persistence.

### 📊 Body Mass Index (BMI) & Health Assessment
- Calculates exact BMI ratio, classifies weight categories (Underweight, Normal, Overweight, Obesity), and generates evidence-based wellness recommendations.

### 🚨 Emergency Hub & Direct Direct Hotline
- One-tap emergency phone dialing for Universal Emergency (911/112), Ambulance, Poison Control, and Mental Health Crisis Hotlines.
- Visual red-flag symptom guide for acute medical situations.

---

## 🏗️ Architecture & Data Flow

```
[ Frontend (React 18 + Vite + Leaflet + Tailwind CSS) ]
                        │
                        │ REST API Requests
                        ▼
      [ Backend (Node.js + Express Server) ]
       ├── Auth Engine (JWT + MongoDB / In-Memory Fallback)
       ├── OpenStreetMap Service (Nominatim + Overpass QL)
       ├── OpenFDA Drug Service (FDA Label Query + Local OTC Cache)
       └── Gemini AI Service (Clinical Safety Engine)
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, Leaflet Maps, React Router v7 |
| **Backend** | Node.js, Express.js, JWT Authentication, Axios, Mongoose |
| **Database** | MongoDB Atlas (with in-memory fallback for local execution) |
| **APIs Integrated** | OpenStreetMap Overpass API, Nominatim Geocoding, US OpenFDA API, Google Gemini AI |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/JaswanthMatsa/MediAI.git
cd MediAI
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create or verify `.env` file in `/backend`:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start backend dev server:
```bash
npm run dev
```
*Backend runs at: `http://localhost:5001`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173`*

---

## 📄 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login & JWT issuance
- `GET /api/auth/me` — Fetch active profile
- `PUT /api/auth/profile` — Update medical history & preferences

### 💬 AI Chat & Symptoms (`/api/chat`)
- `POST /api/chat/message` — Analyze symptoms & return OTC/hospital guidance
- `GET /api/chat/history` — Get past conversation logs
- `DELETE /api/chat/history` — Clear chat history

### 🏥 Facilities (`/api/hospitals`)
- `GET /api/hospitals/nearby?lat=...&lng=...&radius=...&type=...` — Fetch OSM nearby care
- `POST /api/hospitals/save` — Save hospital to favorites
- `GET /api/hospitals/saved` — Get bookmarked facilities

### 💊 Medicines (`/api/medicines`)
- `GET /api/medicines/search?q=...` — Query OpenFDA drug database
- `POST /api/medicines/save` — Save OTC medicine to favorites

### 🩺 Health Metrics & Reminders (`/api/health`)
- `GET /api/health/reminders` — Fetch daily medication reminders
- `POST /api/health/reminders` — Create new reminder
- `PUT /api/health/reminders/:id/toggle` — Toggle completed status
- `POST /api/health/bmi` — Calculate BMI and wellness advice

---

## 🔒 Security & Medical Disclaimer

> **Medical Disclaimer**: MediAI is designed as an informational health platform. It does NOT provide formal medical diagnosis or prescribe controlled substances. In case of medical emergency, immediately dial **911** or visit the nearest trauma center.

---

## 🤝 Portfolio & CV Credit
Developed by **Jaswanth Matsa** — Healthcare AI & Web Development Project.
