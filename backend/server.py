from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import base64
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

# Helper function
def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

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

@api_router.get("/proven-profiles/featured/anushree")
async def get_anushree_profile():
    """Get Anushree's featured profile"""
    return ANUSHREE_PROFILE.model_dump()

@api_router.get("/proven-profiles/{profile_id}")
async def get_proven_profile(profile_id: str):
    """Get a specific proven profile by ID"""
    profile = get_proven_profile_by_id(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Proven profile not found")
    return profile

# ============================================
# VOICE AI APIs - 8 T's TALK Component
# ============================================

from voice_ai import voice_ai, VoiceResponse

@api_router.get("/voice/status")
async def voice_ai_status():
    """Check if Voice AI is available"""
    return {
        "available": voice_ai.is_available(),
        "model": "whisper-1",
        "features": ["transcription", "command_parsing", "navigation", "search"]
    }

@api_router.post("/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file to text using Whisper
    Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm
    Max size: 25MB
    """
    if not voice_ai.is_available():
        raise HTTPException(status_code=503, detail="Voice AI not available. Check API key configuration.")
    
    # Validate file type
    allowed_types = ["audio/webm", "audio/mp3", "audio/mpeg", "audio/wav", "audio/mp4", "audio/m4a", "audio/ogg"]
    if file.content_type and not any(t in file.content_type for t in ["audio", "webm", "ogg"]):
        raise HTTPException(status_code=400, detail=f"Invalid file type: {file.content_type}. Supported: {allowed_types}")
    
    # Read file
    audio_data = await file.read()
    
    # Check size (25MB limit)
    if len(audio_data) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size: 25MB")
    
    try:
        transcription = await voice_ai.transcribe_audio(audio_data, file.filename or "audio.webm")
        return {"success": True, "transcription": transcription.model_dump()}
    except Exception as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/voice/command")
async def process_voice_command(file: UploadFile = File(...)):
    """
    Full voice command pipeline:
    1. Transcribe audio to text
    2. Parse intent and action
    3. Return navigation/action suggestion
    
    Voice Commands Supported:
    - Navigation: "Go to pricing", "Show my profile", "Open jobs"
    - Search: "Search jobs for fashion designer", "Find software developer jobs"
    - Actions: "Create my profile", "Start assessment", "Share my talent card"
    - Questions: "What is my Doer score?"
    """
    if not voice_ai.is_available():
        raise HTTPException(status_code=503, detail="Voice AI not available")
    
    audio_data = await file.read()
    
    if len(audio_data) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max size: 25MB")
    
    try:
        response = await voice_ai.process_voice_command(audio_data, file.filename or "audio.webm")
        return response.model_dump()
    except Exception as e:
        logger.error(f"Voice command error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/voice/parse-text")
async def parse_voice_text(text: str):
    """
    Parse text as if it were a voice command (for testing)
    """
    command = voice_ai.parser.parse(text)
    response_text = voice_ai.parser.get_response_text(command)
    
    suggested_action = None
    if command.intent == "navigate":
        suggested_action = f"NAVIGATE:{command.parameters.get('target', '/')}"
    elif command.intent == "search":
        query = command.parameters.get("query", "")
        suggested_action = f"NAVIGATE:/jobs4me?q={query}"
    
    return {
        "command": command.model_dump(),
        "response_text": response_text,
        "suggested_action": suggested_action
    }

# ============================================
# AIMEE CHAT API (Enhanced with TTS)
# ============================================

class AIMEEChatSimpleRequest(BaseModel):
    message: str
    context: List[Dict[str, str]] = Field(default_factory=list)

@api_router.post("/aimee/chat-simple")
async def aimee_chat_simple(request: AIMEEChatSimpleRequest):
    """
    Simple chat with AIMEE AI Assistant (no user context required)
    Uses LLM for career guidance conversations
    """
    try:
        # Build system prompt for AIMEE
        system_prompt = """You are AIMEE (AI-Mentored Intelligent Employment Engine), a friendly and knowledgeable AI career transformation assistant for the Right Doers platform.

Your expertise includes:
- Career guidance and pathway recommendations
- Skill assessment interpretation (DoersScore™, 6D Assessment)
- Job matching and industry insights
- Learning recommendations
- Motivational support

Personality:
- Warm, encouraging, and professional
- Use emojis sparingly but effectively
- Give concise, actionable advice
- Reference the 5E Journey model (Explore, Educate, Employ, Enterprise, Excel) when relevant

Always encourage users to:
- Complete their DoersProfile
- Explore Jobs4Me for matched opportunities
- Track daily progress with the Streak System
- Share their Talent Card with the world

Keep responses concise (under 200 words) and end with a helpful suggestion or question."""

        # Create chat instance
        llm_key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("OPENAI_API_KEY")
        if not llm_key:
            return {"response": "I'm here to help! While my full AI capabilities are loading, you can explore your DoersProfile, check Jobs4Me for opportunities, or view Proven Profiles for inspiration. What interests you most?"}
        
        import uuid
        session_id = str(uuid.uuid4())
        
        chat = LlmChat(
            api_key=llm_key,
            session_id=session_id,
            system_message=system_prompt
        ).with_model("gemini", "gemini-3-flash-preview")
        
        # Add context from previous messages
        for msg in request.context[-6:]:  # Last 6 messages for context
            if msg.get("role") == "user":
                chat.add_user_message(msg.get("content", ""))
            elif msg.get("role") == "assistant":
                chat.add_assistant_message(msg.get("content", ""))
        
        # Get response using UserMessage
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        return {"response": response}
        
    except Exception as e:
        logger.error(f"AIMEE chat error: {e}")
        # Fallback response
        return {"response": f"I'm processing your question about '{request.message[:50]}...'. Meanwhile, explore your DoersProfile to see your career potential! 🚀"}

# ============================================
# AIMEE TEXT-TO-SPEECH APIs
# ============================================

from aimee_voice import aimee_voice

@api_router.get("/aimee/voice/status")
async def aimee_voice_status():
    """Check if AIMEE TTS is available"""
    return {
        "available": aimee_voice.is_available(),
        "model": "tts-1",
        "default_voice": "nova",
        "voices": aimee_voice.get_available_voices()
    }

@api_router.post("/aimee/speak")
async def aimee_speak(
    text: str,
    voice: str = "nova",
    speed: float = 1.0
):
    """
    Generate speech from text for AIMEE
    Returns audio as base64 string for web embedding
    """
    if not aimee_voice.is_available():
        raise HTTPException(status_code=503, detail="AIMEE Voice not available. Check API key.")
    
    if len(text) > 4096:
        raise HTTPException(status_code=400, detail="Text too long. Max 4096 characters.")
    
    try:
        audio_base64 = await aimee_voice.speak_base64(text, voice=voice, speed=speed)
        return {
            "success": True,
            "audio_base64": audio_base64,
            "format": "mp3",
            "text": text,
            "voice": voice
        }
    except Exception as e:
        logger.error(f"AIMEE TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/aimee/speak/audio")
async def aimee_speak_audio(
    text: str,
    voice: str = "nova",
    speed: float = 1.0
):
    """
    Generate speech and return as audio file
    """
    if not aimee_voice.is_available():
        raise HTTPException(status_code=503, detail="AIMEE Voice not available")
    
    try:
        audio_bytes = await aimee_voice.speak(text, voice=voice, speed=speed)
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=aimee_response.mp3"}
        )
    except Exception as e:
        logger.error(f"AIMEE audio error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# PDF REPORT GENERATION APIs
# ============================================

from pdf_report import report_generator

class ReportRequest(BaseModel):
    name: str = "Doer"
    doers_score: int = 650
    adaptive_level: str = "ASSOCIATE"
    natural_fit: int = 70
    developed_skills: int = 75
    learning_agility: int = 80
    efficiency_value: int = 78
    career_interests: Dict[str, int] = Field(default_factory=dict)
    skills_abilities: Dict[str, int] = Field(default_factory=dict)
    career_clusters: List[Dict[str, Any]] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)

@api_router.post("/report/generate")
async def generate_report(request: ReportRequest):
    """
    Generate the BIG 5 DOERS REPORT PDF
    Returns PDF as base64 string
    """
    try:
        pdf_bytes = report_generator.generate_report(request.model_dump())
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        return {
            "success": True,
            "pdf_base64": pdf_base64,
            "filename": f"Big5_Report_{request.name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
        }
    except Exception as e:
        logger.error(f"PDF generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/report/download")
async def download_report(request: ReportRequest):
    """
    Generate and download the BIG 5 DOERS REPORT PDF
    """
    try:
        pdf_bytes = report_generator.generate_report(request.model_dump())
        
        filename = f"Big5_Report_{request.name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"PDF download error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/report/generate/{user_id}")
async def generate_user_report(user_id: str):
    """
    Generate report for a specific user from their profile
    """
    # Get user's profile
    profile = await db.profiles.find_one({"user_id": user_id}, {"_id": 0})
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Get user info
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    
    # Build report data
    report_data = {
        "name": user.get("name", "Doer") if user else "Doer",
        "doers_score": profile.get("doers_score", 650),
        "adaptive_level": profile.get("adaptive_level", "ASSOCIATE"),
        "natural_fit": profile.get("natural_fit_score", 70),
        "developed_skills": profile.get("developed_skills_score", 75),
        "learning_agility": profile.get("learning_agility_score", 80),
        "efficiency_value": profile.get("efficiency_value", 78),
        "career_interests": profile.get("career_interests", {}),
        "skills_abilities": {s.get("name", ""): s.get("level", 50) for s in profile.get("skills", [])},
        "career_clusters": profile.get("career_clusters", []),
        "next_steps": profile.get("recommended_next_steps", [])
    }
    
    try:
        pdf_bytes = report_generator.generate_report(report_data)
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        return {
            "success": True,
            "pdf_base64": pdf_base64,
            "filename": f"Big5_Report_{report_data['name'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pdf",
            "profile_summary": {
                "name": report_data["name"],
                "doers_score": report_data["doers_score"],
                "adaptive_level": report_data["adaptive_level"]
            }
        }
    except Exception as e:
        logger.error(f"User report generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# CRM SUPER APP APIs - Business to the World
# ============================================

from crm_service import (
    crm_service, Lead, Contact, Deal, Activity, BusinessOrder,
    BusinessVertical, LeadSource, LeadStage, DoerDivision, UrgencyLevel,
    GTMMetrics, CURRENT_ORDERS
)

# --- LEADS ---

class LeadCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    source: str = "community"
    vertical: str
    vibe_score: int = 50
    notes: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)

@api_router.post("/crm/leads")
async def create_lead(data: LeadCreate):
    """Create a new lead in CRM"""
    lead = Lead(
        name=data.name,
        email=data.email,
        phone=data.phone,
        company=data.company,
        source=LeadSource(data.source) if data.source in [e.value for e in LeadSource] else LeadSource.COMMUNITY,
        vertical=BusinessVertical(data.vertical) if data.vertical in [e.value for e in BusinessVertical] else BusinessVertical.EDTECH,
        vibe_score=data.vibe_score,
        notes=data.notes,
        tags=data.tags
    )
    
    # Save to database
    lead_dict = lead.model_dump()
    await db.crm_leads.insert_one(lead_dict)
    
    return {"success": True, "lead": lead_dict}

@api_router.get("/crm/leads")
async def get_leads(vertical: Optional[str] = None, stage: Optional[str] = None, limit: int = 50):
    """Get all leads, optionally filtered"""
    query = {}
    if vertical:
        query["vertical"] = vertical
    if stage:
        query["stage"] = stage
    
    leads = await db.crm_leads.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return {"leads": leads, "total": len(leads)}

@api_router.get("/crm/leads/{lead_id}")
async def get_lead(lead_id: str):
    """Get a specific lead"""
    lead = await db.crm_leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@api_router.patch("/crm/leads/{lead_id}")
async def update_lead(lead_id: str, updates: Dict[str, Any]):
    """Update a lead"""
    updates["updated_at"] = utc_now()
    result = await db.crm_leads.update_one({"id": lead_id}, {"$set": updates})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"success": True, "message": "Lead updated"}

# --- BUSINESS ORDERS (Your 3 current projects) ---

@api_router.get("/crm/orders")
async def get_orders():
    """Get all business orders including the 3 current ones"""
    # First check DB for any orders
    db_orders = await db.crm_orders.find({}, {"_id": 0}).to_list(100)
    
    # If no orders in DB, seed with current orders
    if not db_orders:
        for order in CURRENT_ORDERS:
            order_dict = order.model_dump()
            await db.crm_orders.insert_one(order_dict)
        db_orders = [o.model_dump() for o in CURRENT_ORDERS]
    
    return {"orders": db_orders, "total": len(db_orders)}

@api_router.get("/crm/orders/{order_id}")
async def get_order(order_id: str):
    """Get a specific business order"""
    order = await db.crm_orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.patch("/crm/orders/{order_id}")
async def update_order(order_id: str, updates: Dict[str, Any]):
    """Update a business order (progress, status, etc.)"""
    updates["updated_at"] = utc_now()
    result = await db.crm_orders.update_one({"id": order_id}, {"$set": updates})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True, "message": "Order updated"}

@api_router.post("/crm/orders")
async def create_order(data: Dict[str, Any]):
    """Create a new business order"""
    order_id = f"ORDER-{str(uuid.uuid4())[:8].upper()}"
    data["id"] = order_id
    data["created_at"] = utc_now()
    data["updated_at"] = utc_now()
    data["status"] = data.get("status", "draft")
    data["progress"] = data.get("progress", 0)
    
    await db.crm_orders.insert_one(data)
    return {"success": True, "order_id": order_id}

# --- GTM METRICS (10K Users by Dubai) ---

@api_router.get("/crm/gtm/metrics")
async def get_gtm_metrics():
    """Get GTM metrics for Dubai investor meeting"""
    # Get from DB or create
    metrics = await db.crm_metrics.find_one({"type": "gtm"}, {"_id": 0})
    
    if not metrics:
        metrics = {
            "type": "gtm",
            "target_users": 10000,
            "current_users": 0,
            "target_date": "2026-01-08",
            "audience_reached": 0,
            "vibed_users": 0,
            "community_members": 0,
            "repeat_users": 0,
            "referral_rate": 0.0,
            "share_rate": 0.0,
            "viral_coefficient": 0.0,
            "users_by_vertical": {},
            "mrr": 0.0,
            "arr": 0.0,
            "updated_at": utc_now()
        }
        await db.crm_metrics.insert_one(metrics)
        del metrics["_id"]
    
    # Calculate progress
    days_remaining = 7
    users_needed = metrics["target_users"] - metrics["current_users"]
    users_per_day = users_needed / max(1, days_remaining)
    
    return {
        **metrics,
        "progress": {
            "remaining_users": users_needed,
            "progress_percent": (metrics["current_users"] / metrics["target_users"]) * 100,
            "users_per_day_needed": int(users_per_day),
            "days_remaining": days_remaining,
            "on_track": metrics["current_users"] >= (metrics["target_users"] * (7 - days_remaining) / 7)
        }
    }

@api_router.patch("/crm/gtm/metrics")
async def update_gtm_metrics(updates: Dict[str, Any]):
    """Update GTM metrics"""
    updates["updated_at"] = utc_now()
    await db.crm_metrics.update_one({"type": "gtm"}, {"$set": updates}, upsert=True)
    return {"success": True, "message": "Metrics updated"}

# --- PIPELINE ---

@api_router.get("/crm/pipeline")
async def get_pipeline():
    """Get GTM pipeline summary - New Path stages"""
    leads = await db.crm_leads.find({}, {"_id": 0}).to_list(1000)
    deals = await db.crm_deals.find({}, {"_id": 0}).to_list(1000)
    
    pipeline = {
        "stages": {
            "audience": len([l for l in leads if l.get("stage") == "audience"]),
            "vibed": len([l for l in leads if l.get("stage") == "vibed"]),
            "engaged": len([l for l in leads if l.get("stage") == "engaged"]),
            "launched": len([l for l in leads if l.get("stage") == "launched"]),
            "community_plus": len([l for l in leads if l.get("stage") == "community_plus"]),
            "ai_automated": len([l for l in leads if l.get("stage") == "ai_automated"]),
            "repeat": len([l for l in leads if l.get("stage") == "repeat"]),
        },
        "total_leads": len(leads),
        "total_deals": len(deals),
        "total_value": sum(d.get("value", 0) for d in deals),
        "avg_vibe_score": sum(l.get("vibe_score", 0) for l in leads) / max(1, len(leads))
    }
    
    return pipeline

# --- VERTICALS ---

@api_router.get("/crm/verticals")
async def get_verticals():
    """Get all business verticals and their status"""
    verticals = []
    for v in BusinessVertical:
        leads = await db.crm_leads.count_documents({"vertical": v.value})
        orders = await db.crm_orders.count_documents({"vertical": v.value})
        
        verticals.append({
            "id": v.value,
            "name": v.value.replace("_", " ").title(),
            "leads": leads,
            "orders": orders,
            "active": orders > 0
        })
    
    return {"verticals": verticals}

# --- DASHBOARD ---

@api_router.get("/crm/dashboard")
async def get_crm_dashboard():
    """Get CRM dashboard for Captain Command Centre"""
    # Get counts
    leads_count = await db.crm_leads.count_documents({})
    orders_count = await db.crm_orders.count_documents({})
    deals_count = await db.crm_deals.count_documents({})
    
    # Get recent leads
    recent_leads = await db.crm_leads.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    # Get active orders
    active_orders = await db.crm_orders.find({"status": {"$in": ["active", "in_progress"]}}, {"_id": 0}).to_list(10)
    
    # If no orders, get the 3 default ones
    if not active_orders:
        all_orders = await db.crm_orders.find({}, {"_id": 0}).to_list(10)
        if not all_orders:
            # Seed orders
            for order in CURRENT_ORDERS:
                order_dict = order.model_dump()
                await db.crm_orders.insert_one(order_dict)
            active_orders = [o.model_dump() for o in CURRENT_ORDERS]
        else:
            active_orders = all_orders
    
    # Get GTM metrics
    gtm = await db.crm_metrics.find_one({"type": "gtm"}, {"_id": 0})
    
    return {
        "summary": {
            "total_leads": leads_count,
            "total_orders": orders_count,
            "total_deals": deals_count,
            "current_users": gtm.get("current_users", 0) if gtm else 0,
            "target_users": 10000
        },
        "recent_leads": recent_leads,
        "active_orders": active_orders[:3],  # Your 3 current orders
        "gtm_progress": {
            "target": 10000,
            "current": gtm.get("current_users", 0) if gtm else 0,
            "days_to_dubai": 7
        }
    }

# ============================================
# CONTENT COMMAND CENTRE APIs
# ============================================

from content_command import (
    content_command, ReelContent, ShareCard, CareerMantra,
    NDADocument, OfferLetter, INDIAN_LANGUAGES, REEL_TEMPLATES,
    CAREER_MANTRAS, TARGET_SEGMENTS, AI_BUSINESS_2026
)

class TranslateRequest(BaseModel):
    text: str
    languages: List[str] = ["en", "hi", "kn", "ta", "te"]

class GenerateImageRequest(BaseModel):
    template: str
    message: str
    style: str = "vibrant"

class ShareCardRequest(BaseModel):
    name: str
    doers_score: int = 650
    adaptive_level: str = "ASSOCIATE"
    top_skills: List[str] = []
    career_match: str = ""
    language: str = "en"

class NDARequest(BaseModel):
    recipient_name: str
    recipient_email: str
    recipient_phone: str = ""
    effective_date: str

class OfferRequest(BaseModel):
    candidate_name: str
    candidate_email: str
    position: str
    division: str
    salary_annual: int
    joining_date: str

@api_router.get("/content/status")
async def content_command_status():
    """Check Content Command Centre status"""
    return {
        "available": content_command.is_available(),
        "features": ["translate", "image_generation", "share_cards", "mantras", "nda", "offer_letter"],
        "languages": list(INDIAN_LANGUAGES.keys()),
        "templates": list(REEL_TEMPLATES.keys()),
        "target_segments": list(TARGET_SEGMENTS.keys())
    }

@api_router.post("/content/translate")
async def translate_content(request: TranslateRequest):
    """Translate text to multiple Indian languages"""
    try:
        translations = await content_command.translate_to_all_languages(
            request.text, 
            request.languages
        )
        return {"translations": translations, "source_text": request.text}
    except Exception as e:
        logger.error(f"Translation error: {e}")
        # Return original text for all languages as fallback
        fallback = {lang: request.text for lang in request.languages}
        return {"translations": fallback, "source_text": request.text, "fallback": True}

@api_router.post("/content/generate-image")
async def generate_content_image(request: GenerateImageRequest):
    """Generate AI image for content using Gemini Nano Banana"""
    try:
        template_info = REEL_TEMPLATES.get(request.template, {})
        prompt = f"{request.message} - {template_info.get('description', 'Inspirational content')}"
        
        image_base64 = await content_command.generate_reel_image(prompt, request.style)
        
        if image_base64:
            return {"success": True, "image_base64": image_base64, "template": request.template}
        else:
            return {"success": False, "message": "Image generation unavailable"}
    except Exception as e:
        logger.error(f"Image generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/content/share-card")
async def create_share_card(request: ShareCardRequest):
    """Create DoersScore™ Share Card"""
    try:
        card = ShareCard(
            name=request.name,
            doers_score=request.doers_score,
            adaptive_level=request.adaptive_level,
            top_skills=request.top_skills,
            career_match=request.career_match,
            language=request.language
        )
        
        # Generate image
        image_base64 = await content_command.create_share_card_image(card)
        
        return {
            "card": card.model_dump(),
            "image_base64": image_base64 if image_base64 else None
        }
    except Exception as e:
        logger.error(f"Share card error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/content/mantra/{audience}")
async def get_career_mantra(audience: str):
    """Get random career mantra for specified audience"""
    mantra_data = content_command.get_random_mantra(audience)
    
    # Create mantra object
    mantra = CareerMantra(
        text=mantra_data["text"],
        translations={},
        category=mantra_data["category"],
        target_audience=audience,
        image_prompt=f"Inspirational {audience} career motivation"
    )
    
    # Try to generate image
    image_base64 = await content_command.create_career_mantra_image(mantra)
    
    return {
        **mantra.model_dump(),
        "image_base64": image_base64 if image_base64 else None
    }

@api_router.get("/content/mantras")
async def list_all_mantras():
    """Get all career mantras by category"""
    return {"mantras": CAREER_MANTRAS, "audiences": list(CAREER_MANTRAS.keys())}

@api_router.post("/content/legal/nda")
async def generate_nda(request: NDARequest):
    """Generate NDA document"""
    nda = NDADocument(
        recipient_name=request.recipient_name,
        recipient_email=request.recipient_email,
        recipient_phone=request.recipient_phone,
        effective_date=request.effective_date
    )
    
    html = content_command.generate_nda_html(nda)
    
    # Save to database (create a copy to avoid _id mutation)
    nda_dict = nda.model_dump()
    await db.legal_documents.insert_one({**nda_dict})
    
    return {"nda": nda_dict, "html": html}

@api_router.post("/content/legal/offer")
async def generate_offer_letter(request: OfferRequest):
    """Generate Offer Letter"""
    offer = OfferLetter(
        candidate_name=request.candidate_name,
        candidate_email=request.candidate_email,
        position=request.position,
        division=request.division,
        salary_annual=request.salary_annual,
        joining_date=request.joining_date
    )
    
    html = content_command.generate_offer_letter_html(offer)
    
    # Save to database (create a copy to avoid _id mutation)
    offer_dict = offer.model_dump()
    await db.legal_documents.insert_one({**offer_dict})
    
    return {"offer": offer_dict, "html": html}

@api_router.get("/content/legal/documents")
async def list_legal_documents(doc_type: Optional[str] = None, limit: int = 50):
    """List all generated legal documents"""
    query = {}
    if doc_type:
        query["id"] = {"$regex": f"^{doc_type.upper()}-"}
    
    docs = await db.legal_documents.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return {"documents": docs, "total": len(docs)}

@api_router.get("/content/segments")
async def get_target_segments():
    """Get GTM target audience segments"""
    return {"segments": TARGET_SEGMENTS}

@api_router.get("/content/ai-business-2026")
async def get_ai_business_opportunities():
    """Get 2026 AI Business opportunities mapped to DOERS features"""
    return {"opportunities": AI_BUSINESS_2026}

@api_router.get("/content/languages")
async def get_supported_languages():
    """Get list of supported Indian languages"""
    return {"languages": INDIAN_LANGUAGES}

# ============================================
# GEMMA OFFLINE AI APIs
# For Rural India: Srikakulum & Chickmagalur
# ============================================

from gemma_offline import (
    gemma_service, GemmaQuery, GemmaResponse,
    RURAL_LANGUAGES, OFFLINE_CAREER_GUIDANCE, OFFLINE_FAQ,
    calculate_rural_doers_score
)

class GemmaChatRequest(BaseModel):
    query: str
    language: str = "en"
    is_offline: bool = False
    education_level: Optional[str] = None
    region: Optional[str] = None

class RuralDoersScoreRequest(BaseModel):
    education_level: str
    skills: List[str] = []
    work_experience_years: int = 0
    certifications: int = 0
    language_proficiency: Dict[str, str] = {}

@api_router.get("/gemma/status")
async def gemma_status():
    """Check Gemma Offline AI status"""
    return {
        "available": True,
        "model": "gemma-3n-270m",
        "description": "Offline-first AI for Rural India",
        "target_regions": ["Srikakulum (Telugu)", "Chickmagalur (Kannada)"],
        "supported_languages": list(RURAL_LANGUAGES.keys()),
        "features": ["career_guidance", "offline_cache", "multi_lingual"]
    }

@api_router.post("/gemma/chat")
async def gemma_chat(request: GemmaChatRequest):
    """Main Gemma chat endpoint - works offline and online"""
    try:
        gemma_query = GemmaQuery(
            query=request.query,
            language=request.language,
            is_offline=request.is_offline,
            education_level=request.education_level,
            region=request.region
        )
        
        response = await gemma_service.process_query(gemma_query)
        return response.model_dump()
    except Exception as e:
        logger.error(f"Gemma chat error: {e}")
        # Return offline fallback
        fallback = await gemma_service.get_offline_response(GemmaQuery(
            query=request.query,
            language=request.language,
            is_offline=True
        ))
        return fallback.model_dump()

@api_router.get("/gemma/languages")
async def gemma_languages():
    """Get supported languages for rural India"""
    return {"languages": RURAL_LANGUAGES}

@api_router.get("/gemma/career-data")
async def gemma_career_data(language: str = "en", category: str = "lig_workers"):
    """Get offline career guidance data"""
    data = gemma_service.get_career_data(category, language)
    return data

@api_router.get("/gemma/offline-cache")
async def gemma_offline_cache():
    """Get all offline cached data for PWA sync"""
    return {
        "faq": OFFLINE_FAQ,
        "career_data": OFFLINE_CAREER_GUIDANCE,
        "languages": RURAL_LANGUAGES
    }

@api_router.post("/gemma/doers-score")
async def calculate_gemma_doers_score(request: RuralDoersScoreRequest):
    """Calculate DoersScore™ for rural users"""
    score = calculate_rural_doers_score(
        education_level=request.education_level,
        skills=request.skills,
        work_experience_years=request.work_experience_years,
        certifications=request.certifications,
        language_proficiency=request.language_proficiency
    )
    
    # Determine level based on score
    if score >= 800:
        level = "EXPERT"
    elif score >= 700:
        level = "PROFESSIONAL"
    elif score >= 600:
        level = "MANAGER"
    elif score >= 500:
        level = "ASSOCIATE"
    else:
        level = "PARA"
    
    return {
        "doers_score": score,
        "level": level,
        "education_level": request.education_level,
        "skills_count": len(request.skills),
        "certifications": request.certifications
    }

@api_router.get("/gemma/quick-questions/{language}")
async def gemma_quick_questions(language: str):
    """Get quick questions in specified language"""
    questions = {
        "en": [
            "What career suits me?",
            "How to improve my income?",
            "Government schemes for jobs",
            "Skill training near me"
        ],
        "te": [
            "నాకు ఏ కెరీర్ సరిపోతుంది?",
            "నా ఆదాయాన్ని ఎలా పెంచుకోవాలి?",
            "ఉద్యోగాల కోసం ప్రభుత్వ పథకాలు",
            "నా సమీపంలో స్కిల్ ట్రైనింగ్"
        ],
        "kn": [
            "ನನಗೆ ಯಾವ ವೃತ್ತಿ ಸರಿಹೊಂದುತ್ತದೆ?",
            "ನನ್ನ ಆದಾಯವನ್ನು ಹೇಗೆ ಸುಧಾರಿಸುವುದು?",
            "ಉದ್ಯೋಗಗಳಿಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
            "ನನ್ನ ಹತ್ತಿರ ಕೌಶಲ್ಯ ತರಬೇತಿ"
        ]
    }
    return {"questions": questions.get(language, questions["en"]), "language": language}

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
