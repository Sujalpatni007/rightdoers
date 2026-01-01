"""
Backend API Tests for HI AI-APP.COM
Tests for DoersProfile and Family APIs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Right Doers World" in data["message"]


class TestDoersProfileAPI:
    """Tests for DoersProfile / Talent Card APIs"""
    
    def test_create_profile(self):
        """Test POST /api/profiles - Create new profile"""
        payload = {
            "user_id": "test-user-pytest-001",
            "name": "Test Doer Pytest"
        }
        response = requests.post(f"{BASE_URL}/api/profiles", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        # Verify response structure
        assert "id" in data
        assert data["id"].startswith("DP-")
        assert data["user_id"] == payload["user_id"]
        assert data["name"] == payload["name"]
        
        # Verify DoersScore (300-900 range)
        assert "doers_score" in data
        assert 300 <= data["doers_score"] <= 900
        
        # Verify Efficiency Value
        assert "efficiency_value" in data
        assert 0 <= data["efficiency_value"] <= 100
        
        # Verify 6 Dimensions
        assert "dimensions" in data
        dimensions = data["dimensions"]
        expected_dims = ["personality", "interest", "learning", "eq", "intelligence", "aptitude"]
        for dim in expected_dims:
            assert dim in dimensions
            assert "score" in dimensions[dim]
            assert "level" in dimensions[dim]
        
        # Verify Skills
        assert "skills" in data
        assert len(data["skills"]) > 0
        
        # Store profile ID for next test
        self.__class__.created_profile_id = data["id"]
    
    def test_get_profile_by_id(self):
        """Test GET /api/profiles/{id} - Retrieve profile"""
        # First create a profile
        payload = {"user_id": "test-user-get-001", "name": "Get Test User"}
        create_response = requests.post(f"{BASE_URL}/api/profiles", json=payload)
        profile_id = create_response.json()["id"]
        
        # Now retrieve it
        response = requests.get(f"{BASE_URL}/api/profiles/{profile_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == profile_id
        assert data["name"] == "Get Test User"
        assert "doers_score" in data
    
    def test_get_profile_not_found(self):
        """Test GET /api/profiles/{id} - 404 for non-existent profile"""
        response = requests.get(f"{BASE_URL}/api/profiles/NON-EXISTENT-ID")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "not found" in data["detail"].lower()
    
    def test_get_profile_by_user_id(self):
        """Test GET /api/profiles/user/{user_id} - Retrieve by user ID"""
        # First create a profile
        user_id = "test-user-by-userid-001"
        payload = {"user_id": user_id, "name": "User ID Test"}
        requests.post(f"{BASE_URL}/api/profiles", json=payload)
        
        # Retrieve by user_id
        response = requests.get(f"{BASE_URL}/api/profiles/user/{user_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["user_id"] == user_id


class TestFamilyAPI:
    """Tests for Family Dashboard APIs"""
    
    def test_create_family(self):
        """Test POST /api/families - Create new family"""
        payload = {
            "name": "Test Family Pytest",
            "members": [
                {"id": "m1", "name": "Father", "role": "father", "doers_score": 800},
                {"id": "m2", "name": "Mother", "role": "mother", "doers_score": 750},
                {"id": "m3", "name": "Child", "role": "son", "doers_score": 650}
            ]
        }
        response = requests.post(f"{BASE_URL}/api/families", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        # Verify response structure
        assert "id" in data
        assert data["id"].startswith("FAM-")
        assert data["name"] == payload["name"]
        
        # Verify family score calculation (average of members)
        assert "family_doers_score" in data
        expected_avg = (800 + 750 + 650) // 3
        assert data["family_doers_score"] == expected_avg
        
        # Verify members
        assert "members" in data
        assert len(data["members"]) == 3
        
        # Store family ID for next test
        self.__class__.created_family_id = data["id"]
    
    def test_get_family_by_id(self):
        """Test GET /api/families/{id} - Retrieve family"""
        # First create a family
        payload = {
            "name": "Get Test Family",
            "members": [{"id": "m1", "name": "Member", "role": "father", "doers_score": 700}]
        }
        create_response = requests.post(f"{BASE_URL}/api/families", json=payload)
        family_id = create_response.json()["id"]
        
        # Now retrieve it
        response = requests.get(f"{BASE_URL}/api/families/{family_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == family_id
        assert data["name"] == "Get Test Family"
    
    def test_get_family_not_found(self):
        """Test GET /api/families/{id} - 404 for non-existent family"""
        response = requests.get(f"{BASE_URL}/api/families/NON-EXISTENT-FAM")
        assert response.status_code == 404


class TestSeedData:
    """Tests for seed data endpoint"""
    
    def test_seed_data(self):
        """Test POST /api/seed - Seed data endpoint"""
        response = requests.post(f"{BASE_URL}/api/seed")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
