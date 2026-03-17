import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// WAV encoder utilities
// ---------------------------------------------------------------------------
function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const dataLen = samples.length * 2;
  const buf = new ArrayBuffer(44 + dataLen);
  const view = new DataView(buf);
  const str = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  view.setUint32(4, 36 + dataLen, true);
  str(8, "WAVE");
  str(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);  // PCM
  view.setUint16(22, 1, true);  // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, dataLen, true);
  for (let i = 0, off = 44; i < samples.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buf;
}

function downsample(buf: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return buf;
  const ratio = fromRate / toRate;
  const out = new Float32Array(Math.round(buf.length / ratio));
  for (let i = 0; i < out.length; i++) {
    out[i] = buf[Math.round(i * ratio)];
  }
  return out;
}

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------
interface VoiceAssistantContextType {
  isListening: boolean;
  isProcessing: boolean;
  isSpeakingCustomAudio: boolean;
  audioLevel: number;
  transcript: string;
  lastCommand: string;
  lastFeedback: string;
  lastCommandParams: any;
  voiceEnabled: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  setVoiceEnabled: (enabled: boolean) => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const VOICE_API_URL = `${API_URL}/api/voice`;

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const VoiceAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening]               = useState(false);
  const [isProcessing, setIsProcessing]             = useState(false);
  const [isSpeakingCustomAudio, setIsSpeakingAudio] = useState(false);
  const [audioLevel, setAudioLevel]                 = useState(0);
  const [transcript, setTranscript]                 = useState("");
  const [lastCommand, setLastCommand]               = useState("");
  const [lastFeedback, setLastFeedback]             = useState("");
  const [lastCommandParams, setLastCommandParams]   = useState<any>(null);
  const [voiceEnabled, setVoiceEnabledState]        = useState(
    () => localStorage.getItem("voice_assistant_enabled") === "true"
  );

  const navigate        = useNavigate();
  const stopFnRef       = useRef<(() => void) | null>(null);
  const animFrameRef    = useRef<number | null>(null);

  // ---------------------------------------------------------------------------
  // Browser TTS fallback
  // ---------------------------------------------------------------------------
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.onstart = () => setIsSpeakingAudio(true);
    u.onend   = () => setIsSpeakingAudio(false);
    window.speechSynthesis.speak(u);
  };

  // ---------------------------------------------------------------------------
  // Helper: play response from API
  // ---------------------------------------------------------------------------
  const handleApiResponse = (data: any) => {
    const { action, target, feedback, params, audio, transcript: heard } = data;
    if (heard) setLastCommand(heard);
    setLastFeedback(feedback);
    setLastCommandParams(params ?? null);

    if (audio) {
      try {
        setIsSpeakingAudio(true);
        const snd = new Audio(`data:audio/wav;base64,${audio}`);
        snd.onended = () => {
          setIsSpeakingAudio(false);
          if (voiceEnabled) {
             // Auto-restart listening after a small delay for natural interaction
             setTimeout(() => startListening(), 500);
          }
        };
        snd.onerror = () => { 
          setIsSpeakingAudio(false); 
          speak(feedback); 
          if (voiceEnabled) setTimeout(() => startListening(), 1000);
        };
        snd.play().catch(() => { 
          setIsSpeakingAudio(false); 
          speak(feedback); 
          if (voiceEnabled) setTimeout(() => startListening(), 1000);
        });
      } catch {
        setIsSpeakingAudio(false);
        speak(feedback);
        if (voiceEnabled) setTimeout(() => startListening(), 1000);
      }
    } else {
      speak(feedback);
      // Browser TTS fallback also needs auto-restart logic if we wanted full coverage,
      // but browser TTS is mostly a fallback here.
    }

    switch (action) {
      case "NAVIGATE":
        if (target) {
          if (target.includes("#")) {
            const [path, hash] = target.split("#");
            navigate(path, { state: params });
            // Small delay for navigation to complete before scrolling
            setTimeout(() => {
              const el = document.getElementById(hash);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 300);
          } else {
            navigate(target, { state: params });
          }
        }
        break;
      case "LOGOUT":
        ["token", "userEmail", "user_role", "safego_profile"].forEach(k =>
          localStorage.removeItem(k)
        );
        navigate("/home");
        break;
      case "SOS":
        triggerSOS();
        break;
      case "LOCATION_SHARE":
        shareCurrentLocation();
        break;
      case "BROWSER":
        toast.info("I'm performing that web operation for you now...");
        break;
    }
  };

  // ---------------------------------------------------------------------------
  // Send WAV blob → backend → OpenAI STT + TTS pipeline
  // ---------------------------------------------------------------------------
  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setTranscript("Sending to SafeGo AI…");
    try {
      const fd = new FormData();
      fd.append("file", blob, "recording.wav");
      fd.append("context", JSON.stringify({ 
        path: window.location.pathname,
        state: (window as any).history.state?.usr || {} 
      }));

      const res = await fetch(`${VOICE_API_URL}/process-audio`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      handleApiResponse(data);
    } catch (err) {
      console.error("[Voice] processAudio error:", err);
      speak("Could not reach SafeGo AI. Please check your connection.");
    } finally {
      setIsProcessing(false);
      setTranscript("");
    }
  };

  // ---------------------------------------------------------------------------
  // Recording — AudioContext + WAV encoding + silence detection
  // ---------------------------------------------------------------------------
  const startListening = async () => {
    if (isListening || isProcessing) return;
    setVoiceEnabled(true); // Ensure conversation continues
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const audioCtx   = new AudioContext();
      const sampleRate = audioCtx.sampleRate;
      const source     = audioCtx.createMediaStreamSource(stream);
      const analyser   = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      const processor  = audioCtx.createScriptProcessor(4096, 1, 1);

      const chunks: Float32Array[] = [];
      let silenceTimer: ReturnType<typeof setTimeout> | null = null;
      let stopped = false;

      // Cleanup + process
      const stop = () => {
        if (stopped) return;
        stopped = true;

        if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
        if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }

        source.disconnect();
        processor.disconnect();
        stream.getTracks().forEach(t => t.stop());
        audioCtx.close().catch(() => {});

        stopFnRef.current = null;
        setIsListening(false);
        setAudioLevel(0);

        if (chunks.length === 0) { setTranscript(""); return; }

        setTranscript("Processing…");

        // Merge PCM chunks
        const total  = chunks.reduce((a, c) => a + c.length, 0);
        const merged = new Float32Array(total);
        let off = 0;
        for (const c of chunks) { merged.set(c, off); off += c.length; }

        // Downsample → 16 kHz → WAV
        const resampled = downsample(merged, sampleRate, 16000);
        const wavBuf    = encodeWAV(resampled, 16000);
        const blob      = new Blob([wavBuf], { type: "audio/wav" });
        processAudio(blob);
      };

      // Collect PCM samples
      processor.onaudioprocess = (e) => {
        chunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      // Audio level + silence detection loop
      const levelData = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (stopped) return;
        analyser.getByteFrequencyData(levelData);
        const avg   = levelData.reduce((a, b) => a + b, 0) / levelData.length;
        const level = Math.min(avg / 80, 1);
        setAudioLevel(level);

        // Debug: Log recording progress occasionally
        // if (chunks.length % 50 === 0) console.log("[Voice] Audio Level:", level.toFixed(3), "Chunks:", chunks.length);

        // Silence → auto-stop after 2.0 s (increased from 1.5s) for better stability
        // Threshold lowered to 0.015 for more sensitivity to quiet speech
        if (level < 0.015 && chunks.length > 5) {
          if (!silenceTimer) silenceTimer = setTimeout(stop, 2000);
        } else if (level >= 0.015) {
          if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      source.connect(analyser);
      source.connect(processor);
      processor.connect(audioCtx.destination);

      stopFnRef.current = stop;
      setIsListening(true);
      setTranscript("Listening…");
      animFrameRef.current = requestAnimationFrame(tick);

      // Safety: hard-stop after 15 s
      setTimeout(() => { if (!stopped) stop(); }, 15_000);

    } catch (err: any) {
      console.error("[Voice] Mic error:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Microphone access denied. Please allow mic in browser settings.");
      } else {
        toast.error("Could not start microphone. Please try again.");
      }
    }
  };

  const stopListening = () => {
    if (stopFnRef.current) {
      stopFnRef.current();
    } else {
      setIsListening(false);
      setTranscript("");
    }
  };

  // ---------------------------------------------------------------------------
  // SOS + location share
  // ---------------------------------------------------------------------------
  const triggerSOS = async () => {
    if (!navigator.geolocation) { speak("Unable to get location for SOS."); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await fetch(`${VOICE_API_URL}/sos-trigger`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
          body: JSON.stringify({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            location_address: "Current Location",
            ride_id: null,
          }),
        });
        toast.error("SOS Alert triggered! Help is on the way.");
      } catch { speak("Failed to trigger SOS alert."); }
    });
  };

  const shareCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await fetch(`${VOICE_API_URL}/location-share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
          body: JSON.stringify({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        });
        toast.info("Your location has been shared with emergency contacts.");
      } catch { speak("Failed to share location."); }
    });
  };

  // ---------------------------------------------------------------------------
  // Ride status poller
  // ---------------------------------------------------------------------------
  const [currentRideStatus, setCurrentRideStatus] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const path = window.location.pathname;

    if (path === "/pwd-mode" || path.includes("/ride/tracking") || path.includes("/book")) {
      const pollStatus = async () => {
        if (!localStorage.getItem("token")) return;
        try {
          const res = await fetch(`${VOICE_API_URL}/ride-status`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          if (!res.ok) return;
          const data = await res.json();
          if (!data) return;
          const newStatus = data.status;
          if (newStatus !== currentRideStatus) {
            let msg = `Update: Your ride is now ${newStatus.replace(/_/g, " ")}.`;
            if (newStatus === "driver_arriving") msg = "Your driver is arriving soon!";
            if (newStatus === "in_progress")     msg = "Ride started. You are on your way.";
            if (newStatus === "completed")       msg = "You have arrived. Thank you for riding with SafeGo!";
            speak(msg);
            setCurrentRideStatus(newStatus);
          }
        } catch { /* silent */ }
      };
      pollStatus();
      interval = setInterval(pollStatus, 15_000);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [currentRideStatus, window.location.pathname]);

  // ---------------------------------------------------------------------------
  // setVoiceEnabled
  // ---------------------------------------------------------------------------
  const setVoiceEnabled = (val: boolean) => {
    setVoiceEnabledState(val);
    localStorage.setItem("voice_assistant_enabled", String(val));
    if (!val) stopListening();
  };

  return (
    <VoiceAssistantContext.Provider
      value={{
        isListening, isProcessing, isSpeakingCustomAudio, audioLevel,
        transcript, lastCommand, lastFeedback, lastCommandParams,
        voiceEnabled, startListening, stopListening, speak, setVoiceEnabled,
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const ctx = useContext(VoiceAssistantContext);
  if (!ctx) throw new Error("useVoiceAssistant must be used within VoiceAssistantProvider");
  return ctx;
};
