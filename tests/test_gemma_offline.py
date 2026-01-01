"""
Gemma Offline AI API Tests
Tests for Rural India career guidance with Telugu/Kannada support
Target: Srikakulum (Telugu) & Chickmagalur (Kannada)
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://doerworld-app.preview.emergentagent.com').rstrip('/')

class TestGemmaStatus:
    """Test Gemma Offline AI status endpoint"""
    
    def test_gemma_status_returns_200(self):
        """GET /api/gemma/status returns correct status"""
        response = requests.get(f"{BASE_URL}/api/gemma/status")
        assert response.status_code == 200
        
        data = response.json()
        assert data["available"] == True
        assert data["model"] == "gemma-3n-270m"
        assert "Srikakulum (Telugu)" in data["target_regions"]
        assert "Chickmagalur (Kannada)" in data["target_regions"]
        assert "te" in data["supported_languages"]
        assert "kn" in data["supported_languages"]
        assert "en" in data["supported_languages"]
        assert "hi" in data["supported_languages"]
        assert "career_guidance" in data["features"]
        assert "offline_cache" in data["features"]
        print("✓ Gemma status endpoint working correctly")


class TestGemmaLanguages:
    """Test supported languages endpoint"""
    
    def test_gemma_languages_returns_all_languages(self):
        """GET /api/gemma/languages returns Telugu, Kannada, Hindi, English"""
        response = requests.get(f"{BASE_URL}/api/gemma/languages")
        assert response.status_code == 200
        
        data = response.json()
        languages = data["languages"]
        
        # Telugu
        assert "te" in languages
        assert languages["te"]["name"] == "Telugu"
        assert languages["te"]["native"] == "తెలుగు"
        assert languages["te"]["region"] == "Srikakulum, Andhra Pradesh"
        
        # Kannada
        assert "kn" in languages
        assert languages["kn"]["name"] == "Kannada"
        assert languages["kn"]["native"] == "ಕನ್ನಡ"
        assert languages["kn"]["region"] == "Chickmagalur, Karnataka"
        
        # Hindi
        assert "hi" in languages
        assert languages["hi"]["name"] == "Hindi"
        
        # English
        assert "en" in languages
        assert languages["en"]["name"] == "English"
        
        print("✓ All 4 languages (Telugu, Kannada, Hindi, English) supported")


class TestGemmaChat:
    """Test Gemma chat endpoint with different languages"""
    
    def test_chat_with_telugu_query_offline(self):
        """POST /api/gemma/chat works with Telugu query in offline mode"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/chat",
            json={
                "query": "నాకు ఏ కెరీర్ సరిపోతుంది?",
                "language": "te",
                "is_offline": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert data["id"].startswith("GEMMA-")
        assert "response" in data
        assert data["language"] == "te"
        assert data["is_cached"] == True
        assert "related_resources" in data
        # Response should be in Telugu
        assert "డిజిటల్" in data["response"] or "నైపుణ్య" in data["response"]
        print(f"✓ Telugu offline chat working - Response: {data['response'][:100]}...")
    
    def test_chat_with_kannada_query_offline(self):
        """POST /api/gemma/chat works with Kannada query in offline mode"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/chat",
            json={
                "query": "ನನಗೆ ಯಾವ ವೃತ್ತಿ ಸರಿಹೊಂದುತ್ತದೆ?",
                "language": "kn",
                "is_offline": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["language"] == "kn"
        assert data["is_cached"] == True
        # Response should be in Kannada
        assert "ಡಿಜಿಟಲ್" in data["response"] or "ಕೌಶಲ್ಯ" in data["response"]
        print(f"✓ Kannada offline chat working - Response: {data['response'][:100]}...")
    
    def test_chat_with_english_query(self):
        """POST /api/gemma/chat works with English query"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/chat",
            json={
                "query": "What career suits me?",
                "language": "en",
                "is_offline": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["language"] == "en"
        assert "response" in data
        print(f"✓ English chat working - Response: {data['response'][:100]}...")
    
    def test_chat_with_government_schemes_query(self):
        """POST /api/gemma/chat returns government schemes info"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/chat",
            json={
                "query": "government schemes",
                "language": "en",
                "is_offline": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        # Should mention PMKVY or Mudra
        assert "PMKVY" in data["response"] or "Mudra" in data["response"] or "Skill India" in data["response"]
        print("✓ Government schemes info returned correctly")
    
    def test_chat_returns_related_resources(self):
        """POST /api/gemma/chat returns related career resources"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/chat",
            json={
                "query": "career options",
                "language": "en",
                "is_offline": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "related_resources" in data
        # Should have career path resources
        if len(data["related_resources"]) > 0:
            resource = data["related_resources"][0]
            assert "type" in resource
            assert "name" in resource
            print(f"✓ Related resources returned: {len(data['related_resources'])} resources")


class TestGemmaCareerData:
    """Test career data endpoint for LIG workers"""
    
    def test_career_data_english(self):
        """GET /api/gemma/career-data returns LIG workers career guidance in English"""
        response = requests.get(f"{BASE_URL}/api/gemma/career-data?language=en&category=lig_workers")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "LIG Workers (Low Income Group)"
        assert data["language"] == "en"
        assert "data" in data
        assert "sectors" in data["data"]
        
        sectors = data["data"]["sectors"]
        assert len(sectors) >= 4
        
        # Check sector structure
        sector_names = [s["name"] for s in sectors]
        assert "Digital Skills" in sector_names
        assert "Agriculture Technology" in sector_names
        assert "Healthcare Support" in sector_names
        assert "Skilled Trades" in sector_names
        
        # Check sector details
        digital_sector = next(s for s in sectors if s["name"] == "Digital Skills")
        assert "salary_range" in digital_sector
        assert "training_duration" in digital_sector
        assert "job_opportunities" in digital_sector
        print("✓ LIG workers career data (English) returned correctly")
    
    def test_career_data_telugu(self):
        """GET /api/gemma/career-data returns career guidance in Telugu"""
        response = requests.get(f"{BASE_URL}/api/gemma/career-data?language=te&category=lig_workers")
        assert response.status_code == 200
        
        data = response.json()
        assert data["language"] == "te"
        
        sectors = data["data"]["sectors"]
        # Check Telugu content
        sector_names = [s["name"] for s in sectors]
        assert "డిజిటల్ నైపుణ్యాలు" in sector_names
        print("✓ LIG workers career data (Telugu) returned correctly")
    
    def test_career_data_kannada(self):
        """GET /api/gemma/career-data returns career guidance in Kannada"""
        response = requests.get(f"{BASE_URL}/api/gemma/career-data?language=kn&category=lig_workers")
        assert response.status_code == 200
        
        data = response.json()
        assert data["language"] == "kn"
        
        sectors = data["data"]["sectors"]
        # Check Kannada content
        sector_names = [s["name"] for s in sectors]
        assert "ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳು" in sector_names
        print("✓ LIG workers career data (Kannada) returned correctly")


class TestGemmaDoersScore:
    """Test DoersScore calculation for rural users"""
    
    def test_doers_score_calculation(self):
        """POST /api/gemma/doers-score calculates score for rural users"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/doers-score",
            json={
                "education_level": "10th_pass",
                "skills": ["farming", "mobile_usage"],
                "work_experience_years": 5,
                "certifications": 1,
                "language_proficiency": {"te": "fluent", "en": "basic"}
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "doers_score" in data
        assert "level" in data
        assert data["doers_score"] >= 300
        assert data["doers_score"] <= 900
        assert data["education_level"] == "10th_pass"
        assert data["skills_count"] == 2
        assert data["certifications"] == 1
        print(f"✓ DoersScore calculated: {data['doers_score']} ({data['level']})")
    
    def test_doers_score_graduate_level(self):
        """POST /api/gemma/doers-score returns higher score for graduates"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/doers-score",
            json={
                "education_level": "graduate",
                "skills": ["programming", "data_analysis", "communication", "leadership"],
                "work_experience_years": 8,
                "certifications": 3,
                "language_proficiency": {"en": "fluent", "hi": "fluent", "kn": "conversational"}
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["doers_score"] >= 600  # Should be higher for graduate
        assert data["level"] in ["MANAGER", "PROFESSIONAL", "EXPERT"]
        print(f"✓ Graduate DoersScore: {data['doers_score']} ({data['level']})")
    
    def test_doers_score_minimum_input(self):
        """POST /api/gemma/doers-score works with minimum input"""
        response = requests.post(
            f"{BASE_URL}/api/gemma/doers-score",
            json={
                "education_level": "below_10th",
                "skills": [],
                "work_experience_years": 0,
                "certifications": 0,
                "language_proficiency": {}
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["doers_score"] >= 300  # Minimum score
        assert data["level"] == "PARA" or data["level"] == "ASSOCIATE"
        print(f"✓ Minimum input DoersScore: {data['doers_score']} ({data['level']})")


class TestGemmaQuickQuestions:
    """Test quick questions endpoint"""
    
    def test_quick_questions_english(self):
        """GET /api/gemma/quick-questions/en returns English questions"""
        response = requests.get(f"{BASE_URL}/api/gemma/quick-questions/en")
        assert response.status_code == 200
        
        data = response.json()
        assert "questions" in data
        questions = data["questions"]
        assert len(questions) >= 4
        assert "What career suits me?" in questions
        print(f"✓ English quick questions: {questions}")
    
    def test_quick_questions_telugu(self):
        """GET /api/gemma/quick-questions/te returns Telugu questions"""
        response = requests.get(f"{BASE_URL}/api/gemma/quick-questions/te")
        assert response.status_code == 200
        
        data = response.json()
        questions = data["questions"]
        assert len(questions) >= 4
        # Check Telugu content
        assert any("కెరీర్" in q for q in questions)
        print(f"✓ Telugu quick questions returned")
    
    def test_quick_questions_kannada(self):
        """GET /api/gemma/quick-questions/kn returns Kannada questions"""
        response = requests.get(f"{BASE_URL}/api/gemma/quick-questions/kn")
        assert response.status_code == 200
        
        data = response.json()
        questions = data["questions"]
        assert len(questions) >= 4
        # Check Kannada content
        assert any("ವೃತ್ತಿ" in q for q in questions)
        print(f"✓ Kannada quick questions returned")


class TestGemmaOfflineCache:
    """Test offline cache endpoint"""
    
    def test_offline_cache_returns_all_data(self):
        """GET /api/gemma/offline-cache returns FAQ, career data, languages"""
        response = requests.get(f"{BASE_URL}/api/gemma/offline-cache")
        assert response.status_code == 200
        
        data = response.json()
        assert "faq" in data
        assert "career_data" in data
        assert "languages" in data
        
        # Check FAQ has all languages
        assert "en" in data["faq"]
        assert "te" in data["faq"]
        assert "kn" in data["faq"]
        
        # Check career data
        assert "lig_workers" in data["career_data"]
        
        print("✓ Offline cache data returned for PWA sync")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
