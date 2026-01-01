from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum
import random
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI(title="Right Doers World API", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Enums
class JobLevel(str, Enum):
    L1 = "L1"  # Entry Level: ₹15K-₹30K
    L2 = "L2"  # Junior: ₹30K-₹60K
    L3 = "L3"  # Mid-Level: ₹60K-₹1.5L
    L4 = "L4"  # Expert: ₹1.5L-₹15L+

class DoersDivision(str, Enum):
    POLICY = "Policy"
    LEGAL = "Legal"
    SECURITY = "Security"
    SPORT = "Sport"
    FOOD_AGRI = "Food & Agriculture"
    HEALTH = "Health"
    SCIENCE = "Science"
    TECH = "Technology"
    TRANSPORT = "Transport & Logistics"
    ART = "Art"
    EDUCATION = "Education"
    FINANCE = "Finance & Banking"

class TalentClub(str, Enum):
    POWER_KEEPERS = "Power Keepers"       # Policy, Legal, Security
    WELLNESS_SEEKERS = "Wellness Seekers"  # Sport, Food/Agri, Health
    PROBLEM_SOLVERS = "Problem Solvers"    # Science, Tech, Transport
    KNOWLEDGE_GIVERS = "Knowledge Givers"  # Art, Education
    PROFIT_MAXIMIZERS = "Profit Maximizers"  # Finance

class UserRole(str, Enum):
    DOER = "doer"
    EMPLOYER = "employer"
    ADMIN = "admin"

# Division to Club Mapping
DIVISION_TO_CLUB = {
    DoersDivision.POLICY: TalentClub.POWER_KEEPERS,
    DoersDivision.LEGAL: TalentClub.POWER_KEEPERS,
    DoersDivision.SECURITY: TalentClub.POWER_KEEPERS,
    DoersDivision.SPORT: TalentClub.WELLNESS_SEEKERS,
    DoersDivision.FOOD_AGRI: TalentClub.WELLNESS_SEEKERS,
    DoersDivision.HEALTH: TalentClub.WELLNESS_SEEKERS,
    DoersDivision.SCIENCE: TalentClub.PROBLEM_SOLVERS,
    DoersDivision.TECH: TalentClub.PROBLEM_SOLVERS,
    DoersDivision.TRANSPORT: TalentClub.PROBLEM_SOLVERS,
    DoersDivision.ART: TalentClub.KNOWLEDGE_GIVERS,
    DoersDivision.EDUCATION: TalentClub.KNOWLEDGE_GIVERS,
    DoersDivision.FINANCE: TalentClub.PROFIT_MAXIMIZERS,
}

# Models
class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class UserCreate(BaseModel):
    phone: str
    name: str
    role: UserRole
    division: Optional[DoersDivision] = None
    pincode: Optional[str] = None
    company_name: Optional[str] = None
    age_group: Optional[str] = None
    gender: Optional[str] = None
    interests: Optional[List[str]] = None

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str
    name: str
    role: UserRole
    division: Optional[DoersDivision] = None
    club: Optional[TalentClub] = None
    pincode: Optional[str] = None
    company_name: Optional[str] = None
    psy_score: int = 0
    skill_score: int = 0
    pass_code: Optional[Dict[str, Any]] = None
    age_group: Optional[str] = None
    gender: Optional[str] = None
    interests: Optional[List[str]] = None
    personality_traits: Optional[Dict[str, Any]] = None
    level: str = "L1"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class JobCreate(BaseModel):
    title: str
    description: str
    company_name: str
    division: DoersDivision
    level: JobLevel
    salary_min: int
    salary_max: int
    pincode: str
    requirements: List[str]
    employer_id: str

class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    company_name: str
    division: DoersDivision
    club: TalentClub
    level: JobLevel
    salary_min: int
    salary_max: int
    pincode: str
    requirements: List[str]
    employer_id: str
    applications_count: int = 0
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class JobApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    doer_id: str
    status: str = "applied"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ChatMessage(BaseModel):
    message: str
    user_id: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    recommended_jobs: Optional[List[Dict]] = None

# OTP Store (In-memory for MVP)
otp_store = {}

# Routes

@api_router.get("/")
async def root():
    return {"message": "Welcome to Right Doers World API - The Future of Work"}

# Auth Routes
@api_router.post("/auth/send-otp")
async def send_otp(request: OTPRequest):
    otp = str(random.randint(100000, 999999))
    otp_store[request.phone] = otp
    # In production, send SMS via Twilio/MSG91
    return {"message": "OTP sent successfully", "otp": otp}  # Remove otp in production

@api_router.post("/auth/verify-otp")
async def verify_otp(request: OTPVerify):
    stored_otp = otp_store.get(request.phone)
    if not stored_otp or stored_otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Check if user exists
    existing_user = await db.users.find_one({"phone": request.phone}, {"_id": 0})
    
    del otp_store[request.phone]
    
    return {
        "message": "OTP verified",
        "is_new_user": existing_user is None,
        "user": existing_user
    }

# User Routes
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    user = User(
        phone=user_data.phone,
        name=user_data.name,
        role=user_data.role,
        division=user_data.division,
        club=DIVISION_TO_CLUB.get(user_data.division) if user_data.division else None,
        pincode=user_data.pincode,
        company_name=user_data.company_name,
        age_group=user_data.age_group,
        gender=user_data.gender,
        interests=user_data.interests,
        psy_score=0,  # Will be set after psychometric test
        skill_score=0,  # Will be set after skill assessment
        level="L1"
    )
    doc = user.model_dump()
    await db.users.insert_one(doc)
    return user

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.get("/users/phone/{phone}", response_model=User)
async def get_user_by_phone(phone: str):
    user = await db.users.find_one({"phone": phone}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/users/{user_id}")
async def update_user(user_id: str, updates: Dict[str, Any]):
    if "division" in updates and updates["division"]:
        updates["club"] = DIVISION_TO_CLUB.get(DoersDivision(updates["division"]))
    
    result = await db.users.update_one({"id": user_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0})
    return updated_user

# Job Routes
@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate):
    job = Job(
        title=job_data.title,
        description=job_data.description,
        company_name=job_data.company_name,
        division=job_data.division,
        club=DIVISION_TO_CLUB.get(job_data.division),
        level=job_data.level,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        pincode=job_data.pincode,
        requirements=job_data.requirements,
        employer_id=job_data.employer_id
    )
    doc = job.model_dump()
    await db.jobs.insert_one(doc)
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(
    division: Optional[str] = None,
    level: Optional[str] = None,
    pincode: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 20
):
    query = {"is_active": True}
    
    if division:
        query["division"] = division
    if level:
        query["level"] = level
    if pincode:
        query["pincode"] = {"$regex": f"^{pincode[:3]}", "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"company_name": {"$regex": search, "$options": "i"}}
        ]
    
    jobs = await db.jobs.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return jobs

@api_router.get("/jobs/employer/{employer_id}", response_model=List[Job])
async def get_employer_jobs(employer_id: str):
    jobs = await db.jobs.find({"employer_id": employer_id}, {"_id": 0}).to_list(100)
    return jobs

# ============================================
# JOB AGGREGATOR APIs (must come before /jobs/{job_id})
# ============================================

from job_aggregator import job_aggregator, SAMPLE_INDIAN_JOBS, AggregatedJob

@api_router.get("/jobs/aggregated")
async def search_aggregated_jobs(
    query: str = "jobs",
    location: str = "India",
    page: int = 1,
    include_sample: bool = True
):
    """
    Search jobs from multiple sources (LinkedIn, Indeed, Naukri, etc.)
    """
    try:
        jobs = await job_aggregator.search_all_sources(query, location, page, include_sample)
        return {
            "jobs": [job.model_dump() for job in jobs],
            "total": len(jobs),
            "query": query,
            "location": location,
            "sources": ["jsearch", "adzuna", "naukri", "mercor", "quikr", "internal"]
        }
    except Exception as e:
        logger.error(f"Job aggregation error: {e}")
        # Return sample jobs on error
        return {
            "jobs": [job.model_dump() for job in SAMPLE_INDIAN_JOBS],
            "total": len(SAMPLE_INDIAN_JOBS),
            "query": query,
            "location": location,
            "sources": ["internal"],
            "error": "External APIs unavailable, showing sample jobs"
        }

@api_router.get("/jobs/sources")
async def get_job_sources():
    """Get list of job sources and their status"""
    return {
        "sources": [
            {"name": "JSearch", "description": "LinkedIn, Indeed, Glassdoor aggregator", "status": "configured" if os.environ.get("RAPIDAPI_KEY") else "needs_api_key"},
            {"name": "Adzuna", "description": "Official job board aggregator (16 countries)", "status": "configured" if os.environ.get("ADZUNA_APP_ID") else "needs_api_key"},
            {"name": "Naukri", "description": "India's #1 job portal", "status": "coming_soon"},
            {"name": "Mercor", "description": "AI-powered job matching", "status": "coming_soon"},
            {"name": "Quikr", "description": "Local jobs and gigs", "status": "coming_soon"},
            {"name": "Internal", "description": "Right Doers job listings", "status": "active"}
        ]
    }

# ============================================
# AI JOB MATCHER APIs
# ============================================

from ai_matcher import ai_matcher, ProfileMatchInput, JobMatchResult

class MatchJobsRequest(BaseModel):
    # Profile data
    doers_score: int = 650
    efficiency_value: int = 70
    adaptive_level: str = "ASSOCIATE"
    career_interests: Dict[str, int] = Field(default_factory=dict)
    skills: List[str] = Field(default_factory=list)
    skills_scores: Dict[str, int] = Field(default_factory=dict)
    preferred_location: str = "India"
    salary_expectation_min: Optional[int] = None
    salary_expectation_max: Optional[int] = None
    open_to_remote: bool = True
    # Search params
    query: str = ""

@api_router.post("/jobs/match")
async def match_jobs_to_profile(request: MatchJobsRequest):
    """
    AI-powered job matching based on DoersScore™ and profile data
    """
    try:
        # Create profile input
        profile = ProfileMatchInput(
            doers_score=request.doers_score,
            efficiency_value=request.efficiency_value,
            adaptive_level=request.adaptive_level,
            career_interests=request.career_interests,
            skills=request.skills,
            skills_scores=request.skills_scores,
            preferred_location=request.preferred_location,
            salary_expectation_min=request.salary_expectation_min,
            salary_expectation_max=request.salary_expectation_max,
            open_to_remote=request.open_to_remote
        )
        
        # Get jobs from aggregator
        query = request.query or "jobs"
        jobs = await job_aggregator.search_all_sources(query, request.preferred_location)
        
        # Convert to dict for matcher
        jobs_dict = [job.model_dump() for job in jobs]
        
        # Rank jobs by match score
        matched_jobs = ai_matcher.rank_jobs_for_profile(profile, jobs_dict)
        
        # Separate by recommendation
        perfect_matches = [j for j in matched_jobs if j["recommendation"] == "perfect_match"]
        good_matches = [j for j in matched_jobs if j["recommendation"] == "good_match"]
        stretch_roles = [j for j in matched_jobs if j["recommendation"] == "stretch_role"]
        
        return {
            "matched_jobs": matched_jobs[:20],  # Top 20
            "summary": {
                "total_jobs": len(matched_jobs),
                "perfect_matches": len(perfect_matches),
                "good_matches": len(good_matches),
                "stretch_roles": len(stretch_roles),
                "avg_match_score": sum(j["match_score"] for j in matched_jobs) // max(1, len(matched_jobs))
            },
            "profile_summary": {
                "doers_score": request.doers_score,
                "adaptive_level": request.adaptive_level,
                "top_skills": request.skills[:5],
                "top_interests": sorted(request.career_interests.items(), key=lambda x: x[1], reverse=True)[:3]
            }
        }
    except Exception as e:
        logger.error(f"Job matching error: {e}")
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

@api_router.post("/jobs/match-single")
async def match_single_job(profile_data: Dict[str, Any], job_data: Dict[str, Any]):
    """
    Match a single job to a profile
    """
    profile = ProfileMatchInput(**profile_data)
    match_result = ai_matcher.match_job_to_profile(profile, job_data)
    return match_result.model_dump()

@api_router.get("/jobs/match/anushree")
async def get_anushree_job_matches():
    """
    Get job matches for Anushree's profile (demo)
    """
    # Use Anushree's profile data
    profile = ProfileMatchInput(
        doers_score=820,
        efficiency_value=85,
        adaptive_level="PROFESSIONAL",
        career_interests={
            "Artistic": 73,
            "Enterprising": 64,
            "Social": 60
        },
        skills=["Fashion Design", "Sustainability", "ESG", "Project Management", "Adobe Suite"],
        preferred_location="Bengaluru",
        salary_expectation_min=1200000,
        open_to_remote=True
    )
    
    # Get fashion/sustainability jobs
    jobs = await job_aggregator.search_all_sources("fashion design sustainability", "India")
    jobs_dict = [job.model_dump() for job in jobs]
    
    # Match and rank
    matched_jobs = ai_matcher.rank_jobs_for_profile(profile, jobs_dict)
    
    return {
        "profile_name": "Anushree R. Hosalli",
        "doers_score": 820,
        "matched_jobs": matched_jobs[:10],
        "recommendation": "Based on your DoersScore™ of 820 and expertise in sustainable fashion, you're qualified for senior roles in circular economy and ESG consulting."
    }

# Dynamic job ID route must be AFTER specific routes
@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

# Job Application Routes
@api_router.post("/applications")
async def apply_for_job(job_id: str, doer_id: str):
    # Check if already applied
    existing = await db.applications.find_one({"job_id": job_id, "doer_id": doer_id})
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    application = JobApplication(job_id=job_id, doer_id=doer_id)
    await db.applications.insert_one(application.model_dump())
    await db.jobs.update_one({"id": job_id}, {"$inc": {"applications_count": 1}})
    
    return {"message": "Application submitted successfully", "application_id": application.id}

@api_router.get("/applications/doer/{doer_id}")
async def get_doer_applications(doer_id: str):
    applications = await db.applications.find({"doer_id": doer_id}, {"_id": 0}).to_list(100)
    
    # Enrich with job details
    for app in applications:
        job = await db.jobs.find_one({"id": app["job_id"]}, {"_id": 0})
        app["job"] = job
    
    return applications

@api_router.get("/applications/job/{job_id}")
async def get_job_applications(job_id: str):
    applications = await db.applications.find({"job_id": job_id}, {"_id": 0}).to_list(100)
    
    # Enrich with doer details
    for app in applications:
        doer = await db.users.find_one({"id": app["doer_id"]}, {"_id": 0})
        app["doer"] = doer
    
    return applications

# AIMEE AI Chat
@api_router.post("/aimee/chat", response_model=ChatResponse)
async def aimee_chat(chat_msg: ChatMessage):
    try:
        # Get user context
        user = await db.users.find_one({"id": chat_msg.user_id}, {"_id": 0})
        user_context = ""
        if user:
            user_context = f"""
User Profile:
- Name: {user.get('name', 'Unknown')}
- Division: {user.get('division', 'Not set')}
- Club: {user.get('club', 'Not set')}
- Pincode: {user.get('pincode', 'Not set')}
- Psy Score: {user.get('psy_score', 0)}
- Skill Score: {user.get('skill_score', 0)}
"""
        
        # Get available jobs
        jobs = await db.jobs.find({"is_active": True}, {"_id": 0}).limit(10).to_list(10)
        jobs_context = "\n".join([
            f"- {j['title']} at {j['company_name']} ({j['level']}, ₹{j['salary_min']}-{j['salary_max']}/month, {j['division']}, Pincode: {j['pincode']})"
            for j in jobs
        ])
        
        system_message = f"""You are AIMEE (AI Matching & Employment Engine), the AI assistant for Right Doers World platform.
Your mission: Help people find the RIGHT job that feels like PLAY to them.

Philosophy: "Choose a job that feels like play to you, but looks like work to others." - Naval Ravikant

PASS Code: Personality-Passion-Purpose Alignment + Aspiration-Academic-Appropriateness-Achievement

{user_context}

Available Jobs:
{jobs_context}

Guidelines:
1. Be warm, encouraging, and helpful - like a supportive career guide
2. Match users to jobs based on their division, skills, and location
3. Use Indian context (₹, Indian cities, local examples)
4. Keep responses concise but helpful (max 3-4 sentences + job recommendations)
5. If user asks for jobs, recommend 2-3 relevant ones from the list
6. Encourage skill development and career growth
7. Be motivational - remind them they're on the path to their dream career"""

        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=chat_msg.session_id or f"aimee_{chat_msg.user_id}",
            system_message=system_message
        ).with_model("gemini", "gemini-3-flash-preview")

        user_message = UserMessage(text=chat_msg.message)
        response = await chat.send_message(user_message)
        
        # Find recommended jobs based on user query
        recommended = []
        if user and user.get('division'):
            matching_jobs = await db.jobs.find({
                "is_active": True,
                "division": user.get('division')
            }, {"_id": 0}).limit(3).to_list(3)
            recommended = matching_jobs
        
        return ChatResponse(response=response, recommended_jobs=recommended if recommended else None)
        
    except Exception as e:
        logging.error(f"AIMEE chat error: {e}")
        return ChatResponse(
            response="I'm here to help you find your dream job! Tell me about your skills, interests, or the kind of work you're looking for.",
            recommended_jobs=None
        )

# Admin Dashboard Stats
@api_router.get("/admin/stats")
async def get_admin_stats():
    total_doers = await db.users.count_documents({"role": "doer"})
    total_employers = await db.users.count_documents({"role": "employer"})
    total_jobs = await db.jobs.count_documents({"is_active": True})
    total_applications = await db.applications.count_documents({})
    
    # Division distribution
    division_stats = []
    for div in DoersDivision:
        count = await db.users.count_documents({"division": div.value})
        division_stats.append({"division": div.value, "count": count})
    
    # Recent activity
    recent_jobs = await db.jobs.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "total_doers": total_doers,
        "total_employers": total_employers,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "division_stats": division_stats,
        "recent_jobs": recent_jobs
    }

# Seed Data
@api_router.post("/seed")
async def seed_data():
    # Check if already seeded
    existing_jobs = await db.jobs.count_documents({})
    if existing_jobs > 0:
        return {"message": "Data already seeded"}
    
    # Sample employers
    employers = [
        {"id": "emp_1", "phone": "9876543210", "name": "TechCorp India", "role": "employer", "company_name": "TechCorp India", "pincode": "560001"},
        {"id": "emp_2", "phone": "9876543211", "name": "HealthFirst Hospital", "role": "employer", "company_name": "HealthFirst Hospital", "pincode": "400001"},
        {"id": "emp_3", "phone": "9876543212", "name": "EduSmart Academy", "role": "employer", "company_name": "EduSmart Academy", "pincode": "110001"},
    ]
    
    for emp in employers:
        await db.users.update_one({"id": emp["id"]}, {"$set": emp}, upsert=True)
    
    # Sample jobs
    sample_jobs = [
        {"title": "Software Developer", "description": "Build amazing apps using React and Python", "company_name": "TechCorp India", "division": "Technology", "level": "L2", "salary_min": 40000, "salary_max": 60000, "pincode": "560001", "requirements": ["React", "Python", "Problem Solving"], "employer_id": "emp_1"},
        {"title": "Data Entry Operator", "description": "Accurate data entry and documentation", "company_name": "TechCorp India", "division": "Technology", "level": "L1", "salary_min": 15000, "salary_max": 25000, "pincode": "560001", "requirements": ["Typing Speed", "MS Excel", "Attention to Detail"], "employer_id": "emp_1"},
        {"title": "Delivery Partner", "description": "Last mile delivery in Bangalore", "company_name": "QuickDeliver", "division": "Transport & Logistics", "level": "L1", "salary_min": 18000, "salary_max": 28000, "pincode": "560002", "requirements": ["Bike with License", "Smartphone", "Local Knowledge"], "employer_id": "emp_1"},
        {"title": "Nurse - ICU", "description": "Critical care nursing in multi-specialty hospital", "company_name": "HealthFirst Hospital", "division": "Health", "level": "L2", "salary_min": 35000, "salary_max": 50000, "pincode": "400001", "requirements": ["BSc Nursing", "ICU Experience", "Patient Care"], "employer_id": "emp_2"},
        {"title": "Lab Technician", "description": "Conduct diagnostic tests and analysis", "company_name": "HealthFirst Hospital", "division": "Health", "level": "L2", "salary_min": 25000, "salary_max": 40000, "pincode": "400001", "requirements": ["DMLT/BMLT", "Lab Equipment", "Accuracy"], "employer_id": "emp_2"},
        {"title": "Mathematics Teacher", "description": "Teach Maths to Class 8-12 students", "company_name": "EduSmart Academy", "division": "Education", "level": "L2", "salary_min": 30000, "salary_max": 45000, "pincode": "110001", "requirements": ["B.Ed", "Mathematics Degree", "Communication"], "employer_id": "emp_3"},
        {"title": "Security Guard", "description": "Premises security and visitor management", "company_name": "SecureIndia", "division": "Security", "level": "L1", "salary_min": 15000, "salary_max": 20000, "pincode": "560003", "requirements": ["Physical Fitness", "Alertness", "Basic English"], "employer_id": "emp_1"},
        {"title": "Chef - Indian Cuisine", "description": "Prepare authentic Indian dishes", "company_name": "FoodieHub", "division": "Food & Agriculture", "level": "L2", "salary_min": 28000, "salary_max": 45000, "pincode": "400002", "requirements": ["Culinary Training", "Indian Cuisine", "Hygiene"], "employer_id": "emp_2"},
        {"title": "Legal Associate", "description": "Corporate law and compliance", "company_name": "LawFirst LLP", "division": "Legal", "level": "L3", "salary_min": 80000, "salary_max": 120000, "pincode": "110002", "requirements": ["LLB", "3+ Years Experience", "Corporate Law"], "employer_id": "emp_3"},
        {"title": "Financial Analyst", "description": "Investment analysis and reporting", "company_name": "CapitalGrow", "division": "Finance & Banking", "level": "L3", "salary_min": 70000, "salary_max": 100000, "pincode": "400003", "requirements": ["CA/CFA", "Financial Modeling", "Excel"], "employer_id": "emp_1"},
    ]
    
    for job_data in sample_jobs:
        job = Job(
            id=str(uuid.uuid4()),
            title=job_data["title"],
            description=job_data["description"],
            company_name=job_data["company_name"],
            division=DoersDivision(job_data["division"]),
            club=DIVISION_TO_CLUB.get(DoersDivision(job_data["division"])),
            level=JobLevel(job_data["level"]),
            salary_min=job_data["salary_min"],
            salary_max=job_data["salary_max"],
            pincode=job_data["pincode"],
            requirements=job_data["requirements"],
            employer_id=job_data["employer_id"]
        )
        await db.jobs.insert_one(job.model_dump())
    
    return {"message": "Seed data created successfully", "jobs_created": len(sample_jobs)}

# ============================================
# DOERS PROFILER / TALENT CARD APIs
# ============================================

class DoersProfileCreate(BaseModel):
    user_id: str
    name: str
    
class DoersProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: f"DP-{str(uuid.uuid4())[:8].upper()}")
    user_id: str
    name: str
    
    # DoersScore (CIBIL-style: 300-900)
    doers_score: int = Field(default=650)
    doers_score_percentile: int = Field(default=50)
    doers_score_trend: str = Field(default="stable")
    
    # Efficiency Value Components
    natural_fit_score: int = Field(default=70)
    developed_skills_score: int = Field(default=60)
    learning_agility_score: int = Field(default=75)
    efficiency_value: int = Field(default=0)  # Calculated
    
    # 6 Dimension Scores (EduMilestones)
    dimensions: Dict[str, Dict[str, Any]] = Field(default_factory=lambda: {
        "personality": {"score": 0, "level": "PARA"},
        "interest": {"score": 0, "level": "PARA"},
        "learning": {"score": 0, "level": "PARA"},
        "eq": {"score": 0, "level": "PARA"},
        "intelligence": {"score": 0, "level": "PARA"},
        "aptitude": {"score": 0, "level": "PARA"}
    })
    
    # Skill Journey
    skills: List[Dict[str, Any]] = Field(default_factory=list)
    skill_milestones: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Career Suitability
    current_role: Optional[str] = None
    role_match_score: int = Field(default=0)
    alternate_roles: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Adaptive Level
    adaptive_level: str = Field(default="PARA")  # PARA, ASSOCIATE, MANAGER, PROFESSIONAL, EXPERT
    
    # Verification
    is_verified: bool = Field(default=False)
    credential_id: str = Field(default_factory=lambda: f"RDVC-{str(uuid.uuid4())[:8].upper()}")
    
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

def calculate_efficiency(natural_fit: int, developed_skills: int, learning_agility: int) -> int:
    """Efficiency = (Skills × 0.6) + (NaturalFit × 0.3) + (LearningAgility × 0.1)"""
    return round((developed_skills * 0.6) + (natural_fit * 0.3) + (learning_agility * 0.1))

def get_adaptive_level(score: int) -> str:
    if score >= 91: return "EXPERT"
    if score >= 76: return "PROFESSIONAL"
    if score >= 61: return "MANAGER"
    if score >= 41: return "ASSOCIATE"
    return "PARA"

@api_router.post("/profiles", response_model=DoersProfile)
async def create_profile(data: DoersProfileCreate):
    """Create a new Doers Profile / Talent Card"""
    
    # Calculate initial efficiency
    natural_fit = random.randint(60, 80)
    developed_skills = random.randint(50, 75)
    learning_agility = random.randint(65, 85)
    efficiency = calculate_efficiency(natural_fit, developed_skills, learning_agility)
    
    # Generate DoersScore (300-900 range, like CIBIL)
    base_score = 500 + (efficiency * 4) + random.randint(-50, 50)
    doers_score = max(300, min(900, base_score))
    
    profile = DoersProfile(
        user_id=data.user_id,
        name=data.name,
        doers_score=doers_score,
        doers_score_percentile=min(99, max(1, (doers_score - 300) // 6)),
        natural_fit_score=natural_fit,
        developed_skills_score=developed_skills,
        learning_agility_score=learning_agility,
        efficiency_value=efficiency,
        adaptive_level=get_adaptive_level(efficiency),
        dimensions={
            "personality": {"score": random.randint(60, 90), "level": get_adaptive_level(random.randint(60, 90))},
            "interest": {"score": random.randint(60, 90), "level": get_adaptive_level(random.randint(60, 90))},
            "learning": {"score": random.randint(55, 85), "level": get_adaptive_level(random.randint(55, 85))},
            "eq": {"score": random.randint(60, 90), "level": get_adaptive_level(random.randint(60, 90))},
            "intelligence": {"score": random.randint(65, 95), "level": get_adaptive_level(random.randint(65, 95))},
            "aptitude": {"score": random.randint(55, 85), "level": get_adaptive_level(random.randint(55, 85))}
        },
        skills=[
            {"name": "Problem Solving", "level": random.randint(70, 95), "growth": f"+{random.randint(5, 20)}%"},
            {"name": "Communication", "level": random.randint(65, 90), "growth": f"+{random.randint(5, 15)}%"},
            {"name": "Technical Skills", "level": random.randint(60, 95), "growth": f"+{random.randint(8, 25)}%"},
            {"name": "Team Collaboration", "level": random.randint(70, 90), "growth": f"+{random.randint(5, 18)}%"}
        ]
    )
    
    doc = profile.model_dump()
    await db.profiles.insert_one(doc)
    return profile

@api_router.get("/profiles/{profile_id}")
async def get_profile(profile_id: str):
    """Get a Doers Profile by ID"""
    profile = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.get("/profiles/user/{user_id}")
async def get_profile_by_user(user_id: str):
    """Get a Doers Profile by User ID"""
    profile = await db.profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.put("/profiles/{profile_id}/dimensions")
async def update_profile_dimensions(profile_id: str, dimensions: Dict[str, Dict[str, Any]]):
    """Update 6 dimensions after assessment"""
    # Recalculate scores based on dimensions
    avg_score = sum(d.get("score", 0) for d in dimensions.values()) // len(dimensions)
    adaptive_level = get_adaptive_level(avg_score)
    
    await db.profiles.update_one(
        {"id": profile_id},
        {"$set": {
            "dimensions": dimensions,
            "adaptive_level": adaptive_level,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    return {"message": "Dimensions updated", "adaptive_level": adaptive_level}

# ============================================
# FAMILY DASHBOARD APIs (DOERS ONE)
# ============================================

class FamilyMemberCreate(BaseModel):
    family_id: str
    name: str
    role: str  # father, mother, daughter, son, etc.
    needs: List[Dict[str, Any]]

class FamilyCreate(BaseModel):
    name: str
    members: List[Dict[str, Any]]

class Family(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: f"FAM-{str(uuid.uuid4())[:8].upper()}")
    name: str
    family_doers_score: int = Field(default=700)
    members: List[Dict[str, Any]] = Field(default_factory=list)
    goals: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

@api_router.post("/families", response_model=Family)
async def create_family(data: FamilyCreate):
    """Create a new Family Dashboard"""
    family = Family(
        name=data.name,
        members=data.members,
        family_doers_score=sum(m.get("doers_score", 700) for m in data.members) // max(1, len(data.members))
    )
    doc = family.model_dump()
    await db.families.insert_one(doc)
    return family

@api_router.get("/families/{family_id}")
async def get_family(family_id: str):
    """Get a Family Dashboard by ID"""
    family = await db.families.find_one({"id": family_id}, {"_id": 0})
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    return family

@api_router.get("/families/user/{user_id}")
async def get_family_by_user(user_id: str):
    """Get a Family by User ID (member lookup)"""
    # Look for family where user is a member
    family = await db.families.find_one(
        {"members.user_id": user_id}, 
        {"_id": 0}
    )
    if not family:
        # Also check if user_id matches creator
        family = await db.families.find_one(
            {"creator_user_id": user_id}, 
            {"_id": 0}
        )
    if not family:
        raise HTTPException(status_code=404, detail="Family not found for user")
    return family

@api_router.put("/families/{family_id}/member/{member_id}")
async def update_family_member(family_id: str, member_id: str, updates: Dict[str, Any]):
    """Update a family member's progress"""
    family = await db.families.find_one({"id": family_id})
    if not family:
        raise HTTPException(status_code=404, detail="Family not found")
    
    members = family.get("members", [])
    for i, member in enumerate(members):
        if member.get("id") == member_id:
            members[i].update(updates)
            break
    
    # Recalculate family score
    family_score = sum(m.get("doers_score", 700) for m in members) // max(1, len(members))
    
    await db.families.update_one(
        {"id": family_id},
        {"$set": {"members": members, "family_doers_score": family_score}}
    )
    return {"message": "Member updated", "family_doers_score": family_score}

# ============================================
# PROVEN PROFILES APIs
# ============================================

from proven_profiles import get_proven_profiles, get_proven_profile_by_id, ANUSHREE_PROFILE

@api_router.get("/proven-profiles")
async def list_proven_profiles():
    """Get all proven/featured profiles"""
    return get_proven_profiles()

@api_router.get("/proven-profiles/{profile_id}")
async def get_proven_profile(profile_id: str):
    """Get a specific proven profile by ID"""
    profile = get_proven_profile_by_id(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Proven profile not found")
    return profile

@api_router.get("/proven-profiles/featured/anushree")
async def get_anushree_profile():
    """Get Anushree's featured profile"""
    return ANUSHREE_PROFILE.model_dump()

# ============================================
# JOB AGGREGATOR APIs
# ============================================

from job_aggregator import job_aggregator, SAMPLE_INDIAN_JOBS, AggregatedJob

@api_router.get("/jobs/aggregated")
async def search_aggregated_jobs(
    query: str = "jobs",
    location: str = "India",
    page: int = 1,
    include_sample: bool = True
):
    """
    Search jobs from multiple sources (LinkedIn, Indeed, Naukri, etc.)
    """
    try:
        jobs = await job_aggregator.search_all_sources(query, location, page, include_sample)
        return {
            "jobs": [job.model_dump() for job in jobs],
            "total": len(jobs),
            "query": query,
            "location": location,
            "sources": ["jsearch", "adzuna", "naukri", "mercor", "quikr", "internal"]
        }
    except Exception as e:
        logger.error(f"Job aggregation error: {e}")
        # Return sample jobs on error
        return {
            "jobs": [job.model_dump() for job in SAMPLE_INDIAN_JOBS],
            "total": len(SAMPLE_INDIAN_JOBS),
            "query": query,
            "location": location,
            "sources": ["internal"],
            "error": "External APIs unavailable, showing sample jobs"
        }

@api_router.get("/jobs/sources")
async def get_job_sources():
    """Get list of job sources and their status"""
    return {
        "sources": [
            {"name": "JSearch", "description": "LinkedIn, Indeed, Glassdoor aggregator", "status": "configured" if os.environ.get("RAPIDAPI_KEY") else "needs_api_key"},
            {"name": "Adzuna", "description": "Official job board aggregator (16 countries)", "status": "configured" if os.environ.get("ADZUNA_APP_ID") else "needs_api_key"},
            {"name": "Naukri", "description": "India's #1 job portal", "status": "coming_soon"},
            {"name": "Mercor", "description": "AI-powered job matching", "status": "coming_soon"},
            {"name": "Quikr", "description": "Local jobs and gigs", "status": "coming_soon"},
            {"name": "Internal", "description": "Right Doers job listings", "status": "active"}
        ]
    }

# ============================================
# AI JOB MATCHER APIs
# ============================================

from ai_matcher import ai_matcher, ProfileMatchInput, JobMatchResult

class MatchJobsRequest(BaseModel):
    # Profile data
    doers_score: int = 650
    efficiency_value: int = 70
    adaptive_level: str = "ASSOCIATE"
    career_interests: Dict[str, int] = Field(default_factory=dict)
    skills: List[str] = Field(default_factory=list)
    skills_scores: Dict[str, int] = Field(default_factory=dict)
    preferred_location: str = "India"
    salary_expectation_min: Optional[int] = None
    salary_expectation_max: Optional[int] = None
    open_to_remote: bool = True
    # Search params
    query: str = ""

@api_router.post("/jobs/match")
async def match_jobs_to_profile(request: MatchJobsRequest):
    """
    AI-powered job matching based on DoersScore™ and profile data
    """
    try:
        # Create profile input
        profile = ProfileMatchInput(
            doers_score=request.doers_score,
            efficiency_value=request.efficiency_value,
            adaptive_level=request.adaptive_level,
            career_interests=request.career_interests,
            skills=request.skills,
            skills_scores=request.skills_scores,
            preferred_location=request.preferred_location,
            salary_expectation_min=request.salary_expectation_min,
            salary_expectation_max=request.salary_expectation_max,
            open_to_remote=request.open_to_remote
        )
        
        # Get jobs from aggregator
        query = request.query or "jobs"
        jobs = await job_aggregator.search_all_sources(query, request.preferred_location)
        
        # Convert to dict for matcher
        jobs_dict = [job.model_dump() for job in jobs]
        
        # Rank jobs by match score
        matched_jobs = ai_matcher.rank_jobs_for_profile(profile, jobs_dict)
        
        # Separate by recommendation
        perfect_matches = [j for j in matched_jobs if j["recommendation"] == "perfect_match"]
        good_matches = [j for j in matched_jobs if j["recommendation"] == "good_match"]
        stretch_roles = [j for j in matched_jobs if j["recommendation"] == "stretch_role"]
        
        return {
            "matched_jobs": matched_jobs[:20],  # Top 20
            "summary": {
                "total_jobs": len(matched_jobs),
                "perfect_matches": len(perfect_matches),
                "good_matches": len(good_matches),
                "stretch_roles": len(stretch_roles),
                "avg_match_score": sum(j["match_score"] for j in matched_jobs) // max(1, len(matched_jobs))
            },
            "profile_summary": {
                "doers_score": request.doers_score,
                "adaptive_level": request.adaptive_level,
                "top_skills": request.skills[:5],
                "top_interests": sorted(request.career_interests.items(), key=lambda x: x[1], reverse=True)[:3]
            }
        }
    except Exception as e:
        logger.error(f"Job matching error: {e}")
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")

@api_router.post("/jobs/match-single")
async def match_single_job(profile_data: Dict[str, Any], job_data: Dict[str, Any]):
    """
    Match a single job to a profile
    """
    profile = ProfileMatchInput(**profile_data)
    match_result = ai_matcher.match_job_to_profile(profile, job_data)
    return match_result.model_dump()

@api_router.get("/jobs/match/anushree")
async def get_anushree_job_matches():
    """
    Get job matches for Anushree's profile (demo)
    """
    # Use Anushree's profile data
    profile = ProfileMatchInput(
        doers_score=820,
        efficiency_value=85,
        adaptive_level="PROFESSIONAL",
        career_interests={
            "Artistic": 73,
            "Enterprising": 64,
            "Social": 60
        },
        skills=["Fashion Design", "Sustainability", "ESG", "Project Management", "Adobe Suite"],
        preferred_location="Bengaluru",
        salary_expectation_min=1200000,
        open_to_remote=True
    )
    
    # Get fashion/sustainability jobs
    jobs = await job_aggregator.search_all_sources("fashion design sustainability", "India")
    jobs_dict = [job.model_dump() for job in jobs]
    
    # Match and rank
    matched_jobs = ai_matcher.rank_jobs_for_profile(profile, jobs_dict)
    
    return {
        "profile_name": "Anushree R. Hosalli",
        "doers_score": 820,
        "matched_jobs": matched_jobs[:10],
        "recommendation": "Based on your DoersScore™ of 820 and expertise in sustainable fashion, you're qualified for senior roles in circular economy and ESG consulting."
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
