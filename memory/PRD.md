# Right Doers World - Product Requirements Document
## Version 2.0 | January 1, 2025 Global Launch

---

## Original Problem Statement
Build "Right Doers World" - An AI-native workforce matching platform for India's population-scale talent ecosystem connecting right people to right places. Key philosophy: PASS.NET DoersID system. GTM: QR codes in shops across India.

---

## Vision & Mission
- **Vision**: Right People @ Right Place | Work that feels like PLAY
- **Tagline**: "Dream → Do → Done"
- **Website**: hi-ai-app.com
- **Mission**: Connect India's 1.4B+ workforce with opportunities from ₹15K to ₹15L+

---

## User Personas (4 Types)

### 1. TALENT (Doer/Job Seeker)
- Fresh graduates, blue-collar workers, professionals
- Age: 8-40+ (all age groups supported)
- Journey: Test Talent → Get DoersID → Find Jobs → Level Up

### 2. CONSUMER (Service Seeker)
- Individuals/families needing services
- Journey: Select Category → Find Providers → Book Service

### 3. COMPANY (Employer)
- SMEs, startups, corporates
- Journey: Post Jobs → View Applicants → Hire Doers

### 4. GOVERNMENT (Admin/Policy)
- District officers, state admins, policymakers
- Journey: View Impact Dashboard → District Drill-down → Export Pipeline

---

## Core Requirements (Static)

### 12 Doers Divisions → 5 Talent Clubs
| Club | Divisions | Character |
|------|-----------|-----------|
| Power Keepers | Policy, Legal, Security | Communication |
| Wellness Seekers | Sport, Food/Agri, Health | Compassion |
| Problem Solvers | Science, Tech, Transport | Curiosity |
| Knowledge Givers | Art, Education | Creativity |
| Profit Maximizers | Finance/Banking | Calculation |

### L1-L5 Job Levels
| Level | Type | Salary Range | Example |
|-------|------|--------------|---------|
| L1 | Para-Skilled | ₹15K-30K | Delivery boy |
| L2 | Professional | ₹30K-60K | Sundar Pichai type |
| L3 | Multi-disciplinary | ₹60K-1.5L | Abdul Kalam type |
| L4 | Proficorm | ₹1.5L-15L+ | Elon Musk type |
| L5 | NET (Natural Exceptional Talent) | Unicorn | Junicorn Finder |

### PASS Code System
- **P**ersonality - **P**assion - **P**urpose
- **A**spiration - **A**cademic/DoersID - **A**ppropriateness - **A**chievement

---

## What's Been Implemented (MVP v2.0 - Jan 2025)

### ✅ Backend (FastAPI + MongoDB + Gemini)
- Phone OTP Authentication (mocked for demo)
- User Management (4 roles: doer, consumer, employer, admin)
- Job CRUD with L1-L5 levels & Division mapping
- Job Applications system
- AIMEE AI Chat (Gemini 3 Flash via Emergent)
- Admin statistics dashboard
- Seed data (10 sample jobs across divisions)

### ✅ Frontend (React + Tailwind + Shadcn)

**Entry Screens:**
- [x] Splash Screen with animated logo
- [x] Landing Page "WHO ARE YOU?" with 4 user type cards
- [x] Phone OTP Authentication (role-specific branding)

**Talent/Doer Flow:**
- [x] Onboarding (Age → Gender → Division → Pincode)
- [x] Psychometric Test (Big 5 - 15 questions)
- [x] DoersID Card Generation with PASS Score
- [x] Doer Dashboard with quick actions
- [x] Jobs Discovery with filters
- [x] Job Application flow
- [x] AIMEE AI Chat (full-screen)
- [x] Profile Page with level progress
- [x] Learn & Earn (Glocal Gurukul) module

**Consumer Flow:**
- [x] Service Categories (12 divisions)
- [x] Service Providers List (mock data)
- [x] Provider Detail Sheet
- [x] Booking flow (toast confirmation)

**Employer Flow:**
- [x] Employer Dashboard with stats
- [x] Post New Job (AI-assisted description)
- [x] View Applicants with Shortlist/Reject

**Government Flow:**
- [x] Impact Dashboard (AP-ready for Davos 2026)
- [x] District Drill-down with pincode stats
- [x] Talent Pipeline (Gulf/US/Japan export)
- [x] One Family One Entrepreneur tracker
- [x] Junicorn NET Finder section

**Junicorn NET Program:**
- [x] Landing page with ISF/Dubai Summit info
- [x] Application form (3-step)
- [x] Age groups: 8-17, 18-25

### ✅ Design & UX
- Mobile-first responsive PWA
- Dark gradient theme (Slate/Indigo/Purple)
- Club-specific color coding
- Bottom navigation for Doer flow
- Animated transitions
- Toast notifications (Sonner)

---

## Completed for Dubai Global Innovation Summit (Jan 9-11, 2025)
- [x] Full application functional
- [x] Government dashboard ready for CM demo
- [x] Junicorn NET application flow
- [x] Abu Dhabi talent pipeline display
- [x] ISF Network branding
- [x] Export-ready statistics

---

## Prioritized Backlog

### P0 (Critical - Week 1 Post-Launch)
- [ ] Real SMS OTP integration (Twilio/MSG91)
- [ ] Skill assessment gamified module
- [ ] Push notifications for job alerts
- [ ] Real service provider database

### P1 (High - Month 1)
- [ ] Voice input for AIMEE (aveovoice.com inspired)
- [ ] QR code generation for shop distribution
- [ ] Multi-language support (Hindi, Telugu first)
- [ ] Company profiles with reviews
- [ ] Interview scheduling

### P2 (Medium - Quarter 1)
- [ ] Video resume feature
- [ ] Skill certificates upload
- [ ] Referral system
- [ ] Payment integration for services
- [ ] Advanced job matching algorithm

### P3 (Future)
- [ ] Web 3.0 integration
- [ ] Face ID registration
- [ ] AI-powered resume builder
- [ ] Robo Teddy physical assistant
- [ ] 5 Human Xperts + AI Agents team

---

## Technical Stack
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Frontend**: React + Tailwind + Shadcn UI
- **AI**: Gemini 3 Flash (via Emergent Universal Key)
- **Auth**: Phone OTP (mock for demo)

---

## Competitors
- **Mercor** ($350M funded) - High-tech jobs
- **Zefy** - Blue collar (potential acquisition)
- **Apna** - L1 jobs
- **Naukri** - L2 jobs
- **LinkedIn** - L3 jobs

---

## Key Partnerships
- **ISF Network** - Global Innovation
- **Google AI Future Fund** - Investment pipeline
- **AP Government** - Population talent management

---

## Success Metrics (Post-Launch)
- Daily Active Users (DAU)
- Jobs Posted vs Applications
- Placement Rate
- PASS Score improvement over time
- Junicorn applications

---

## Next Steps (Jan 2-8, 2025)
1. Monitor real user feedback
2. Fix any production bugs
3. Prepare Dubai demo presentation
4. Document API for partners
5. Marketing collateral for summit

---

*Document Updated: January 1, 2025*
*Right Doers World LLP | Powered by ISF Network & Google AI*
