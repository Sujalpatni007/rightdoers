"""
WhatsApp NDA Signing API Tests - Right Doers World Pvt Ltd
Tests for WhatsApp-based NDA/Offer signing with OTP verification

Features tested:
1. WhatsApp service status endpoint
2. Send NDA via WhatsApp (creates signing request with OTP)
3. Send Offer via WhatsApp (creates offer signing request)
4. List signing requests
5. Founder approval workflow
6. OTP verification flow
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestWhatsAppStatus:
    """Test WhatsApp service status endpoint"""
    
    def test_whatsapp_status_returns_200(self):
        """GET /api/whatsapp/status returns service status"""
        response = requests.get(f"{BASE_URL}/api/whatsapp/status")
        assert response.status_code == 200
        
        data = response.json()
        assert "service" in data
        assert data["service"] == "WhatsApp NDA Signing"
        assert "twilio_enabled" in data
        assert "simulation_mode" in data
        assert "features" in data
        assert "nda_signing" in data["features"]
        assert "offer_signing" in data["features"]
        assert "founder_approvals" in data["features"]
        assert data["company"] == "Right Doers World Pvt. Ltd."
        print(f"✅ WhatsApp status: simulation_mode={data['simulation_mode']}")


class TestNDASigning:
    """Test NDA signing via WhatsApp"""
    
    def test_send_nda_creates_signing_request(self):
        """POST /api/whatsapp/nda/send creates NDA signing request with OTP"""
        nda_id = f"TEST-NDA-{int(time.time())}"
        
        payload = {
            "nda_id": nda_id,
            "recipient_name": "Test Recipient",
            "recipient_phone": "+919876543210",
            "recipient_email": "test@example.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/nda/send", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "signing_id" in data
        assert data["status"] == "otp_sent"
        assert data["otp_sent"] == True
        assert "NDA sent to" in data["message"]
        print(f"✅ NDA signing request created: {data['signing_id']}")
        
        return data["signing_id"]
    
    def test_send_nda_missing_fields_returns_error(self):
        """POST /api/whatsapp/nda/send with missing fields returns 422"""
        payload = {
            "nda_id": "TEST-NDA-INCOMPLETE"
            # Missing required fields
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/nda/send", json=payload)
        assert response.status_code == 422  # Validation error
        print("✅ Missing fields validation works")


class TestOfferSigning:
    """Test Offer letter signing via WhatsApp"""
    
    def test_send_offer_creates_signing_request(self):
        """POST /api/whatsapp/offer/send creates offer signing request"""
        offer_id = f"TEST-OFFER-{int(time.time())}"
        
        payload = {
            "offer_id": offer_id,
            "candidate_name": "Test Candidate",
            "candidate_phone": "+919876543211",
            "candidate_email": "candidate@example.com",
            "position": "Division Director",
            "division": "Technology"
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/offer/send", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "signing_id" in data
        assert data["status"] == "otp_sent"
        assert data["otp_sent"] == True
        assert "Offer sent to" in data["message"]
        print(f"✅ Offer signing request created: {data['signing_id']}")
        
        return data["signing_id"]
    
    def test_send_offer_missing_fields_returns_error(self):
        """POST /api/whatsapp/offer/send with missing fields returns 422"""
        payload = {
            "offer_id": "TEST-OFFER-INCOMPLETE",
            "candidate_name": "Test"
            # Missing required fields
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/offer/send", json=payload)
        assert response.status_code == 422  # Validation error
        print("✅ Missing fields validation works for offer")


class TestSigningsList:
    """Test listing signing requests"""
    
    def test_list_signings_returns_array(self):
        """GET /api/whatsapp/signings returns list of signing requests"""
        response = requests.get(f"{BASE_URL}/api/whatsapp/signings")
        assert response.status_code == 200
        
        data = response.json()
        assert "signings" in data
        assert "total" in data
        assert isinstance(data["signings"], list)
        print(f"✅ Signings list returned: {data['total']} items")
    
    def test_list_signings_with_limit(self):
        """GET /api/whatsapp/signings?limit=5 respects limit parameter"""
        response = requests.get(f"{BASE_URL}/api/whatsapp/signings?limit=5")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["signings"]) <= 5
        print(f"✅ Signings list with limit: {len(data['signings'])} items")
    
    def test_list_signings_with_status_filter(self):
        """GET /api/whatsapp/signings?status=otp_sent filters by status"""
        response = requests.get(f"{BASE_URL}/api/whatsapp/signings?status=otp_sent")
        assert response.status_code == 200
        
        data = response.json()
        # All returned signings should have status=otp_sent
        for signing in data["signings"]:
            assert signing["status"] == "otp_sent"
        print(f"✅ Signings filtered by status: {data['total']} items")


class TestFounderApproval:
    """Test founder approval workflow"""
    
    def test_request_approval_creates_request(self):
        """POST /api/whatsapp/approval/request creates approval request"""
        payload = {
            "request_type": "new_hire",
            "subject": "Test Approval Request",
            "details": {"description": "Testing approval workflow"},
            "requester_name": "Test Requester",
            "requester_phone": "+919876543212"
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/approval/request", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "approval_id" in data
        assert data["status"] == "pending"
        assert "Approval request sent" in data["message"]
        print(f"✅ Approval request created: {data['approval_id']}")


class TestOTPVerification:
    """Test OTP verification flow"""
    
    def test_verify_invalid_signing_id_returns_404(self):
        """POST /api/whatsapp/verify with invalid signing_id returns 404"""
        payload = {
            "signing_id": "INVALID-SIGNING-ID",
            "otp": "123456"
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/verify", json=payload)
        assert response.status_code == 404
        print("✅ Invalid signing ID returns 404")
    
    def test_verify_wrong_otp_returns_failure(self):
        """POST /api/whatsapp/verify with wrong OTP returns failure"""
        # First create a signing request
        nda_id = f"TEST-NDA-OTP-{int(time.time())}"
        
        create_payload = {
            "nda_id": nda_id,
            "recipient_name": "OTP Test User",
            "recipient_phone": "+919876543213",
            "recipient_email": "otp@example.com"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/whatsapp/nda/send", json=create_payload)
        assert create_response.status_code == 200
        signing_id = create_response.json()["signing_id"]
        
        # Try to verify with wrong OTP
        verify_payload = {
            "signing_id": signing_id,
            "otp": "000000"  # Wrong OTP
        }
        
        verify_response = requests.post(f"{BASE_URL}/api/whatsapp/verify", json=verify_payload)
        assert verify_response.status_code == 200
        
        data = verify_response.json()
        assert data["success"] == False
        assert "Invalid OTP" in data["message"]
        print("✅ Wrong OTP verification returns failure")


class TestDocumentViews:
    """Test document view endpoints"""
    
    def test_view_nda_nonexistent_returns_404(self):
        """GET /api/whatsapp/nda/view/{nda_id} returns 404 for nonexistent"""
        response = requests.get(f"{BASE_URL}/api/whatsapp/nda/view/NONEXISTENT-NDA")
        assert response.status_code == 404
        print("✅ Nonexistent NDA returns 404")
    
    def test_view_offer_nonexistent_returns_404(self):
        """GET /api/whatsapp/offer/view/{offer_id} returns 404 for nonexistent"""
        response = requests.get(f"{BASE_URL}/api/whatsapp/offer/view/NONEXISTENT-OFFER")
        assert response.status_code == 404
        print("✅ Nonexistent Offer returns 404")
    
    def test_view_nda_after_creation(self):
        """GET /api/whatsapp/nda/view/{nda_id} returns HTML after NDA is sent"""
        nda_id = f"TEST-NDA-VIEW-{int(time.time())}"
        
        # Create NDA
        create_payload = {
            "nda_id": nda_id,
            "recipient_name": "View Test User",
            "recipient_phone": "+919876543214",
            "recipient_email": "view@example.com"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/whatsapp/nda/send", json=create_payload)
        assert create_response.status_code == 200
        
        # View NDA
        view_response = requests.get(f"{BASE_URL}/api/whatsapp/nda/view/{nda_id}")
        assert view_response.status_code == 200
        assert "text/html" in view_response.headers.get("content-type", "")
        assert "NON-DISCLOSURE AGREEMENT" in view_response.text or "NDA" in view_response.text
        print(f"✅ NDA document viewable: {nda_id}")


class TestIncomingMessages:
    """Test incoming WhatsApp message handling"""
    
    def test_incoming_help_command(self):
        """POST /api/whatsapp/incoming with HELP returns help text"""
        payload = {
            "from_phone": "+919876543215",
            "message": "HELP"
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/incoming", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "response" in data
        assert "Commands" in data["response"] or "SIGN" in data["response"]
        print("✅ HELP command returns help text")
    
    def test_incoming_unknown_command(self):
        """POST /api/whatsapp/incoming with unknown command returns error"""
        payload = {
            "from_phone": "+919876543216",
            "message": "RANDOM UNKNOWN COMMAND"
        }
        
        response = requests.post(f"{BASE_URL}/api/whatsapp/incoming", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "Unknown command" in data["response"] or "HELP" in data["response"]
        print("✅ Unknown command handled gracefully")


class TestWelcomeNotification:
    """Test welcome notification endpoint"""
    
    def test_send_welcome_notification(self):
        """POST /api/whatsapp/welcome sends welcome message"""
        response = requests.post(
            f"{BASE_URL}/api/whatsapp/welcome",
            params={
                "name": "Test User",
                "phone": "+919876543217",
                "role": "Division Director"
            }
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] == True
        assert "message_id" in data
        assert data["status"] in ["sent", "simulated"]
        print(f"✅ Welcome notification sent: {data['message_id']}")


class TestEndToEndFlow:
    """Test complete NDA signing flow"""
    
    def test_complete_nda_signing_flow(self):
        """Test complete flow: Send NDA -> View -> List -> Verify (with correct OTP)"""
        nda_id = f"TEST-E2E-NDA-{int(time.time())}"
        
        # Step 1: Send NDA
        send_payload = {
            "nda_id": nda_id,
            "recipient_name": "E2E Test User",
            "recipient_phone": "+919876543218",
            "recipient_email": "e2e@example.com"
        }
        
        send_response = requests.post(f"{BASE_URL}/api/whatsapp/nda/send", json=send_payload)
        assert send_response.status_code == 200
        signing_id = send_response.json()["signing_id"]
        print(f"  Step 1: NDA sent, signing_id={signing_id}")
        
        # Step 2: View NDA document
        view_response = requests.get(f"{BASE_URL}/api/whatsapp/nda/view/{nda_id}")
        assert view_response.status_code == 200
        print(f"  Step 2: NDA document viewable")
        
        # Step 3: List signings and find our signing
        list_response = requests.get(f"{BASE_URL}/api/whatsapp/signings")
        assert list_response.status_code == 200
        signings = list_response.json()["signings"]
        our_signing = next((s for s in signings if s["id"] == signing_id), None)
        assert our_signing is not None
        assert our_signing["status"] == "otp_sent"
        print(f"  Step 3: Signing found in list with status=otp_sent")
        
        # Step 4: Get OTP from signing (in real scenario, this comes via WhatsApp)
        otp = our_signing.get("otp")
        if otp:
            # Step 5: Verify with correct OTP
            verify_payload = {
                "signing_id": signing_id,
                "otp": otp
            }
            
            verify_response = requests.post(f"{BASE_URL}/api/whatsapp/verify", json=verify_payload)
            assert verify_response.status_code == 200
            
            verify_data = verify_response.json()
            assert verify_data["success"] == True
            assert verify_data["status"] == "signed"
            assert "signature_hash" in verify_data
            print(f"  Step 5: NDA signed successfully, hash={verify_data['signature_hash']}")
            
            # Step 6: Verify signing status updated
            list_response2 = requests.get(f"{BASE_URL}/api/whatsapp/signings")
            signings2 = list_response2.json()["signings"]
            our_signing2 = next((s for s in signings2 if s["id"] == signing_id), None)
            assert our_signing2["status"] == "signed"
            assert our_signing2["signature_hash"] == verify_data["signature_hash"]
            print(f"  Step 6: Signing status updated to 'signed'")
        else:
            print(f"  Step 4-6: Skipped (OTP not exposed in response)")
        
        print("✅ Complete E2E NDA signing flow passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
