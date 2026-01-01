"""
Captain Command Centre API Tests
Tests for 7 Business Verticals, Leader Assignment, and AI Onboarding Kit
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://doerworld-app.preview.emergentagent.com')

class TestCaptainCommandStatus:
    """Test Command Centre status endpoint"""
    
    def test_get_status(self):
        """GET /api/captain/status - Command Centre status"""
        response = requests.get(f"{BASE_URL}/api/captain/status")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "operational"
        assert data["codename"] == "DOERS_COMMAND"
        assert data["version"] == "1.0.0"
        assert data["verticals_count"] == 7
        assert "mission" in data
        assert "motto" in data
        assert "timestamp" in data


class TestBusinessVerticals:
    """Test 7 Business Verticals endpoints"""
    
    def test_get_all_verticals(self):
        """GET /api/captain/verticals - Get all 7 business verticals"""
        response = requests.get(f"{BASE_URL}/api/captain/verticals")
        assert response.status_code == 200
        
        data = response.json()
        assert "verticals" in data
        assert data["total"] == 7
        
        verticals = data["verticals"]
        vertical_codes = [v["code"] for v in verticals]
        
        # Verify all 7 verticals exist
        expected_codes = ["B2G", "B2A", "B2B", "B2C", "B2D", "D2D", "A2A"]
        for code in expected_codes:
            assert code in vertical_codes, f"Missing vertical: {code}"
        
        # Verify vertical structure
        for vertical in verticals:
            assert "code" in vertical
            assert "name" in vertical
            assert "mission" in vertical
            assert "icon" in vertical
            assert "color" in vertical
            assert "description" in vertical
            assert "kata_focus" in vertical
            assert "key_metrics" in vertical
            assert "metrics" in vertical
    
    def test_get_vertical_b2g(self):
        """GET /api/captain/vertical/B2G - Get B2G vertical details"""
        response = requests.get(f"{BASE_URL}/api/captain/vertical/B2G")
        assert response.status_code == 200
        
        data = response.json()
        assert "vertical" in data
        assert data["vertical"]["code"] == "B2G"
        assert data["vertical"]["name"] == "Business to Government"
        assert data["vertical"]["mission"] == "Jobs for Locals Focus"
        
        # Verify kata system
        assert "kata_system" in data
        assert len(data["kata_system"]) == 4
        
        # Verify cached responses
        assert "cached_responses" in data
        assert "welcome" in data["cached_responses"]
        assert "first_task" in data["cached_responses"]
        assert "kata_tips" in data["cached_responses"]
    
    def test_get_vertical_b2b(self):
        """GET /api/captain/vertical/B2B - Get B2B vertical details"""
        response = requests.get(f"{BASE_URL}/api/captain/vertical/B2B")
        assert response.status_code == 200
        
        data = response.json()
        assert data["vertical"]["code"] == "B2B"
        assert data["vertical"]["name"] == "Business to Business"
        assert data["vertical"]["mission"] == "Corporate Services"
    
    def test_get_invalid_vertical(self):
        """GET /api/captain/vertical/INVALID - Returns 404"""
        response = requests.get(f"{BASE_URL}/api/captain/vertical/INVALID")
        assert response.status_code == 404


class TestLeaderAssignment:
    """Test leader assignment endpoints"""
    
    def test_assign_leader(self):
        """POST /api/captain/assign-leader - Assign leader to vertical"""
        test_leader = {
            "vertical": "B2D",
            "leader_name": f"TEST_Leader_{uuid.uuid4().hex[:6]}",
            "leader_phone": "+919876543299",
            "leader_email": "test_leader@test.com",
            "designation": "Digital Director"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/captain/assign-leader",
            json=test_leader
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "leader" in data
        assert data["leader"]["leader_name"] == test_leader["leader_name"]
        assert data["leader"]["vertical"] == "B2D"
        assert data["leader"]["status"] == "active"
        assert "next_step" in data
    
    def test_assign_leader_invalid_vertical(self):
        """POST /api/captain/assign-leader - Invalid vertical returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/captain/assign-leader",
            json={
                "vertical": "INVALID",
                "leader_name": "Test",
                "leader_phone": "+919876543210"
            }
        )
        assert response.status_code == 400
    
    def test_get_all_leaders(self):
        """GET /api/captain/leaders - Get all assigned leaders"""
        response = requests.get(f"{BASE_URL}/api/captain/leaders")
        assert response.status_code == 200
        
        data = response.json()
        assert "leaders" in data
        assert "total" in data
        assert isinstance(data["leaders"], list)
        
        # Verify leader structure
        if data["total"] > 0:
            leader = data["leaders"][0]
            assert "id" in leader
            assert "vertical" in leader
            assert "leader_name" in leader
            assert "leader_phone" in leader
            assert "status" in leader


class TestOnboarding:
    """Test AI Onboarding Kit endpoints"""
    
    @pytest.fixture
    def onboarding_session(self):
        """Create an onboarding session for testing"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/start",
            json={
                "user_id": f"test_user_{uuid.uuid4().hex[:8]}",
                "user_name": "TEST_Onboarding User",
                "vertical": "A2A"
            }
        )
        assert response.status_code == 200
        return response.json()
    
    def test_start_onboarding(self):
        """POST /api/captain/onboarding/start - Start onboarding session"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/start",
            json={
                "user_id": f"test_user_{uuid.uuid4().hex[:8]}",
                "user_name": "TEST_New Leader",
                "vertical": "D2D"
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "session_id" in data
        assert data["vertical"] == "D2D"
        assert "welcome_message" in data
        assert "first_kata" in data
        assert "first_task" in data
        assert "tips" in data
    
    def test_start_onboarding_invalid_vertical(self):
        """POST /api/captain/onboarding/start - Invalid vertical returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/start",
            json={
                "user_id": "test_user",
                "user_name": "Test",
                "vertical": "INVALID"
            }
        )
        assert response.status_code == 400
    
    def test_onboarding_chat_first_task(self, onboarding_session):
        """POST /api/captain/onboarding/chat - Ask about first task"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/chat",
            json={
                "session_id": onboarding_session["session_id"],
                "message": "What is my first task?",
                "use_ai": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "response" in data
        assert "source" in data
        assert data["source"] == "cached"
        assert data["is_offline_capable"] == True
    
    def test_onboarding_chat_tips(self, onboarding_session):
        """POST /api/captain/onboarding/chat - Ask for tips"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/chat",
            json={
                "session_id": onboarding_session["session_id"],
                "message": "Give me some tips",
                "use_ai": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "response" in data
        assert data["source"] == "cached"
    
    def test_onboarding_chat_kata_progress(self, onboarding_session):
        """POST /api/captain/onboarding/chat - Ask about kata progress"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/chat",
            json={
                "session_id": onboarding_session["session_id"],
                "message": "What kata am I on?",
                "use_ai": True
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "response" in data
        assert "Kata" in data["response"]
    
    def test_onboarding_chat_invalid_session(self):
        """POST /api/captain/onboarding/chat - Invalid session returns 404"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/chat",
            json={
                "session_id": "invalid_session_id",
                "message": "Hello",
                "use_ai": True
            }
        )
        assert response.status_code == 404
    
    def test_update_kata_progress(self, onboarding_session):
        """POST /api/captain/onboarding/progress - Update kata progress"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/progress",
            json={
                "session_id": onboarding_session["session_id"],
                "kata_number": 2,
                "completed_modules": ["context_loading", "mission_brief"]
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert data["current_kata"] == 2
        assert data["status"] == "kata_2"
        assert "kata_info" in data
        assert "next_kata" in data
        assert data["is_orbit"] == False
    
    def test_update_kata_progress_to_orbit(self, onboarding_session):
        """POST /api/captain/onboarding/progress - Reach ORBIT status"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/progress",
            json={
                "session_id": onboarding_session["session_id"],
                "kata_number": 4,
                "completed_modules": ["all_modules"]
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["current_kata"] == 4
        assert data["status"] == "orbit"
        assert data["is_orbit"] == True
        assert "orbit_message" in data
        assert data["orbit_message"] is not None
    
    def test_update_kata_progress_invalid_kata(self, onboarding_session):
        """POST /api/captain/onboarding/progress - Invalid kata number returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/captain/onboarding/progress",
            json={
                "session_id": onboarding_session["session_id"],
                "kata_number": 10,
                "completed_modules": []
            }
        )
        assert response.status_code == 400


class TestDashboardMetrics:
    """Test dashboard metrics endpoint"""
    
    def test_get_dashboard_metrics(self):
        """GET /api/captain/dashboard-metrics - Get dashboard metrics"""
        response = requests.get(f"{BASE_URL}/api/captain/dashboard-metrics")
        assert response.status_code == 200
        
        data = response.json()
        assert "metrics" in data
        assert "timestamp" in data
        assert "mission_status" in data
        
        metrics = data["metrics"]
        assert "total_verticals" in metrics
        assert metrics["total_verticals"] == 7
        assert "leaders_assigned" in metrics
        assert "total_team_size" in metrics
        assert "onboarding_in_progress" in metrics
        assert "orbit_achieved" in metrics
        assert "health_score" in metrics


class TestKataSystem:
    """Test 16-Kata system endpoint"""
    
    def test_get_kata_system(self):
        """GET /api/captain/kata-system - Get 16-Kata system info"""
        response = requests.get(f"{BASE_URL}/api/captain/kata-system")
        assert response.status_code == 200
        
        data = response.json()
        assert data["system_name"] == "DOERS 16-Kata Onboarding"
        assert data["inspired_by"] == "Varun Mayya - Company as Organism"
        assert "philosophy" in data
        assert "katas" in data
        assert "orbit_definition" in data
        assert "total_duration" in data
        
        # Verify 4 kata stages
        katas = data["katas"]
        assert "1" in katas
        assert "2" in katas
        assert "3" in katas
        assert "4" in katas
        
        # Verify kata structure
        kata_1 = katas["1"]
        assert kata_1["name"] == "Context Loading"
        assert "duration" in kata_1
        assert "objectives" in kata_1
        assert "deliverables" in kata_1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
