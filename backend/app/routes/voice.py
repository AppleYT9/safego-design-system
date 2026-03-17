from __future__ import annotations

import os
import re
import base64
from typing import Optional
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, SOSAlert, SOSStatus, SOSSeverity, Ride, RideStatus
from app.schemas import (
    VoiceCommandRequest, VoiceActionResponse, LocationShareRequest,
    SOSTriggerRequest, SOSResponse, RideResponse
)
from app.utils.dependencies import get_current_user, get_optional_user
from app.services.browser_service import BrowserOperator
import asyncio
import json
from openai import AsyncOpenAI

router = APIRouter(prefix="/api/voice", tags=["voice"])



# ---------------------------------------------------------------------------
# Feature/navigation map
# ---------------------------------------------------------------------------
FEATURE_MAP = {
    # Modes
    "pwd_mode":       {"target": "/pwd-mode",        "keywords": ["pwd", "pwd mode", "blind", "handicap", "voice assistant", "need help", "assistance mode", "assistant", "guide", "how to use", "voice assistance"], "feedback": "Opening the SafeGo PWD Assistant for you. I will guide you through our features."},
    "booking_pink":   {"target": "/book/pink",        "keywords": ["pink", "women", "woman", "female", "girl", "lady", "pink mode"],                               "feedback": "Opening Pink Mode for women-only rides. Your safety is our priority."},
    "booking_elderly":{"target": "/book/elderly",     "keywords": ["elderly", "elder", "senior", "old", "grandparent", "parent", "elderly mode"],                  "feedback": "Opening Elderly Mode for senior-friendly rides. We will ensure a comfortable trip."},
    "booking_normal": {"target": "/book/normal",      "keywords": ["normal", "regular", "standard", "basic", "taxi", "car", "regular ride"],                        "feedback": "Opening standard ride booking. Find the best trip for your needs."},
    
    # Passenger Dashboard Sections
    "dashboard":      {"target": "/dashboard",        "keywords": ["dashboard", "my account", "stats"],                                                            "feedback": "Taking you to your dashboard overview.", "params": {"activeTab": "Dashboard"}},
    "ride_history":   {"target": "/dashboard",        "keywords": ["history", "past rides", "previous trip", "records", "my rides", "previous rides"],             "feedback": "Opening your ride history.", "params": {"activeTab": "My Rides"}},
    "safety_reports": {"target": "/dashboard",        "keywords": ["reports", "safety report", "incidents", "safety log"],                                         "feedback": "Opening your safety reports.", "params": {"activeTab": "Safety Reports"}},
    "contacts":       {"target": "/dashboard",        "keywords": ["contacts", "emergency contacts", "trusted contacts", "family"],                                "feedback": "Opening your trusted contacts list.", "params": {"activeTab": "Emergency Contacts"}},
    "settings":       {"target": "/dashboard",        "keywords": ["settings", "profile", "account settings", "my profile", "edit profile"],                       "feedback": "Opening your account settings.", "params": {"activeTab": "Settings"}},
    
    # Driver Portal Sections
    "driver":         {"target": "/driver",           "keywords": ["driver portal", "driver dashboard", "work portal"],                                            "feedback": "Opening the driver portal.", "params": {"activeTab": "dashboard"}},
    "driver_work":    {"target": "/driver",           "keywords": ["available rides", "find work", "get rides", "work now"],                                       "feedback": "Showing available ride requests.", "params": {"activeTab": "rides"}},
    "driver_history": {"target": "/driver",           "keywords": ["driver history", "my earnings log", "job history"],                                            "feedback": "Showing your driver history.", "params": {"activeTab": "history"}},
    "driver_docs":    {"target": "/driver",           "keywords": ["documents", "driver documents", "verification", "license info"],                               "feedback": "Opening your driver documents page.", "params": {"activeTab": "documents"}},
    "driver_earnings":{"target": "/driver",           "keywords": ["earnings", "my money", "payouts", "income"],                                                   "feedback": "Opening your earnings overview.", "params": {"activeTab": "earnings"}},
    "driver_settings":{"target": "/driver",           "keywords": ["driver settings", "portal settings"],                                                          "feedback": "Opening driver portal settings.", "params": {"activeTab": "settings"}},
    
    # Static & Info Pages
    "safety_center":  {"target": "/safety",           "keywords": ["safety center", "security", "protection", "rules", "how we protect"],                          "feedback": "Opening the SafeGo Safety Center. Learn about our protection features."},
    "tracking":       {"target": "/ride/tracking",    "keywords": ["track", "where", "location of ride", "map", "tracking"],                                       "feedback": "Opening live ride tracking. You can see your driver's real-time location."},
    "admin":          {"target": "/admin",            "keywords": ["admin", "management", "system status", "admin dashboard"],                                     "feedback": "Accessing administrative dashboard."},
    "apply":          {"target": "/apply-driver",     "keywords": ["apply", "job", "work as driver", "drive with us", "apply to drive"],                           "feedback": "Opening the driver application form."},
    "drive_info":     {"target": "/drive-with-us",    "keywords": ["become a driver", "why drive", "driver benefits"],                                             "feedback": "Showing information on how to become a driver."},
    "home":           {"target": "/home",             "keywords": ["home", "start", "main page"],                                                                 "feedback": "Going to the home page."},
    "login":          {"target": "/login",            "keywords": ["login", "sign in", "log in"],                                                                  "feedback": "Taking you to the login page."},
    "signup":         {"target": "/signup",           "keywords": ["signup", "sign up", "register", "create account"],                                            "feedback": "Opening the registration page."},
    "logout":         {"target": "/home",             "keywords": ["logout", "sign out", "log out", "exit account"],                                              "feedback": "You have been signed out. Stay safe!"},
    "features":       {"target": "/home#features",    "keywords": ["feature", "features", "what can you do", "options", "command list"],                           "feedback": "Taking you to the features guide."},
    "how_it_works":   {"target": "/home#how",         "keywords": ["how it works", "process", "steps", "tutorial"],                                               "feedback": "Showing how SafeGo works."},
}

# ---------------------------------------------------------------------------
# OpenAI helpers  (fully async, proper timeouts, detailed error logging)
# ---------------------------------------------------------------------------

def _api_key() -> Optional[str]:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        print("[Warning] OPENAI_API_KEY not set – Voice features disabled")
    return key


async def openai_tts(text: str) -> Optional[str]:
    """Returns base64-encoded WAV audio from OpenAI TTS, or None on failure."""
    api_key = _api_key()
    if not api_key:
        return None
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/audio/speech",
                json={
                    "model": "tts-1",
                    "input": text,
                    "voice": "nova",
                    "response_format": "wav",
                },
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
            )
        if resp.status_code == 200:
            return base64.b64encode(resp.content).decode("utf-8")
        else:
            print(f"[Error] OpenAI TTS {resp.status_code}: {resp.text[:300]}")
    except httpx.TimeoutException:
        print("[Error] OpenAI TTS: request timed out (15 s)")
    except Exception as exc:
        print(f"[Error] OpenAI TTS: {exc}")
    return None


async def openai_stt(audio_bytes: bytes, filename: str = "recording.wav") -> Optional[str]:
    """Returns transcript text from OpenAI STT, or None on failure."""
    api_key = _api_key()
    if not api_key:
        return None

    # Reject suspiciously small audio (< 2 KB ≈ less than ~0.1 s at 16-bit 16 kHz)
    if len(audio_bytes) < 2_000:
        print(f"[Warning] OpenAI STT: audio too small ({len(audio_bytes)} bytes) – skipped")
        return None

    print(f"[STT] Sending {len(audio_bytes):,} bytes to OpenAI STT …")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/audio/transcriptions",
                files={"file": (filename, audio_bytes, "audio/wav")},
                data={"model": "whisper-1", "language": "en"},
                headers={"Authorization": f"Bearer {api_key}"},
            )
        if resp.status_code == 200:
            data = resp.json()
            transcript = data.get("text", "").strip()
            print(f"[STT] Success! Transcript: '{transcript}'")
            return transcript or None
        else:
            print(f"[Error] OpenAI STT {resp.status_code}: {resp.text[:500]}")
    except httpx.TimeoutException:
        print("[Error] OpenAI STT: request timed out (30 s)")
    except Exception as exc:
        print(f"[Error] OpenAI STT: {exc}")
    return None


# ---------------------------------------------------------------------------
# Command interpreter
# ---------------------------------------------------------------------------

def _parse_command(cmd: str, current_user: Optional[User], db: Session) -> dict:
    import re

    # Normalize command
    cmd = cmd.strip().lower()

    # 1. Emergency / SOS (highest priority)
    # Refined keywords for actual emergencies
    if any(k in cmd for k in ["sos", "emergency", "save me", "police", "danger", "accident", "help me now", "panic"]):
        return {"action": "SOS", "feedback": "EMERGENCY ALERT! Triggering SOS. Help is being dispatched to your location."}

    # 2. Help / Support / Assistant (The "Help Phase")
    # Redirect casual "help" or "guide" to PWD mode (Assistant Mode)
    if any(k in cmd for k in ["help", "guide", "assistant", "how to", "pwd mode", "blind", "handicap", "assistance mode"]):
        return {"action": "NAVIGATE", "target": "/pwd-mode", "feedback": "Entering the SafeGo Voice Assistance phase. I will guide you through our services. You can ask me to book a ride or show your status."}

    # 3. Ride status
    if any(k in cmd for k in ["status", "arrive", "active", "trip", "my ride", "where is my driver"]):
        if not current_user:
            return {"action": "NAVIGATE", "target": "/login", "feedback": "Please log in to check your ride status."}
        latest = db.query(Ride).filter(Ride.passenger_id == current_user.id).order_by(Ride.created_at.desc()).first()
        if not latest or latest.status == RideStatus.completed:
            return {"action": "TELL_STATUS", "feedback": "You have no active rides at the moment. Would you like to book one?"}
        status_text = latest.status.value.replace('_', ' ')
        return {"action": "TELL_STATUS", "feedback": f"Your current ride status is: {status_text}."}

    # 4. Feature keyword lookup (from FEATURE_MAP) for non-booking pages
    for feature, data in FEATURE_MAP.items():
        if not feature.startswith("booking_") and feature != "pwd_mode":
            if any(keyword in cmd for keyword in data["keywords"]):
                action = "LOGOUT" if feature == "logout" else "NAVIGATE"
                return {
                    "action": action, 
                    "target": data["target"], 
                    "feedback": data["feedback"],
                    "params": data.get("params", {})
                }

    # 5. Ride bookings with optional destination extraction
    is_booking = any(k in cmd for k in ["book", "ride", "taxi", "car", "get", "need", "hire", "go to", "take me to", "travel to", "open", "pink", "elderly", "normal", "drop me"])
    if is_booking:
        pickup, destination = None, None

        m = re.search(r"from\s+(.+?)\s+to\s+(.+)", cmd)
        if m:
            pickup, destination = m.group(1).strip(), m.group(2).strip()
        else:
            m = re.search(r"to\s+(.+?)\s+from\s+(.+)", cmd)
            if m:
                destination, pickup = m.group(1).strip(), m.group(2).strip()
            else:
                m = re.search(r"(?:to|at|for|towards)\s+(.+)", cmd)
                if m:
                    dest = m.group(1).strip()
                    for noise in ["a ride", "ride", "taxi", "car", "a lift"]:
                        dest = dest.replace(noise, "").strip()
                    if dest:
                        destination = dest

        mode = "normal"
        if any(w in cmd for w in ["pink", "women", "ladies", "girl"]):
            mode = "pink"
        elif any(w in cmd for w in ["elder", "senior", "grandpa", "grandma", "elderly", "old"]):
            mode = "elderly"

        if destination:
            feedback = f"Confirmed. {mode.capitalize()} ride to {destination.capitalize()}."
            if pickup:
                feedback += f" Pickup from {pickup.capitalize()}."
            feedback += " Search is underway for a driver."
            target = f"/book/{mode}"
            return {"action": "NAVIGATE", "target": target,
                    "params": {"pickup": pickup, "destination": destination, "auto_search": True},
                    "feedback": feedback}
        
        feature_key = f"booking_{mode}"
        if feature_key in FEATURE_MAP:
            fm_data = FEATURE_MAP[feature_key]
            return {"action": "NAVIGATE", "target": fm_data["target"], "feedback": fm_data["feedback"]}

        target = f"/book/{mode}"
        return {"action": "NAVIGATE", "target": target,
                "feedback": f"Opening the {mode.capitalize()} booking page. Please state your destination."}

    # 6. Fallback - Only return UNKNOWN if there's really nothing
    if len(cmd) < 3:
         return {"action": "UNKNOWN", "feedback": "I am listening. How can I help you today?"}
    
    return {"action": "UNKNOWN", "feedback": f"I heard you say: '{cmd}'. You can ask me to book a ride, open your dashboard, or get help."}


async def _parse_command_llm(cmd: str, current_user: Optional[User], db: Session, context: Optional[dict] = None) -> dict:
    """Uses LLM to understand complex instructions and return a browser plan if needed."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return _parse_command(cmd, current_user, db)

    client = AsyncOpenAI(api_key=api_key)
    ctx = context or {}
    
    app_routes = {
        "dashboard": "/dashboard",
        "pink_mode": "/book/pink",
        "elderly_mode": "/book/elderly",
        "pwd_mode": "/pwd-mode",
        "ride_tracking": "/ride/tracking",
        "safety_center": "/safety",
        "home": "/home",
        "login": "/login",
        "signup": "/signup"
    }

    system_prompt = f"""
    You are the brain of SafeGo AI. Convert user voice transcripts into structured JSON.
    Your goal is to be a realistic, perfect assistant that does operations in the project sites.
    
    Internal Routes: {app_routes}
    
    Actions:
    - NAVIGATE: Use one of internal routes.
    - SOS: Trigger emergency alert.
    - LOGOUT: Sign out user.
    - TELL_STATUS: Check active ride.
    - BROWSER: External web operations. Provide a "plan" list of steps.
    
    SPECIAL PARAMS for Internal Routes (NAVIGATE):
    - "/book/[mode]": use mode = normal, pink, elderly, or pwd.
      Params: {{"pickup": "...", "destination": "...", "auto_search": true, "auto_confirm": true}}
      * Set "auto_search": true if destination is provided.
      * Set "auto_confirm": true only if user says "book it", "confirm", or is very certain.
    - "/dashboard": Params: {{"activeTab": "Dashboard" | "My Rides" | "Emergency Contacts" | "Settings"}}
    
    State:
    - Current User: {current_user.full_name if current_user else 'Guest'}
    - Current Page: {ctx.get('path', 'unknown')}
    - Current State: {json.dumps(ctx.get('state', {}))}
    
    Guidelines:
    1. If user says "book a ride" without destination, set target to "/book/normal" and feedback "Where would you like to go?".
    2. If user says "take me to Mall of Asia", set target to "/book/normal", params {{"destination": "Mall of Asia", "auto_search": true}}, and feedback "Looking for the safest route to Mall of Asia."
    3. If user says "book it now" while on a booking page, set action "NAVIGATE", target "/book/normal", params {{"auto_confirm": true}}, and feedback "Confirming your ride now."
    4. ALWAYS return valid JSON. No markdown.
    """

    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": cmd}
            ],
            response_format={"type": "json_object"}
        )
        content = completion.choices[0].message.content
        if not content:
            return _parse_command(cmd, current_user, db)
        return json.loads(content)
    except Exception as e:
        print(f"[LLM Parser Error] {e}")
        return _parse_command(cmd, current_user, db)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/process-audio", response_model=VoiceActionResponse)
async def process_voice_audio(
    file: UploadFile = File(...),
    context: Optional[str] = None, # JSON string from frontend
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """
    Full OpenAI pipeline:
      1. OpenAI STT  → transcript
      2. Command interpreter → action + feedback text
      3. OpenAI TTS  → spoken response audio (base64 WAV)
    """
    ctx_dict = {}
    if context:
        try: ctx_dict = json.loads(context)
        except: pass

    audio_data = await file.read()
    print(f"[Voice] Audio received: {len(audio_data):,} bytes. Context: {ctx_dict}")

    # Step 1 – Speech-to-Text
    transcript = await openai_stt(audio_data, file.filename or "recording.wav")

    if not transcript:
        feedback = "I didn't catch that. Please speak clearly and try again."
        audio_b64 = await openai_tts(feedback)
        return VoiceActionResponse(action="UNKNOWN", feedback=feedback,
                                   transcript="", audio=audio_b64)

    # Step 2 – Parse command
    result = await _parse_command_llm(transcript.lower(), current_user, db, ctx_dict)
    result["transcript"] = transcript

    # Handle Browser Operations
    if result.get("action") == "BROWSER" and result.get("plan"):
        operator = await BrowserOperator.get_instance()
        asyncio.create_task(operator.execute_plan(result["plan"]))

    # Step 3 – Text-to-Speech
    audio_b64 = await openai_tts(result["feedback"])
    if audio_b64:
        result["audio"] = audio_b64

    return result


@router.post("/voice-command", response_model=VoiceActionResponse)
async def process_voice_command(
    payload: VoiceCommandRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Text command → parse → OpenAI TTS response (useful for testing)."""
    cmd = payload.command.lower().strip()
    result = _parse_command(cmd, current_user, db)
    result["transcript"] = payload.command

    audio_b64 = await openai_tts(result["feedback"])
    if audio_b64:
        result["audio"] = audio_b64

    return result


@router.post("/sos-trigger", response_model=SOSResponse)
def trigger_sos_voice(
    payload: SOSTriggerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a high-priority SOS alert from voice command."""
    sos = SOSAlert(
        user_id=current_user.id,
        ride_id=payload.ride_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location_address=payload.location_address,
        severity=SOSSeverity.critical,
        status=SOSStatus.active,
        notes="Triggered via voice command",
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)
    print(f"[SOS] User {current_user.id} triggered SOS via Voice")
    return sos


@router.get("/ride-status", response_model=Optional[RideResponse])
def get_voice_ride_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return latest ride for voice status feedback."""
    return (
        db.query(Ride)
        .filter(Ride.passenger_id == current_user.id)
        .order_by(Ride.created_at.desc())
        .first()
    )


@router.post("/location-share")
def share_location(
    payload: LocationShareRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log and share live location."""
    print(f"[Location] User {current_user.id} at {payload.latitude}, {payload.longitude}")
    return {"status": "shared", "timestamp": datetime.now(timezone.utc)}
