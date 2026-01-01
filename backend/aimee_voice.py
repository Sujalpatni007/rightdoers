# ============================================
# AIMEE TEXT-TO-SPEECH SERVICE
# Voice for the AI Assistant
# ============================================

from typing import Optional
import logging
import os
import base64

logger = logging.getLogger(__name__)

class AIMEEVoice:
    """
    Text-to-Speech service for AIMEE AI Assistant
    Uses OpenAI TTS via Emergent LLM Key
    Voice: Nova (energetic, upbeat) - perfect for AIMEE
    """
    
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY") or os.environ.get("OPENAI_API_KEY")
        self.tts = None
        self.default_voice = "nova"  # Energetic, upbeat - perfect for AIMEE
        self.default_model = "tts-1"  # Standard quality, faster for real-time
        
        if self.api_key:
            try:
                from emergentintegrations.llm.openai import OpenAITextToSpeech
                self.tts = OpenAITextToSpeech(api_key=self.api_key)
                logger.info("AIMEE Voice Service initialized with TTS")
            except ImportError:
                logger.warning("emergentintegrations not installed for TTS")
            except Exception as e:
                logger.error(f"Failed to initialize AIMEE Voice: {e}")
    
    async def speak(
        self,
        text: str,
        voice: Optional[str] = None,
        model: Optional[str] = None,
        speed: float = 1.0,
        response_format: str = "mp3"
    ) -> bytes:
        """
        Generate speech audio from text
        
        Args:
            text: Text to convert to speech (max 4096 characters)
            voice: Voice to use (alloy, ash, coral, echo, fable, nova, onyx, sage, shimmer)
            model: Model to use (tts-1 for speed, tts-1-hd for quality)
            speed: Speech speed (0.25 to 4.0, default 1.0)
            response_format: Output format (mp3, opus, aac, flac, wav, pcm)
        
        Returns:
            Audio bytes
        """
        if not self.tts:
            raise ValueError("AIMEE Voice not initialized. Check API key.")
        
        # Truncate text if too long
        if len(text) > 4096:
            text = text[:4093] + "..."
        
        try:
            audio_bytes = await self.tts.generate_speech(
                text=text,
                model=model or self.default_model,
                voice=voice or self.default_voice,
                speed=speed,
                response_format=response_format
            )
            return audio_bytes
        except Exception as e:
            logger.error(f"TTS generation error: {e}")
            raise
    
    async def speak_base64(
        self,
        text: str,
        voice: Optional[str] = None,
        model: Optional[str] = None,
        speed: float = 1.0
    ) -> str:
        """
        Generate speech and return as base64 string for web embedding
        """
        if not self.tts:
            raise ValueError("AIMEE Voice not initialized. Check API key.")
        
        if len(text) > 4096:
            text = text[:4093] + "..."
        
        try:
            audio_base64 = await self.tts.generate_speech_base64(
                text=text,
                model=model or self.default_model,
                voice=voice or self.default_voice,
                speed=speed
            )
            return audio_base64
        except Exception as e:
            logger.error(f"TTS base64 generation error: {e}")
            raise
    
    def is_available(self) -> bool:
        """Check if TTS is properly configured"""
        return self.tts is not None
    
    @staticmethod
    def get_available_voices():
        """Get list of available voices with descriptions"""
        return {
            "alloy": "Neutral, balanced",
            "ash": "Clear, articulate",
            "coral": "Warm, friendly",
            "echo": "Smooth, calm",
            "fable": "Expressive, storytelling",
            "nova": "Energetic, upbeat (AIMEE default)",
            "onyx": "Deep, authoritative",
            "sage": "Wise, measured",
            "shimmer": "Bright, cheerful"
        }

# Singleton instance
aimee_voice = AIMEEVoice()
