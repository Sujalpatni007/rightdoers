# ============================================
# HI AI-APP.COM - DATABASE MODELS
# Complete Schema Definitions for MongoDB
# Version: 1.0 | January 2026
# ============================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid

# ============================================
# ENUMS
# ============================================

class UserRole(str, Enum):
    DOER = "doer"
    EMPLOYER = "employer"
    ADMIN = "admin"
    CTO = "cto"

class AdaptiveLevel(str, Enum):
    PARA = "PARA"
    ASSOCIATE = "ASSOCIATE"
    MANAGER = "MANAGER"
    PROFESSIONAL = "PROFESSIONAL"
    EXPERT = "EXPERT"

class AssessmentStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class DCoinTransactionType(str, Enum):
    EARN = "earn"
    SPEND = "spend"
    TRANSFER = "transfer"
    REWARD = "reward"

# ============================================
# HELPER FUNCTIONS
# ============================================

def generate_id(prefix: str = "ID") -> str:
    return f"{prefix}-{str(uuid.uuid4())[:8].upper()}"

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

def calculate_efficiency(natural_fit: int, developed_skills: int, learning_agility: int) -> int:
    """Efficiency = (Skills × 0.6) + (NaturalFit × 0.3) + (LearningAgility × 0.1)"""
    return round((developed_skills * 0.6) + (natural_fit * 0.3) + (learning_agility * 0.1))

def get_adaptive_level(score: int) -> str:
    if score >= 91: return AdaptiveLevel.EXPERT
    if score >= 76: return AdaptiveLevel.PROFESSIONAL
    if score >= 61: return AdaptiveLevel.MANAGER
    if score >= 41: return AdaptiveLevel.ASSOCIATE
    return AdaptiveLevel.PARA

def calculate_doers_score(efficiency: int, dimensions_avg: int) -> int:
    """DoersScore = 300-900 range (like CIBIL)"""
    base = 400 + (efficiency * 3) + (dimensions_avg * 2)
    return max(300, min(900, base))

# ============================================
# USER MODEL
# ============================================

class User(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("USR"))
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    role: UserRole = UserRole.DOER
    user_type: Optional[str] = None  # pupil, people, partner, performer
    
    # Profile reference
    profile_id: Optional[str] = None
    
    # Auth
    is_verified: bool = False
    last_otp: Optional[str] = None
    otp_expires_at: Optional[str] = None
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)
    last_login: Optional[str] = None

# ============================================
# DOERS PROFILE / TALENT CARD
# ============================================

class DimensionScore(BaseModel):
    score: int = 0
    level: str = AdaptiveLevel.PARA
    percentile: int = 50
    reliability: float = 0.0

class Skill(BaseModel):
    name: str
    level: int = 0
    growth: str = "+0%"
    verified: bool = False
    last_assessed: Optional[str] = None

class SkillMilestone(BaseModel):
    date: str
    skill: str
    improvement: int
    badge_earned: Optional[str] = None

class CareerSuitability(BaseModel):
    role: str
    match_score: int
    gap_analysis: Optional[str] = None

class DoersProfile(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("DP"))
    user_id: str
    credential_id: str = Field(default_factory=lambda: generate_id("RDVC"))
    
    # Basic Info
    name: str
    avatar_emoji: str = "🎯"
    
    # DoersScore (CIBIL-style: 300-900)
    doers_score: int = 650
    doers_score_percentile: int = 50
    doers_score_trend: str = "stable"  # rising, stable, falling
    doers_score_history: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Efficiency Value
    natural_fit_score: int = 70
    developed_skills_score: int = 60
    learning_agility_score: int = 75
    efficiency_value: int = 0
    
    # 6 Dimensions (EduMilestones)
    dimensions: Dict[str, DimensionScore] = Field(default_factory=lambda: {
        "personality": DimensionScore(reliability=0.95),
        "interest": DimensionScore(reliability=0.94),
        "learning": DimensionScore(reliability=0.89),
        "eq": DimensionScore(reliability=0.89),
        "intelligence": DimensionScore(reliability=0.91),
        "aptitude": DimensionScore(reliability=0.88)
    })
    
    # Adaptive Level
    adaptive_level: str = AdaptiveLevel.PARA
    
    # Skills
    skills: List[Skill] = Field(default_factory=list)
    skill_milestones: List[SkillMilestone] = Field(default_factory=list)
    total_skill_improvement: int = 0
    
    # Career
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    role_match_score: int = 0
    alternate_roles: List[CareerSuitability] = Field(default_factory=list)
    
    # Character Club (Pandava)
    character_club: Optional[str] = None  # Arjuna, Bhima, Yudhishthira, Nakula, Sahadeva
    prakruti_type: Optional[str] = None  # Vata, Pitta, Kapha
    
    # Verification
    is_verified: bool = False
    verified_date: Optional[str] = None
    right_doers_powered: bool = True
    
    # Social
    shares_count: int = 0
    profile_views: int = 0
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)

# ============================================
# ASSESSMENT MODEL
# ============================================

class AssessmentQuestion(BaseModel):
    id: str
    dimension: str
    question_text: str
    options: List[str]
    selected_option: Optional[int] = None
    score: int = 0

class Assessment(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("ASM"))
    user_id: str
    profile_id: str
    
    # Assessment Type
    assessment_type: str  # prakruti, suitability, full
    adaptive_level: str = AdaptiveLevel.PARA
    
    # Status
    status: AssessmentStatus = AssessmentStatus.PENDING
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    duration_minutes: int = 0
    
    # Questions & Answers
    total_questions: int = 0
    answered_questions: int = 0
    questions: List[AssessmentQuestion] = Field(default_factory=list)
    
    # Results
    dimension_scores: Dict[str, int] = Field(default_factory=dict)
    overall_score: int = 0
    reliability_coefficient: float = 0.0
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)

# ============================================
# D-COIN WALLET & TRANSACTIONS
# ============================================

class DCoinTransaction(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("TXN"))
    user_id: str
    
    # Transaction Details
    type: DCoinTransactionType
    amount: int
    balance_after: int
    
    # Reference
    description: str
    reference_type: Optional[str] = None  # capsule, assessment, referral, purchase
    reference_id: Optional[str] = None
    
    # Timestamp
    created_at: str = Field(default_factory=utc_now)

class DCoinWallet(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("WLT"))
    user_id: str
    
    # Balance
    balance: int = 100  # Starting bonus
    total_earned: int = 100
    total_spent: int = 0
    
    # Streak
    daily_streak: int = 0
    longest_streak: int = 0
    last_activity_date: Optional[str] = None
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)

# ============================================
# CAREER CAPSULE PROGRESS
# ============================================

class CapsuleProgress(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("CAP"))
    user_id: str
    
    # Capsule Info
    division_id: str
    capsule_id: str
    capsule_title: str
    
    # Progress
    status: str = "not_started"  # not_started, in_progress, completed
    progress_percent: int = 0
    
    # Scores
    quiz_score: Optional[int] = None
    role_play_score: Optional[int] = None
    
    # D-COIN earned
    dcoin_earned: int = 0
    
    # Timestamps
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

# ============================================
# FAMILY DASHBOARD (DOERS ONE)
# ============================================

class FamilyMemberNeed(BaseModel):
    id: str
    name: str
    name_regional: Optional[str] = None
    icon: str
    progress: int = 0
    status: str = "pending"  # pending, active, completed

class FamilyMember(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("MBR"))
    name: str
    name_regional: Optional[str] = None
    role: str  # father, mother, daughter, son, etc.
    avatar: str = "👤"
    
    # Profile link
    profile_id: Optional[str] = None
    doers_score: int = 700
    
    # Needs
    needs: List[FamilyMemberNeed] = Field(default_factory=list)
    
    # Goals
    current_goal: Optional[str] = None
    next_action: Optional[str] = None

class FamilyGoal(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("GOL"))
    title: str
    target_amount: int
    saved_amount: int = 0
    progress: int = 0
    target_date: Optional[str] = None

class Family(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("FAM"))
    name: str
    family_type: str = "MIG"  # MIG, HIG, etc.
    
    # Scores
    family_doers_score: int = 700
    
    # Members
    members: List[FamilyMember] = Field(default_factory=list)
    
    # Goals
    goals: List[FamilyGoal] = Field(default_factory=list)
    
    # Settings
    primary_language: str = "en"  # en, kn, hi, te, ta
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)

# ============================================
# JOB POSTING
# ============================================

class Job(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("JOB"))
    employer_id: str
    
    # Job Details
    title: str
    company: str
    description: str
    requirements: List[str] = Field(default_factory=list)
    
    # Location & Type
    location: str
    job_type: str = "full-time"  # full-time, part-time, contract, gig
    remote_option: bool = False
    
    # Compensation
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: str = "INR"
    
    # Requirements
    min_doers_score: int = 500
    required_level: str = AdaptiveLevel.ASSOCIATE
    required_skills: List[str] = Field(default_factory=list)
    
    # Status
    is_active: bool = True
    applications_count: int = 0
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)
    expires_at: Optional[str] = None

# ============================================
# JOB APPLICATION
# ============================================

class JobApplication(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("APP"))
    job_id: str
    user_id: str
    profile_id: str
    
    # Match
    match_score: int = 0
    
    # Status
    status: str = "applied"  # applied, reviewing, shortlisted, rejected, hired
    
    # Notes
    cover_note: Optional[str] = None
    employer_notes: Optional[str] = None
    
    # Timestamps
    applied_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)

# ============================================
# ANALYTICS / METRICS
# ============================================

class PlatformMetrics(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("MTR"))
    date: str
    
    # Users
    total_users: int = 0
    new_users_today: int = 0
    active_users_today: int = 0
    
    # Profiles
    total_profiles: int = 0
    verified_profiles: int = 0
    
    # Assessments
    assessments_completed: int = 0
    avg_doers_score: int = 650
    
    # D-COIN
    total_dcoin_circulation: int = 0
    dcoin_transactions_today: int = 0
    
    # Jobs
    active_jobs: int = 0
    applications_today: int = 0
    successful_matches: int = 0
    
    # Engagement
    profile_shares: int = 0
    capsules_completed: int = 0

# ============================================
# EXPORT ALL MODELS
# ============================================

__all__ = [
    "UserRole", "AdaptiveLevel", "AssessmentStatus", "DCoinTransactionType",
    "User", "DoersProfile", "DimensionScore", "Skill", "SkillMilestone",
    "CareerSuitability", "Assessment", "AssessmentQuestion",
    "DCoinWallet", "DCoinTransaction", "CapsuleProgress",
    "Family", "FamilyMember", "FamilyMemberNeed", "FamilyGoal",
    "Job", "JobApplication", "PlatformMetrics",
    "generate_id", "utc_now", "calculate_efficiency", "get_adaptive_level", "calculate_doers_score"
]
