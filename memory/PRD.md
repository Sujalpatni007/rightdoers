# HI AI-APP.COM - Product Requirements Document
## Version 6.0 | January 1, 2026

---

## Original Problem Statement
Build **HI AI-APP.COM** - A Human Potential Management & Transformation Company (H.P.M.T.C.) platform.

**Project Doers** = Ability Assessments + Skilling Solutions = World's Workforce Creators for Industry 4.0 & 5.0 (Building for 1 Billion+)

**POSITIONING:** "We are to Population Management what NPCI is to Payments"

---

## Vision & Philosophy
- **Vision**: Right People @ Right Place | Work that feels like PLAY
- **Tagline**: "Enter the Doers World. Say WOW. Get What You Want."
- **Moonshot**: "People in this planet must say HI AI and experience WOW"

---

## Key Naming Conventions (Finalized)
| Feature | Name | Tagline/Badge |
|---------|------|---------------|
| Profile System | **D.P. (Doers Profiler)** | Like Display Picture |
| Credential | **Talent Card** | Verified Career Identity |
| Trust Score | **DoersScore™** | Like CIBIL for Careers (300-900) |
| Trust Badge | **Right Doers Powered™** | Like UIDAI Powered |
| Founder Dashboard | **Captain Command Centre** | CXO Level Access |
| Share Feature | **Send Your Profiler** | TALENTON.AI REVOLUTION |
| Family Dashboard | **DOERS ONE** | One Family, Different Dreams |

---

## What's Been Implemented

### ✅ COMPLETED: Frontend-Backend Integration (January 1, 2026)
**Major milestone: App is now fully functional with real data persistence!**

#### DoersProfiler (/dp) - INTEGRATED
- Fetches real profile data from `/api/profiles/user/{userId}`
- Creates profile if user doesn't have one via `/api/profiles`
- **DoersScore™** (300-900) calculated and stored in MongoDB
- **Efficiency Value** calculated: `(Skills × 0.6) + (NaturalFit × 0.3) + (LearningAgility × 0.1)`
- **6 Dimensions** with scores from backend
- Graceful fallback to demo data if backend unavailable
- Share modal works with real profile data

#### DoersOneFamily (/family) - INTEGRATED
- Fetches family data from `/api/families/user/{userId}`
- Creates family if user doesn't have one
- **Family DoersScore** = average of member scores
- Multi-lingual support (Kannada/English)
- Real family members and goals from database

#### Backend APIs (All Working)
- `POST /api/profiles` - Create profile
- `GET /api/profiles/{id}` - Get profile by ID
- `GET /api/profiles/user/{userId}` - Get profile by user ID
- `POST /api/families` - Create family
- `GET /api/families/{id}` - Get family by ID
- `GET /api/families/user/{userId}` - Get family by user ID
- All endpoints tested and passing

### ✅ Previously Completed Features
- "Send Your Profiler" Viral Share (6 channels)
- D.P. (Doers Profiler) with Talent Tracker
- Captain Command Centre with 5C Framework
- Daily Career Capsules, Glocal Gurukul
- DoersID Profile, Agent AIMEE
- Landing Page with Cosmic Flywheel
- PWA support

---

## Architecture

### Backend Stack
- **FastAPI** - Python async web framework
- **MongoDB** (via motor) - Document database
- **Pydantic** - Data validation

### Frontend Stack
- **React** - UI framework
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **axios** - API calls

### Key Files
```
/app/backend/
├── server.py         # Main API routes
├── models.py         # Pydantic models
└── db_routes.py      # DB management APIs

/app/frontend/src/
├── services/api.js   # API service layer
├── hooks/            # React hooks for data fetching
│   ├── useProfile.js
│   └── useFamily.js
└── pages/
    ├── DoersProfiler.jsx  # Talent Card page
    └── DoersOneFamily.jsx # Family dashboard
```

---

## Data Models

### DoersProfile
```javascript
{
  id: "DP-XXXXXXXX",
  user_id: string,
  name: string,
  doers_score: 300-900,
  doers_score_percentile: 1-99,
  natural_fit_score: 0-100,
  developed_skills_score: 0-100,
  learning_agility_score: 0-100,
  efficiency_value: 0-100,
  adaptive_level: "PARA|ASSOCIATE|MANAGER|PROFESSIONAL|EXPERT",
  dimensions: { personality, interest, learning, eq, intelligence, aptitude },
  skills: [{ name, level, growth }]
}
```

### Family
```javascript
{
  id: "FAM-XXXXXXXX",
  name: string,
  family_type: "MIG|HIG",
  family_doers_score: 300-900,
  members: [{ id, name, role, avatar, doers_score, needs, goals }],
  goals: [{ title, target_amount, saved_amount, progress }],
  primary_language: "en|kn"
}
```

---

## Routes Reference
```
/dp                  → Doers Profiler (REAL DATA)
/family              → DOERS ONE Family Dashboard (REAL DATA)
/captain-command     → Captain Command Centre
/prakruti            → Glocal Gurukul
/investor            → Investor Pitch Deck
/role-play           → Daily Career Capsules
```

---

## Upcoming Tasks (Priority Order)

### P0: Critical
1. **PDF Report Generation** - "Big 5 Report" downloadable from DoersProfiler
2. **Real Authentication** - Replace mock OTP with Twilio SMS

### P1: High Priority
1. **Build DOERS STUDIO Page** - Expert podcasts featuring J Chaudhary
2. **Implement "Flywheel Feel UX"** - Consistent cosmic rotation pattern
3. **Razorpay Payment Integration**
4. **Content Ecosystem Workflow** - Podcast → Cut → Repurpose

### P2: Medium Priority
1. **Real AI Integration** - Connect Agent AIMEE to LLM (Google DeepMind)
2. **Jobs4Me Matcher (L1-L5)** - Job matching platform
3. **Daily Career Capsules & Streak System**

### P3: Future
1. **Robo Helper** - Third part of Right Doers Trinity
2. **Blockchain-based Digital Profile**

---

## Testing Status
- **Backend**: 100% (9/9 pytest tests passing)
- **Frontend**: 100% (all E2E tests passing)
- **Latest Test Report**: `/app/test_reports/iteration_7.json`

---

## User Verification Needed
- CTO Vijay and Data Scientist Sujal to test the build
- Verify profile creation and data persistence
- Verify family dashboard functionality

---

*HI AI-APP.COM | TALENTON.AI REVOLUTION | Ride the Wave! 🚀*
