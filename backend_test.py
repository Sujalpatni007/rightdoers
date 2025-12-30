#!/usr/bin/env python3
"""
Right Doers World - Backend API Testing
Tests all API endpoints for the AI-native workforce matching platform
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, List, Any

class RightDoersAPITester:
    def __init__(self, base_url="https://talenton.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "error": details})
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200 and "Right Doers World" in response.text
            self.log_test("API Root Endpoint", success, 
                         f"Status: {response.status_code}" if not success else "")
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_send_otp(self, phone="9876543210"):
        """Test OTP sending"""
        try:
            response = requests.post(f"{self.api_url}/auth/send-otp", 
                                   json={"phone": phone}, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            self.log_test("Send OTP", success, 
                         f"Status: {response.status_code}" if not success else "")
            return data.get("otp") if success else None
        except Exception as e:
            self.log_test("Send OTP", False, str(e))
            return None

    def test_verify_otp(self, phone="9876543210", otp="123456"):
        """Test OTP verification"""
        try:
            response = requests.post(f"{self.api_url}/auth/verify-otp", 
                                   json={"phone": phone, "otp": otp}, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            self.log_test("Verify OTP", success, 
                         f"Status: {response.status_code}" if not success else "")
            return data if success else None
        except Exception as e:
            self.log_test("Verify OTP", False, str(e))
            return None

    def test_create_user(self, phone="9876543210", name="Test Doer", role="doer"):
        """Test user creation"""
        try:
            user_data = {
                "phone": phone,
                "name": name,
                "role": role,
                "division": "Technology" if role == "doer" else None,
                "pincode": "560001" if role == "doer" else None,
                "company_name": "Test Company" if role == "employer" else None
            }
            
            response = requests.post(f"{self.api_url}/users", 
                                   json=user_data, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            self.log_test(f"Create {role.title()} User", success, 
                         f"Status: {response.status_code}" if not success else "")
            return data if success else None
        except Exception as e:
            self.log_test(f"Create {role.title()} User", False, str(e))
            return None

    def test_get_user(self, user_id):
        """Test get user by ID"""
        try:
            response = requests.get(f"{self.api_url}/users/{user_id}", timeout=10)
            success = response.status_code == 200
            
            self.log_test("Get User by ID", success, 
                         f"Status: {response.status_code}" if not success else "")
            return response.json() if success else None
        except Exception as e:
            self.log_test("Get User by ID", False, str(e))
            return None

    def test_get_user_by_phone(self, phone="9876543210"):
        """Test get user by phone"""
        try:
            response = requests.get(f"{self.api_url}/users/phone/{phone}", timeout=10)
            success = response.status_code == 200
            
            self.log_test("Get User by Phone", success, 
                         f"Status: {response.status_code}" if not success else "")
            return response.json() if success else None
        except Exception as e:
            self.log_test("Get User by Phone", False, str(e))
            return None

    def test_seed_data(self):
        """Test seed data creation"""
        try:
            response = requests.post(f"{self.api_url}/seed", timeout=15)
            success = response.status_code == 200
            
            self.log_test("Seed Data", success, 
                         f"Status: {response.status_code}" if not success else "")
            return success
        except Exception as e:
            self.log_test("Seed Data", False, str(e))
            return False

    def test_get_jobs(self):
        """Test get jobs endpoint"""
        try:
            response = requests.get(f"{self.api_url}/jobs", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else []
            
            self.log_test("Get Jobs", success, 
                         f"Status: {response.status_code}, Jobs: {len(data)}" if success 
                         else f"Status: {response.status_code}")
            return data if success else []
        except Exception as e:
            self.log_test("Get Jobs", False, str(e))
            return []

    def test_get_jobs_with_filters(self):
        """Test jobs with filters"""
        try:
            params = {"division": "Technology", "level": "L2", "limit": 5}
            response = requests.get(f"{self.api_url}/jobs", params=params, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else []
            
            self.log_test("Get Jobs with Filters", success, 
                         f"Status: {response.status_code}, Filtered Jobs: {len(data)}" if success 
                         else f"Status: {response.status_code}")
            return data if success else []
        except Exception as e:
            self.log_test("Get Jobs with Filters", False, str(e))
            return []

    def test_create_job(self, employer_id):
        """Test job creation"""
        try:
            job_data = {
                "title": "Test Software Developer",
                "description": "Test job for API testing",
                "company_name": "Test Company",
                "division": "Technology",
                "level": "L2",
                "salary_min": 40000,
                "salary_max": 60000,
                "pincode": "560001",
                "requirements": ["Python", "Testing"],
                "employer_id": employer_id
            }
            
            response = requests.post(f"{self.api_url}/jobs", 
                                   json=job_data, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            self.log_test("Create Job", success, 
                         f"Status: {response.status_code}" if not success else "")
            return data if success else None
        except Exception as e:
            self.log_test("Create Job", False, str(e))
            return None

    def test_job_application(self, job_id, doer_id):
        """Test job application"""
        try:
            response = requests.post(f"{self.api_url}/applications", 
                                   params={"job_id": job_id, "doer_id": doer_id}, 
                                   timeout=10)
            success = response.status_code == 200
            
            self.log_test("Job Application", success, 
                         f"Status: {response.status_code}" if not success else "")
            return success
        except Exception as e:
            self.log_test("Job Application", False, str(e))
            return False

    def test_get_doer_applications(self, doer_id):
        """Test get doer applications"""
        try:
            response = requests.get(f"{self.api_url}/applications/doer/{doer_id}", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else []
            
            self.log_test("Get Doer Applications", success, 
                         f"Status: {response.status_code}, Applications: {len(data)}" if success 
                         else f"Status: {response.status_code}")
            return data if success else []
        except Exception as e:
            self.log_test("Get Doer Applications", False, str(e))
            return []

    def test_aimee_chat(self, user_id):
        """Test AIMEE AI chat"""
        try:
            chat_data = {
                "message": "Find me technology jobs",
                "user_id": user_id,
                "session_id": f"test_session_{user_id}"
            }
            
            response = requests.post(f"{self.api_url}/aimee/chat", 
                                   json=chat_data, timeout=15)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            self.log_test("AIMEE Chat", success, 
                         f"Status: {response.status_code}" if not success else 
                         f"Response length: {len(data.get('response', ''))}")
            return data if success else None
        except Exception as e:
            self.log_test("AIMEE Chat", False, str(e))
            return None

    def test_admin_stats(self):
        """Test admin dashboard stats"""
        try:
            response = requests.get(f"{self.api_url}/admin/stats", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            
            self.log_test("Admin Stats", success, 
                         f"Status: {response.status_code}" if not success else 
                         f"Stats: {list(data.keys())}")
            return data if success else None
        except Exception as e:
            self.log_test("Admin Stats", False, str(e))
            return None

    def run_comprehensive_test(self):
        """Run all tests in sequence"""
        print("🚀 Starting Right Doers World API Testing...")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 60)

        # Test 1: API Root
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return self.generate_report()

        # Test 2: Seed data first
        self.test_seed_data()

        # Test 3: Authentication flow
        test_phone = "9876543210"
        otp = self.test_send_otp(test_phone)
        if otp:
            self.test_verify_otp(test_phone, otp)

        # Test 4: User creation
        doer = self.test_create_user(test_phone, "Test Doer", "doer")
        employer = self.test_create_user("9876543211", "Test Employer", "employer")
        admin = self.test_create_user("9876543212", "Test Admin", "admin")

        # Test 5: User retrieval
        if doer:
            self.test_get_user(doer.get("id"))
            self.test_get_user_by_phone(test_phone)

        # Test 6: Jobs
        jobs = self.test_get_jobs()
        self.test_get_jobs_with_filters()

        # Test 7: Job creation
        created_job = None
        if employer:
            created_job = self.test_create_job(employer.get("id"))

        # Test 8: Job applications
        if doer and (jobs or created_job):
            job_id = created_job.get("id") if created_job else jobs[0].get("id")
            if job_id:
                self.test_job_application(job_id, doer.get("id"))
                self.test_get_doer_applications(doer.get("id"))

        # Test 9: AIMEE AI Chat
        if doer:
            self.test_aimee_chat(doer.get("id"))

        # Test 10: Admin stats
        self.test_admin_stats()

        return self.generate_report()

    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")

        if self.failed_tests:
            print("\n🔍 FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"  • {failure['test']}: {failure['error']}")

        # Determine critical issues
        critical_issues = []
        if not any(r["test"] == "API Root Endpoint" and r["success"] for r in self.test_results):
            critical_issues.append("API not accessible")
        
        backend_endpoints_working = sum(1 for r in self.test_results 
                                      if r["success"] and "API" not in r["test"]) / max(1, len(self.test_results) - 1)
        
        if backend_endpoints_working < 0.5:
            critical_issues.append("More than 50% of endpoints failing")

        return {
            "tests_run": self.tests_run,
            "tests_passed": self.tests_passed,
            "success_rate": self.tests_passed/self.tests_run*100 if self.tests_run > 0 else 0,
            "failed_tests": self.failed_tests,
            "critical_issues": critical_issues,
            "test_results": self.test_results
        }

def main():
    """Main test execution"""
    tester = RightDoersAPITester()
    results = tester.run_comprehensive_test()
    
    # Save results to file
    with open("/app/backend_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to: /app/backend_test_results.json")
    
    # Return appropriate exit code
    return 0 if results["success_rate"] > 80 else 1

if __name__ == "__main__":
    sys.exit(main())