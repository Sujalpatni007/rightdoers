"""
Backend API Tests for Content Command Centre
Tests for Reel Creator, Share Cards, Career Mantras, Legal Docs (NDA, Offer Letter)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestContentCommandStatus:
    """Test Content Command Centre status endpoint"""
    
    def test_content_status(self):
        """Test GET /api/content/status - Check service availability"""
        response = requests.get(f"{BASE_URL}/api/content/status")
        assert response.status_code == 200
        
        data = response.json()
        # Verify response structure
        assert "available" in data
        assert "features" in data
        assert "languages" in data
        assert "templates" in data
        assert "target_segments" in data
        
        # Verify features list
        expected_features = ["translate", "image_generation", "share_cards", "mantras", "nda", "offer_letter"]
        for feature in expected_features:
            assert feature in data["features"], f"Missing feature: {feature}"
        
        # Verify languages include major Indian languages
        assert "en" in data["languages"]
        assert "hi" in data["languages"]
        assert "kn" in data["languages"]
        
        # Verify templates include expected reel templates
        assert len(data["templates"]) >= 6
        print(f"Content Command Status: available={data['available']}, features={len(data['features'])}, languages={len(data['languages'])}, templates={len(data['templates'])}")


class TestCareerMantras:
    """Tests for Career Mantra APIs"""
    
    def test_get_entrepreneur_mantra(self):
        """Test GET /api/content/mantra/entrepreneur - Get entrepreneur mantra"""
        response = requests.get(f"{BASE_URL}/api/content/mantra/entrepreneur")
        assert response.status_code == 200
        
        data = response.json()
        assert "text" in data
        assert "category" in data
        assert "target_audience" in data
        assert data["target_audience"] == "entrepreneur"
        assert len(data["text"]) > 0
        print(f"Entrepreneur Mantra: {data['text'][:50]}...")
    
    def test_get_student_mantra(self):
        """Test GET /api/content/mantra/student - Get student mantra"""
        response = requests.get(f"{BASE_URL}/api/content/mantra/student")
        assert response.status_code == 200
        
        data = response.json()
        assert data["target_audience"] == "student"
        assert "text" in data
        print(f"Student Mantra: {data['text'][:50]}...")
    
    def test_get_corporate_mantra(self):
        """Test GET /api/content/mantra/corporate - Get corporate mantra"""
        response = requests.get(f"{BASE_URL}/api/content/mantra/corporate")
        assert response.status_code == 200
        
        data = response.json()
        assert data["target_audience"] == "corporate"
        print(f"Corporate Mantra: {data['text'][:50]}...")
    
    def test_get_repeater_mantra(self):
        """Test GET /api/content/mantra/repeater - Get career comeback mantra"""
        response = requests.get(f"{BASE_URL}/api/content/mantra/repeater")
        assert response.status_code == 200
        
        data = response.json()
        assert data["target_audience"] == "repeater"
        print(f"Repeater Mantra: {data['text'][:50]}...")
    
    def test_list_all_mantras(self):
        """Test GET /api/content/mantras - List all mantras"""
        response = requests.get(f"{BASE_URL}/api/content/mantras")
        assert response.status_code == 200
        
        data = response.json()
        assert "mantras" in data
        assert "audiences" in data
        
        # Verify 4 audience segments
        expected_audiences = ["entrepreneur", "student", "corporate", "repeater"]
        for audience in expected_audiences:
            assert audience in data["audiences"], f"Missing audience: {audience}"
        
        print(f"Total audiences: {len(data['audiences'])}")


class TestLegalDocuments:
    """Tests for Legal Document APIs (NDA, Offer Letter)"""
    
    def test_generate_nda(self):
        """Test POST /api/content/legal/nda - Generate NDA document"""
        payload = {
            "recipient_name": "Test Recipient Pytest",
            "recipient_email": "test@pytest.com",
            "recipient_phone": "+91-9876543210",
            "effective_date": "2025-01-15"
        }
        response = requests.post(f"{BASE_URL}/api/content/legal/nda", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        # Verify NDA structure
        assert "nda" in data
        assert "html" in data
        
        nda = data["nda"]
        assert nda["id"].startswith("NDA-")
        assert nda["recipient_name"] == payload["recipient_name"]
        assert nda["recipient_email"] == payload["recipient_email"]
        assert nda["effective_date"] == payload["effective_date"]
        assert nda["status"] == "draft"
        
        # Verify HTML contains key elements
        html = data["html"]
        assert "NON-DISCLOSURE" in html
        assert payload["recipient_name"] in html
        assert "Right Doers World" in html
        
        print(f"NDA Generated: {nda['id']}")
    
    def test_generate_offer_letter(self):
        """Test POST /api/content/legal/offer - Generate Offer Letter"""
        payload = {
            "candidate_name": "Test Candidate Pytest",
            "candidate_email": "candidate@pytest.com",
            "position": "Division Director",
            "division": "Technology",
            "salary_annual": 1200000,
            "joining_date": "2025-02-01"
        }
        response = requests.post(f"{BASE_URL}/api/content/legal/offer", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        # Verify Offer structure
        assert "offer" in data
        assert "html" in data
        
        offer = data["offer"]
        assert offer["id"].startswith("OFFER-")
        assert offer["candidate_name"] == payload["candidate_name"]
        assert offer["position"] == payload["position"]
        assert offer["division"] == payload["division"]
        assert offer["salary_annual"] == payload["salary_annual"]
        assert offer["status"] == "draft"
        
        # Verify HTML contains key elements
        html = data["html"]
        assert "Offer Letter" in html or "OFFER" in html.upper()
        assert payload["candidate_name"] in html
        assert payload["position"] in html
        
        # Verify salary breakdown in HTML
        assert "Basic Salary" in html
        assert "House Rent Allowance" in html
        
        print(f"Offer Letter Generated: {offer['id']}")
    
    def test_list_legal_documents(self):
        """Test GET /api/content/legal/documents - List legal documents"""
        response = requests.get(f"{BASE_URL}/api/content/legal/documents")
        assert response.status_code == 200
        
        data = response.json()
        assert "documents" in data
        assert "total" in data
        
        print(f"Total legal documents: {data['total']}")


class TestTranslation:
    """Tests for Translation API"""
    
    def test_translate_text(self):
        """Test POST /api/content/translate - Translate to multiple languages"""
        payload = {
            "text": "Build your dream career",
            "languages": ["en", "hi", "kn"]
        }
        response = requests.post(f"{BASE_URL}/api/content/translate", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "translations" in data
        assert "source_text" in data
        
        translations = data["translations"]
        # English should be same as source
        assert "en" in translations
        assert translations["en"] == payload["text"]
        
        # Hindi and Kannada should be present
        assert "hi" in translations
        assert "kn" in translations
        
        print(f"Translations: EN={translations['en'][:30]}..., HI={translations.get('hi', 'N/A')[:30]}...")


class TestShareCard:
    """Tests for Share Card API"""
    
    def test_create_share_card(self):
        """Test POST /api/content/share-card - Create DoersScore share card"""
        payload = {
            "name": "Test Doer Pytest",
            "doers_score": 728,
            "adaptive_level": "ASSOCIATE",
            "top_skills": ["Python", "Leadership", "Communication"],
            "career_match": "Technology Division Director",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/api/content/share-card", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "card" in data
        
        card = data["card"]
        assert card["id"].startswith("CARD-")
        assert card["name"] == payload["name"]
        assert card["doers_score"] == payload["doers_score"]
        assert card["adaptive_level"] == payload["adaptive_level"]
        
        print(f"Share Card Created: {card['id']}, Score: {card['doers_score']}")


class TestTargetSegments:
    """Tests for GTM Target Segments API"""
    
    def test_get_target_segments(self):
        """Test GET /api/content/segments - Get GTM target segments"""
        response = requests.get(f"{BASE_URL}/api/content/segments")
        assert response.status_code == 200
        
        data = response.json()
        assert "segments" in data
        
        segments = data["segments"]
        # Verify expected segments
        expected_segments = ["startup_india", "cbse_repeaters", "small_business", "corporate_hr", "government"]
        for segment in expected_segments:
            assert segment in segments, f"Missing segment: {segment}"
        
        # Verify segment structure
        for seg_key, seg_data in segments.items():
            assert "name" in seg_data
            assert "description" in seg_data
            assert "content_types" in seg_data
            assert "estimated_reach" in seg_data
        
        print(f"Total segments: {len(segments)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
