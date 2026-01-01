# ============================================
# HI AI-APP.COM - DATABASE MANAGEMENT APIs
# For CTO Vijay & Data Scientist Sujal
# Version: 1.0 | January 2026
# ============================================

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
import random

from models import (
    User, DoersProfile, Assessment, DCoinWallet, DCoinTransaction,
    Family, FamilyMember, Job, JobApplication, PlatformMetrics,
    CapsuleProgress, DimensionScore, Skill,
    generate_id, utc_now, calculate_efficiency, get_adaptive_level, calculate_doers_score,
    UserRole, AdaptiveLevel, AssessmentStatus, DCoinTransactionType
)

db_router = APIRouter(prefix="/db", tags=["Database Management"])

# ============================================
# DATABASE STATS (FOR CTO DASHBOARD)
# ============================================

@db_router.get("/stats")
async def get_database_stats(db):
    """Get overall database statistics for CTO dashboard"""
    stats = {
        "timestamp": utc_now(),
        "collections": {},
        "health": "healthy"
    }
    
    # Get counts for each collection
    collections = ["users", "profiles", "assessments", "wallets", "transactions", 
                   "families", "jobs", "applications", "capsule_progress", "metrics"]
    
    for col in collections:
        try:
            count = await db[col].count_documents({})
            stats["collections"][col] = {"count": count}
        except:
            stats["collections"][col] = {"count": 0}
    
    # Calculate key metrics
    stats["summary"] = {
        "total_users": stats["collections"].get("users", {}).get("count", 0),
        "total_profiles": stats["collections"].get("profiles", {}).get("count", 0),
        "total_families": stats["collections"].get("families", {}).get("count", 0),
        "active_jobs": stats["collections"].get("jobs", {}).get("count", 0),
        "dcoin_transactions": stats["collections"].get("transactions", {}).get("count", 0)
    }
    
    return stats

@db_router.get("/health")
async def database_health_check(db):
    """Health check for database connectivity"""
    try:
        # Ping database
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": utc_now()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": utc_now()
        }

# ============================================
# USER MANAGEMENT
# ============================================

@db_router.get("/users")
async def list_users(
    db,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    role: Optional[str] = None
):
    """List all users with pagination"""
    query = {}
    if role:
        query["role"] = role
    
    users = await db.users.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    total = await db.users.count_documents(query)
    
    return {
        "users": users,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@db_router.get("/users/{user_id}")
async def get_user_detail(db, user_id: str):
    """Get detailed user information including profile"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get associated profile
    profile = None
    if user.get("profile_id"):
        profile = await db.profiles.find_one({"id": user["profile_id"]}, {"_id": 0})
    
    # Get wallet
    wallet = await db.wallets.find_one({"user_id": user_id}, {"_id": 0})
    
    return {
        "user": user,
        "profile": profile,
        "wallet": wallet
    }

# ============================================
# PROFILE MANAGEMENT
# ============================================

@db_router.get("/profiles")
async def list_profiles(
    db,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    min_score: Optional[int] = None,
    verified_only: bool = False
):
    """List all profiles with filters"""
    query = {}
    if min_score:
        query["doers_score"] = {"$gte": min_score}
    if verified_only:
        query["is_verified"] = True
    
    profiles = await db.profiles.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    total = await db.profiles.count_documents(query)
    
    return {
        "profiles": profiles,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@db_router.get("/profiles/analytics")
async def profile_analytics(db):
    """Get profile analytics for data science"""
    pipeline = [
        {
            "$group": {
                "_id": None,
                "avg_doers_score": {"$avg": "$doers_score"},
                "max_doers_score": {"$max": "$doers_score"},
                "min_doers_score": {"$min": "$doers_score"},
                "avg_efficiency": {"$avg": "$efficiency_value"},
                "total_profiles": {"$sum": 1},
                "verified_count": {"$sum": {"$cond": ["$is_verified", 1, 0]}}
            }
        }
    ]
    
    result = await db.profiles.aggregate(pipeline).to_list(length=1)
    
    # Level distribution
    level_pipeline = [
        {"$group": {"_id": "$adaptive_level", "count": {"$sum": 1}}}
    ]
    level_dist = await db.profiles.aggregate(level_pipeline).to_list(length=10)
    
    return {
        "summary": result[0] if result else {},
        "level_distribution": {item["_id"]: item["count"] for item in level_dist},
        "timestamp": utc_now()
    }

# ============================================
# ASSESSMENT MANAGEMENT
# ============================================

@db_router.get("/assessments")
async def list_assessments(
    db,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None
):
    """List all assessments"""
    query = {}
    if status:
        query["status"] = status
    
    assessments = await db.assessments.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    total = await db.assessments.count_documents(query)
    
    return {
        "assessments": assessments,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@db_router.get("/assessments/analytics")
async def assessment_analytics(db):
    """Assessment completion analytics"""
    pipeline = [
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1},
                "avg_duration": {"$avg": "$duration_minutes"}
            }
        }
    ]
    
    result = await db.assessments.aggregate(pipeline).to_list(length=10)
    
    return {
        "status_distribution": {item["_id"]: {"count": item["count"], "avg_duration": item.get("avg_duration", 0)} for item in result},
        "timestamp": utc_now()
    }

# ============================================
# D-COIN ECONOMY
# ============================================

@db_router.get("/dcoin/stats")
async def dcoin_economy_stats(db):
    """D-COIN economy statistics"""
    # Total circulation
    wallet_pipeline = [
        {
            "$group": {
                "_id": None,
                "total_balance": {"$sum": "$balance"},
                "total_earned": {"$sum": "$total_earned"},
                "total_spent": {"$sum": "$total_spent"},
                "wallets_count": {"$sum": 1}
            }
        }
    ]
    
    wallet_stats = await db.wallets.aggregate(wallet_pipeline).to_list(length=1)
    
    # Transaction volume
    txn_pipeline = [
        {
            "$group": {
                "_id": "$type",
                "count": {"$sum": 1},
                "total_amount": {"$sum": "$amount"}
            }
        }
    ]
    
    txn_stats = await db.transactions.aggregate(txn_pipeline).to_list(length=10)
    
    return {
        "circulation": wallet_stats[0] if wallet_stats else {},
        "transaction_types": {item["_id"]: {"count": item["count"], "total": item["total_amount"]} for item in txn_stats},
        "timestamp": utc_now()
    }

@db_router.get("/dcoin/transactions")
async def list_transactions(
    db,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    type: Optional[str] = None
):
    """List D-COIN transactions"""
    query = {}
    if type:
        query["type"] = type
    
    transactions = await db.transactions.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    total = await db.transactions.count_documents(query)
    
    return {
        "transactions": transactions,
        "total": total,
        "skip": skip,
        "limit": limit
    }

# ============================================
# FAMILY MANAGEMENT
# ============================================

@db_router.get("/families")
async def list_families(
    db,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """List all families"""
    families = await db.families.find({}, {"_id": 0}).skip(skip).limit(limit).to_list(length=limit)
    total = await db.families.count_documents({})
    
    return {
        "families": families,
        "total": total,
        "skip": skip,
        "limit": limit
    }

# ============================================
# JOB MARKETPLACE
# ============================================

@db_router.get("/jobs/analytics")
async def job_marketplace_analytics(db):
    """Job marketplace analytics"""
    # Active jobs by type
    type_pipeline = [
        {"$match": {"is_active": True}},
        {"$group": {"_id": "$job_type", "count": {"$sum": 1}}}
    ]
    
    job_types = await db.jobs.aggregate(type_pipeline).to_list(length=10)
    
    # Application stats
    app_pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    
    app_stats = await db.applications.aggregate(app_pipeline).to_list(length=10)
    
    return {
        "job_types": {item["_id"]: item["count"] for item in job_types},
        "application_status": {item["_id"]: item["count"] for item in app_stats},
        "timestamp": utc_now()
    }

# ============================================
# CAPSULE PROGRESS
# ============================================

@db_router.get("/capsules/progress")
async def capsule_progress_analytics(db):
    """Career capsule progress analytics"""
    pipeline = [
        {
            "$group": {
                "_id": "$division_id",
                "total_started": {"$sum": 1},
                "completed": {"$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}},
                "avg_progress": {"$avg": "$progress_percent"},
                "total_dcoin": {"$sum": "$dcoin_earned"}
            }
        }
    ]
    
    result = await db.capsule_progress.aggregate(pipeline).to_list(length=20)
    
    return {
        "by_division": {item["_id"]: item for item in result},
        "timestamp": utc_now()
    }

# ============================================
# SEED DATA (FOR TESTING)
# ============================================

@db_router.post("/seed")
async def seed_database(db, count: int = Query(10, ge=1, le=100)):
    """Seed database with test data for CTO testing"""
    seeded = {
        "users": 0,
        "profiles": 0,
        "wallets": 0,
        "families": 0
    }
    
    # Create test users and profiles
    for i in range(count):
        user_id = generate_id("USR")
        profile_id = generate_id("DP")
        
        # Random scores
        natural_fit = random.randint(50, 95)
        developed_skills = random.randint(45, 98)
        learning_agility = random.randint(60, 92)
        efficiency = calculate_efficiency(natural_fit, developed_skills, learning_agility)
        
        dimensions_avg = random.randint(60, 85)
        doers_score = calculate_doers_score(efficiency, dimensions_avg)
        
        # Create user
        user = {
            "id": user_id,
            "phone": f"98765{10000 + i}",
            "name": f"Test Doer {i+1}",
            "role": random.choice(["doer", "employer"]),
            "profile_id": profile_id,
            "is_verified": random.choice([True, False]),
            "created_at": utc_now()
        }
        await db.users.insert_one(user)
        seeded["users"] += 1
        
        # Create profile
        profile = {
            "id": profile_id,
            "user_id": user_id,
            "credential_id": generate_id("RDVC"),
            "name": f"Test Doer {i+1}",
            "doers_score": doers_score,
            "doers_score_percentile": min(99, max(1, (doers_score - 300) // 6)),
            "natural_fit_score": natural_fit,
            "developed_skills_score": developed_skills,
            "learning_agility_score": learning_agility,
            "efficiency_value": efficiency,
            "adaptive_level": get_adaptive_level(efficiency),
            "dimensions": {
                "personality": {"score": random.randint(60, 95), "level": "PROFESSIONAL"},
                "interest": {"score": random.randint(55, 90), "level": "MANAGER"},
                "learning": {"score": random.randint(50, 85), "level": "ASSOCIATE"},
                "eq": {"score": random.randint(60, 92), "level": "PROFESSIONAL"},
                "intelligence": {"score": random.randint(65, 98), "level": "EXPERT"},
                "aptitude": {"score": random.randint(55, 88), "level": "MANAGER"}
            },
            "is_verified": random.choice([True, False]),
            "created_at": utc_now()
        }
        await db.profiles.insert_one(profile)
        seeded["profiles"] += 1
        
        # Create wallet
        wallet = {
            "id": generate_id("WLT"),
            "user_id": user_id,
            "balance": random.randint(50, 500),
            "total_earned": random.randint(100, 1000),
            "total_spent": random.randint(0, 200),
            "daily_streak": random.randint(0, 30),
            "created_at": utc_now()
        }
        await db.wallets.insert_one(wallet)
        seeded["wallets"] += 1
    
    # Create a sample family
    family = {
        "id": generate_id("FAM"),
        "name": "Test Family",
        "family_type": "MIG",
        "family_doers_score": 737,
        "members": [
            {"id": generate_id("MBR"), "name": "Father", "role": "father", "doers_score": 720},
            {"id": generate_id("MBR"), "name": "Mother", "role": "mother", "doers_score": 680},
            {"id": generate_id("MBR"), "name": "Daughter", "role": "daughter", "doers_score": 810}
        ],
        "primary_language": "en",
        "created_at": utc_now()
    }
    await db.families.insert_one(family)
    seeded["families"] += 1
    
    return {
        "message": "Database seeded successfully",
        "seeded": seeded,
        "timestamp": utc_now()
    }

@db_router.delete("/clear")
async def clear_test_data(db, confirm: str = Query(...)):
    """Clear test data (requires confirmation)"""
    if confirm != "YES_DELETE_ALL":
        raise HTTPException(status_code=400, detail="Confirmation required: pass confirm=YES_DELETE_ALL")
    
    deleted = {}
    collections = ["users", "profiles", "wallets", "transactions", "families", "assessments", "jobs", "applications", "capsule_progress"]
    
    for col in collections:
        result = await db[col].delete_many({})
        deleted[col] = result.deleted_count
    
    return {
        "message": "Test data cleared",
        "deleted": deleted,
        "timestamp": utc_now()
    }

# Export router
__all__ = ["db_router"]
