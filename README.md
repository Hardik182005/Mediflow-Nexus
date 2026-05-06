<p align="center">
  <img src="https://img.shields.io/badge/MediFlow-Nexus-black?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMjIgMTIgMTggMTIgMTUgMjEgOSAzIDYgMTIgMiAxMiI+PC9wb2x5bGluZT48L3N2Zz4=" alt="MediFlow Nexus" />
  <br/>
  <strong>The Intelligence Engine for Modern Healthcare</strong>
  <br/>
  <a href="https://mediflow-nexus-2026.web.app">Live URL: mediflow-nexus-2026.web.app</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/Gemini-1.5_Pro-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/License-MIT-white?style=flat-square" />
</p>

---

# MediFlow Nexus

**MediFlow Nexus** is a dual-core AI-powered healthcare intelligence platform that bridges the gap between **Medical Startups** (Go-To-Market) and **Clinical Operations** (Revenue Cycle Management). It leverages Google's Gemini 1.5 Pro to automate the most expensive and time-consuming processes in the healthcare ecosystem.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MEDIFLOW NEXUS                        │
├──────────────────────┬──────────────────────────────────┤
│   LAUNCH ENGINE      │         CLINIC OPS               │
│   (Startup GTM)      │    (Hospital Intelligence)       │
├──────────────────────┼──────────────────────────────────┤
│ • Startup Onboarding │ • Patient Intake Dashboard       │
│ • Buyer Discovery    │ • Insurance Intelligence (VOB)   │
│ • AI Pitch Deck      │ • Denial Prediction Engine       │
│ • Email Outreach     │ • Prior Authorization            │
│ • Sales Pipeline     │ • Revenue Intelligence           │
│ • Competitive Intel  │ • Payer Intelligence             │
│ • GTM Strategy       │ • Growth Intelligence            │
├──────────────────────┴──────────────────────────────────┤
│              SHARED INTELLIGENCE LAYER                   │
│  AI Copilot │ Reports │ Marketplace │ Settings           │
├─────────────────────────────────────────────────────────┤
│              INFRASTRUCTURE                              │
│  Supabase (Auth + DB) │ Gemini 1.5 Pro │ Vercel Edge    │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🚀 Launch Engine (For Healthcare Startups)
| Feature | Description |
|---------|-------------|
| **Buyer Discovery** | AI cross-references startup USP with 30+ hospital profiles to find "Perfect Match" buyers |
| **8-Slide AI Pitch Deck** | Generates personalized, data-driven sales decks with real ROI calculations per buyer |
| **AI Email Outreach** | Drafts high-conversion cold emails using pitch deck intelligence |
| **GTM Strategy Generator** | Multi-modal AI strategy engine that processes documents, decks, and market data |
| **Sales Pipeline** | Kanban-style deal tracker with win probability scoring |
| **Competitive Intel** | Real competitor profiles with market share, strengths, weaknesses, and pricing |

### 🏥 Clinic Ops (For Hospitals & Clinics)
| Feature | Description |
|---------|-------------|
| **VOB Analyzer** | AI-powered Verification of Benefits — extracts coverage, exclusions, and waiting periods from insurance documents |
| **Denial Prediction** | Predicts claim denial probability with AI-generated fix recommendations |
| **Prior Authorization** | Tracks PA status, approval probability, and missing documents |
| **Revenue Intelligence** | Revenue vs predicted charts, leakage detection, CPT profitability engine |
| **Payer Intelligence** | Performance scorecards for each insurance payer with denial rates and payment delays |
| **Growth Intelligence** | Referral network analysis, patient drop-off predictions, and growth opportunities |

### 🤖 Platform Intelligence
| Feature | Description |
|---------|-------------|
| **AI Copilot** | Natural language assistant connected to Gemini 1.5 Pro for real-time healthcare queries |
| **Executive Dashboard** | 6 KPIs, revenue trajectory charts, denial distribution, and real-time activity feed |
| **Intelligence Reports** | Filterable, downloadable reports across all modules |
| **Marketplace** | Integration directory for EHR systems, data sources, and service partners |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, file-based routing |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS with custom "Obsidian Glass" design system |
| **Animation** | Framer Motion | Fluid page transitions and micro-interactions |
| **Charts** | Recharts | Data visualization (Area, Bar, Line charts) |
| **Icons** | Lucide React | 200+ consistent icons |
| **Database** | Supabase (PostgreSQL) | Real-time database with Row-Level Security |
| **Auth** | Supabase Auth | JWT-based session management |
| **AI Engine** | Google Gemini 1.5 Pro | Multi-modal intelligence (text + vision/OCR) |
| **Deployment** | Vercel | Edge Functions, CDN, CI/CD |

---

## 📂 Project Structure

```
MediFlow Nexus/
├── frontend/
│   ├── app/
│   │   ├── (dashboard)/          # Authenticated dashboard routes
│   │   │   ├── dashboard/        # Executive summary KPIs
│   │   │   ├── clinic-ops/       # Hospital intelligence modules
│   │   │   │   ├── patient-intake/
│   │   │   │   ├── insurance/    # VOB Analyzer
│   │   │   │   ├── denials/      # Denial Prediction
│   │   │   │   ├── prior-auth/   # Prior Authorization
│   │   │   │   ├── revenue/      # Revenue Intelligence
│   │   │   │   ├── payer/        # Payer Intelligence
│   │   │   │   └── growth/       # Growth Intelligence
│   │   │   ├── launch-engine/    # Startup GTM modules
│   │   │   │   ├── gtm/          # Strategy Generator
│   │   │   │   ├── buyer-discovery/  # AI Match Engine
│   │   │   │   ├── onboarding/   # Startup Profiles
│   │   │   │   ├── sales-pipeline/   # Kanban Board
│   │   │   │   └── competitive/  # Competitor Analysis
│   │   │   ├── copilot/          # AI Assistant
│   │   │   ├── marketplace/      # Integrations
│   │   │   ├── reports/          # Intelligence Reports
│   │   │   └── settings/         # App Configuration
│   │   ├── api/                  # API Routes
│   │   │   ├── gtm/analyze/      # GTM + Buyer Discovery
│   │   │   ├── gtm/pitch-deck/   # Pitch Deck + Email
│   │   │   ├── clinic/vob/       # VOB Analysis
│   │   │   └── copilot/chat/     # AI Copilot
│   │   ├── login/                # Authentication
│   │   └── page.tsx              # Marketing Landing Page
│   ├── components/
│   │   ├── layout/               # Sidebar, Header
│   │   ├── pitch-deck-modal.tsx  # 8-Slide Deck Viewer
│   │   ├── vob-report-view.tsx   # Insurance Report
│   │   └── gtm-results.tsx       # Strategy Results
│   ├── lib/
│   │   ├── demo-data.ts          # Comprehensive demo dataset
│   │   ├── supabase/             # Client + Server configs
│   │   └── utils.ts              # Formatters & helpers
│   └── types/                    # TypeScript interfaces
├── buyers.json                   # 30+ hospital profiles dataset
├── supabase_schema.sql           # Database schema
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google Gemini API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Hardik182005/Mediflow-Nexus.git
cd MediFlow-Nexus

# 2. Install dependencies
cd frontend
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
RESEND_API_KEY=your_resend_api_key
```

### Advanced Voice & Inference Agents

MediFlow Nexus now supports:
- **ElevenLabs Integration:** Live Mock Pitch Simulator and AI Outreach Voice Memos.
- **Groq Llama-3 Fallback:** High-performance fallback for heavy analytical tasks if the primary LLM goes down.
- **Firebase/Cloud Run Deployment:** Configured out-of-the-box for serverless edge deployment using Firebase Web Frameworks.

### Database Setup

Run the schema in your Supabase SQL Editor:

```bash
# Copy contents of supabase_schema.sql into Supabase SQL Editor
```

### Run Development Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Deployment (Firebase Hosting & Cloud Run)

MediFlow Nexus is fully configured for serverless deployment using Firebase Web Frameworks. This setup automatically deploys the Next.js frontend to **Firebase Hosting** and provisions the backend API routes and SSR logic on **Google Cloud Run** via Firebase Cloud Functions (2nd Gen).

### 1. Authenticate with Firebase & Google Cloud
```bash
# Login to Firebase
firebase login

# Login to Google Cloud
gcloud auth login
```

### 2. Set Up Firebase Project
```bash
cd frontend

# Ensure you have a valid project in .firebaserc
# E.g., "default": "mediflow-nexus-2026"

# Verify environment variables in .env are set correctly.
```

### 3. Deploy
```bash
# Deploy to Firebase Hosting and Cloud Run automatically
firebase deploy --only hosting
```

The Next.js framework integration will detect your setup, build the production application, and automatically push your SSR and API routes to Cloud Run while hosting static assets on Firebase.

---

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/gtm/analyze` | POST | GTM strategy generation & buyer discovery |
| `/api/gtm/pitch-deck` | POST | AI pitch deck generation (8 slides) |
| `/api/gtm/pitch-deck/email` | POST | AI outreach email drafting |
| `/api/clinic/vob/analyze` | POST | Insurance document analysis (VOB) |
| `/api/copilot/chat` | POST | AI Copilot conversation |

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `patients` | Patient demographics, insurance info, treatment readiness |
| `startup_profiles` | Onboarded startup business profiles |
| `gtm_recommendations` | Saved AI-generated GTM strategies |
| `marketplace_matches` | Discovered buyers, match scores, pitch decks |
| `insurance_cases` | VOB results, risk scores, denial probabilities |

---

## 🎨 Design System

MediFlow Nexus uses the **"Stitch White"** design language:

- **Palette**: High-contrast monochrome (Obsidian Black text on Pure White backgrounds)
- **Aesthetics**: Premium, professional, and accessible light theme
- **Typography**: Playfair Display (Serif Headings) & Plus Jakarta Sans (Functional UI)
- **Animations**: Staggered reveals, smooth modals, and live loading states
- **Responsive**: Mobile-first adaptive layouts

---

## 🔐 Security & Compliance

- **HIPAA Ready**: All patient data encrypted at rest and in transit
- **SOC2 Type II**: Enterprise-grade access controls
- **Row-Level Security**: PostgreSQL RLS policies ensure data isolation
- **NABH/JCI Aware**: Compliance considerations built into GTM strategy prompts

---

## 👥 Team

| Name | Role |
|------|------|
| **Hardik Hinduja** | Founder & Full-Stack Developer |

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <strong>MEDIFLOW NEXUS OS // v2.0.0 ENTERPRISE // ALL SYSTEMS OPERATIONAL</strong>
</p>
