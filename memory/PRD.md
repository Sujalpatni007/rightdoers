# Right Doers World - Product Requirements Document

## Original Problem Statement
Build "Right Doers World" - An AI-native workforce matching platform for India's population-scale talent ecosystem. Vision: "Service Amazon for People" - connecting right people to right places. Key philosophy: PASS.NET doersID (Personalized Ability & Aspiration + Solutions & Services = Right People @ Right Place World).

## Vision & Mission
- **Vision**: Right People @ Right Place - Work that feels like PLAY
- **Mission**: Connect India's 1 billion+ workforce with opportunities from ₹15K to ₹15L+ across all industries
- **GTM Strategy**: QR codes in shops across India

## User Personas

### 1. Doer (Job Seeker)
- Fresh graduates seeking first job
- Blue-collar workers (delivery, house help, security)
- Professionals seeking career growth
- Tech comfort: Instagram, PUBG, Blinkit users

### 2. Employer (Job Provider)
- Companies posting jobs
- Small businesses
- Startups looking for talent

### 3. Admin (Captain Right Doer)
- Platform coordinators
- Oversight and reporting

## Core Requirements (Static)

### 12 Doers Divisions
1. Policy, Legal, Security → **Power Keepers** (Communication Talent Club)
2. Sport, Food/Agri, Health → **Wellness Seekers** (Compassion Talent Club)
3. Science, Tech, Transport/Logistics → **Problem Solvers** (Curiosity Talent Club)
4. Art, Education → **Knowledge Givers** (Creativity Talent Club)
5. Finance/Banking → **Profit Maximizers** (Core Concern Club)

### L1-L4 Job Levels
- L1: Entry Level (₹15K-30K)
- L2: Junior (₹30K-60K)
- L3: Mid-Level (₹60K-1.5L)
- L4: Expert (₹1.5L-15L+)

### PASS Code
- **P**ersonality - **P**assion - **P**urpose
- **A**spiration Alignment
- **A**cademic/Doer ID
- **A**ppropriateness
- **A**chievement

## What's Been Implemented (MVP v1.0 - June 2025)

### Backend (FastAPI + MongoDB)
- ✅ Phone OTP Authentication (mocked for demo)
- ✅ User Management (Doer, Employer, Admin roles)
- ✅ Job CRUD with L1-L4 levels
- ✅ Division → Club mapping
- ✅ Job Applications system
- ✅ AIMEE AI Chat (Gemini 3 Flash via Emergent)
- ✅ Admin statistics dashboard
- ✅ Seed data (10 sample jobs)

### Frontend (React + Tailwind + Shadcn)
- ✅ Landing Page with hero, QR code placeholder, CTAs
- ✅ Phone OTP Authentication flow
- ✅ Doer Onboarding (Division + Pincode)
- ✅ Doer Dashboard with PASS Score
- ✅ Jobs Discovery with filters
- ✅ Job Application flow
- ✅ AIMEE AI Chat interface
- ✅ Profile page with stats
- ✅ Employer Dashboard (Post jobs, view applicants)
- ✅ Admin Dashboard (Stats overview)
- ✅ Mobile-first responsive design
- ✅ Bottom navigation for PWA

### AI Integration
- ✅ AIMEE (AI Matching & Employment Engine)
- ✅ Gemini 3 Flash for natural language job search
- ✅ Context-aware responses with user profile

## Prioritized Backlog

### P0 (Critical - Next Sprint)
- [ ] Real SMS OTP integration (Twilio/MSG91)
- [ ] Gamified skill assessment module
- [ ] Job matching algorithm improvement
- [ ] Push notifications for job alerts

### P1 (High Priority)
- [ ] Voice input for AIMEE (inspired by aveovoice.com)
- [ ] Face ID registration option
- [ ] Hyper-local landing based on pincode
- [ ] Company profiles with reviews
- [ ] Interview scheduling

### P2 (Medium Priority)
- [ ] QR code generation for shop distribution
- [ ] Multi-language support (Hindi first)
- [ ] Skill certificates upload
- [ ] Video resume feature
- [ ] Referral system

### P3 (Future)
- [ ] Web 3.0 integration (mentioned in vision)
- [ ] 5G/6G optimizations
- [ ] AI-powered resume builder
- [ ] Community clubs feature
- [ ] Mercor-style high-tech job matching for L4

## Competitors
- **Mercor** ($350M funded) - High-tech jobs focus
- **Zefy** - Blue collar workforce (potential acquisition)

## Technical Stack
- Backend: FastAPI + Python
- Database: MongoDB
- Frontend: React + Tailwind + Shadcn UI
- AI: Gemini 3 Flash (via Emergent LLM Key)
- Auth: Phone OTP (mock for MVP)

## Next Tasks
1. Test complete user flow with real users
2. Implement gamified skill assessment
3. Add push notifications
4. Integrate real SMS OTP
5. Build QR code registration flow
