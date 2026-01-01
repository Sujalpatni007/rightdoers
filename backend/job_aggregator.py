# ============================================
# JOB AGGREGATOR - Multi-Source Job Fetching
# Sources: JSearch (LinkedIn/Indeed/Glassdoor), Adzuna, Mercor
# ============================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import httpx
import asyncio
import logging
import os

logger = logging.getLogger(__name__)

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()

# ============================================
# JOB LISTING MODEL (Unified)
# ============================================

class AggregatedJob(BaseModel):
    id: str
    source: str  # jsearch, adzuna, mercor, naukri, internal
    source_job_id: str
    
    # Basic Info
    title: str
    company_name: str
    company_logo: Optional[str] = None
    
    # Location
    location: str
    is_remote: bool = False
    country: str = "India"
    
    # Job Details
    description: str
    job_type: str = "full-time"  # full-time, part-time, contract, internship
    experience_level: str = "entry"  # entry, mid, senior, executive
    
    # Salary
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "INR"
    salary_period: str = "yearly"  # yearly, monthly, hourly
    
    # Requirements
    required_skills: List[str] = Field(default_factory=list)
    required_experience_years: Optional[int] = None
    required_education: Optional[str] = None
    
    # For AI Matching
    match_score: Optional[int] = None  # Calculated based on DoersScore
    match_reasons: List[str] = Field(default_factory=list)
    
    # URLs
    apply_url: str
    source_url: Optional[str] = None
    
    # Metadata
    posted_date: Optional[str] = None
    expires_date: Optional[str] = None
    applicants_count: Optional[int] = None
    
    # Timestamps
    fetched_at: str = Field(default_factory=utc_now)

# ============================================
# JSEARCH API (RapidAPI) - LinkedIn/Indeed/Glassdoor
# ============================================

class JSearchClient:
    """
    JSearch API from RapidAPI - Aggregates jobs from LinkedIn, Indeed, Glassdoor, ZipRecruiter
    Free tier: 100 requests/month
    """
    
    BASE_URL = "https://jsearch.p.rapidapi.com"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("RAPIDAPI_KEY", "")
        self.headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
    
    async def search_jobs(
        self,
        query: str,
        location: str = "India",
        page: int = 1,
        num_pages: int = 1,
        date_posted: str = "all",  # all, today, 3days, week, month
        remote_only: bool = False,
        employment_types: Optional[str] = None  # FULLTIME, PARTTIME, CONTRACTOR, INTERN
    ) -> List[AggregatedJob]:
        """Search jobs from JSearch API"""
        
        if not self.api_key:
            logger.warning("JSearch API key not configured")
            return []
        
        try:
            params = {
                "query": f"{query} in {location}",
                "page": str(page),
                "num_pages": str(num_pages),
                "date_posted": date_posted,
            }
            
            if remote_only:
                params["remote_jobs_only"] = "true"
            
            if employment_types:
                params["employment_types"] = employment_types
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.BASE_URL}/search",
                    headers=self.headers,
                    params=params
                )
                
                if response.status_code != 200:
                    logger.error(f"JSearch API error: {response.status_code}")
                    return []
                
                data = response.json()
                jobs = []
                
                for job_data in data.get("data", []):
                    try:
                        job = AggregatedJob(
                            id=f"jsearch_{job_data.get('job_id', '')}",
                            source="jsearch",
                            source_job_id=job_data.get("job_id", ""),
                            title=job_data.get("job_title", ""),
                            company_name=job_data.get("employer_name", ""),
                            company_logo=job_data.get("employer_logo"),
                            location=job_data.get("job_city", "") or job_data.get("job_country", "India"),
                            is_remote=job_data.get("job_is_remote", False),
                            country=job_data.get("job_country", "India"),
                            description=job_data.get("job_description", "")[:2000],
                            job_type=self._map_employment_type(job_data.get("job_employment_type")),
                            salary_min=job_data.get("job_min_salary"),
                            salary_max=job_data.get("job_max_salary"),
                            salary_currency=job_data.get("job_salary_currency", "INR"),
                            salary_period=job_data.get("job_salary_period", "yearly"),
                            required_skills=job_data.get("job_required_skills", []) or [],
                            required_experience_years=job_data.get("job_required_experience", {}).get("required_experience_in_months", 0) // 12 if job_data.get("job_required_experience") else None,
                            required_education=job_data.get("job_required_education", {}).get("required_education_level") if job_data.get("job_required_education") else None,
                            apply_url=job_data.get("job_apply_link", ""),
                            source_url=job_data.get("job_google_link"),
                            posted_date=job_data.get("job_posted_at_datetime_utc"),
                            expires_date=job_data.get("job_offer_expiration_datetime_utc")
                        )
                        jobs.append(job)
                    except Exception as e:
                        logger.error(f"Error parsing JSearch job: {e}")
                        continue
                
                return jobs
                
        except Exception as e:
            logger.error(f"JSearch API exception: {e}")
            return []
    
    def _map_employment_type(self, emp_type: Optional[str]) -> str:
        mapping = {
            "FULLTIME": "full-time",
            "PARTTIME": "part-time",
            "CONTRACTOR": "contract",
            "INTERN": "internship"
        }
        return mapping.get(emp_type, "full-time")

# ============================================
# ADZUNA API - Official Job Board Aggregator
# ============================================

class AdzunaClient:
    """
    Adzuna API - Official job aggregator for 16+ countries
    Free tier: 1000 requests/month
    """
    
    BASE_URL = "https://api.adzuna.com/v1/api/jobs"
    
    def __init__(self, app_id: Optional[str] = None, app_key: Optional[str] = None):
        self.app_id = app_id or os.environ.get("ADZUNA_APP_ID", "")
        self.app_key = app_key or os.environ.get("ADZUNA_APP_KEY", "")
    
    async def search_jobs(
        self,
        query: str,
        location: str = "",
        country: str = "in",  # in = India
        page: int = 1,
        results_per_page: int = 20,
        salary_min: Optional[int] = None,
        full_time: bool = False,
        part_time: bool = False
    ) -> List[AggregatedJob]:
        """Search jobs from Adzuna API"""
        
        if not self.app_id or not self.app_key:
            logger.warning("Adzuna API credentials not configured")
            return []
        
        try:
            params = {
                "app_id": self.app_id,
                "app_key": self.app_key,
                "results_per_page": results_per_page,
                "what": query,
            }
            
            if location:
                params["where"] = location
            
            if salary_min:
                params["salary_min"] = salary_min
            
            if full_time:
                params["full_time"] = 1
            
            if part_time:
                params["part_time"] = 1
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{self.BASE_URL}/{country}/search/{page}",
                    params=params
                )
                
                if response.status_code != 200:
                    logger.error(f"Adzuna API error: {response.status_code}")
                    return []
                
                data = response.json()
                jobs = []
                
                for job_data in data.get("results", []):
                    try:
                        job = AggregatedJob(
                            id=f"adzuna_{job_data.get('id', '')}",
                            source="adzuna",
                            source_job_id=str(job_data.get("id", "")),
                            title=job_data.get("title", ""),
                            company_name=job_data.get("company", {}).get("display_name", ""),
                            location=job_data.get("location", {}).get("display_name", ""),
                            is_remote="remote" in job_data.get("title", "").lower(),
                            country="India",
                            description=job_data.get("description", "")[:2000],
                            job_type="full-time",
                            salary_min=int(job_data.get("salary_min")) if job_data.get("salary_min") else None,
                            salary_max=int(job_data.get("salary_max")) if job_data.get("salary_max") else None,
                            salary_currency="INR",
                            salary_period="yearly",
                            apply_url=job_data.get("redirect_url", ""),
                            posted_date=job_data.get("created")
                        )
                        jobs.append(job)
                    except Exception as e:
                        logger.error(f"Error parsing Adzuna job: {e}")
                        continue
                
                return jobs
                
        except Exception as e:
            logger.error(f"Adzuna API exception: {e}")
            return []

# ============================================
# SAMPLE JOBS (For Demo/Fallback)
# ============================================

SAMPLE_INDIAN_JOBS = [
    AggregatedJob(
        id="sample_1",
        source="internal",
        source_job_id="SAMPLE-001",
        title="Fashion Designer",
        company_name="FabIndia",
        location="Bengaluru, Karnataka",
        country="India",
        description="Design contemporary fashion collections inspired by traditional Indian textiles. Work with artisans across India to create sustainable fashion products.",
        job_type="full-time",
        experience_level="mid",
        salary_min=600000,
        salary_max=1200000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Fashion Design", "Adobe Illustrator", "Textile Knowledge", "Trend Analysis"],
        required_experience_years=3,
        required_education="B.Des in Fashion Design",
        apply_url="https://fabindia.com/careers"
    ),
    AggregatedJob(
        id="sample_2",
        source="internal",
        source_job_id="SAMPLE-002",
        title="Sustainable Fashion Consultant",
        company_name="Aditya Birla Fashion",
        location="Mumbai, Maharashtra",
        country="India",
        description="Lead sustainability initiatives across fashion brands. Develop circular economy strategies and ESG compliance frameworks.",
        job_type="full-time",
        experience_level="senior",
        salary_min=1500000,
        salary_max=2500000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Sustainability", "ESG", "Fashion Industry", "Project Management"],
        required_experience_years=5,
        apply_url="https://abfrl.com/careers"
    ),
    AggregatedJob(
        id="sample_3",
        source="internal",
        source_job_id="SAMPLE-003",
        title="Software Developer - React",
        company_name="TCS",
        location="Bengaluru, Karnataka",
        country="India",
        description="Build scalable web applications using React.js and Node.js. Work in agile teams on enterprise projects.",
        job_type="full-time",
        experience_level="entry",
        salary_min=400000,
        salary_max=800000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["React.js", "JavaScript", "Node.js", "Git"],
        required_experience_years=0,
        required_education="B.Tech/BE in Computer Science",
        apply_url="https://tcs.com/careers"
    ),
    AggregatedJob(
        id="sample_4",
        source="internal",
        source_job_id="SAMPLE-004",
        title="Data Analyst",
        company_name="Flipkart",
        location="Bengaluru, Karnataka",
        is_remote=True,
        country="India",
        description="Analyze large datasets to drive business decisions. Create dashboards and reports for stakeholders.",
        job_type="full-time",
        experience_level="mid",
        salary_min=800000,
        salary_max=1400000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Python", "SQL", "Power BI", "Excel", "Statistics"],
        required_experience_years=2,
        apply_url="https://flipkart.com/careers"
    ),
    AggregatedJob(
        id="sample_5",
        source="internal",
        source_job_id="SAMPLE-005",
        title="Marketing Manager",
        company_name="Swiggy",
        location="Bengaluru, Karnataka",
        country="India",
        description="Lead marketing campaigns for food delivery platform. Drive user acquisition and brand awareness.",
        job_type="full-time",
        experience_level="mid",
        salary_min=1200000,
        salary_max=1800000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Digital Marketing", "Brand Management", "Analytics", "Team Leadership"],
        required_experience_years=4,
        apply_url="https://swiggy.com/careers"
    ),
    AggregatedJob(
        id="sample_6",
        source="naukri",
        source_job_id="NAUKRI-001",
        title="Textile Engineer",
        company_name="Raymond Limited",
        location="Thane, Maharashtra",
        country="India",
        description="Manage textile production processes. Ensure quality standards and optimize manufacturing efficiency.",
        job_type="full-time",
        experience_level="mid",
        salary_min=700000,
        salary_max=1000000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Textile Engineering", "Quality Control", "Production Management"],
        required_experience_years=3,
        apply_url="https://naukri.com/raymond-jobs"
    ),
    AggregatedJob(
        id="sample_7",
        source="mercor",
        source_job_id="MERCOR-001",
        title="AI/ML Engineer",
        company_name="Mercor AI",
        location="Remote",
        is_remote=True,
        country="India",
        description="Build AI models for talent matching platform. Work with cutting-edge NLP and recommendation systems.",
        job_type="full-time",
        experience_level="mid",
        salary_min=2000000,
        salary_max=3500000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Python", "Machine Learning", "NLP", "TensorFlow", "PyTorch"],
        required_experience_years=3,
        apply_url="https://mercor.com/careers"
    ),
    AggregatedJob(
        id="sample_8",
        source="quikr",
        source_job_id="QUIKR-001",
        title="Delivery Executive",
        company_name="Zepto",
        location="Bengaluru, Karnataka",
        country="India",
        description="Quick commerce delivery partner. Flexible hours, good earnings potential.",
        job_type="part-time",
        experience_level="entry",
        salary_min=180000,
        salary_max=360000,
        salary_currency="INR",
        salary_period="yearly",
        required_skills=["Bike Driving", "Navigation", "Customer Service"],
        required_experience_years=0,
        apply_url="https://quikr.com/jobs"
    )
]

# ============================================
# JOB AGGREGATOR SERVICE
# ============================================

class JobAggregatorService:
    """
    Unified service to fetch jobs from multiple sources
    """
    
    def __init__(self):
        self.jsearch = JSearchClient()
        self.adzuna = AdzunaClient()
    
    async def search_all_sources(
        self,
        query: str,
        location: str = "India",
        page: int = 1,
        include_sample: bool = True
    ) -> List[AggregatedJob]:
        """
        Search jobs from all configured sources
        Returns combined list of jobs
        """
        
        all_jobs = []
        
        # Fetch from multiple sources in parallel
        tasks = []
        
        # JSearch (LinkedIn/Indeed/Glassdoor)
        if self.jsearch.api_key:
            tasks.append(self.jsearch.search_jobs(query, location, page))
        
        # Adzuna
        if self.adzuna.app_id:
            tasks.append(self.adzuna.search_jobs(query, location))
        
        # Execute all API calls
        if tasks:
            results = await asyncio.gather(*tasks, return_exceptions=True)
            for result in results:
                if isinstance(result, list):
                    all_jobs.extend(result)
                elif isinstance(result, Exception):
                    logger.error(f"Job fetch error: {result}")
        
        # Add sample jobs if no external results or for demo
        if include_sample or len(all_jobs) == 0:
            # Filter sample jobs by query
            query_lower = query.lower()
            filtered_samples = [
                job for job in SAMPLE_INDIAN_JOBS
                if query_lower in job.title.lower() 
                or query_lower in job.description.lower()
                or any(query_lower in skill.lower() for skill in job.required_skills)
            ]
            
            # If no matches, return all samples
            if not filtered_samples:
                filtered_samples = SAMPLE_INDIAN_JOBS
            
            all_jobs.extend(filtered_samples)
        
        # Remove duplicates by title + company
        seen = set()
        unique_jobs = []
        for job in all_jobs:
            key = f"{job.title}_{job.company_name}".lower()
            if key not in seen:
                seen.add(key)
                unique_jobs.append(job)
        
        return unique_jobs
    
    async def get_jobs_for_profile(
        self,
        career_interests: Dict[str, int],
        skills: List[str],
        location: str = "India"
    ) -> List[AggregatedJob]:
        """
        Get jobs matched to a user's profile
        """
        
        # Get top career interests
        sorted_interests = sorted(career_interests.items(), key=lambda x: x[1], reverse=True)
        top_interest = sorted_interests[0][0] if sorted_interests else "technology"
        
        # Map interests to job search queries
        interest_to_query = {
            "Artistic": "creative design fashion",
            "Enterprising": "business management sales",
            "Social": "teaching counseling HR",
            "Realistic": "engineering manufacturing",
            "Investigative": "research analyst data",
            "Conventional": "accounting administration finance"
        }
        
        query = interest_to_query.get(top_interest, "jobs")
        
        # Also search by top skills
        if skills:
            query += " " + " ".join(skills[:3])
        
        jobs = await self.search_all_sources(query, location)
        
        return jobs

# Singleton instance
job_aggregator = JobAggregatorService()
