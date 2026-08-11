# MediAI — Smart Healthcare & GIS Discovery Platform

MediAI is a full-stack AI healthcare platform that helps users find nearby medical facilities, search a built-in medicine database, track medication and hydration, and receive AI-guided symptom information.

Medicine search uses a built-in medicine catalog, while AI symptom analysis uses Gemini with medicine information from the local catalog.

Built with **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, **OpenStreetMap (Overpass/Nominatim)**, and **Google Gemini AI**. Deployed on **Vercel** (Frontend) and **Render** (Backend).

---

## Core Features

- 🤖 **AI-Powered Symptom Guidance**: Google Gemini-powered symptom analysis returning structured, non-diagnostic guidance (possible cause, OTC options, home care, when to see a doctor) with emergency keyword detection.
- 💊 **Medicine Search & Information**: Search medicines from a built-in medicine catalog and save frequently used medicines to your account.
- 🗺️ **Nearby Healthcare Facility Discovery**: Real-time GIS facility finder using Leaflet & OpenStreetMap to locate nearby hospitals, clinics, and pharmacies with distance filtering and Google Maps navigation.
- 🚨 **Emergency Assistance**: One-tap emergency contact dialing, red-flag symptom guide, and automated emergency facility surfacing.
- 📊 **Health & BMI Tracking**: Daily medication reminders with dosage notes, hydration tracker with progress visualization, and evidence-based BMI calculations.
- 🔐 **User Authentication**: Secure JWT-based registration and login with MongoDB data persistence.
- 📱 **Responsive Healthcare Dashboard**: Clean, accessible UI tailored for desktop and mobile devices.

---

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Mapping**: Leaflet / React-Leaflet
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **HTTP Client**: Axios

### External APIs & Integrations
- **AI Engine**: Google Gemini API
- **Maps & GIS**: OpenStreetMap (Overpass QL & Nominatim)

---

## Architecture

```text
                    MediAI
                       │
          ┌────────────┴────────────┐
          │                         │
     React Frontend            Express Backend
          │                         │
          │                  ┌──────┴──────┐
          │                  │             │
          │               MongoDB      Gemini AI
          │
          ├── Medicine Search
          │        ↓
          │   Local Medicine
          │     Catalog
          │
          ├── Symptom Chat
          │        ↓
          │     Gemini (using Local Catalog)
          │
          └── Maps/Healthcare
                   ↓
              OpenStreetMap
```

---

## Security

- JWT-based authentication for protected routes
- User ownership checks for user-specific data
- Environment variables for sensitive configuration
- Medical disclaimer for responsible AI-assisted healthcare guidance

**Medical Disclaimer:** MediAI is an informational tool only. It does not provide medical diagnosis or prescribe controlled substances. In a medical emergency, call your local emergency number immediately.

---

## Getting Started

**Prerequisites:** Node.js v18+, npm

```bash
git clone https://github.com/JaswanthMatsa/MediAI.git
cd MediAI
```

### Backend
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
npm start
```

### Frontend
```bash
cd ../frontend
npm install
npm run dev
```

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
| GET | `/search` | optional | Search the medicine database |
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
