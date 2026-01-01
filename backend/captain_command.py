"""
Captain Command Centre - 7 Business Verticals Hub
DOERS Trinity: Human + AI + Robo Doer
Varun Mayya Style: Company as Organism, 16-Kata System
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum
import uuid
import hashlib

router = APIRouter(prefix="/api/captain", tags=["Captain Command Centre"])

# Business Vertical Enum
class BusinessVertical(str, Enum):
    B2G = "B2G"  # Business to Government - Jobs for Locals
    B2A = "B2A"  # Business to Associations - Partnership Focus
    B2B = "B2B"  # Business to Business - Corporate Services
    B2C = "B2C"  # Business to Consumers/Candidates - Direct Talent
    B2D = "B2D"  # Business to Digital - Creative/Digital Services
    D2D = "D2D"  # Doers to Doers - Peer Network
    A2A = "A2A"  # Agent to Agent - AI Agent Operations

# Vertical Configuration
VERTICAL_CONFIG = {
    BusinessVertical.B2G: {
        "name": "Business to Government",
        "code": "B2G",
        "mission": "Jobs for Locals Focus",
        "icon": "🏛️",
        "color": "#1e40af",  # Blue
        "description": "Government schemes integration, policy briefs, public sector talent pipeline",
        "kata_focus": ["Policy Navigation", "Government Compliance", "Public Sector Hiring"],
        "key_metrics": ["govt_contracts", "local_jobs_filled", "scheme_enrollments"]
    },
    BusinessVertical.B2A: {
        "name": "Business to Associations",
        "code": "B2A",
        "mission": "Association Partnerships",
        "icon": "🤝",
        "color": "#7c3aed",  # Purple
        "description": "Industry associations, trade bodies, professional networks",
        "kata_focus": ["Partner Onboarding", "Association Management", "Network Building"],
        "key_metrics": ["active_partnerships", "member_organizations", "joint_programs"]
    },
    BusinessVertical.B2B: {
        "name": "Business to Business",
        "code": "B2B",
        "mission": "Corporate Services",
        "icon": "🏢",
        "color": "#059669",  # Green
        "description": "Enterprise talent solutions, corporate training, GCC support",
        "kata_focus": ["Enterprise Sales", "Client Success", "Solution Architecture"],
        "key_metrics": ["enterprise_clients", "revenue_b2b", "retention_rate"]
    },
    BusinessVertical.B2C: {
        "name": "Business to Consumers",
        "code": "B2C",
        "mission": "Direct Talent Services",
        "icon": "👤",
        "color": "#dc2626",  # Red
        "description": "Direct-to-user career services, talent assessments, job matching",
        "kata_focus": ["User Acquisition", "Engagement Loops", "Career Guidance"],
        "key_metrics": ["active_users", "assessments_completed", "job_placements"]
    },
    BusinessVertical.B2D: {
        "name": "Business to Digital",
        "code": "B2D",
        "mission": "Creative & Digital Services",
        "icon": "🎨",
        "color": "#ea580c",  # Orange
        "description": "Content creation, digital marketing, creative automation",
        "kata_focus": ["Content Strategy", "Distribution Machine", "Creative AI"],
        "key_metrics": ["content_pieces", "reach_millions", "engagement_rate"]
    },
    BusinessVertical.D2D: {
        "name": "Doers to Doers",
        "code": "D2D",
        "mission": "Peer Network",
        "icon": "🔗",
        "color": "#0891b2",  # Cyan
        "description": "Community, mentorship, peer learning, skill exchange",
        "kata_focus": ["Community Building", "Mentorship SOPs", "Peer Learning"],
        "key_metrics": ["active_mentors", "peer_connections", "skill_exchanges"]
    },
    BusinessVertical.A2A: {
        "name": "Agent to Agent",
        "code": "A2A",
        "mission": "AI Agent Operations",
        "icon": "🤖",
        "color": "#4f46e5",  # Indigo
        "description": "AI orchestration, agentic workflows, data science operations",
        "kata_focus": ["AI Orchestration", "Agent Training", "Workflow Automation"],
        "key_metrics": ["active_agents", "tasks_automated", "ai_accuracy"]
    }
}

# Onboarding Status
class OnboardingStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    KATA_1 = "kata_1"  # Day 1-3
    KATA_2 = "kata_2"  # Day 4-7
    KATA_3 = "kata_3"  # Week 2
    ORBIT = "orbit"    # Self-sustaining

# Models
class LeaderAssignment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vertical: BusinessVertical
    leader_name: str
    leader_phone: str
    leader_email: Optional[str] = None
    designation: str = "Vertical Director"
    status: str = "active"
    assigned_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    onboarding_status: OnboardingStatus = OnboardingStatus.NOT_STARTED
    kata_progress: int = 0  # 0-100
    team_size: int = 0

class OnboardingSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    vertical: BusinessVertical
    started_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    current_kata: int = 1
    completed_modules: List[str] = []
    ai_conversations: List[Dict[str, Any]] = []
    cached_responses: Dict[str, str] = {}
    status: OnboardingStatus = OnboardingStatus.IN_PROGRESS

class KataModule(BaseModel):
    id: str
    kata_number: int
    title: str
    vertical: BusinessVertical
    content_type: str  # "video", "interactive", "document", "ai_chat"
    duration_mins: int
    objectives: List[str]
    completion_criteria: str

class VerticalMetrics(BaseModel):
    vertical: BusinessVertical
    leader_assigned: bool = False
    leader_name: Optional[str] = None
    team_size: int = 0
    active_projects: int = 0
    revenue_mtd: float = 0.0
    key_metric_1: float = 0.0
    key_metric_2: float = 0.0
    key_metric_3: float = 0.0
    health_score: int = 0  # 0-100

# 16-Kata System Content (Varun Mayya inspired)
KATA_SYSTEM = {
    1: {
        "name": "Context Loading",
        "duration": "Day 1",
        "objectives": [
            "Understand DOERS mission and your vertical's role",
            "Meet the Captain (Founder) via video message",
            "Access your vertical's intelligence briefing"
        ],
        "deliverables": ["Signed NDA", "Completed mission brief quiz", "First team introduction"]
    },
    2: {
        "name": "System Orientation",
        "duration": "Day 2-3",
        "objectives": [
            "Master the Command Centre dashboard",
            "Set up your AI assistant (AIMEE)",
            "Complete security protocols"
        ],
        "deliverables": ["Dashboard proficiency test", "AI assistant configured", "Security clearance"]
    },
    3: {
        "name": "Vertical Deep Dive",
        "duration": "Week 1",
        "objectives": [
            "Study your vertical's playbook",
            "Shadow existing operations",
            "Identify 3 quick wins"
        ],
        "deliverables": ["Playbook comprehension test", "Shadow report", "Quick wins proposal"]
    },
    4: {
        "name": "First Mission",
        "duration": "Week 2",
        "objectives": [
            "Execute first independent task",
            "Build your vertical's 30-day roadmap",
            "Recruit your first team member"
        ],
        "deliverables": ["Mission completion report", "30-day roadmap", "Team expansion plan"]
    }
}

# AI Onboarding Responses Cache (for offline mode)
CACHED_ONBOARDING_RESPONSES = {
    "welcome": {
        "B2G": "Welcome, Commander! You're now leading our Government Operations vertical. Your mission: bridge talent with public sector opportunities. Let's review the Karnataka Model success...",
        "B2A": "Welcome to Association Command! Your mission is to build strategic partnerships with industry bodies. Let's start with our FICCI and NASSCOM playbooks...",
        "B2B": "Welcome to Enterprise Operations! You'll be powering Fortune 500 GCC talent pipelines. Let's review our client success framework...",
        "B2C": "Welcome to Talent Command! You're at the heart of our user journey. From assessment to placement - let's master the DOERS flywheel...",
        "B2D": "Welcome to Digital Command! You'll run our distribution machine - 60M+ reach is the target. Let's study the content factory playbook...",
        "D2D": "Welcome to Community Command! Peer networks are our superpower. Let's build the mentorship engine that scales...",
        "A2A": "Welcome to AI Operations! You're commanding our agentic workforce. Let's calibrate the AIMEE network..."
    },
    "first_task": {
        "B2G": "Your first mission: Review the 'Jobs for Locals' compliance checklist and identify 5 government schemes we should integrate by next quarter.",
        "B2A": "Your first mission: Map 10 potential association partners and draft outreach templates using our proven playbook.",
        "B2B": "Your first mission: Study our top 3 enterprise client success stories and document the patterns that led to retention.",
        "B2C": "Your first mission: Complete 5 user journey audits and identify friction points in the assessment-to-placement funnel.",
        "B2D": "Your first mission: Create a 7-day content calendar using our reel templates and analyze which formats drive highest engagement.",
        "D2D": "Your first mission: Interview 5 successful mentor-mentee pairs and document what makes the relationship work.",
        "A2A": "Your first mission: Audit AIMEE's response accuracy across 100 conversations and flag patterns needing improvement."
    },
    "kata_tips": {
        "B2G": "Pro tip: Government moves slow but at scale. One policy win = 10,000 placements. Play the long game.",
        "B2A": "Pro tip: Associations are trust-networks. One champion inside = access to their entire member base.",
        "B2B": "Pro tip: Enterprise sales is about de-risking. Show them we've done this before, exactly like this.",
        "B2C": "Pro tip: Users don't want jobs, they want transformed lives. Sell the dream, deliver the pathway.",
        "B2D": "Pro tip: Distribution > Creation. One viral piece = 100 average ones. Focus on the algorithm.",
        "D2D": "Pro tip: Communities die without rituals. Weekly touchpoints keep the network alive.",
        "A2A": "Pro tip: AI is a force multiplier. Every 1% accuracy improvement = 1000 better user experiences."
    }
}

# Database reference (will be injected from server.py)
db = None

def set_database(database):
    global db
    db = database

# API Endpoints

@router.get("/status")
async def get_command_status():
    """Get Captain Command Centre status"""
    return {
        "status": "operational",
        "codename": "DOERS_COMMAND",
        "version": "1.0.0",
        "verticals_count": len(BusinessVertical),
        "mission": "Human Potential Management & Transformation",
        "motto": "From Dream to Destination",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/verticals")
async def get_all_verticals():
    """Get all 7 business verticals with configuration"""
    verticals = []
    
    for vertical in BusinessVertical:
        config = VERTICAL_CONFIG[vertical]
        
        # Get leader if assigned
        leader = None
        if db is not None:
            leader_doc = await db.vertical_leaders.find_one(
                {"vertical": vertical.value, "status": "active"},
                {"_id": 0}
            )
            if leader_doc:
                leader = leader_doc
        
        # Get metrics
        metrics = {
            "team_size": leader.get("team_size", 0) if leader else 0,
            "active_projects": 0,
            "health_score": 75 if leader else 0
        }
        
        verticals.append({
            "code": vertical.value,
            "name": config["name"],
            "mission": config["mission"],
            "icon": config["icon"],
            "color": config["color"],
            "description": config["description"],
            "kata_focus": config["kata_focus"],
            "key_metrics": config["key_metrics"],
            "leader": leader,
            "metrics": metrics
        })
    
    return {"verticals": verticals, "total": len(verticals)}

@router.get("/vertical/{vertical_code}")
async def get_vertical_details(vertical_code: str):
    """Get detailed information for a specific vertical"""
    try:
        vertical = BusinessVertical(vertical_code)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Vertical {vertical_code} not found")
    
    config = VERTICAL_CONFIG[vertical]
    
    # Get leader
    leader = None
    if db is not None:
        leader_doc = await db.vertical_leaders.find_one(
            {"vertical": vertical.value, "status": "active"},
            {"_id": 0}
        )
        if leader_doc:
            leader = leader_doc
    
    # Get kata system for this vertical
    kata_modules = []
    for kata_num, kata_info in KATA_SYSTEM.items():
        kata_modules.append({
            "kata_number": kata_num,
            "name": kata_info["name"],
            "duration": kata_info["duration"],
            "objectives": kata_info["objectives"],
            "deliverables": kata_info["deliverables"],
            "vertical_context": config["kata_focus"][0] if config["kata_focus"] else "General"
        })
    
    return {
        "vertical": {
            "code": vertical.value,
            "name": config["name"],
            "mission": config["mission"],
            "icon": config["icon"],
            "color": config["color"],
            "description": config["description"],
            "kata_focus": config["kata_focus"]
        },
        "leader": leader,
        "kata_system": kata_modules,
        "cached_responses": {
            "welcome": CACHED_ONBOARDING_RESPONSES["welcome"].get(vertical.value, ""),
            "first_task": CACHED_ONBOARDING_RESPONSES["first_task"].get(vertical.value, ""),
            "kata_tips": CACHED_ONBOARDING_RESPONSES["kata_tips"].get(vertical.value, "")
        }
    }

class AssignLeaderRequest(BaseModel):
    vertical: str
    leader_name: str
    leader_phone: str
    leader_email: Optional[str] = None
    designation: str = "Vertical Director"

@router.post("/assign-leader")
async def assign_vertical_leader(request: AssignLeaderRequest):
    """Assign a leader to a business vertical"""
    try:
        vertical = BusinessVertical(request.vertical)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid vertical: {request.vertical}")
    
    # Create leader assignment
    leader = LeaderAssignment(
        vertical=vertical,
        leader_name=request.leader_name,
        leader_phone=request.leader_phone,
        leader_email=request.leader_email,
        designation=request.designation
    )
    
    if db is not None:
        # Deactivate any existing leader for this vertical
        await db.vertical_leaders.update_many(
            {"vertical": vertical.value, "status": "active"},
            {"$set": {"status": "replaced"}}
        )
        
        # Insert new leader
        await db.vertical_leaders.insert_one(leader.model_dump())
    
    return {
        "success": True,
        "message": f"Leader assigned to {VERTICAL_CONFIG[vertical]['name']}",
        "leader": leader.model_dump(),
        "next_step": "Start onboarding via /api/captain/onboarding/start"
    }

@router.get("/leaders")
async def get_all_leaders():
    """Get all assigned vertical leaders"""
    leaders = []
    
    if db is not None:
        cursor = db.vertical_leaders.find({"status": "active"}, {"_id": 0})
        async for doc in cursor:
            leaders.append(doc)
    
    return {"leaders": leaders, "total": len(leaders)}

class StartOnboardingRequest(BaseModel):
    user_id: str
    user_name: str
    vertical: str

@router.post("/onboarding/start")
async def start_onboarding(request: StartOnboardingRequest):
    """Start AI-powered onboarding for a new vertical leader or team member"""
    try:
        vertical = BusinessVertical(request.vertical)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid vertical: {request.vertical}")
    
    config = VERTICAL_CONFIG[vertical]
    
    # Create onboarding session
    session = OnboardingSession(
        user_id=request.user_id,
        user_name=request.user_name,
        vertical=vertical
    )
    
    # Add cached welcome response
    welcome_msg = CACHED_ONBOARDING_RESPONSES["welcome"].get(vertical.value, 
        f"Welcome to {config['name']}! Your mission: {config['mission']}")
    
    session.ai_conversations.append({
        "role": "assistant",
        "content": welcome_msg,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": "cached"
    })
    
    session.cached_responses = {
        "welcome": welcome_msg,
        "first_task": CACHED_ONBOARDING_RESPONSES["first_task"].get(vertical.value, ""),
        "kata_tips": CACHED_ONBOARDING_RESPONSES["kata_tips"].get(vertical.value, "")
    }
    
    if db is not None:
        await db.onboarding_sessions.insert_one(session.model_dump())
    
    return {
        "success": True,
        "session_id": session.id,
        "vertical": vertical.value,
        "welcome_message": welcome_msg,
        "first_kata": KATA_SYSTEM[1],
        "first_task": session.cached_responses["first_task"],
        "tips": session.cached_responses["kata_tips"]
    }

class OnboardingChatRequest(BaseModel):
    session_id: str
    message: str
    use_ai: bool = True  # False = use cached responses only

@router.post("/onboarding/chat")
async def onboarding_chat(request: OnboardingChatRequest):
    """Chat with AI onboarding assistant (hybrid: AI when online, cached when offline)"""
    
    # Get session
    session_doc = None
    if db is not None:
        session_doc = await db.onboarding_sessions.find_one(
            {"id": request.session_id},
            {"_id": 0}
        )
    
    if not session_doc:
        raise HTTPException(status_code=404, detail="Onboarding session not found")
    
    vertical = session_doc.get("vertical", "B2C")
    config = VERTICAL_CONFIG.get(BusinessVertical(vertical), VERTICAL_CONFIG[BusinessVertical.B2C])
    
    # Determine response source
    response_content = ""
    response_source = "cached"
    
    # Check for keyword matches in cached responses
    message_lower = request.message.lower()
    
    if any(word in message_lower for word in ["task", "first", "mission", "start", "begin"]):
        response_content = CACHED_ONBOARDING_RESPONSES["first_task"].get(vertical, "")
        response_source = "cached"
    elif any(word in message_lower for word in ["tip", "advice", "help", "stuck"]):
        response_content = CACHED_ONBOARDING_RESPONSES["kata_tips"].get(vertical, "")
        response_source = "cached"
    elif any(word in message_lower for word in ["kata", "progress", "next", "stage"]):
        current_kata = session_doc.get("current_kata", 1)
        kata_info = KATA_SYSTEM.get(current_kata, KATA_SYSTEM[1])
        response_content = f"You're on Kata {current_kata}: {kata_info['name']}. Objectives: {', '.join(kata_info['objectives'][:2])}. Deliverables needed: {', '.join(kata_info['deliverables'][:2])}"
        response_source = "cached"
    elif request.use_ai:
        # Try AI response (would integrate with LLM here)
        # For now, generate contextual cached response
        response_content = f"As the {config['mission']} lead, here's my guidance: Focus on {config['kata_focus'][0]}. Your key metrics are: {', '.join(config['key_metrics'])}. What specific challenge are you facing?"
        response_source = "ai_fallback"
    else:
        response_content = f"I'm your onboarding guide for {config['name']}. Ask me about: your first task, kata progress, or tips for success."
        response_source = "cached"
    
    # Store conversation
    if db is not None:
        await db.onboarding_sessions.update_one(
            {"id": request.session_id},
            {"$push": {
                "ai_conversations": {
                    "$each": [
                        {"role": "user", "content": request.message, "timestamp": datetime.now(timezone.utc).isoformat()},
                        {"role": "assistant", "content": response_content, "timestamp": datetime.now(timezone.utc).isoformat(), "source": response_source}
                    ]
                }
            }}
        )
    
    return {
        "response": response_content,
        "source": response_source,
        "session_id": request.session_id,
        "is_offline_capable": response_source == "cached"
    }

class UpdateKataProgressRequest(BaseModel):
    session_id: str
    kata_number: int
    completed_modules: List[str] = []

@router.post("/onboarding/progress")
async def update_kata_progress(request: UpdateKataProgressRequest):
    """Update onboarding kata progress"""
    
    if request.kata_number < 1 or request.kata_number > 4:
        raise HTTPException(status_code=400, detail="Kata number must be 1-4")
    
    status = OnboardingStatus.IN_PROGRESS
    if request.kata_number == 1:
        status = OnboardingStatus.KATA_1
    elif request.kata_number == 2:
        status = OnboardingStatus.KATA_2
    elif request.kata_number == 3:
        status = OnboardingStatus.KATA_3
    elif request.kata_number == 4:
        status = OnboardingStatus.ORBIT
    
    if db is not None:
        await db.onboarding_sessions.update_one(
            {"id": request.session_id},
            {"$set": {
                "current_kata": request.kata_number,
                "status": status.value,
                "completed_modules": request.completed_modules
            }}
        )
    
    kata_info = KATA_SYSTEM.get(request.kata_number, KATA_SYSTEM[1])
    next_kata = KATA_SYSTEM.get(request.kata_number + 1) if request.kata_number < 4 else None
    
    return {
        "success": True,
        "current_kata": request.kata_number,
        "status": status.value,
        "kata_info": kata_info,
        "next_kata": next_kata,
        "is_orbit": status == OnboardingStatus.ORBIT,
        "orbit_message": "🎖️ Congratulations! You've achieved ORBIT status - self-sustaining productivity!" if status == OnboardingStatus.ORBIT else None
    }

@router.get("/dashboard-metrics")
async def get_dashboard_metrics():
    """Get overall command centre metrics for the captain"""
    
    metrics = {
        "total_verticals": len(BusinessVertical),
        "leaders_assigned": 0,
        "total_team_size": 0,
        "onboarding_in_progress": 0,
        "orbit_achieved": 0,
        "health_score": 0
    }
    
    if db is not None:
        # Count assigned leaders
        metrics["leaders_assigned"] = await db.vertical_leaders.count_documents({"status": "active"})
        
        # Count team sizes
        pipeline = [
            {"$match": {"status": "active"}},
            {"$group": {"_id": None, "total": {"$sum": "$team_size"}}}
        ]
        result = await db.vertical_leaders.aggregate(pipeline).to_list(1)
        if result:
            metrics["total_team_size"] = result[0].get("total", 0)
        
        # Count onboarding sessions
        metrics["onboarding_in_progress"] = await db.onboarding_sessions.count_documents({
            "status": {"$in": ["in_progress", "kata_1", "kata_2", "kata_3"]}
        })
        metrics["orbit_achieved"] = await db.onboarding_sessions.count_documents({"status": "orbit"})
    
    # Calculate health score
    if metrics["total_verticals"] > 0:
        metrics["health_score"] = int((metrics["leaders_assigned"] / metrics["total_verticals"]) * 100)
    
    return {
        "metrics": metrics,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mission_status": "OPERATIONAL" if metrics["health_score"] >= 50 else "BUILDING"
    }

@router.get("/kata-system")
async def get_kata_system():
    """Get the complete 16-Kata onboarding system"""
    return {
        "system_name": "DOERS 16-Kata Onboarding",
        "inspired_by": "Varun Mayya - Company as Organism",
        "philosophy": "Execution failures = Context failures. Build context, enable orbit.",
        "katas": KATA_SYSTEM,
        "orbit_definition": "Self-sustaining productivity with minimal supervision",
        "total_duration": "~2 weeks to orbit"
    }

# ============================================
# MISSION BOARD - Dubai Launch Live Tracker
# ============================================

class MilestoneType(str, Enum):
    LEADER_ASSIGNED = "leader_assigned"
    KATA_STARTED = "kata_started"
    KATA_COMPLETED = "kata_completed"
    ORBIT_ACHIEVED = "orbit_achieved"
    TEAM_EXPANDED = "team_expanded"
    FIRST_WIN = "first_win"

class ActivityLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vertical: str
    milestone_type: MilestoneType
    title: str
    description: str
    leader_name: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    points: int = 0

# Dubai Launch Target Date
DUBAI_LAUNCH_DATE = "2026-01-09T00:00:00+04:00"  # Dubai timezone

@router.get("/mission-board")
async def get_mission_board():
    """Get real-time mission board for Dubai launch - all 7 verticals progress"""
    
    # Calculate days to launch
    launch_date = datetime.fromisoformat(DUBAI_LAUNCH_DATE)
    now = datetime.now(timezone.utc)
    days_to_launch = max(0, (launch_date - now).days)
    hours_to_launch = max(0, int((launch_date - now).total_seconds() / 3600))
    
    # Get vertical progress
    verticals_progress = []
    total_progress = 0
    
    for vertical in BusinessVertical:
        config = VERTICAL_CONFIG[vertical]
        
        # Get leader and their progress
        leader = None
        kata_progress = 0
        status = "vacant"
        team_size = 0
        
        if db is not None:
            leader_doc = await db.vertical_leaders.find_one(
                {"vertical": vertical.value, "status": "active"},
                {"_id": 0}
            )
            if leader_doc:
                leader = leader_doc
                team_size = leader_doc.get("team_size", 0)
                
                # Get onboarding progress
                session = await db.onboarding_sessions.find_one(
                    {"vertical": vertical.value, "status": {"$ne": "not_started"}},
                    {"_id": 0},
                    sort=[("started_at", -1)]
                )
                if session:
                    current_kata = session.get("current_kata", 1)
                    kata_progress = current_kata * 25  # 25% per kata
                    status = session.get("status", "in_progress")
                else:
                    status = "assigned"
                    kata_progress = 10  # Just assigned
        
        # Calculate vertical readiness
        readiness = 0
        if leader:
            readiness += 30  # Leader assigned = 30%
            readiness += kata_progress * 0.5  # Kata progress contributes up to 50%
            readiness += min(team_size * 5, 20)  # Team size contributes up to 20%
        
        verticals_progress.append({
            "code": vertical.value,
            "name": config["name"],
            "icon": config["icon"],
            "color": config["color"],
            "mission": config["mission"],
            "leader_name": leader.get("leader_name") if leader else None,
            "leader_designation": leader.get("designation") if leader else None,
            "status": status,
            "kata_progress": kata_progress,
            "team_size": team_size,
            "readiness_percent": min(100, int(readiness)),
            "is_orbit": status == "orbit"
        })
        
        total_progress += readiness
    
    # Calculate overall launch readiness
    launch_readiness = int(total_progress / len(BusinessVertical))
    
    # Determine mission status
    if launch_readiness >= 90:
        mission_status = "LAUNCH_READY"
        status_color = "#00ff88"
    elif launch_readiness >= 70:
        mission_status = "FINAL_PREP"
        status_color = "#22c55e"
    elif launch_readiness >= 50:
        mission_status = "ON_TRACK"
        status_color = "#eab308"
    elif launch_readiness >= 30:
        mission_status = "ACCELERATE"
        status_color = "#f97316"
    else:
        mission_status = "MOBILIZING"
        status_color = "#ef4444"
    
    return {
        "launch_target": "DUBAI GLOBAL LAUNCH",
        "launch_date": DUBAI_LAUNCH_DATE,
        "days_to_launch": days_to_launch,
        "hours_to_launch": hours_to_launch,
        "countdown_active": days_to_launch > 0,
        "mission_status": mission_status,
        "status_color": status_color,
        "launch_readiness_percent": launch_readiness,
        "verticals_progress": verticals_progress,
        "verticals_ready": sum(1 for v in verticals_progress if v["readiness_percent"] >= 80),
        "verticals_total": len(BusinessVertical),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/mission-board/activity")
async def get_mission_activity():
    """Get recent activity feed for mission board"""
    
    activities = []
    
    if db is not None:
        # Get recent leader assignments
        cursor = db.vertical_leaders.find(
            {"status": "active"},
            {"_id": 0}
        ).sort("assigned_at", -1).limit(10)
        
        async for leader in cursor:
            config = VERTICAL_CONFIG.get(BusinessVertical(leader["vertical"]), {})
            activities.append({
                "id": leader.get("id", str(uuid.uuid4())),
                "type": "leader_assigned",
                "icon": "🎖️",
                "title": f"Leader Assigned to {leader['vertical']}",
                "description": f"{leader['leader_name']} appointed as {leader.get('designation', 'Director')}",
                "vertical": leader["vertical"],
                "vertical_color": config.get("color", "#00ff88"),
                "timestamp": leader.get("assigned_at", datetime.now(timezone.utc).isoformat()),
                "points": 100
            })
        
        # Get recent onboarding milestones
        cursor = db.onboarding_sessions.find(
            {"status": {"$ne": "not_started"}},
            {"_id": 0}
        ).sort("started_at", -1).limit(10)
        
        async for session in cursor:
            config = VERTICAL_CONFIG.get(BusinessVertical(session["vertical"]), {})
            milestone_type = "kata_started"
            icon = "📚"
            points = 50
            
            if session.get("status") == "orbit":
                milestone_type = "orbit_achieved"
                icon = "🚀"
                points = 500
                title = f"ORBIT Achieved! {session['vertical']}"
                desc = f"{session['user_name']} reached self-sustaining productivity"
            else:
                current_kata = session.get("current_kata", 1)
                title = f"Kata {current_kata} Progress - {session['vertical']}"
                desc = f"{session['user_name']} advancing through onboarding"
            
            activities.append({
                "id": session.get("id", str(uuid.uuid4())),
                "type": milestone_type,
                "icon": icon,
                "title": title,
                "description": desc,
                "vertical": session["vertical"],
                "vertical_color": config.get("color", "#00ff88"),
                "timestamp": session.get("started_at", datetime.now(timezone.utc).isoformat()),
                "points": points
            })
    
    # Sort by timestamp and limit
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    activities = activities[:15]
    
    # Calculate total points
    total_points = sum(a["points"] for a in activities)
    
    return {
        "activities": activities,
        "total_activities": len(activities),
        "total_points": total_points,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.post("/mission-board/log-milestone")
async def log_milestone(
    vertical: str,
    milestone_type: str,
    title: str,
    description: str,
    leader_name: Optional[str] = None,
    points: int = 50
):
    """Log a custom milestone to the mission board"""
    
    try:
        v = BusinessVertical(vertical)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid vertical: {vertical}")
    
    activity = ActivityLog(
        vertical=vertical,
        milestone_type=MilestoneType(milestone_type) if milestone_type in [e.value for e in MilestoneType] else MilestoneType.FIRST_WIN,
        title=title,
        description=description,
        leader_name=leader_name,
        points=points
    )
    
    if db is not None:
        await db.mission_activities.insert_one(activity.model_dump())
    
    return {
        "success": True,
        "activity": activity.model_dump(),
        "message": "Milestone logged to mission board"
    }

@router.get("/mission-board/leaderboard")
async def get_vertical_leaderboard():
    """Get leaderboard ranking verticals by readiness"""
    
    board = await get_mission_board()
    
    # Sort verticals by readiness
    ranked = sorted(
        board["verticals_progress"],
        key=lambda x: (x["readiness_percent"], x["kata_progress"]),
        reverse=True
    )
    
    # Add rankings
    for i, v in enumerate(ranked):
        v["rank"] = i + 1
        if i == 0:
            v["badge"] = "🥇"
        elif i == 1:
            v["badge"] = "🥈"
        elif i == 2:
            v["badge"] = "🥉"
        else:
            v["badge"] = f"#{i+1}"
    
    return {
        "leaderboard": ranked,
        "leader_vertical": ranked[0]["code"] if ranked else None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Notification payload model
class NotificationPayload(BaseModel):
    type: str  # orbit, readiness, leader, kata, countdown, win
    vertical: Optional[str] = None
    leader_name: Optional[str] = None
    percentage: Optional[int] = None
    kata_number: Optional[int] = None
    days_remaining: Optional[int] = None
    description: Optional[str] = None

@router.post("/notifications/trigger")
async def trigger_notification(payload: NotificationPayload):
    """Manually trigger a notification (for testing or admin use)"""
    
    notification_data = {
        "type": payload.type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "should_notify": True
    }
    
    if payload.type == "orbit":
        notification_data["title"] = f"🚀 ORBIT ACHIEVED - {payload.vertical}!"
        notification_data["body"] = f"{payload.leader_name or 'Team'} has reached self-sustaining productivity!"
        notification_data["priority"] = "high"
        
    elif payload.type == "readiness":
        notification_data["title"] = f"📈 {payload.vertical} at {payload.percentage}% Readiness!"
        notification_data["body"] = f"Almost there! {payload.vertical} is ready for Dubai launch!"
        notification_data["priority"] = "medium"
        
    elif payload.type == "leader":
        notification_data["title"] = f"🎖️ New Leader: {payload.vertical}"
        notification_data["body"] = f"{payload.leader_name} has been assigned to lead {payload.vertical}"
        notification_data["priority"] = "medium"
        
    elif payload.type == "kata":
        notification_data["title"] = f"📚 Kata {payload.kata_number} Complete - {payload.vertical}"
        notification_data["body"] = f"{payload.leader_name or 'Team'} has completed Kata {payload.kata_number}"
        notification_data["priority"] = "low"
        
    elif payload.type == "countdown":
        if payload.days_remaining == 0:
            notification_data["title"] = "🚀 DUBAI LAUNCH DAY!"
            notification_data["body"] = "The moment is here! HI AI APP is launching globally!"
        else:
            notification_data["title"] = f"⏰ {payload.days_remaining} Days to Dubai Launch!"
            notification_data["body"] = "Check the Mission Board to see team progress."
        notification_data["priority"] = "high" if payload.days_remaining <= 1 else "medium"
        
    elif payload.type == "win":
        notification_data["title"] = f"🏆 First Win - {payload.vertical}!"
        notification_data["body"] = payload.description or "A major milestone has been achieved!"
        notification_data["priority"] = "medium"
    
    # Store notification in DB for history
    if db is not None:
        await db.notifications.insert_one(notification_data)
    
    return {
        "success": True,
        "notification": notification_data,
        "message": "Notification triggered successfully"
    }

@router.get("/notifications/history")
async def get_notification_history(limit: int = 20):
    """Get notification history"""
    
    notifications = []
    
    if db is not None:
        cursor = db.notifications.find(
            {},
            {"_id": 0}
        ).sort("timestamp", -1).limit(limit)
        
        async for doc in cursor:
            notifications.append(doc)
    
    return {
        "notifications": notifications,
        "total": len(notifications),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/notifications/settings")
async def get_notification_settings():
    """Get notification settings and supported types"""
    
    return {
        "supported_types": [
            {"type": "orbit", "description": "ORBIT status achieved", "priority": "high"},
            {"type": "readiness", "description": "80%+ readiness milestone", "priority": "medium"},
            {"type": "leader", "description": "New leader assigned", "priority": "medium"},
            {"type": "kata", "description": "Kata completion", "priority": "low"},
            {"type": "countdown", "description": "Launch countdown alerts", "priority": "high"},
            {"type": "win", "description": "First win achievements", "priority": "medium"}
        ],
        "auto_notify": True,
        "check_interval_seconds": 60
    }


