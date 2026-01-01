# HI AI-APP.COM - Product Requirements Document
## Version 15.0 | January 1, 2026

---

## Original Problem Statement
Build **HI AI-APP.COM** - A Human Potential Management & Transformation Company (H.P.M.T.C.) platform.

**Mission:** AI Adoption from **7G Neom City (Saudi Arabia)** to **No-Network Nagara Village (Thirthahalli, Shivamogga, Karnataka)**

**POSITIONING:** "We are to Population Management what NPCI is to Payments"

**HEADQUARTERS:**
```
Right Doers World Pvt Ltd
Global Capability Centre for Human Xperts
15th Floor, World Trade Centre
Bangalore, India
```

---

## What's Been Implemented

### ✅ NEW: Captain Command Centre (January 1, 2026)
**Purpose:** Central HQ for 7 Business Verticals - DOERS Trinity Vision

**7 Business Verticals:**
| Code | Name | Mission |
|------|------|---------|
| B2G | Business to Government | Jobs for Locals Focus |
| B2A | Business to Associations | Association Partnerships |
| B2B | Business to Business | Corporate Services |
| B2C | Business to Consumers | Direct Talent Services |
| B2D | Business to Digital | Creative & Digital Services |
| D2D | Doers to Doers | Peer Network |
| A2A | Agent to Agent | AI Agent Operations |

**Features:**

#### 1. Dynamic Leader Assignment 🎖️
- Assign leaders to any of 7 verticals
- Track onboarding status (Not Started → In Progress → ORBIT)
- Team size and metrics tracking

#### 2. 16-Kata Onboarding System (Varun Mayya Inspired) 📚
- **Kata 1 (Day 1):** Context Loading - Understand mission, meet Captain
- **Kata 2 (Day 2-3):** System Orientation - Master dashboard, set up AI assistant
- **Kata 3 (Week 1):** Vertical Deep Dive - Study playbook, shadow operations
- **Kata 4 (Week 2):** First Mission - Execute task, build 30-day roadmap
- **ORBIT Status:** Self-sustaining productivity with minimal supervision

#### 3. AI Onboarding Kit (Hybrid Mode) 🤖
- **Online:** AI-powered contextual responses
- **Offline:** Cached responses for each vertical
- Welcome messages, first tasks, pro tips per vertical
- Chat interface with source indicators (Cached/AI)

#### 4. Military Command Style Design 🎯
- Dark navy (#0a1628) background
- Tactical green (#00ff88) accents
- Font: Monospace for military aesthetic
- Status badges: ASSIGNED, VACANT, ORBIT

**Routes:** `/command-centre`, `/captain`, `/verticals`, `/hq`

**APIs:**
- `GET /api/captain/status` - Command Centre status
- `GET /api/captain/verticals` - All 7 verticals
- `GET /api/captain/vertical/{code}` - Specific vertical details
- `POST /api/captain/assign-leader` - Assign leader to vertical
- `GET /api/captain/leaders` - All assigned leaders
- `POST /api/captain/onboarding/start` - Start onboarding session
- `POST /api/captain/onboarding/chat` - Chat with AI onboarding
- `POST /api/captain/onboarding/progress` - Update kata progress
- `GET /api/captain/dashboard-metrics` - Dashboard metrics
- `GET /api/captain/kata-system` - 16-Kata system info

**Files:** `/app/backend/captain_command.py`, `/app/frontend/src/pages/CaptainCommandCentre.jsx`

**MongoDB Collections:** `vertical_leaders`, `onboarding_sessions`

**Testing:** 100% (19/19 backend tests passed, all frontend tests passed)

---

### ✅ NEW: Mission Board - Dubai Launch Tracker (January 1, 2026)
**Purpose:** Real-time progress tracker for all 7 verticals - Dubai Global Launch

**Features:**

#### 1. Countdown Timer ⏱️
- Live countdown to Dubai Launch (January 9, 2026)
- Days, Hours, Minutes, Seconds - updates every second
- Dynamic status: LAUNCH_READY → FINAL_PREP → ON_TRACK → ACCELERATE → MOBILIZING

#### 2. Vertical Progress Grid 📊
- All 7 verticals with readiness percentage (0-100%)
- Leader names and team sizes
- Color-coded progress bars
- ORBIT status indicator for completed verticals

#### 3. Leaderboard 🏆
- Rankings: 🥇 🥈 🥉 for top 3 verticals
- Sorted by readiness percentage
- Real-time competition between verticals

#### 4. Activity Feed ⚡
- Live notifications for milestones
- Points system (+50, +100, +500 pts)
- Leader assignments, kata completions, ORBIT achievements
- Auto-refresh every 30 seconds

**Routes:** `/mission-board`, `/launch`, `/dubai`

**APIs:**
- `GET /api/captain/mission-board` - Full dashboard data with countdown
- `GET /api/captain/mission-board/activity` - Activity feed with points
- `GET /api/captain/mission-board/leaderboard` - Ranked verticals
- `POST /api/captain/mission-board/log-milestone` - Log custom milestones

**Files:** `/app/backend/captain_command.py`, `/app/frontend/src/pages/MissionBoard.jsx`

**MongoDB Collections:** `mission_activities` (new)

**Testing:** 100% (9/9 backend tests passed, all frontend tests passed)

---

### ✅ WhatsApp NDA Signing - DOERS LEGAL AI (January 1, 2026)
**Status:** Running in **SIMULATION MODE** (Twilio not configured)

**Features:**
- NDA Signing via WhatsApp
- Offer Letter via WhatsApp
- OTP-based digital signatures
- Founder approval workflow

**Routes:** `/whatsapp`, `/whatsapp-signing`, `/nda-signing`

---

### ✅ PWA Service Worker - Offline-First (January 1, 2026)
- Advanced Service Worker v2.0.0
- IndexedDB for conversation persistence
- Background sync for queued actions
- Install prompts for rural users

---

### ✅ Gemma Offline AI - Rural India (January 1, 2026)
- Google Gemma 3n (270M) for basic phones
- Telugu (Srikakulum), Kannada (Chickmagalur)
- Full offline career guidance
- Government schemes: PMKVY, Mudra, Skill India

---

### ✅ Content Command Centre - GTM (January 1, 2026)
- Multi-lingual Reel Creator (11 languages)
- DoersScore™ Share Card Generator
- Career Mantra Generator (4 audiences)
- NDA & Offer Letter Generator

---

## Landing Page Quick Launch Features

| Feature | Color | Badge | Route |
|---------|-------|-------|-------|
| Captain Command Centre | Tactical Green | 🎖️ HQ | /command-centre |
| Mission Board | Green/Purple | 🚀 LAUNCH | /mission-board |
| Content Command Centre | Purple | NEW | /content |
| Gemma Offline AI | Emerald | 🇮🇳 Rural | /gemma |
| WhatsApp NDA Signing | Green | ⚖️ Legal | /whatsapp |
| Junicorn Finder | Indigo | ISF | External |

---

## Testing Status
- **Mission Board:** 100% (9/9 tests)
- **Captain Command Centre:** 100% (19/19 tests)
- **WhatsApp NDA Signing:** 100% (18/18 tests)
- **Gemma Offline AI:** 100% (17/17 tests)
- **Content Command Centre:** 100% (12/12 tests)

**Latest Test Reports:**
- `/app/test_reports/iteration_13.json` (Mission Board)
- `/app/test_reports/iteration_12.json` (Captain Command)
- `/app/test_reports/iteration_11.json` (WhatsApp)
- `/app/test_reports/iteration_10.json` (Gemma)
- `/app/test_reports/iteration_9.json` (Content)

---

## Key Routes Reference
```
/mission-board   → Mission Board (Dubai Launch Tracker)
/command-centre  → Captain Command Centre (7 Verticals HQ)
/captain         → Captain Command Centre (alias)
/whatsapp        → WhatsApp NDA Signing (DOERS LEGAL AI)
/gemma           → Gemma Offline AI (Rural India)
/content         → Content Command Centre (GTM)
/dp              → Doers Profiler
/jobs4me         → AI Job Matching
/pricing         → Subscription Tiers
/welcome         → Landing Page
```

---

## Mocked/Simulated Features

| Feature | Status | What's Working | For Production |
|---------|--------|----------------|----------------|
| WhatsApp Messages | SIMULATED | OTPs, signatures, DB storage | Configure Twilio credentials |
| AI Onboarding Chat | HYBRID | Cached responses + AI fallback | Full LLM integration |
| Job Aggregator | SCAFFOLDED | Structure ready | Integrate Naukri, Mercor APIs |
| CRM | SCAFFOLDED | Basic structure | Complete lead management |

---

## Upcoming Tasks (Priority Order)

### P0: Critical
1. ✅ **Captain Command Centre** - COMPLETE
2. ✅ **WhatsApp NDA Signing** - COMPLETE (SIMULATED)
3. ✅ **Gemma Offline AI** - COMPLETE
4. ✅ **Content Command Centre** - COMPLETE
5. ✅ **PWA Service Worker** - COMPLETE
6. **Configure Twilio** - For live WhatsApp

### P1: High Priority
1. **Full Job Aggregator** - Naukri, Quikr, Mercor
2. **Complete CRM** - Lead management
3. **SMS OTP Auth** - Twilio (real phone verification)

### P2: Medium Priority
1. **Razorpay Payments**
2. **Blockchain Profile**
3. **Daily Career Capsules**

---

## Notes
- **Captain Command Centre** is the central hub for all 7 business verticals
- **16-Kata Onboarding System** inspired by Varun Mayya's "Company as Organism" philosophy
- **Hybrid AI Mode:** Online AI + Offline cached responses for onboarding
- **Military Theme:** Dark navy (#0a1628), tactical green (#00ff88)
- All major features have 100% test coverage

---

*HI AI-APP.COM | CAPTAIN COMMAND CENTRE 🎖️ | DOERS TRINITY | IPO 2031 🚀*
