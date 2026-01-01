# ============================================
# AI JOB MATCHER - DoersScore™ Based Matching
# Matches profiles to jobs using AI
# ============================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import logging
import os

logger = logging.getLogger(__name__)

# ============================================
# MATCH RESULT MODEL
# ============================================

class JobMatchResult(BaseModel):
    job_id: str
    job_title: str
    company_name: str
    
    # Match Scores
    overall_match_score: int  # 0-100
    skill_match_score: int
    interest_match_score: int
    level_match_score: int
    salary_match_score: int
    
    # Reasons
    match_reasons: List[str] = Field(default_factory=list)
    improvement_suggestions: List[str] = Field(default_factory=list)
    
    # Recommendation
    recommendation: str  # "perfect_match", "good_match", "stretch_role", "develop_first"
    confidence: float = 0.0

class ProfileMatchInput(BaseModel):
    # DoersScore™ Data
    doers_score: int = 650
    efficiency_value: int = 70
    adaptive_level: str = "ASSOCIATE"  # PARA, ASSOCIATE, MANAGER, PROFESSIONAL, EXPERT
    
    # Career Interests (RIASEC)
    career_interests: Dict[str, int] = Field(default_factory=dict)
    
    # Skills & Abilities
    skills: List[str] = Field(default_factory=list)
    skills_scores: Dict[str, int] = Field(default_factory=dict)
    
    # Career Clusters
    career_clusters: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Preferences
    preferred_location: str = "India"
    salary_expectation_min: Optional[int] = None
    salary_expectation_max: Optional[int] = None
    open_to_remote: bool = True

# ============================================
# AI MATCHER SERVICE
# ============================================

class AIJobMatcher:
    """
    AI-powered job matching based on DoersScore™ and profile data
    """
    
    # Skill keyword mapping
    SKILL_KEYWORDS = {
        "Fashion Design": ["fashion", "design", "apparel", "clothing", "textile", "garment"],
        "Software Development": ["software", "developer", "programming", "coding", "engineer"],
        "Data Analysis": ["data", "analyst", "analytics", "statistics", "excel", "sql"],
        "Marketing": ["marketing", "advertising", "brand", "digital", "social media"],
        "Management": ["manager", "management", "lead", "supervisor", "director"],
        "Sales": ["sales", "business development", "account", "client"],
        "Healthcare": ["health", "medical", "nursing", "hospital", "patient"],
        "Education": ["teacher", "education", "training", "instructor", "tutor"],
        "Finance": ["finance", "accounting", "banking", "investment", "financial"],
        "Engineering": ["engineer", "mechanical", "electrical", "civil", "technical"]
    }
    
    # Interest to job type mapping
    INTEREST_TO_JOB_TYPE = {
        "Artistic": ["designer", "creative", "artist", "writer", "content"],
        "Enterprising": ["manager", "sales", "business", "executive", "entrepreneur"],
        "Social": ["counselor", "teacher", "hr", "social", "community"],
        "Realistic": ["engineer", "technician", "mechanic", "operator", "driver"],
        "Investigative": ["researcher", "analyst", "scientist", "data", "investigator"],
        "Conventional": ["accountant", "administrator", "clerk", "assistant", "coordinator"]
    }
    
    # Level mapping
    LEVEL_TO_EXPERIENCE = {
        "PARA": (0, 1),
        "ASSOCIATE": (1, 3),
        "MANAGER": (3, 6),
        "PROFESSIONAL": (6, 10),
        "EXPERT": (10, 20)
    }
    
    def calculate_skill_match(self, profile_skills: List[str], job_skills: List[str], job_title: str, job_description: str) -> tuple[int, List[str]]:
        """Calculate skill match score and reasons"""
        
        if not job_skills:
            # Extract skills from title and description
            job_text = f"{job_title} {job_description}".lower()
            matched_keywords = []
            
            for skill in profile_skills:
                skill_lower = skill.lower()
                if skill_lower in job_text:
                    matched_keywords.append(skill)
                else:
                    # Check skill keywords
                    for category, keywords in self.SKILL_KEYWORDS.items():
                        if skill_lower in category.lower() or any(kw in skill_lower for kw in keywords):
                            if any(kw in job_text for kw in keywords):
                                matched_keywords.append(skill)
                                break
            
            if not profile_skills:
                return 50, ["Skills not specified - general match"]
            
            match_score = min(100, (len(matched_keywords) / max(1, len(profile_skills))) * 100)
            reasons = [f"Matched skill: {skill}" for skill in matched_keywords[:5]]
            return int(match_score), reasons
        
        # Direct skill comparison
        profile_skills_lower = [s.lower() for s in profile_skills]
        job_skills_lower = [s.lower() for s in job_skills]
        
        matched = []
        for skill in profile_skills_lower:
            for job_skill in job_skills_lower:
                if skill in job_skill or job_skill in skill:
                    matched.append(skill)
                    break
        
        match_score = min(100, (len(matched) / max(1, len(job_skills_lower))) * 100)
        reasons = [f"Matched skill: {skill}" for skill in matched[:5]]
        
        return int(match_score), reasons
    
    def calculate_interest_match(self, career_interests: Dict[str, int], job_title: str, job_description: str) -> tuple[int, List[str]]:
        """Calculate interest match score"""
        
        if not career_interests:
            return 50, ["Career interests not specified"]
        
        job_text = f"{job_title} {job_description}".lower()
        
        # Find matching interests
        matched_interests = []
        total_score = 0
        
        for interest, score in career_interests.items():
            if score >= 50:  # Only consider significant interests
                keywords = self.INTEREST_TO_JOB_TYPE.get(interest, [])
                if any(kw in job_text for kw in keywords):
                    matched_interests.append((interest, score))
                    total_score += score
        
        if not matched_interests:
            return 30, ["Job doesn't align with top career interests"]
        
        # Calculate weighted score
        avg_interest_score = total_score / len(matched_interests)
        match_score = int(avg_interest_score)
        
        reasons = [f"Aligns with {interest} interest ({score}%)" for interest, score in matched_interests[:3]]
        
        return match_score, reasons
    
    def calculate_level_match(self, adaptive_level: str, job_experience_years: Optional[int], job_level: str) -> tuple[int, List[str]]:
        """Calculate experience level match"""
        
        profile_exp_range = self.LEVEL_TO_EXPERIENCE.get(adaptive_level, (0, 5))
        profile_avg_exp = (profile_exp_range[0] + profile_exp_range[1]) / 2
        
        if job_experience_years is None:
            return 70, ["Experience requirement not specified"]
        
        # Calculate match
        exp_diff = abs(profile_avg_exp - job_experience_years)
        
        if exp_diff <= 1:
            return 100, [f"Perfect experience match: {adaptive_level} level"]
        elif exp_diff <= 2:
            return 80, [f"Good experience match: {adaptive_level} level"]
        elif exp_diff <= 3:
            return 60, [f"Stretch role: May need skill development"]
        else:
            return 40, [f"Significant experience gap: Consider skill building first"]
    
    def calculate_salary_match(
        self, 
        salary_expectation_min: Optional[int],
        salary_expectation_max: Optional[int],
        job_salary_min: Optional[int],
        job_salary_max: Optional[int]
    ) -> tuple[int, List[str]]:
        """Calculate salary match"""
        
        if not job_salary_min and not job_salary_max:
            return 50, ["Salary not disclosed"]
        
        if not salary_expectation_min:
            return 70, ["Salary expectations not set - job offers ₹{:,}".format(job_salary_min or 0)]
        
        job_mid = ((job_salary_min or 0) + (job_salary_max or job_salary_min or 0)) / 2
        exp_mid = (salary_expectation_min + (salary_expectation_max or salary_expectation_min * 1.3)) / 2
        
        if job_mid >= exp_mid:
            return 100, ["Salary meets or exceeds expectations"]
        elif job_mid >= exp_mid * 0.8:
            return 80, ["Salary slightly below expectations but competitive"]
        elif job_mid >= exp_mid * 0.6:
            return 50, ["Salary below expectations - consider for growth opportunities"]
        else:
            return 30, ["Salary significantly below expectations"]
    
    def match_job_to_profile(self, profile: ProfileMatchInput, job: Dict[str, Any]) -> JobMatchResult:
        """
        Calculate comprehensive match score for a job
        """
        
        # Extract job data
        job_title = job.get("title", "")
        job_description = job.get("description", "")
        job_skills = job.get("required_skills", [])
        job_exp_years = job.get("required_experience_years")
        job_level = job.get("experience_level", "entry")
        job_salary_min = job.get("salary_min")
        job_salary_max = job.get("salary_max")
        
        # Calculate individual scores
        skill_score, skill_reasons = self.calculate_skill_match(
            profile.skills, job_skills, job_title, job_description
        )
        
        interest_score, interest_reasons = self.calculate_interest_match(
            profile.career_interests, job_title, job_description
        )
        
        level_score, level_reasons = self.calculate_level_match(
            profile.adaptive_level, job_exp_years, job_level
        )
        
        salary_score, salary_reasons = self.calculate_salary_match(
            profile.salary_expectation_min,
            profile.salary_expectation_max,
            job_salary_min,
            job_salary_max
        )
        
        # Calculate overall score (weighted)
        overall_score = int(
            skill_score * 0.35 +
            interest_score * 0.30 +
            level_score * 0.20 +
            salary_score * 0.15
        )
        
        # Boost based on DoersScore
        if profile.doers_score >= 750:
            overall_score = min(100, overall_score + 10)
        elif profile.doers_score >= 650:
            overall_score = min(100, overall_score + 5)
        
        # Combine reasons
        all_reasons = skill_reasons + interest_reasons + level_reasons + salary_reasons
        
        # Generate improvement suggestions
        suggestions = []
        if skill_score < 60:
            suggestions.append("Consider developing skills mentioned in job requirements")
        if interest_score < 50:
            suggestions.append("Explore roles aligned with your top career interests")
        if level_score < 60:
            suggestions.append("Build experience through internships or projects")
        if salary_score < 50:
            suggestions.append("Negotiate based on your DoersScore™ and proven skills")
        
        # Determine recommendation
        if overall_score >= 80:
            recommendation = "perfect_match"
        elif overall_score >= 60:
            recommendation = "good_match"
        elif overall_score >= 40:
            recommendation = "stretch_role"
        else:
            recommendation = "develop_first"
        
        return JobMatchResult(
            job_id=job.get("id", ""),
            job_title=job_title,
            company_name=job.get("company_name", ""),
            overall_match_score=overall_score,
            skill_match_score=skill_score,
            interest_match_score=interest_score,
            level_match_score=level_score,
            salary_match_score=salary_score,
            match_reasons=all_reasons[:7],
            improvement_suggestions=suggestions,
            recommendation=recommendation,
            confidence=min(0.95, overall_score / 100)
        )
    
    def rank_jobs_for_profile(self, profile: ProfileMatchInput, jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Rank all jobs by match score for a profile
        Returns jobs with match data attached
        """
        
        matched_jobs = []
        
        for job in jobs:
            match_result = self.match_job_to_profile(profile, job)
            
            # Attach match data to job
            job_with_match = {
                **job,
                "match_score": match_result.overall_match_score,
                "skill_match": match_result.skill_match_score,
                "interest_match": match_result.interest_match_score,
                "level_match": match_result.level_match_score,
                "salary_match": match_result.salary_match_score,
                "match_reasons": match_result.match_reasons,
                "improvement_suggestions": match_result.improvement_suggestions,
                "recommendation": match_result.recommendation
            }
            
            matched_jobs.append(job_with_match)
        
        # Sort by match score (descending)
        matched_jobs.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matched_jobs

# Singleton instance
ai_matcher = AIJobMatcher()
