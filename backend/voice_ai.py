# ============================================
# VOICE AI SERVICE - Talk Component of 8 T's
# Uses OpenAI Whisper for Speech-to-Text
# Reid Hoffman Vision: Human-Computer Voice Interaction
# ============================================

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import logging
import os
import tempfile
import re

logger = logging.getLogger(__name__)

# ============================================
# VOICE COMMAND MODELS
# ============================================

class VoiceTranscription(BaseModel):
    text: str
    language: Optional[str] = "en"
    duration: Optional[float] = None
    confidence: Optional[float] = None

class VoiceCommand(BaseModel):
    raw_text: str
    intent: str  # navigate, search, create, ask, unknown
    action: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)
    confidence: float = 0.0

class VoiceResponse(BaseModel):
    success: bool
    transcription: Optional[VoiceTranscription] = None
    command: Optional[VoiceCommand] = None
    response_text: str = ""
    suggested_action: Optional[str] = None

# ============================================
# VOICE COMMAND PARSER
# ============================================

class VoiceCommandParser:
    """
    Parse transcribed text into actionable commands
    Supports: Navigation, Search, Profile Actions, Questions
    """
    
    # Navigation patterns
    NAVIGATION_PATTERNS = {
        r"(go to|open|show|navigate to|take me to)\s+(home|dashboard)": {"action": "navigate", "target": "/doer"},
        r"(go to|open|show)\s+(pricing|plans|subscription)": {"action": "navigate", "target": "/pricing"},
        r"(go to|open|show)\s+(jobs|job matching|jobs for me)": {"action": "navigate", "target": "/jobs4me"},
        r"(go to|open|show)\s+(profile|my profile|talent card)": {"action": "navigate", "target": "/dp"},
        r"(go to|open|show)\s+(family|family dashboard)": {"action": "navigate", "target": "/family"},
        r"(go to|open|show)\s+(streaks?|daily streak)": {"action": "navigate", "target": "/streaks"},
        r"(go to|open|show)\s+(proven profiles?|success stor(y|ies)|anushree)": {"action": "navigate", "target": "/proven-profiles"},
        r"(go to|open|show)\s+(kids?|kidz|children)": {"action": "navigate", "target": "/kidz"},
        r"(go to|open|show)\s+(teens?|teenagers?)": {"action": "navigate", "target": "/teens"},
        r"(go to|open|show)\s+(captain|founder|command cent(er|re))": {"action": "navigate", "target": "/captain"},
        r"(go to|open|show)\s+(compare|comparison)": {"action": "navigate", "target": "/compare"},
    }
    
    # Search patterns
    SEARCH_PATTERNS = {
        r"(search|find|look for)\s+(jobs?|positions?)\s+(for|about|in|related to)?\s*(.+)": "job_search",
        r"(search|find)\s+(.+)": "general_search",
    }
    
    # Action patterns
    ACTION_PATTERNS = {
        r"(create|make|generate)\s+(my)?\s*(profile|talent card)": {"action": "create_profile"},
        r"(take|start)\s+(assessment|test|quiz)": {"action": "start_assessment"},
        r"(share|send)\s+(my)?\s*(profile|talent card)": {"action": "share_profile"},
        r"(compare|match)\s+(my)?\s*(profile|score)": {"action": "compare_profile"},
        r"(update|edit)\s+(my)?\s*(profile|skills?)": {"action": "edit_profile"},
        r"(log ?out|sign ?out|exit)": {"action": "logout"},
    }
    
    # Question patterns
    QUESTION_PATTERNS = [
        r"(what is|what's)\s+(my)?\s*(doer ?score|score)",
        r"(how many|how much)\s+(.+)",
        r"(tell me|show me)\s+(about|my)\s+(.+)",
        r"(who is|who's)\s+(.+)",
    ]
    
    def parse(self, text: str) -> VoiceCommand:
        """
        Parse transcribed text into a structured command
        """
        text_lower = text.lower().strip()
        
        # Check navigation commands
        for pattern, nav_info in self.NAVIGATION_PATTERNS.items():
            if re.search(pattern, text_lower):
                return VoiceCommand(
                    raw_text=text,
                    intent="navigate",
                    action=nav_info["action"],
                    parameters={"target": nav_info["target"]},
                    confidence=0.9
                )
        
        # Check action commands
        for pattern, action_info in self.ACTION_PATTERNS.items():
            if re.search(pattern, text_lower):
                return VoiceCommand(
                    raw_text=text,
                    intent="action",
                    action=action_info["action"],
                    parameters={},
                    confidence=0.85
                )
        
        # Check search commands
        for pattern, search_type in self.SEARCH_PATTERNS.items():
            match = re.search(pattern, text_lower)
            if match:
                query = match.group(match.lastindex) if match.lastindex else ""
                return VoiceCommand(
                    raw_text=text,
                    intent="search",
                    action=search_type,
                    parameters={"query": query.strip()},
                    confidence=0.8
                )
        
        # Check questions
        for pattern in self.QUESTION_PATTERNS:
            if re.search(pattern, text_lower):
                return VoiceCommand(
                    raw_text=text,
                    intent="question",
                    action="ask",
                    parameters={"question": text},
                    confidence=0.75
                )
        
        # Unknown command - return as general query
        return VoiceCommand(
            raw_text=text,
            intent="unknown",
            action="general",
            parameters={"text": text},
            confidence=0.5
        )
    
    def get_response_text(self, command: VoiceCommand) -> str:
        """
        Generate a spoken response for the command
        """
        if command.intent == "navigate":
            target_names = {
                "/doer": "dashboard",
                "/pricing": "pricing page",
                "/jobs4me": "Jobs for Me",
                "/dp": "your profile",
                "/family": "family dashboard",
                "/streaks": "streak system",
                "/proven-profiles": "proven profiles",
                "/kidz": "Doer Kids",
                "/teens": "Doer Teens",
                "/captain": "Captain Command Centre",
                "/compare": "profile comparison"
            }
            target = command.parameters.get("target", "")
            name = target_names.get(target, "page")
            return f"Opening {name}"
        
        elif command.intent == "action":
            action_responses = {
                "create_profile": "Let's create your talent card",
                "start_assessment": "Starting assessment now",
                "share_profile": "Preparing to share your profile",
                "compare_profile": "Opening profile comparison",
                "edit_profile": "Opening profile editor",
                "logout": "Signing you out"
            }
            return action_responses.get(command.action, "Processing your request")
        
        elif command.intent == "search":
            query = command.parameters.get("query", "")
            if command.action == "job_search":
                return f"Searching jobs for {query}"
            return f"Searching for {query}"
        
        elif command.intent == "question":
            return "Let me find that information for you"
        
        return "I heard you. How can I help?"

# ============================================
# VOICE AI SERVICE
# ============================================

class VoiceAIService:
    """
    Voice AI Service using OpenAI Whisper
    Part of the 8 T's: TALK component
    """
    
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("OPENAI_API_KEY")
        self.parser = VoiceCommandParser()
        self.stt = None
        
        if self.api_key:
            try:
                from emergentintegrations.llm.openai import OpenAISpeechToText
                self.stt = OpenAISpeechToText(api_key=self.api_key)
                logger.info("Voice AI Service initialized with Whisper")
            except ImportError:
                logger.warning("emergentintegrations not installed")
            except Exception as e:
                logger.error(f"Failed to initialize Voice AI: {e}")
    
    async def transcribe_audio(self, audio_data: bytes, filename: str = "audio.webm") -> VoiceTranscription:
        """
        Transcribe audio data to text using Whisper
        """
        if not self.stt:
            raise ValueError("Voice AI not initialized. Check API key.")
        
        # Determine file extension
        ext = filename.split(".")[-1] if "." in filename else "webm"
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(suffix=f".{ext}", delete=False) as tmp:
            tmp.write(audio_data)
            tmp_path = tmp.name
        
        try:
            with open(tmp_path, "rb") as audio_file:
                response = await self.stt.transcribe(
                    file=audio_file,
                    model="whisper-1",
                    response_format="json",
                    language="en"
                )
            
            return VoiceTranscription(
                text=response.text,
                language="en",
                confidence=0.95
            )
        finally:
            # Cleanup temp file
            try:
                os.unlink(tmp_path)
            except:
                pass
    
    async def process_voice_command(self, audio_data: bytes, filename: str = "audio.webm") -> VoiceResponse:
        """
        Full pipeline: Transcribe audio → Parse command → Generate response
        """
        try:
            # Step 1: Transcribe
            transcription = await self.transcribe_audio(audio_data, filename)
            
            if not transcription.text.strip():
                return VoiceResponse(
                    success=False,
                    response_text="I couldn't hear anything. Please try again."
                )
            
            # Step 2: Parse command
            command = self.parser.parse(transcription.text)
            
            # Step 3: Generate response
            response_text = self.parser.get_response_text(command)
            
            # Determine suggested action
            suggested_action = None
            if command.intent == "navigate":
                suggested_action = f"NAVIGATE:{command.parameters.get('target', '/')}"
            elif command.intent == "search":
                query = command.parameters.get("query", "")
                if command.action == "job_search":
                    suggested_action = f"NAVIGATE:/jobs4me?q={query}"
                else:
                    suggested_action = f"SEARCH:{query}"
            elif command.intent == "action":
                action_routes = {
                    "create_profile": "NAVIGATE:/dp/create",
                    "start_assessment": "NAVIGATE:/psychometric",
                    "share_profile": "NAVIGATE:/compare",
                    "compare_profile": "NAVIGATE:/compare",
                    "edit_profile": "NAVIGATE:/dp",
                    "logout": "ACTION:logout"
                }
                suggested_action = action_routes.get(command.action)
            
            return VoiceResponse(
                success=True,
                transcription=transcription,
                command=command,
                response_text=response_text,
                suggested_action=suggested_action
            )
            
        except Exception as e:
            logger.error(f"Voice command processing error: {e}")
            return VoiceResponse(
                success=False,
                response_text=f"Sorry, I had trouble processing that. {str(e)}"
            )
    
    def is_available(self) -> bool:
        """Check if Voice AI is properly configured"""
        return self.stt is not None

# Singleton instance
voice_ai = VoiceAIService()
