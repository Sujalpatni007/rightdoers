"""
Mission Board API Tests
Tests for Dubai Global Launch Live Tracker - Real-time progress across 7 verticals
New feature: Countdown timer, vertical readiness, leaderboard, activity feed with points
"""

import pytest
import requests
import os
import uuid
from datetime import datetime

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://doerworld-app.preview.emergentagent.com')


class TestMissionBoard:
    """Test Mission Board main endpoint - Dubai Launch Tracker"""
    
    def test_get_mission_board(self):
        """GET /api/captain/mission-board - Returns launch countdown, readiness %, verticals progress"""
        response = requests.get(f"{BASE_URL}/api/captain/mission-board")
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify launch target info
        assert data["launch_target"] == "DUBAI GLOBAL LAUNCH"
        assert "launch_date" in data
        assert "2026-01-09" in data["launch_date"]  # Dubai launch date
        
        # Verify countdown fields
        assert "days_to_launch" in data
        assert "hours_to_launch" in data
        assert "countdown_active" in data
        assert isinstance(data["days_to_launch"], int)
        assert isinstance(data["hours_to_launch"], int)
        
        # Verify mission status
        assert "mission_status" in data
        assert data["mission_status"] in ["LAUNCH_READY", "FINAL_PREP", "ON_TRACK", "ACCELERATE", "MOBILIZING"]
        assert "status_color" in data
        
        # Verify launch readiness
        assert "launch_readiness_percent" in data
        assert isinstance(data["launch_readiness_percent"], int)
        assert 0 <= data["launch_readiness_percent"] <= 100
        
        # Verify verticals progress
        assert "verticals_progress" in data
        assert len(data["verticals_progress"]) == 7  # All 7 verticals
        
        # Verify vertical structure
        for vertical in data["verticals_progress"]:
            assert "code" in vertical
            assert "name" in vertical
            assert "icon" in vertical
            assert "color" in vertical
            assert "mission" in vertical
            assert "status" in vertical
            assert "kata_progress" in vertical
            assert "readiness_percent" in vertical
            assert "is_orbit" in vertical
            assert isinstance(vertical["readiness_percent"], int)
        
        # Verify summary counts
        assert "verticals_ready" in data
        assert "verticals_total" in data
        assert data["verticals_total"] == 7
        assert "timestamp" in data
    
    def test_mission_board_vertical_codes(self):
        """Verify all 7 vertical codes are present in mission board"""
        response = requests.get(f"{BASE_URL}/api/captain/mission-board")
        assert response.status_code == 200
        
        data = response.json()
        vertical_codes = [v["code"] for v in data["verticals_progress"]]
        
        expected_codes = ["B2G", "B2A", "B2B", "B2C", "B2D", "D2D", "A2A"]
        for code in expected_codes:
            assert code in vertical_codes, f"Missing vertical: {code}"


class TestMissionBoardActivity:
    """Test Mission Board activity feed endpoint"""
    
    def test_get_mission_activity(self):
        """GET /api/captain/mission-board/activity - Returns activity feed with points"""
        response = requests.get(f"{BASE_URL}/api/captain/mission-board/activity")
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify response structure
        assert "activities" in data
        assert "total_activities" in data
        assert "total_points" in data
        assert "timestamp" in data
        
        assert isinstance(data["activities"], list)
        assert isinstance(data["total_points"], int)
        
        # Verify activity structure if activities exist
        if len(data["activities"]) > 0:
            activity = data["activities"][0]
            assert "id" in activity
            assert "type" in activity
            assert "icon" in activity
            assert "title" in activity
            assert "description" in activity
            assert "vertical" in activity
            assert "vertical_color" in activity
            assert "timestamp" in activity
            assert "points" in activity
            assert isinstance(activity["points"], int)


class TestMissionBoardLeaderboard:
    """Test Mission Board leaderboard endpoint"""
    
    def test_get_leaderboard(self):
        """GET /api/captain/mission-board/leaderboard - Returns ranked verticals"""
        response = requests.get(f"{BASE_URL}/api/captain/mission-board/leaderboard")
        assert response.status_code == 200
        
        data = response.json()
        
        # Verify response structure
        assert "leaderboard" in data
        assert "leader_vertical" in data
        assert "timestamp" in data
        
        leaderboard = data["leaderboard"]
        assert len(leaderboard) == 7  # All 7 verticals
        
        # Verify leaderboard is sorted by readiness (descending)
        for i in range(len(leaderboard) - 1):
            assert leaderboard[i]["readiness_percent"] >= leaderboard[i+1]["readiness_percent"], \
                "Leaderboard should be sorted by readiness descending"
        
        # Verify ranking structure
        for i, vertical in enumerate(leaderboard):
            assert "rank" in vertical
            assert vertical["rank"] == i + 1
            assert "badge" in vertical
            assert "code" in vertical
            assert "readiness_percent" in vertical
            assert "color" in vertical
        
        # Verify badges for top 3
        assert leaderboard[0]["badge"] == "🥇"
        assert leaderboard[1]["badge"] == "🥈"
        assert leaderboard[2]["badge"] == "🥉"


class TestMissionBoardLogMilestone:
    """Test Mission Board log milestone endpoint"""
    
    def test_log_milestone_success(self):
        """POST /api/captain/mission-board/log-milestone - Log custom milestone"""
        response = requests.post(
            f"{BASE_URL}/api/captain/mission-board/log-milestone",
            params={
                "vertical": "B2C",
                "milestone_type": "first_win",
                "title": "TEST_First Client Win",
                "description": "Closed first enterprise deal",
                "leader_name": "Test Leader",
                "points": 100
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "activity" in data
        assert data["message"] == "Milestone logged to mission board"
        
        # Verify activity structure
        activity = data["activity"]
        assert activity["vertical"] == "B2C"
        assert activity["title"] == "TEST_First Client Win"
        assert activity["description"] == "Closed first enterprise deal"
        assert activity["points"] == 100
        assert "id" in activity
        assert "timestamp" in activity
    
    def test_log_milestone_invalid_vertical(self):
        """POST /api/captain/mission-board/log-milestone - Invalid vertical returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/captain/mission-board/log-milestone",
            params={
                "vertical": "INVALID",
                "milestone_type": "first_win",
                "title": "Test",
                "description": "Test"
            }
        )
        assert response.status_code == 400
    
    def test_log_milestone_with_different_types(self):
        """POST /api/captain/mission-board/log-milestone - Test different milestone types"""
        milestone_types = ["leader_assigned", "kata_started", "kata_completed", "orbit_achieved", "team_expanded", "first_win"]
        
        for m_type in milestone_types:
            response = requests.post(
                f"{BASE_URL}/api/captain/mission-board/log-milestone",
                params={
                    "vertical": "A2A",
                    "milestone_type": m_type,
                    "title": f"TEST_{m_type}_milestone",
                    "description": f"Testing {m_type} milestone type",
                    "points": 50
                }
            )
            assert response.status_code == 200, f"Failed for milestone type: {m_type}"
            data = response.json()
            assert data["success"] == True


class TestMissionBoardIntegration:
    """Integration tests - verify data flows correctly"""
    
    def test_leader_assignment_affects_mission_board(self):
        """Verify that assigning a leader updates mission board readiness"""
        # Get initial mission board state
        initial_response = requests.get(f"{BASE_URL}/api/captain/mission-board")
        assert initial_response.status_code == 200
        initial_data = initial_response.json()
        
        # Assign a new leader
        test_leader = {
            "vertical": "B2G",
            "leader_name": f"TEST_MissionBoard_{uuid.uuid4().hex[:6]}",
            "leader_phone": "+919876543210",
            "leader_email": "test_mission@test.com",
            "designation": "Government Director"
        }
        
        assign_response = requests.post(
            f"{BASE_URL}/api/captain/assign-leader",
            json=test_leader
        )
        assert assign_response.status_code == 200
        
        # Get updated mission board
        updated_response = requests.get(f"{BASE_URL}/api/captain/mission-board")
        assert updated_response.status_code == 200
        updated_data = updated_response.json()
        
        # Find B2G vertical in both responses
        initial_b2g = next((v for v in initial_data["verticals_progress"] if v["code"] == "B2G"), None)
        updated_b2g = next((v for v in updated_data["verticals_progress"] if v["code"] == "B2G"), None)
        
        assert updated_b2g is not None
        assert updated_b2g["leader_name"] == test_leader["leader_name"]
        # Readiness should be at least 30% with a leader assigned
        assert updated_b2g["readiness_percent"] >= 30
    
    def test_activity_feed_shows_recent_activities(self):
        """Verify activity feed includes recent leader assignments"""
        # First assign a leader
        test_leader = {
            "vertical": "D2D",
            "leader_name": f"TEST_Activity_{uuid.uuid4().hex[:6]}",
            "leader_phone": "+919876543211",
            "designation": "Community Director"
        }
        
        assign_response = requests.post(
            f"{BASE_URL}/api/captain/assign-leader",
            json=test_leader
        )
        assert assign_response.status_code == 200
        
        # Check activity feed
        activity_response = requests.get(f"{BASE_URL}/api/captain/mission-board/activity")
        assert activity_response.status_code == 200
        
        data = activity_response.json()
        # Should have at least one activity
        assert data["total_activities"] >= 1
        
        # Check if our leader assignment is in the feed
        leader_activities = [a for a in data["activities"] if a["type"] == "leader_assigned"]
        assert len(leader_activities) >= 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
