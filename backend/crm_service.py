# ============================================
# CRM SUPER APP - DOERS COMMAND CENTRE
# "Business to the World" - GTM Virality Engine
# ============================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid

def generate_id(prefix: str = "CRM") -> str:
    return f"{prefix}-{str(uuid.uuid4())[:8].upper()}"

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

# ============================================
# BUSINESS VERTICALS (From your images)
# ============================================

class BusinessVertical(str, Enum):
    # Core DOERS Verticals
    WOMEN_ENTREPRENEURS = "women_entrepreneurs"
    LEGAL_UPSKILL = "legal_upskill"
    AMBULANCE_AGGREGATOR = "ambulance_aggregator"
    
    # Tech Verticals
    EDTECH = "edtech"
    HRTECH = "hrtech"
    FINTECH = "fintech"
    HEALTHTECH = "healthtech"
    
    # Platform Verticals
    SAAS = "saas"
    MARKETPLACE = "marketplace"
    CONSUMERTECH = "consumertech"
    
    # Glocal Verticals
    AGRITECH = "agritech"
    SUSTAINABILITY = "sustainability"
    LOGISTICS = "logistics"
    REAL_ESTATE = "real_estate"

class LeadSource(str, Enum):
    # New Path GTM Sources
    COMMUNITY = "community"
    VIBE_CODE = "vibe_code"
    REFERRAL = "referral"
    SOCIAL_MEDIA = "social_media"
    CONTENT = "content"
    AI_AGENT = "ai_agent"
    
    # Traditional
    WEBSITE = "website"
    EVENT = "event"
    PARTNERSHIP = "partnership"
    COLD_OUTREACH = "cold_outreach"

class LeadStage(str, Enum):
    # New Path Stages
    AUDIENCE = "audience"           # Found Audience
    VIBED = "vibed"                 # Connected with Vibe
    ENGAGED = "engaged"             # Active in Community
    LAUNCHED = "launched"           # Using Product
    COMMUNITY_PLUS = "community_plus"  # Active Contributor
    AI_AUTOMATED = "ai_automated"   # Fully Automated
    REPEAT = "repeat"               # Repeat Customer
    
    # Traditional
    PROSPECT = "prospect"
    QUALIFIED = "qualified"
    PROPOSAL = "proposal"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class DoerDivision(str, Enum):
    # 12 Divisions from Captain Command Centre
    STRATEGY = "strategy"
    PRODUCT = "product"
    TECHNOLOGY = "technology"
    MARKETING = "marketing"
    SALES = "sales"
    OPERATIONS = "operations"
    FINANCE = "finance"
    HR = "hr"
    LEGAL = "legal"
    PARTNERSHIPS = "partnerships"
    CUSTOMER_SUCCESS = "customer_success"
    AI_AGENTS = "ai_agents"

class UrgencyLevel(str, Enum):
    CRITICAL = "critical"      # Resolve in hours
    HIGH = "high"              # Resolve in 1 day
    MEDIUM = "medium"          # Resolve in 3 days
    LOW = "low"                # Resolve in week
    SCHEDULED = "scheduled"    # As per schedule

# ============================================
# CRM MODELS
# ============================================

class Lead(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("LEAD"))
    
    # Basic Info
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    title: Optional[str] = None
    
    # GTM Tracking
    source: LeadSource = LeadSource.COMMUNITY
    stage: LeadStage = LeadStage.AUDIENCE
    vertical: BusinessVertical
    
    # Vibe Score (How well they match our vibe)
    vibe_score: int = 50  # 0-100
    engagement_score: int = 0  # Activity level
    
    # Assignment
    assigned_division: Optional[DoerDivision] = None
    assigned_to: Optional[str] = None
    urgency: UrgencyLevel = UrgencyLevel.MEDIUM
    
    # Value
    potential_value: Optional[float] = None
    currency: str = "INR"
    
    # Notes & Tags
    notes: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    
    # Timestamps
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)
    last_contacted: Optional[str] = None

class Contact(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("CONT"))
    lead_id: Optional[str] = None
    
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    
    # Social
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    
    # Preferences
    preferred_contact: str = "email"  # email, phone, whatsapp
    language: str = "en"  # en, kn (Kannada), hi, etc.
    
    created_at: str = Field(default_factory=utc_now)

class Deal(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("DEAL"))
    lead_id: str
    
    # Deal Info
    title: str
    description: Optional[str] = None
    vertical: BusinessVertical
    
    # Value
    value: float
    currency: str = "INR"
    recurring: bool = False
    recurring_period: Optional[str] = None  # monthly, yearly
    
    # Stage
    stage: LeadStage = LeadStage.PROPOSAL
    probability: int = 50  # 0-100%
    
    # Timeline
    expected_close_date: Optional[str] = None
    actual_close_date: Optional[str] = None
    
    # Assignment
    assigned_division: DoerDivision
    assigned_to: Optional[str] = None
    
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("ACT"))
    
    # Reference
    lead_id: Optional[str] = None
    deal_id: Optional[str] = None
    contact_id: Optional[str] = None
    
    # Activity
    activity_type: str  # call, email, meeting, note, task
    title: str
    description: Optional[str] = None
    
    # Scheduling
    scheduled_at: Optional[str] = None
    completed_at: Optional[str] = None
    is_completed: bool = False
    
    # AI Agent
    ai_generated: bool = False
    ai_agent: Optional[str] = None
    
    created_by: Optional[str] = None
    created_at: str = Field(default_factory=utc_now)

class BusinessOrder(BaseModel):
    """Track your 3 current orders and future ones"""
    id: str = Field(default_factory=lambda: generate_id("ORDER"))
    
    # Client Info
    client_name: str
    client_contact: Optional[str] = None
    
    # Order Details
    title: str
    description: str
    vertical: BusinessVertical
    
    # Requirements
    requirements: List[str] = Field(default_factory=list)
    deliverables: List[str] = Field(default_factory=list)
    
    # Timeline
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    milestones: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Value
    contract_value: float
    currency: str = "INR"
    payment_terms: str = "50% advance, 50% on delivery"
    
    # Status
    status: str = "draft"  # draft, active, in_progress, review, completed, cancelled
    progress: int = 0  # 0-100%
    
    # Division Assignment
    primary_division: DoerDivision
    supporting_divisions: List[DoerDivision] = Field(default_factory=list)
    
    created_at: str = Field(default_factory=utc_now)
    updated_at: str = Field(default_factory=utc_now)

# ============================================
# YOUR 3 CURRENT ORDERS
# ============================================

CURRENT_ORDERS = [
    BusinessOrder(
        id="ORDER-WOMEN-001",
        client_name="Women Entrepreneurs Network",
        title="Women Entrepreneurs Platform",
        description="Build a comprehensive platform for women entrepreneurs with networking, mentorship, funding access, and skill development",
        vertical=BusinessVertical.WOMEN_ENTREPRENEURS,
        requirements=[
            "User registration with business profile",
            "Mentor matching system",
            "Funding opportunity listings",
            "Skill development courses",
            "Community forums",
            "Success stories showcase"
        ],
        deliverables=[
            "PWA Mobile App",
            "Admin Dashboard",
            "Mentor Portal",
            "Payment Integration"
        ],
        contract_value=500000,
        status="draft",
        progress=0,
        primary_division=DoerDivision.PRODUCT,
        supporting_divisions=[DoerDivision.TECHNOLOGY, DoerDivision.MARKETING]
    ),
    BusinessOrder(
        id="ORDER-LEGAL-002",
        client_name="Karnataka Bar Association",
        title="Legal Upskill Platform (Kannada-English)",
        description="Bilingual upskilling platform for new lawyers in Karnataka with focus on Kannada and English content",
        vertical=BusinessVertical.LEGAL_UPSKILL,
        requirements=[
            "Bilingual content (Kannada + English)",
            "Video course modules",
            "Case study library",
            "Mock court simulations",
            "Certificate generation",
            "Mentor connect with senior advocates"
        ],
        deliverables=[
            "Learning Management System",
            "Mobile App (PWA)",
            "Content Management System",
            "Certificate Generator"
        ],
        contract_value=750000,
        status="draft",
        progress=0,
        primary_division=DoerDivision.PRODUCT,
        supporting_divisions=[DoerDivision.TECHNOLOGY, DoerDivision.OPERATIONS]
    ),
    BusinessOrder(
        id="ORDER-AMBULANCE-003",
        client_name="Emergency Services Consortium",
        title="Ambulance Driver Aggregator (Uber-style)",
        description="Real-time ambulance booking and tracking platform connecting patients with ambulance drivers",
        vertical=BusinessVertical.AMBULANCE_AGGREGATOR,
        requirements=[
            "Real-time GPS tracking",
            "Emergency SOS button",
            "Driver app with earnings dashboard",
            "Hospital integration",
            "Insurance tie-ups",
            "Multi-language support"
        ],
        deliverables=[
            "Patient App",
            "Driver App",
            "Hospital Dashboard",
            "Admin Command Centre"
        ],
        contract_value=1000000,
        status="draft",
        progress=0,
        primary_division=DoerDivision.TECHNOLOGY,
        supporting_divisions=[DoerDivision.OPERATIONS, DoerDivision.PARTNERSHIPS]
    )
]

# ============================================
# GTM METRICS - 10K USERS BY DUBAI
# ============================================

class GTMMetrics(BaseModel):
    """Track progress to 10K users for Dubai investor meeting"""
    target_users: int = 10000
    current_users: int = 0
    target_date: str = "2026-01-08"  # 1 week from now
    
    # New Path Metrics
    audience_reached: int = 0
    vibed_users: int = 0
    community_members: int = 0
    repeat_users: int = 0
    
    # Viral Metrics
    referral_rate: float = 0.0
    share_rate: float = 0.0
    viral_coefficient: float = 0.0
    
    # By Vertical
    users_by_vertical: Dict[str, int] = Field(default_factory=dict)
    
    # Revenue
    mrr: float = 0.0  # Monthly Recurring Revenue
    arr: float = 0.0  # Annual Recurring Revenue
    
    updated_at: str = Field(default_factory=utc_now)

# ============================================
# CRM SERVICE
# ============================================

class CRMService:
    """CRM Service for the Super App"""
    
    def __init__(self):
        self.leads: List[Lead] = []
        self.contacts: List[Contact] = []
        self.deals: List[Deal] = []
        self.activities: List[Activity] = []
        self.orders: List[BusinessOrder] = CURRENT_ORDERS.copy()
        self.metrics = GTMMetrics()
    
    def add_lead(self, lead: Lead) -> Lead:
        self.leads.append(lead)
        return lead
    
    def get_leads_by_vertical(self, vertical: BusinessVertical) -> List[Lead]:
        return [l for l in self.leads if l.vertical == vertical]
    
    def get_leads_by_stage(self, stage: LeadStage) -> List[Lead]:
        return [l for l in self.leads if l.stage == stage]
    
    def get_pipeline_summary(self) -> Dict[str, Any]:
        """Get GTM pipeline summary - New Path stages"""
        return {
            "audience": len([l for l in self.leads if l.stage == LeadStage.AUDIENCE]),
            "vibed": len([l for l in self.leads if l.stage == LeadStage.VIBED]),
            "engaged": len([l for l in self.leads if l.stage == LeadStage.ENGAGED]),
            "launched": len([l for l in self.leads if l.stage == LeadStage.LAUNCHED]),
            "community_plus": len([l for l in self.leads if l.stage == LeadStage.COMMUNITY_PLUS]),
            "ai_automated": len([l for l in self.leads if l.stage == LeadStage.AI_AUTOMATED]),
            "repeat": len([l for l in self.leads if l.stage == LeadStage.REPEAT]),
            "total_leads": len(self.leads),
            "total_value": sum(d.value for d in self.deals)
        }
    
    def get_vertical_summary(self) -> Dict[str, Any]:
        """Get summary by business vertical"""
        summary = {}
        for vertical in BusinessVertical:
            leads = self.get_leads_by_vertical(vertical)
            summary[vertical.value] = {
                "leads": len(leads),
                "avg_vibe_score": sum(l.vibe_score for l in leads) / len(leads) if leads else 0,
                "deals": len([d for d in self.deals if d.vertical == vertical])
            }
        return summary
    
    def get_dubai_progress(self) -> Dict[str, Any]:
        """Track progress for Dubai investor meeting"""
        days_remaining = 7  # 1 week
        users_per_day_needed = (self.metrics.target_users - self.metrics.current_users) / max(1, days_remaining)
        
        return {
            "target": self.metrics.target_users,
            "current": self.metrics.current_users,
            "remaining": self.metrics.target_users - self.metrics.current_users,
            "progress_percent": (self.metrics.current_users / self.metrics.target_users) * 100,
            "users_per_day_needed": int(users_per_day_needed),
            "viral_coefficient": self.metrics.viral_coefficient,
            "on_track": self.metrics.current_users >= (self.metrics.target_users * (7 - days_remaining) / 7)
        }

# Singleton
crm_service = CRMService()
