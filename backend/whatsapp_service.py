"""
WhatsApp NDA Signing Service - DOERS LEGAL AI
Direct Founder → Command Centre → Candidate Onboarding

Features:
1. Send NDA documents via WhatsApp
2. Receive digital signature confirmations (OTP-based)
3. Track document status (sent, viewed, signed)
4. Notifications and approval workflow

Architecture:
- WhatsApp Business API (via Meta Cloud API or Twilio)
- OTP-based digital signatures
- PDF generation with signed watermark
- MongoDB for tracking

For production: Use Twilio WhatsApp or Meta Business API
For development: Uses simulation mode
"""

import os
import uuid
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import logging
import base64

load_dotenv()

logger = logging.getLogger(__name__)

# ============================================
# CONFIGURATION
# ============================================

# For production, use Twilio credentials
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.environ.get("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")

# Founder's WhatsApp number for approvals
FOUNDER_WHATSAPP = os.environ.get("FOUNDER_WHATSAPP", "+919876543210")

# Company Info
COMPANY_NAME = "Right Doers World Pvt. Ltd."
COMPANY_ADDRESS = "15th Floor, World Trade Centre, Bangalore, India"

# Is Twilio configured?
TWILIO_ENABLED = bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN)

# ============================================
# PYDANTIC MODELS
# ============================================

class WhatsAppMessage(BaseModel):
    """WhatsApp message model"""
    id: str = Field(default_factory=lambda: f"MSG-{str(uuid.uuid4())[:8].upper()}")
    to_phone: str
    from_phone: str = TWILIO_WHATSAPP_NUMBER
    message_type: str = "text"  # text, template, document
    content: str
    template_name: Optional[str] = None
    template_params: Optional[Dict[str, Any]] = None
    document_url: Optional[str] = None
    status: str = "pending"  # pending, sent, delivered, read, failed
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    delivered_at: Optional[str] = None
    read_at: Optional[str] = None

class NDASigningRequest(BaseModel):
    """NDA signing request via WhatsApp"""
    id: str = Field(default_factory=lambda: f"NDA-SIGN-{str(uuid.uuid4())[:8].upper()}")
    nda_id: str
    recipient_name: str
    recipient_phone: str
    recipient_email: str
    otp: Optional[str] = None
    otp_expiry: Optional[str] = None
    otp_verified: bool = False
    signature_hash: Optional[str] = None
    status: str = "initiated"  # initiated, otp_sent, verified, signed, rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    signed_at: Optional[str] = None

class OfferSigningRequest(BaseModel):
    """Offer letter signing request via WhatsApp"""
    id: str = Field(default_factory=lambda: f"OFFER-SIGN-{str(uuid.uuid4())[:8].upper()}")
    offer_id: str
    candidate_name: str
    candidate_phone: str
    candidate_email: str
    position: str
    division: str
    otp: Optional[str] = None
    otp_expiry: Optional[str] = None
    otp_verified: bool = False
    signature_hash: Optional[str] = None
    status: str = "initiated"  # initiated, otp_sent, verified, signed, rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    signed_at: Optional[str] = None

class FounderApprovalRequest(BaseModel):
    """Request for founder approval via WhatsApp"""
    id: str = Field(default_factory=lambda: f"APPR-{str(uuid.uuid4())[:8].upper()}")
    request_type: str  # nda_signing, offer_signing, new_hire, contract
    subject: str
    details: Dict[str, Any]
    requester_name: str
    requester_phone: str
    status: str = "pending"  # pending, approved, rejected
    founder_response: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    responded_at: Optional[str] = None

# ============================================
# WHATSAPP SERVICE
# ============================================

class WhatsAppService:
    """
    WhatsApp Business API Service for NDA Signing
    
    Flow:
    1. Generate NDA document
    2. Send NDA link via WhatsApp
    3. Send OTP for digital signature
    4. Verify OTP and mark as signed
    5. Notify founder of completion
    """
    
    def __init__(self):
        self.twilio_enabled = TWILIO_ENABLED
        self.client = None
        
        if self.twilio_enabled:
            try:
                from twilio.rest import Client
                self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                logger.info("WhatsApp Service: Twilio enabled")
            except ImportError:
                logger.warning("WhatsApp Service: Twilio SDK not installed")
                self.twilio_enabled = False
        else:
            logger.info("WhatsApp Service: Running in simulation mode")
    
    def _format_phone(self, phone: str) -> str:
        """Format phone number for WhatsApp"""
        # Remove spaces, dashes, etc.
        phone = ''.join(filter(str.isdigit, phone))
        
        # Add country code if missing (default to India)
        if not phone.startswith('91') and len(phone) == 10:
            phone = '91' + phone
        
        return f"whatsapp:+{phone}"
    
    def _generate_otp(self) -> str:
        """Generate 6-digit OTP"""
        return ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    
    def _generate_signature_hash(self, name: str, phone: str, otp: str, timestamp: str) -> str:
        """Generate digital signature hash"""
        data = f"{name}|{phone}|{otp}|{timestamp}|{COMPANY_NAME}"
        return hashlib.sha256(data.encode()).hexdigest()[:16].upper()
    
    async def send_message(self, to_phone: str, message: str) -> WhatsAppMessage:
        """Send WhatsApp message"""
        msg = WhatsAppMessage(
            to_phone=to_phone,
            content=message
        )
        
        if self.twilio_enabled and self.client:
            try:
                result = self.client.messages.create(
                    body=message,
                    from_=TWILIO_WHATSAPP_NUMBER,
                    to=self._format_phone(to_phone)
                )
                msg.status = "sent"
                logger.info(f"WhatsApp sent to {to_phone}: {result.sid}")
            except Exception as e:
                logger.error(f"WhatsApp send error: {e}")
                msg.status = "failed"
        else:
            # Simulation mode
            msg.status = "simulated"
            logger.info(f"[SIMULATED] WhatsApp to {to_phone}: {message[:100]}...")
        
        return msg
    
    async def send_nda_for_signing(self, nda_request: NDASigningRequest, nda_html_url: str) -> NDASigningRequest:
        """
        Send NDA document via WhatsApp for signing
        
        Flow:
        1. Send welcome message with NDA summary
        2. Send document link
        3. Send OTP for verification
        """
        # Generate OTP
        otp = self._generate_otp()
        otp_expiry = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        
        nda_request.otp = otp
        nda_request.otp_expiry = otp_expiry
        nda_request.status = "otp_sent"
        
        # Message 1: Welcome and context
        welcome_msg = f"""🚀 *RIGHT DOERS WORLD*
Global Capability Centre for Human Xperts

नमस्ते {nda_request.recipient_name}! 🙏

You have been invited to sign a *Non-Disclosure Agreement (NDA)* with {COMPANY_NAME}.

📄 *Document:* NDA-{nda_request.nda_id}
🏢 *Company:* {COMPANY_NAME}
📍 *Location:* {COMPANY_ADDRESS}

This NDA ensures confidentiality of all business information shared with you."""
        
        await self.send_message(nda_request.recipient_phone, welcome_msg)
        
        # Message 2: Document link
        doc_msg = f"""📋 *View your NDA Document:*
{nda_html_url}

Please review the document carefully before signing."""
        
        await self.send_message(nda_request.recipient_phone, doc_msg)
        
        # Message 3: OTP for signing
        otp_msg = f"""✍️ *Digital Signature Required*

To sign this NDA digitally, please reply with the following OTP:

🔐 *Your OTP:* {otp}

This OTP is valid for 24 hours.

By replying with this OTP, you confirm that:
1. You have read and understood the NDA
2. You agree to all terms and conditions
3. This constitutes your digital signature

Reply with: SIGN {otp}

Or reply REJECT to decline."""
        
        await self.send_message(nda_request.recipient_phone, otp_msg)
        
        return nda_request
    
    async def send_offer_for_signing(self, offer_request: OfferSigningRequest, offer_html_url: str) -> OfferSigningRequest:
        """Send Offer Letter via WhatsApp for signing"""
        # Generate OTP
        otp = self._generate_otp()
        otp_expiry = (datetime.now(timezone.utc) + timedelta(hours=48)).isoformat()
        
        offer_request.otp = otp
        offer_request.otp_expiry = otp_expiry
        offer_request.status = "otp_sent"
        
        # Welcome message
        welcome_msg = f"""🎉 *CONGRATULATIONS!*

Dear {offer_request.candidate_name},

🚀 *RIGHT DOERS WORLD* is pleased to offer you the position of *{offer_request.position}* in our *{offer_request.division}* division!

📄 *Offer ID:* {offer_request.offer_id}
🏢 *Company:* {COMPANY_NAME}
📍 *Location:* {COMPANY_ADDRESS}

We are excited to have you join our team!"""
        
        await self.send_message(offer_request.candidate_phone, welcome_msg)
        
        # Document link
        doc_msg = f"""📋 *View your Offer Letter:*
{offer_html_url}

Please review your compensation package and terms."""
        
        await self.send_message(offer_request.candidate_phone, doc_msg)
        
        # OTP for acceptance
        otp_msg = f"""✍️ *Accept Your Offer*

To accept this offer digitally, reply with:

🔐 *ACCEPT {otp}*

This OTP is valid for 48 hours.

By accepting, you confirm:
1. You have read the offer letter
2. You agree to the terms and conditions
3. You will join on the specified date

Or reply DECLINE to reject the offer."""
        
        await self.send_message(offer_request.candidate_phone, otp_msg)
        
        return offer_request
    
    async def verify_nda_signature(self, nda_request: NDASigningRequest, user_otp: str) -> bool:
        """Verify OTP and mark NDA as signed"""
        if nda_request.otp != user_otp:
            return False
        
        # Check expiry
        if nda_request.otp_expiry:
            expiry = datetime.fromisoformat(nda_request.otp_expiry.replace('Z', '+00:00'))
            if datetime.now(timezone.utc) > expiry:
                return False
        
        # Generate signature hash
        timestamp = datetime.now(timezone.utc).isoformat()
        signature = self._generate_signature_hash(
            nda_request.recipient_name,
            nda_request.recipient_phone,
            user_otp,
            timestamp
        )
        
        nda_request.otp_verified = True
        nda_request.signature_hash = signature
        nda_request.status = "signed"
        nda_request.signed_at = timestamp
        
        # Send confirmation
        confirm_msg = f"""✅ *NDA SIGNED SUCCESSFULLY*

Dear {nda_request.recipient_name},

Your NDA has been digitally signed!

📝 *Document ID:* {nda_request.nda_id}
🔏 *Signature:* {signature}
📅 *Signed at:* {timestamp[:10]}

Thank you for joining {COMPANY_NAME}!

A copy of the signed document will be sent to your email."""
        
        await self.send_message(nda_request.recipient_phone, confirm_msg)
        
        # Notify founder
        await self.notify_founder(
            f"✅ NDA Signed: {nda_request.recipient_name} ({nda_request.recipient_phone}) has signed NDA-{nda_request.nda_id}"
        )
        
        return True
    
    async def verify_offer_acceptance(self, offer_request: OfferSigningRequest, user_otp: str) -> bool:
        """Verify OTP and mark Offer as accepted"""
        if offer_request.otp != user_otp:
            return False
        
        # Check expiry
        if offer_request.otp_expiry:
            expiry = datetime.fromisoformat(offer_request.otp_expiry.replace('Z', '+00:00'))
            if datetime.now(timezone.utc) > expiry:
                return False
        
        # Generate signature hash
        timestamp = datetime.now(timezone.utc).isoformat()
        signature = self._generate_signature_hash(
            offer_request.candidate_name,
            offer_request.candidate_phone,
            user_otp,
            timestamp
        )
        
        offer_request.otp_verified = True
        offer_request.signature_hash = signature
        offer_request.status = "signed"
        offer_request.signed_at = timestamp
        
        # Send confirmation
        confirm_msg = f"""🎉 *OFFER ACCEPTED!*

Dear {offer_request.candidate_name},

Welcome to the team! 🚀

📋 *Position:* {offer_request.position}
🏢 *Division:* {offer_request.division}
🔏 *Acceptance ID:* {signature}

Our HR team will contact you shortly with next steps.

We look forward to working with you!

*Right Doers World Pvt. Ltd.*
15th Floor, World Trade Centre
Bangalore"""
        
        await self.send_message(offer_request.candidate_phone, confirm_msg)
        
        # Notify founder
        await self.notify_founder(
            f"🎉 Offer Accepted: {offer_request.candidate_name} has accepted the {offer_request.position} position in {offer_request.division}!"
        )
        
        return True
    
    async def notify_founder(self, message: str) -> WhatsAppMessage:
        """Send notification to founder"""
        return await self.send_message(FOUNDER_WHATSAPP, message)
    
    async def request_founder_approval(self, approval: FounderApprovalRequest) -> FounderApprovalRequest:
        """Request approval from founder via WhatsApp"""
        msg = f"""🔔 *APPROVAL REQUIRED*

*Type:* {approval.request_type.replace('_', ' ').title()}
*Subject:* {approval.subject}

*Details:*
"""
        for key, value in approval.details.items():
            msg += f"• {key.replace('_', ' ').title()}: {value}\n"
        
        msg += f"""
*Requested by:* {approval.requester_name}
*Contact:* {approval.requester_phone}
*Request ID:* {approval.id}

Reply with:
✅ APPROVE {approval.id}
❌ REJECT {approval.id}"""
        
        await self.notify_founder(msg)
        
        return approval
    
    async def send_welcome_notification(self, name: str, phone: str, role: str) -> WhatsAppMessage:
        """Send welcome notification to new team member"""
        msg = f"""🚀 *Welcome to RIGHT DOERS WORLD!*

Dear {name},

Congratulations on joining as *{role}*!

You are now part of the Global Capability Centre for Human Xperts at World Trade Centre, Bangalore.

*Quick Links:*
🔗 HI AI-APP: https://hi-ai-app.com
📱 Gemma AI: https://hi-ai-app.com/gemma
📊 Your Profile: https://hi-ai-app.com/dp

Need help? Reply to this message.

*Right Doers World Pvt. Ltd.*
15th Floor, World Trade Centre
Bangalore, India 🇮🇳"""
        
        return await self.send_message(phone, msg)

# ============================================
# MESSAGE HANDLER (For incoming messages)
# ============================================

class WhatsAppMessageHandler:
    """
    Handle incoming WhatsApp messages
    
    Commands:
    - SIGN <OTP> - Sign NDA
    - ACCEPT <OTP> - Accept offer
    - REJECT - Reject document
    - APPROVE <ID> - Approve request (founder only)
    - STATUS <ID> - Check document status
    - HELP - Show commands
    """
    
    def __init__(self, service: WhatsAppService):
        self.service = service
        self.pending_signatures: Dict[str, NDASigningRequest] = {}
        self.pending_offers: Dict[str, OfferSigningRequest] = {}
        self.pending_approvals: Dict[str, FounderApprovalRequest] = {}
    
    async def handle_message(self, from_phone: str, message: str) -> str:
        """Process incoming WhatsApp message and return response"""
        message = message.strip().upper()
        
        # SIGN command
        if message.startswith("SIGN "):
            otp = message.replace("SIGN ", "").strip()
            return await self._handle_sign(from_phone, otp)
        
        # ACCEPT command
        if message.startswith("ACCEPT "):
            otp = message.replace("ACCEPT ", "").strip()
            return await self._handle_accept(from_phone, otp)
        
        # REJECT command
        if message == "REJECT" or message == "DECLINE":
            return await self._handle_reject(from_phone)
        
        # APPROVE command (founder only)
        if message.startswith("APPROVE ") and self._is_founder(from_phone):
            request_id = message.replace("APPROVE ", "").strip()
            return await self._handle_approve(request_id)
        
        # STATUS command
        if message.startswith("STATUS "):
            doc_id = message.replace("STATUS ", "").strip()
            return await self._handle_status(from_phone, doc_id)
        
        # HELP command
        if message == "HELP" or message == "?":
            return self._get_help_text()
        
        return "Unknown command. Reply HELP for available commands."
    
    def _is_founder(self, phone: str) -> bool:
        """Check if phone belongs to founder"""
        clean_phone = ''.join(filter(str.isdigit, phone))
        founder_clean = ''.join(filter(str.isdigit, FOUNDER_WHATSAPP))
        return clean_phone.endswith(founder_clean[-10:])
    
    async def _handle_sign(self, phone: str, otp: str) -> str:
        """Handle NDA signing"""
        # Find pending signature for this phone
        for req_id, req in self.pending_signatures.items():
            if phone.endswith(req.recipient_phone[-10:]):
                if await self.service.verify_nda_signature(req, otp):
                    return "✅ NDA signed successfully! Check your messages for confirmation."
                else:
                    return "❌ Invalid or expired OTP. Please check and try again."
        
        return "No pending NDA found for your number. Contact HR if you believe this is an error."
    
    async def _handle_accept(self, phone: str, otp: str) -> str:
        """Handle offer acceptance"""
        for req_id, req in self.pending_offers.items():
            if phone.endswith(req.candidate_phone[-10:]):
                if await self.service.verify_offer_acceptance(req, otp):
                    return "🎉 Offer accepted! Welcome to the team!"
                else:
                    return "❌ Invalid or expired OTP. Please check and try again."
        
        return "No pending offer found for your number. Contact HR for assistance."
    
    async def _handle_reject(self, phone: str) -> str:
        """Handle document rejection"""
        # Check NDA signatures
        for req_id, req in self.pending_signatures.items():
            if phone.endswith(req.recipient_phone[-10:]):
                req.status = "rejected"
                await self.service.notify_founder(
                    f"❌ NDA Rejected: {req.recipient_name} has rejected NDA-{req.nda_id}"
                )
                return "Document rejected. The relevant team has been notified."
        
        # Check offers
        for req_id, req in self.pending_offers.items():
            if phone.endswith(req.candidate_phone[-10:]):
                req.status = "rejected"
                await self.service.notify_founder(
                    f"❌ Offer Declined: {req.candidate_name} has declined the {req.position} offer."
                )
                return "Offer declined. We wish you the best in your endeavors."
        
        return "No pending document found to reject."
    
    async def _handle_approve(self, request_id: str) -> str:
        """Handle founder approval"""
        if request_id in self.pending_approvals:
            approval = self.pending_approvals[request_id]
            approval.status = "approved"
            approval.responded_at = datetime.now(timezone.utc).isoformat()
            return f"✅ Approved: {approval.subject}"
        
        return "Request not found."
    
    async def _handle_status(self, phone: str, doc_id: str) -> str:
        """Handle status inquiry"""
        # Check NDA
        for req_id, req in self.pending_signatures.items():
            if doc_id in req.nda_id or doc_id in req_id:
                return f"""📋 *NDA Status*
Document: {req.nda_id}
Recipient: {req.recipient_name}
Status: {req.status.upper()}
Created: {req.created_at[:10]}"""
        
        # Check offers
        for req_id, req in self.pending_offers.items():
            if doc_id in req.offer_id or doc_id in req_id:
                return f"""📋 *Offer Status*
Document: {req.offer_id}
Candidate: {req.candidate_name}
Position: {req.position}
Status: {req.status.upper()}
Created: {req.created_at[:10]}"""
        
        return "Document not found."
    
    def _get_help_text(self) -> str:
        """Return help text"""
        return """📱 *WhatsApp Commands*

*For Document Signing:*
• SIGN <OTP> - Sign NDA with OTP
• ACCEPT <OTP> - Accept offer with OTP
• REJECT - Decline document

*For Status:*
• STATUS <ID> - Check document status

*For Help:*
• HELP - Show this message

*Need Assistance?*
Contact HR: hr@rightdoers.com
📍 World Trade Centre, Bangalore"""
    
    def add_pending_signature(self, request: NDASigningRequest):
        """Add pending NDA signature"""
        self.pending_signatures[request.id] = request
    
    def add_pending_offer(self, request: OfferSigningRequest):
        """Add pending offer"""
        self.pending_offers[request.id] = request
    
    def add_pending_approval(self, request: FounderApprovalRequest):
        """Add pending approval"""
        self.pending_approvals[request.id] = request

# ============================================
# GLOBAL INSTANCES
# ============================================

whatsapp_service = WhatsAppService()
message_handler = WhatsAppMessageHandler(whatsapp_service)
