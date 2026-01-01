# HI AI-APP.COM - Product Requirements Document
## Version 14.0 | January 1, 2026

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

### ✅ NEW: WhatsApp NDA Signing - DOERS LEGAL AI (January 1, 2026)
**Purpose:** Direct Founder → Command Centre → Candidate Onboarding via WhatsApp

**Flow:**
```
Founder WhatsApp → Command Centre Contract Signing → Candidate Onboarding Complete
```

**Features:**

#### 1. NDA Signing via WhatsApp 📜
- Send NDA documents via WhatsApp
- OTP-based digital signatures (6-digit, 24-hour expiry)
- Signature hash generated using SHA256
- Document tracking: initiated → otp_sent → verified → signed

#### 2. Offer Letter via WhatsApp 💼
- Send offer letters for digital acceptance
- Position and Division selection
- 48-hour OTP expiry for offers
- Confirmation messages with signature ID

#### 3. Founder Approval Workflow ✅
- Request approval directly via WhatsApp
- Approval types: New Hire, Contract, Budget, Partnership
- Commands: APPROVE <ID> / REJECT <ID>

#### 4. WhatsApp Commands
| Command | Action |
|---------|--------|
| SIGN <OTP> | Sign NDA with OTP |
| ACCEPT <OTP> | Accept offer with OTP |
| REJECT | Decline document |
| APPROVE <ID> | Approve request (founder) |
| STATUS <ID> | Check document status |
| HELP | Show available commands |

**Routes:** `/whatsapp`, `/whatsapp-signing`, `/nda-signing`

**APIs:**
- `GET /api/whatsapp/status` - Service status
- `POST /api/whatsapp/nda/send` - Send NDA for signing
- `POST /api/whatsapp/offer/send` - Send offer for acceptance
- `GET /api/whatsapp/nda/view/{id}` - View NDA document
- `GET /api/whatsapp/offer/view/{id}` - View offer document
- `POST /api/whatsapp/verify` - Verify OTP signature
- `POST /api/whatsapp/incoming` - Handle incoming messages (webhook)
- `POST /api/whatsapp/approval/request` - Request founder approval
- `GET /api/whatsapp/signings` - List all signings
- `POST /api/whatsapp/welcome` - Send welcome notification

**Status:** Running in **SIMULATION MODE** (Twilio not configured)

**For Production:** Configure in backend/.env:
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1415...
FOUNDER_WHATSAPP=+91...
```

**Files:** `/app/backend/whatsapp_service.py`, `/app/frontend/src/pages/WhatsAppSigning.jsx`

---

### ✅ PWA Service Worker - Offline-First (January 1, 2026)
- Advanced Service Worker v2.0.0
- IndexedDB for conversation persistence
- Background sync for queued actions
- Install prompts for rural users
- Pre-cached Telugu/Kannada career guidance

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
| Content Command Centre | Purple | NEW | /content |
| Gemma Offline AI | Emerald | 🇮🇳 Rural | /gemma |
| WhatsApp NDA Signing | Green | ⚖️ Legal | /whatsapp |
| Junicorn Finder | Indigo | ISF | External |

---

## Testing Status
- **WhatsApp NDA Signing:** 100% (18/18 tests)
- **Gemma Offline AI:** 100% (17/17 tests)
- **Content Command Centre:** 100% (12/12 tests)

**Latest Test Reports:**
- `/app/test_reports/iteration_11.json` (WhatsApp)
- `/app/test_reports/iteration_10.json` (Gemma)
- `/app/test_reports/iteration_9.json` (Content)

---

## Key Routes Reference
```
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
| Job Aggregator | SCAFFOLDED | Structure ready | Integrate Naukri, Mercor APIs |
| CRM | SCAFFOLDED | Basic structure | Complete lead management |

---

## Upcoming Tasks (Priority Order)

### P0: Critical
1. ✅ **WhatsApp NDA Signing** - COMPLETE (SIMULATED)
2. ✅ **Gemma Offline AI** - COMPLETE
3. ✅ **Content Command Centre** - COMPLETE
4. ✅ **PWA Service Worker** - COMPLETE
5. **Configure Twilio** - For live WhatsApp

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
- **WhatsApp NDA Signing** works end-to-end in simulation mode
- OTP-based digital signatures generate SHA256 hash
- Documents stored in MongoDB `legal_documents` collection
- Signing requests tracked in `whatsapp_signings` collection
- Landing page now shows all 3 major features prominently

---

*HI AI-APP.COM | DOERS LEGAL AI ⚖️ | Digital Signatures via WhatsApp | IPO 2031 🚀*
