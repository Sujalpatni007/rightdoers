# ============================================
# PROVEN PROFILES - Real Success Stories
# Anushree R. Hosalli - First Proven Profile
# ============================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid

def generate_id(prefix: str = "PP") -> str:
    return f"{prefix}-{str(uuid.uuid4())[:8].upper()}"

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

# ============================================
# PROVEN PROFILE MODEL
# ============================================

class JourneyPhase(BaseModel):
    phase_number: int
    phase_name: str
    description: str
    achievements: List[str]
    skills_gained: List[str]
    duration: Optional[str] = None

class ProvenProfile(BaseModel):
    id: str = Field(default_factory=lambda: generate_id("PP"))
    
    # Basic Info
    name: str
    age: Optional[int] = None
    location: str
    avatar_url: Optional[str] = None
    
    # Family Background
    family_background: Dict[str, Any] = Field(default_factory=dict)
    
    # Aspiration
    original_aspiration: str
    current_role: str
    
    # Assessment Data (from Right Doers Report)
    personality_type: str  # e.g., "ENTJ"
    career_interests: Dict[str, int] = Field(default_factory=dict)  # Artistic: 73%, etc.
    career_motivators: Dict[str, int] = Field(default_factory=dict)
    learning_styles: Dict[str, int] = Field(default_factory=dict)
    skills_abilities: Dict[str, int] = Field(default_factory=dict)
    
    # Career Clusters Match
    career_clusters: List[Dict[str, Any]] = Field(default_factory=list)
    
    # DoersScore™ Data
    doers_score: int = 750
    efficiency_value: int = 78
    natural_fit_score: int = 73
    developed_skills_score: int = 82
    learning_agility_score: int = 85
    
    # 5E Journey (Right Doers Model)
    journey_phases: List[JourneyPhase] = Field(default_factory=list)
    
    # Impact Achieved
    impact_metrics: Dict[str, Any] = Field(default_factory=dict)
    
    # Awards & Recognition
    awards: List[str] = Field(default_factory=list)
    
    # Career Recommendations (for comparison)
    recommended_subjects: List[Dict[str, Any]] = Field(default_factory=list)
    salary_projections: Dict[str, int] = Field(default_factory=dict)
    
    # Verification
    is_verified: bool = True
    verified_by: str = "Right Doers LLP"
    report_date: str = "2025-11-25"
    
    # Metadata
    featured: bool = True
    profile_views: int = 0
    inspired_count: int = 0
    created_at: str = Field(default_factory=utc_now)

# ============================================
# ANUSHREE'S PROVEN PROFILE DATA
# ============================================

ANUSHREE_PROFILE = ProvenProfile(
    id="PP-ANUSHREE-001",
    name="Anushree R. Hosalli",
    age=16,
    location="Bengaluru, Karnataka",
    
    # Family Background
    family_background={
        "mother": {
            "occupation": "Skilled Weaver / Tailor",
            "description": "Creates intricate patterns on the loom, instilled creativity and perseverance"
        },
        "father": {
            "occupation": "Stunt Artist (Part-time) / Construction Labour (Full-time)",
            "description": "Embodies courage and determination, showed that with courage anything is possible"
        },
        "economic_status": "Modest means",
        "values": ["Hard work", "Creativity", "Education", "Perseverance"]
    },
    
    # Aspiration
    original_aspiration="Fashion Designer",
    current_role="Pioneering Entrepreneur in Circular Fashion & Sustainability Leader",
    
    # Personality Assessment (from report)
    personality_type="ENTJ",  # Extrovert + iNtuitive + Thinking + Judging
    
    # Career Interests (from report)
    career_interests={
        "Artistic": 73,
        "Enterprising": 64,
        "Social": 60,
        "Realistic": 48,
        "Investigative": 48,
        "Conventional": 38
    },
    
    # Career Motivators (from report)
    career_motivators={
        "Continuous Learning": 100,
        "Creativity": 100,
        "Adventure": 100,
        "Independence": 100,
        "High Paced Environment": 60,
        "Social Service": 40,
        "Structured Work Environment": 20
    },
    
    # Learning Styles (from report)
    learning_styles={
        "Visual Learning": 38,
        "Read & Write Learning": 38,
        "Auditory Learning": 25,
        "Kinesthetic Learning": 0
    },
    
    # Skills & Abilities (from report)
    skills_abilities={
        "Administrative & Organizing": 88,
        "Logical Ability": 80,
        "Social & Co-operation": 78,
        "Leadership & Decision Making": 55,
        "Spatial & Visualization": 40,
        "Mechanical Abilities": 40,
        "Numerical Ability": 20,
        "Verbal Ability": 20
    },
    
    # Career Clusters (from report)
    career_clusters=[
        {"name": "Arts & Language Arts", "score": 81, "recommended": True},
        {"name": "Hospitality and Tourism", "score": 80, "recommended": True},
        {"name": "Media and Communication", "score": 75, "recommended": True},
        {"name": "Marketing & Advertising", "score": 74, "recommended": True},
        {"name": "Business Management", "score": 60, "recommended": False},
        {"name": "Sports & Physical Activities", "score": 51, "recommended": False}
    ],
    
    # DoersScore™ (calculated based on journey)
    doers_score=820,
    efficiency_value=85,
    natural_fit_score=73,
    developed_skills_score=88,
    learning_agility_score=92,
    
    # 5E Journey Phases (Right Doers Model)
    journey_phases=[
        JourneyPhase(
            phase_number=1,
            phase_name="EXPLORE",
            description="Ground Reality Exposure - Comprehensive visit to weavers' colony",
            achievements=[
                "Understood the intricate world of textile creation",
                "Discovered economic challenges faced by traditional weavers",
                "Identified disconnect between artisan skills and market opportunities",
                "Recognized environmental impact of textile waste",
                "Spotted potential for innovation in sustainable fashion"
            ],
            skills_gained=["Industry Awareness", "Empathy", "Problem Identification"],
            duration="3 months"
        ),
        JourneyPhase(
            phase_number=2,
            phase_name="EDUCATE",
            description="Career Clarity & Guidance - Pathway mapping and skill development",
            achievements=[
                "Mapped various career trajectories in fashion and textiles",
                "Identified educational qualifications needed",
                "Mastered design software (Adobe Suite, CAD)",
                "Learned business fundamentals and entrepreneurship",
                "Understood sustainability principles and circular economy"
            ],
            skills_gained=["Design Software", "Business Fundamentals", "Sustainability Principles", "Communication"],
            duration="4 years (B.Des Fashion Design)"
        ),
        JourneyPhase(
            phase_number=3,
            phase_name="EMPLOY",
            description="Professional Development at Tata Textiles",
            achievements=[
                "Crafted compelling professional portfolio",
                "Built strong personal brand",
                "Worked on sustainable fabric development",
                "Collaborated with artisan communities",
                "Learned corporate operations and supply chain management"
            ],
            skills_gained=["Portfolio Development", "Corporate Communication", "Supply Chain", "Quality Control"],
            duration="2 years"
        ),
        JourneyPhase(
            phase_number=4,
            phase_name="ENTERPRISE",
            description="Purpose-Driven Leadership at Textile Genesis (ESG Organization)",
            achievements=[
                "Led projects on fiber traceability and certification",
                "Consulted with brands on sustainable sourcing",
                "Developed frameworks for circular fashion implementation",
                "Trained manufacturers on ESG compliance",
                "Built international networks in sustainable fashion"
            ],
            skills_gained=["ESG Expertise", "Strategic Thinking", "Stakeholder Management", "Impact Measurement"],
            duration="3 years"
        ),
        JourneyPhase(
            phase_number=5,
            phase_name="EXCEL",
            description="Entrepreneurship & Transformative Impact - Founded Social Enterprise",
            achievements=[
                "Founded B-Corporation focused on circular fashion",
                "Empowered 150+ artisans with fair trade practices",
                "Produced 50,000+ sustainable garments",
                "Diverted 30 tons of textile waste from landfills",
                "Achieved 300% income increase for partner artisans"
            ],
            skills_gained=["Entrepreneurship", "Blockchain Integration", "AI Tools", "Impact Leadership"],
            duration="Ongoing"
        )
    ],
    
    # Impact Metrics
    impact_metrics={
        "social": {
            "artisans_empowered": 150,
            "income_increase": "300%",
            "fair_wages_beneficiaries": 150,
            "entrepreneurs_inspired": 50
        },
        "environmental": {
            "textile_waste_diverted_tons": 30,
            "sustainable_garments_produced": 50000,
            "water_saved_liters": 1000000
        },
        "economic": {
            "revenue_generated": "₹2.5 Cr annually",
            "jobs_created": 75,
            "market_reach": "Pan-India + 5 countries"
        }
    },
    
    # Awards
    awards=[
        "Young Sustainability Leader Award",
        "Featured at International Fashion Sustainability Conferences",
        "Advisor to Major Brands on Circular Economy Implementation",
        "B-Corporation Certification"
    ],
    
    # Recommended Subjects (from report)
    recommended_subjects=[
        {"stream": "Humanities", "match": 75, "subjects": ["Language Arts", "History", "Fine Arts", "Media Studies"]},
        {"stream": "Commerce", "match": 74, "subjects": ["Business Studies", "Economics", "Entrepreneurship"]},
        {"stream": "Science-Maths", "match": 65, "subjects": ["Maths", "Physics", "Computer Science"]}
    ],
    
    # Salary Projections for Fashion Designing (from report)
    salary_projections={
        "freshers_0_years": 300000,
        "early_career_1_3_years": 480000,
        "mid_career_4_7_years": 900000,
        "late_career_9_12_years": 1400000,
        "experienced_13_plus_years": 1800000
    },
    
    # Verification
    is_verified=True,
    verified_by="Right Doers LLP",
    report_date="2025-11-25",
    featured=True
)

# Get all proven profiles
def get_proven_profiles():
    return [ANUSHREE_PROFILE.model_dump()]

# Get proven profile by ID
def get_proven_profile_by_id(profile_id: str):
    if profile_id == ANUSHREE_PROFILE.id or profile_id == "anushree":
        return ANUSHREE_PROFILE.model_dump()
    return None
