# MediAI — Smart Healthcare & GIS Discovery Platform

MediAI is a full-stack healthcare web application that helps users find nearby medical facilities, look up authentic FDA drug information, track medication and hydration, and get AI-guided symptom analysis backed by clinical safety guardrails.

Built with **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, **OpenStreetMap (Overpass/Nominatim)**, **US OpenFDA API**, and **Google Gemini AI**.

**Live demo:** _add your deployed link here_

---

## Key Features

**Real-Time GIS Hospital & Clinic Finder**
Interactive map (Leaflet + OpenStreetMap) showing nearby hospitals, clinics, and pharmacies, with Haversine-based distance filtering (3–20 km) and one-tap directions via Google Maps.

**US OpenFDA Drug Search**
Queries the official FDA label database for brand names, active ingredients, dosage, and warnings, with quick category filters and the ability to save favorite OTC remedies.

**AI Symptom Checker with Clinical Guardrails**
Google Gemini-powered symptom analysis (with a rule-based fallback when no API key is configured) that returns structured, non-diagnostic guidance — possible cause, OTC options, home care, and when to see a doctor. Never prescribes controlled substances or definitive diagnoses. Automatically detects emergency keywords and surfaces the nearest trauma facilities.

**Medication & Hydration Tracking**
Custom daily medicine reminders with dosage notes, plus a hydration tracker with progress visualization.

**BMI & Health Assessment**
Calculates BMI, classifies weight category, and returns evidence-based wellness recommendations.

**Emergency Hub**
One-tap dialing for emergency services, ambulance, poison control, and mental health crisis lines, plus a red-flag symptom reference guide.

---

## Architecture

```
Frontend (React + Vite + Leaflet + Tailwind)
                │  REST API
                ▼
Backend (Node.js + Express)
 ├── Auth (JWT + MongoDB, in-memory fallback for local dev)
 ├── Hospital Service (Nominatim + Overpass QL)
 ├── Medicine Service (OpenFDA + local OTC cache)
 └── AI Service (Gemini, with rule-based fallback)
```

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v7, Leaflet |
| Backend | Node.js, Express, JWT, Axios, Mongoose |
| Database | MongoDB Atlas (in-memory fallback for local runs without a DB) |
| External APIs | OpenStreetMap (Overpass, Nominatim), US OpenFDA, Google Gemini |

---

## Security

- JWT authentication with an environment-enforced secret — the server fails to start if `JWT_SECRET` is not set, rather than falling back to a default
- Ownership checks on all user-scoped resources to prevent unauthorized access to another user's data
- Rate limiting on authentication endpoints to reduce brute-force risk
- HTTP security headers via Helmet; CORS restricted to a configured client origin
- Fallback location data is explicitly flagged as unverified sample data and never presented as a real facility's contact information

**Medical Disclaimer:** MediAI is an informational tool only. It does not provide medical diagnosis or prescribe controlled substances. In a medical emergency, call your local emergency number immediately.

---

## Getting Started

**Prerequisites:** Node.js v18+, npm

```bash
git clone https://github.com/JaswanthMatsa/MediAI.git
cd MediAI
```

**Backend**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```
Runs at `http://localhost:5001`

**Frontend**
```bash
cd ../frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

---

## API Endpoints

**Auth** (`/api/auth`)
| Method | Route | Auth | Description |
|---|---|:---:|---|
| POST | `/register` | – | Register a new user |
| POST | `/login` | – | Log in and receive a JWT |
| GET | `/me` | 🔒 | Get current user profile |
| PUT | `/profile` | 🔒 | Update profile / medical history |

**Chat / Symptoms** (`/api/chat`)
| Method | Route | Auth | Description |
|---|---|:---:|---|
| POST | `/message` | optional | Analyze symptoms, return OTC/hospital guidance |
| GET | `/history` | optional | Get past chat history |
| DELETE | `/history` | 🔒 | Clear chat history |

**Hospitals** (`/api/hospitals`)
| Method | Route | Auth | Description |
|---|---|:---:|---|
| GET | `/nearby` | optional | Find nearby facilities |
| POST | `/save` | 🔒 | Save a facility to favorites |
| GET | `/saved` | 🔒 | List saved facilities |
| DELETE | `/saved/:hospitalId` | 🔒 | Remove a saved facility |

**Medicines** (`/api/medicines`)
| Method | Route | Auth | Description |
|---|---|:---:|---|
| GET | `/search` | optional | Search the OpenFDA drug database |
| POST | `/save` | 🔒 | Save a medicine to favorites |

**Health** (`/api/health`)
| Method | Route | Auth | Description |
|---|---|:---:|---|
| GET | `/reminders` | 🔒 | List medication reminders |
| POST | `/reminders` | 🔒 | Create a reminder |
| PUT | `/reminders/:id/toggle` | 🔒 | Toggle reminder completion |
| POST | `/bmi` | – | Calculate BMI |
| GET | `/info` | – | Get emergency contacts & articles |

🔒 = requires a valid JWT

---

## Author

**Jaswanth Matsa**
