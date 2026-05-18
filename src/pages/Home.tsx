import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModeCard } from "@/components/ModeCard";
import { ModeFilterTabs } from "@/components/ModeFilterTabs";
import { SafetyScoreBar } from "@/components/SafetyScoreBar";
import { modes } from "@/config/modeConfig";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Shield, Bell, MapPin, CheckCircle, ArrowRight, Star,
  Clock, Users, Car, ShieldCheck, Zap, HelpCircle, Lock,
  Banknote, GraduationCap, Heart, CalendarCheck, Navigation,
  X, User, Globe
} from "lucide-react";

// ─── Services Hero Graphic Component ───────────────────────────────────────────
const ServicesHeroGraphic = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const ACCENT_COLOR = "#4f46e5"; // Premium Indigo
  const active = selectedCard || hoveredCard;

  const leftCards = [
    { title: "Pink Mode", desc: "Verified female drivers exclusively for women passengers, ensuring maximum comfort.", top: "12%", color: ACCENT_COLOR },
    { title: "PWD Accessibility", desc: "Specially equipped vehicles and trained drivers for differently-abled passengers.", top: "37%", color: "#374151" },
    { title: "Elderly Assistance", desc: "Patient, top-rated drivers offering door-to-door support for senior citizens.", top: "63%", color: "#374151" },
    { title: "AI Safe Routing", desc: "Machine learning algorithms analyze crime data for the absolute safest path.", top: "88%", color: "#374151" },
  ];

  const rightCards = [
    { title: "Emergency SOS", desc: "One-tap emergency alert instantly notifies authorities and pre-selected contacts.", top: "12%", color: "#374151" },
    { title: "Live Tracking", desc: "Share your real-time location with family for complete peace of mind.", top: "37%", color: "#374151" },
    { title: "Verified Operators", desc: "Strict background checks and continuous monitoring for every active driver.", top: "63%", color: "#374151" },
    { title: "Multilingual App", desc: "Navigate and communicate seamlessly with native language app support.", top: "88%", color: "#374151" },
  ];

  const getLineStyles = (cardTitle: string) => {
    if (selectedCard !== null) {
      if (selectedCard === cardTitle) {
        return {
          stroke: ACCENT_COLOR,
          strokeWidth: "4",
          opacity: 1,
          style: { "--flow-speed": "0.6s" } as React.CSSProperties
        };
      } else {
        return {
          stroke: ACCENT_COLOR,
          strokeWidth: "0",
          opacity: 0,
          style: { "--flow-speed": "3s" } as React.CSSProperties
        };
      }
    }

    const isHovered = hoveredCard === cardTitle;
    const isAnyHovered = hoveredCard !== null;

    if (isHovered) {
      return {
        stroke: ACCENT_COLOR,
        strokeWidth: "4",
        opacity: 1,
        style: { "--flow-speed": "0.6s" } as React.CSSProperties
      };
    }

    if (isAnyHovered) {
      return {
        stroke: ACCENT_COLOR,
        strokeWidth: "1.5",
        opacity: 0.08,
        style: { "--flow-speed": "3s" } as React.CSSProperties
      };
    }

    return {
      stroke: ACCENT_COLOR,
      strokeWidth: "2.8",
      opacity: 0.8,
      style: { "--flow-speed": "1.8s" } as React.CSSProperties
    };
  };

  return (
    <div className="relative w-[900px] h-[720px] flex justify-center items-center shrink-0 scale-[0.45] sm:scale-[0.58] md:scale-[0.72] lg:scale-[0.82] xl:scale-[0.92] origin-center select-none">
      
      {/* Stylesheet for flowchart animations */}
      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -24;
          }
        }
        .flow-line {
          stroke-dasharray: 8 6;
          animation: dash-flow var(--flow-speed, 1.8s) linear infinite;
          transition: stroke-width 0.3s, opacity 0.3s, stroke 0.3s;
        }
        @keyframes float-y-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes float-y-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        @keyframes float-x {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(3px); }
        }
        @keyframes radar-sweep {
          0% { transform: scale(0.1); opacity: 0.9; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes siren-ring {
          0%, 100% { box-shadow: 0 0 0 0px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
        }
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          20%, 60% { transform: rotate(12deg); }
          40%, 80% { transform: rotate(-12deg); }
        }
        .badge-float-1 { animation: float-y-1 4s ease-in-out infinite; }
        .badge-float-2 { animation: float-y-2 4.5s ease-in-out infinite; }
        .badge-float-3 { animation: float-x 3.8s ease-in-out infinite; }
      `}</style>

      {/* Central Phone */}
      <div className="relative w-[300px] h-[600px] z-20 bg-[#1e1e1e] rounded-[3.2rem] border-[12px] border-[#2d2d2d] shadow-[0_25px_60px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col justify-center items-center">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
          <div className="w-24 h-5 bg-[#2d2d2d] rounded-b-2xl"></div>
        </div>
        
        {/* Interactive Phone Screen UI */}
        <div className={`w-full h-full bg-[#f8fafc] dark:bg-zinc-950 overflow-hidden relative flex flex-col transition-all duration-500 ${
          active === "Emergency SOS" ? "ring-4 ring-red-500/80 ring-inset" : ""
        }`}
        style={{
          animation: active === "Emergency SOS" ? "siren-ring 2s infinite" : "none"
        }}>
          {/* Top Info Bar inside Screen */}
          <div className="absolute top-0 inset-x-0 h-10 px-5 flex items-center justify-between z-40 bg-white/40 dark:bg-black/30 backdrop-blur-sm border-b border-gray-200/20">
            <span className="text-[10px] font-extrabold text-gray-700 dark:text-gray-300">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wider">SECURED</span>
            </div>
          </div>

          {/* Vector City Map SVG Background */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.65] dark:opacity-[0.25] z-0" viewBox="0 0 276 576" preserveAspectRatio="none">
            {/* Soft grid lines */}
            <defs>
              <pattern id="city-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#city-grid)" />
            
            {/* Roads */}
            <path d="M -20 180 Q 80 180 120 220 T 260 250" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
            <path d="M 60 -20 Q 60 180 140 220 T 140 600" fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" />
            <path d="M 220 -20 L 220 600" fill="none" stroke="#e2e8f0" strokeWidth="14" />
            
            {/* Road center lines */}
            <path d="M -20 180 Q 80 180 120 220 T 260 250" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
            <path d="M 60 -20 Q 60 180 140 220 T 140 600" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
          </svg>

          {/* Dynamic Map Route Line */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 276 576" preserveAspectRatio="none">
            {/* Base route */}
            <path
              d="M 60 140 Q 60 200 140 240 T 140 400"
              fill="none"
              stroke={
                active === "Pink Mode"
                  ? "#db2777"
                  : active === "AI Safe Routing"
                    ? "#4f46e5"
                    : active === "Emergency SOS"
                      ? "#dc2626"
                      : "#0d9488"
              }
              strokeWidth="5.5"
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{
                filter: active ? "drop-shadow(0 0 5px rgba(79, 70, 229, 0.45))" : "none"
              }}
            />

            {/* Alternating bypassed unsafe route for AI Safe Routing */}
            {active === "AI Safe Routing" && (
              <path
                d="M 60 140 L 220 140 L 220 310 L 140 400"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                className="opacity-70 animate-pulse"
              />
            )}

            {/* Route Start Waypoint */}
            <circle cx="60" cy="140" r="5" fill="#10b981" />
            <circle cx="60" cy="140" r="10" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping" style={{ animationDuration: "2s" }} />

            {/* Route End Waypoint */}
            <rect x="136" y="396" width="8" height="8" rx="1.5" fill="#ef4444" />
            <circle cx="140" cy="400" r="12" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
          </svg>

          {/* Live GPS Car Dot */}
          <div 
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{
              left: active === "AI Safe Routing" ? "138px" : "138px",
              top: active === "AI Safe Routing" ? "300px" : "280px"
            }}
          >
            <div className={`h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${
              active === "Pink Mode" ? "bg-pink-600" : active === "Emergency SOS" ? "bg-red-600" : "bg-primary"
            }`}>
              <Navigation size={8} className="text-white fill-white rotate-45" />
            </div>
            <div className={`absolute -inset-1 rounded-full animate-ping opacity-25 ${
              active === "Pink Mode" ? "bg-pink-600" : "bg-primary"
            }`} />
          </div>

          {/* Radar Sweep Effect (Live Tracking Active) */}
          {active === "Live Tracking" && (
            <div className="absolute left-[138px] top-[280px] z-15 pointer-events-none -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 rounded-full border border-emerald-500/40 bg-emerald-500/5" style={{ animation: "radar-sweep 2s infinite linear" }} />
              <div className="absolute inset-0 w-24 h-24 rounded-full border border-emerald-500/20" style={{ animation: "radar-sweep 2s infinite linear", animationDelay: "1s" }} />
            </div>
          )}

          {/* Siren Alert Icon (Emergency Active) */}
          {active === "Emergency SOS" && (
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 z-20 bg-red-600 text-white rounded-full p-3 shadow-xl animate-bounce">
              <Bell size={24} className="animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          )}

          {/* AI Bypass Badge overlay */}
          {active === "AI Safe Routing" && (
            <div className="absolute left-1/2 top-[160px] -translate-x-1/2 z-20 bg-red-500 text-white text-[8px] font-extrabold uppercase py-0.5 px-1.5 rounded shadow border border-white flex items-center gap-0.5 animate-pulse">
              <X size={8} /> High-Risk Area Bypassed
            </div>
          )}

          {/* ────── Floating Safety Badges (matching first screenshot) ────── */}
          
          {/* Badge 1: Pass / Pink Mode */}
          <div 
            className={`absolute top-[50px] left-[12px] z-30 transition-all duration-300 badge-float-1 flex items-center gap-1 rounded-full px-2.5 py-1.5 shadow-md border ${
              active === "Pink Mode"
                ? "bg-pink-50 border-pink-200 scale-110 shadow-pink-100"
                : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            }`}
            style={{
              borderColor: active === "Pink Mode" ? "#f472b6" : undefined,
              boxShadow: active === "Pink Mode" ? "0 8px 20px rgba(244, 114, 182, 0.25)" : undefined
            }}
          >
            <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center ${active === "Pink Mode" ? "bg-pink-600 text-white" : "border border-red-500 text-red-500"}`}>
              <X size={10} className="stroke-[3]" />
            </div>
            <span className={`text-[9px] font-extrabold ${active === "Pink Mode" ? "text-pink-700" : "text-gray-800 dark:text-gray-200"}`}>
              {active === "Pink Mode" ? "Pink Mode" : "Pass"}
            </span>
          </div>

          {/* Badge 2: Emergency Protected (Red) */}
          <div 
            className={`absolute top-[45px] right-[10px] z-30 transition-all duration-300 badge-float-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-md border ${
              active === "Emergency SOS"
                ? "bg-red-600 border-red-500 scale-112 shadow-red-200 text-white"
                : "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
            }`}
            style={{
              animation: active === "Emergency SOS" ? "bell-shake 0.5s infinite" : undefined
            }}
          >
            <Bell size={10} className={active === "Emergency SOS" ? "text-white" : "text-red-500"} />
            <span className="text-[9px] font-extrabold">Emergency Protected</span>
          </div>

          {/* Badge 3: Verified Driver */}
          <div 
            className={`absolute top-[95px] left-[8px] z-30 transition-all duration-300 badge-float-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-md border ${
              active === "Verified Operators"
                ? "bg-emerald-50 border-emerald-200 scale-110 shadow-emerald-100"
                : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            }`}
            style={{
              borderColor: active === "Verified Operators" ? "#34d399" : undefined,
              boxShadow: active === "Verified Operators" ? "0 8px 20px rgba(52, 211, 153, 0.25)" : undefined
            }}
          >
            <ShieldCheck size={11} className="text-emerald-500" />
            <span className={`text-[9px] font-extrabold ${active === "Verified Operators" ? "text-emerald-700" : "text-gray-800 dark:text-gray-200"}`}>Verified Driver</span>
          </div>

          {/* Badge 4: AI Safe Route */}
          <div 
            className={`absolute top-[145px] right-[8px] z-30 transition-all duration-300 badge-float-1 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-md border ${
              active === "AI Safe Routing"
                ? "bg-indigo-50 border-indigo-200 scale-110 shadow-indigo-100"
                : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            }`}
            style={{
              borderColor: active === "AI Safe Routing" ? "#818cf8" : undefined,
              boxShadow: active === "AI Safe Routing" ? "0 8px 20px rgba(129, 140, 248, 0.25)" : undefined
            }}
          >
            <Navigation size={10} className="text-indigo-500 fill-indigo-100 rotate-45" />
            <span className={`text-[9px] font-extrabold ${active === "AI Safe Routing" ? "text-indigo-700" : "text-gray-800 dark:text-gray-200"}`}>AI Safe Route</span>
          </div>

          {/* Badge 5: 24/7 Monitored */}
          <div 
            className={`absolute bottom-[220px] left-[10px] z-30 transition-all duration-300 badge-float-2 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-md border ${
              active === "Live Tracking"
                ? "bg-pink-50 border-pink-200 scale-110 shadow-pink-100"
                : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            }`}
            style={{
              borderColor: active === "Live Tracking" ? "#f472b6" : undefined
            }}
          >
            <Clock size={11} className="text-pink-500" />
            <span className={`text-[9px] font-extrabold ${active === "Live Tracking" ? "text-pink-700" : "text-gray-800 dark:text-gray-200"}`}>24/7 Monitored</span>
          </div>

          {/* Badge 6: Multilingual Enabled */}
          <div 
            className={`absolute bottom-[200px] right-[10px] z-30 transition-all duration-300 badge-float-3 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-md border ${
              active === "Multilingual App"
                ? "bg-blue-50 border-blue-200 scale-110 shadow-blue-100"
                : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            }`}
            style={{
              borderColor: active === "Multilingual App" ? "#60a5fa" : undefined
            }}
          >
            <Globe size={11} className="text-blue-500" />
            <span className={`text-[9px] font-extrabold ${active === "Multilingual App" ? "text-blue-700" : "text-gray-800 dark:text-gray-200"}`}>Multilingual Enabled</span>
          </div>

          {/* Dynamic Accessibility and Elderly Badges (fades in) */}
          {active === "PWD Accessibility" && (
            <div className="absolute top-[215px] left-[12px] z-30 animate-bounce flex items-center gap-1 bg-blue-600 border border-blue-500 text-white rounded-full px-2.5 py-1.5 shadow-lg">
              <Users size={11} />
              <span className="text-[9px] font-extrabold">PWD Assisted</span>
            </div>
          )}

          {active === "Elderly Assistance" && (
            <div className="absolute top-[210px] right-[12px] z-30 animate-bounce flex items-center gap-1 bg-amber-500 border border-amber-400 text-white rounded-full px-2.5 py-1.5 shadow-lg">
              <Heart size={11} className="fill-white" />
              <span className="text-[9px] font-extrabold">Elderly Care</span>
            </div>
          )}

          {/* ────── Bottom Ride Details Card (matching first screenshot) ────── */}
          <div className="absolute bottom-[38px] left-[12px] right-[12px] bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-zinc-800/80 z-30 transition-all duration-300 flex flex-col">
            
            {/* Card Header (Profile & Payment Type) */}
            <div className="flex items-center justify-between mb-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                active === "Pink Mode"
                  ? "bg-pink-100 text-pink-600"
                  : active === "PWD Accessibility"
                    ? "bg-blue-100 text-blue-600"
                    : active === "Elderly Assistance"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-[#0d9488]/10 text-[#0d9488]"
              }`}>
                {active === "Pink Mode" ? (
                  <User size={16} />
                ) : active === "PWD Accessibility" ? (
                  <Users size={16} />
                ) : (
                  <User size={16} />
                )}
              </div>

              {/* Digital Payment Label */}
              <div className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide ${
                active === "Emergency SOS"
                  ? "bg-red-100 text-red-600"
                  : active === "Pink Mode"
                    ? "bg-pink-100 text-pink-600"
                    : active === "PWD Accessibility"
                      ? "bg-blue-100 text-blue-600"
                      : active === "Elderly Assistance"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-emerald-100 text-emerald-700"
              }`}>
                {active === "Emergency SOS" ? (
                  "SOS BROADCAST"
                ) : active === "Pink Mode" ? (
                  "FEMALE OPERATOR"
                ) : active === "PWD Accessibility" ? (
                  "ACCESSIBLE RIDE"
                ) : active === "Elderly Assistance" ? (
                  "CARE SPECIALIST"
                ) : active === "Multilingual App" ? (
                  "डिजिटल भुगतान"
                ) : (
                  "DIGITAL PAYMENT"
                )}
              </div>
            </div>

            {/* Ride Details (ETA, car type) */}
            <div className="mb-3">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black tracking-tight ${
                  active === "Emergency SOS" ? "text-red-600 animate-pulse" : "text-gray-900 dark:text-white"
                }`}>
                  {active === "Emergency SOS" ? (
                    "ACTIVE"
                  ) : active === "Multilingual App" ? (
                    "3 मिनट"
                  ) : (
                    "3 min"
                  )}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                  {active === "Emergency SOS" ? (
                    "Alert Broadcasted"
                  ) : active === "Pink Mode" ? (
                    "Innova • Female Driver"
                  ) : active === "Multilingual App" ? (
                    "सेडान • 1.7 किमी"
                  ) : (
                    "Sedan • 1.7 km"
                  )}
                </span>
              </div>
            </div>

            {/* Route addresses */}
            <div className="flex flex-col gap-2 relative pl-4 border-l border-dashed border-gray-200 dark:border-zinc-800 ml-1.5 text-left">
              {/* Pickup Address */}
              <div className="relative">
                <div className="absolute -left-[20px] top-[4px] h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                <p className="text-[9px] font-extrabold text-gray-700 dark:text-gray-300 leading-none">
                  {active === "Multilingual App" ? "7वीं मेन रोड, इंदिरा नगर" : "7th Main Rd, Indiranagar"}
                </p>
              </div>

              {/* Destination Address */}
              <div className="relative mt-0.5">
                <div className="absolute -left-[20px] top-[4px] h-2.5 w-2.5 rounded-sm bg-red-500 border border-white" />
                <p className="text-[9px] font-extrabold text-gray-700 dark:text-gray-300 leading-none">
                  {active === "Multilingual App" ? "कोरामंगला" : "Koramangala"}
                </p>
              </div>
            </div>

            {/* State messages */}
            {active && (
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-zinc-800/80 text-[8px] font-extrabold uppercase tracking-wide text-left text-primary">
                {active === "Pink Mode" && (
                  <span className="text-pink-600">✓ प्रिया एस. • महिला चालक सत्यापित</span>
                )}
                {active === "Emergency SOS" && (
                  <span className="text-red-600 animate-pulse">!! आपातकालीन अलर्ट: संपर्क एवं पुलिस को सूचित किया जा रहा है</span>
                )}
                {active === "PWD Accessibility" && (
                  <span className="text-blue-600">✓ रैंप युक्त वाहन एवं विशेष सहायता सक्रिय</span>
                )}
                {active === "Elderly Assistance" && (
                  <span className="text-amber-600">✓ द्वार तक सहायता सुनिश्चित की गई</span>
                )}
                {active === "AI Safe Routing" && (
                  <span className="text-indigo-600 animate-pulse">✦ मार्ग सुरक्षा: 99.8% - सभी संवेदनशील क्षेत्र बाईपास</span>
                )}
                {active === "Live Tracking" && (
                  <span className="text-emerald-600">✦ लाइव ट्रैकिंग सक्रिय - 3 संरक्षक जुड़े हैं</span>
                )}
                {active === "Verified Operators" && (
                  <span className="text-emerald-600">✓ पृष्ठभूमि जांच: 100% स्पष्ट</span>
                )}
                {active === "Multilingual App" && (
                  <span className="text-blue-600">✦ हिंदी भाषा सक्रिय</span>
                )}
              </div>
            )}
          </div>
          
          {/* Home Button Bar inside Screen */}
          <div className="absolute bottom-1 inset-x-0 flex justify-center z-40">
            <div className="w-16 h-1 bg-gray-300 dark:bg-zinc-800 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* SVG Dotted lines behind phone converging nicely */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 900 720">
        {/* Left lines converging to (300, 360) */}
        <path d="M 240 86 L 300 360" className="flow-line" {...getLineStyles("Pink Mode")} fill="none" />
        <path d="M 240 266 L 300 360" className="flow-line" {...getLineStyles("PWD Accessibility")} fill="none" />
        <path d="M 240 454 L 300 360" className="flow-line" {...getLineStyles("Elderly Assistance")} fill="none" />
        <path d="M 240 634 L 300 360" className="flow-line" {...getLineStyles("AI Safe Routing")} fill="none" />
        
        {/* Right lines converging to (600, 360) */}
        <path d="M 660 86 L 600 360" className="flow-line" {...getLineStyles("Emergency SOS")} fill="none" />
        <path d="M 660 266 L 600 360" className="flow-line" {...getLineStyles("Live Tracking")} fill="none" />
        <path d="M 660 454 L 600 360" className="flow-line" {...getLineStyles("Verified Operators")} fill="none" />
        <path d="M 660 634 L 600 360" className="flow-line" {...getLineStyles("Multilingual App")} fill="none" />
      </svg>

      {/* Left Feature Cards - Re-engineered for high visibility */}
      {leftCards.map((card) => {
        const isSelected = selectedCard === card.title;
        const isHovered = hoveredCard === card.title;
        const isAnySelected = selectedCard !== null;
        const isAnyHovered = hoveredCard !== null;

        let opacity = 1;
        let scale = 1;
        let pointerEvents: "auto" | "none" = "auto";

        if (isAnySelected) {
          if (isSelected) {
            opacity = 1;
            scale = 1.15;
            pointerEvents = "auto";
          } else {
            opacity = 0;
            scale = 0.4;
            pointerEvents = "none";
          }
        } else if (isAnyHovered) {
          if (isHovered) {
            opacity = 1;
            scale = 1.1;
          } else {
            opacity = 0.35;
            scale = 0.95;
          }
        }

        return (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity, x: 0, scale }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            onMouseEnter={() => !isAnySelected && setHoveredCard(card.title)}
            onMouseLeave={() => !isAnySelected && setHoveredCard(null)}
            onClick={() => {
              setSelectedCard(isSelected ? null : card.title);
              setHoveredCard(null);
            }}
            className={`absolute left-[10px] w-[230px] rounded-[1.6rem] p-6 border transition-all duration-300 z-30 flex flex-col justify-center cursor-pointer ${
              isSelected
                ? 'bg-white border-primary shadow-[0_20px_50px_rgba(79,70,229,0.25)] border-[2.5px]' 
                : isHovered 
                  ? 'bg-white shadow-[0_20px_50px_rgba(79,70,229,0.18)] border-primary' 
                  : 'bg-white border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)]'
            }`}
            style={{ 
              top: card.top, 
              transform: 'translateY(-50%)', 
              minHeight: '105px',
              pointerEvents,
              borderColor: isSelected || isHovered ? ACCENT_COLOR : undefined
            }}
          >
            <h4 className="text-center font-extrabold text-[16px] mb-2 transition-colors duration-300" 
              style={{ color: isSelected || isHovered ? ACCENT_COLOR : "#1f2937" }}>
              {card.title}
            </h4>
            <p className="text-center text-gray-600 text-[12.5px] leading-relaxed transition-colors duration-300 font-medium">
              {card.desc}
            </p>
          </motion.div>
        );
      })}

      {/* Right Feature Cards - Re-engineered for high visibility */}
      {rightCards.map((card) => {
        const isSelected = selectedCard === card.title;
        const isHovered = hoveredCard === card.title;
        const isAnySelected = selectedCard !== null;
        const isAnyHovered = hoveredCard !== null;

        let opacity = 1;
        let scale = 1;
        let pointerEvents: "auto" | "none" = "auto";

        if (isAnySelected) {
          if (isSelected) {
            opacity = 1;
            scale = 1.15;
            pointerEvents = "auto";
          } else {
            opacity = 0;
            scale = 0.4;
            pointerEvents = "none";
          }
        } else if (isAnyHovered) {
          if (isHovered) {
            opacity = 1;
            scale = 1.1;
          } else {
            opacity = 0.35;
            scale = 0.95;
          }
        }

        return (
          <motion.div 
            key={card.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity, x: 0, scale }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            onMouseEnter={() => !isAnySelected && setHoveredCard(card.title)}
            onMouseLeave={() => !isAnySelected && setHoveredCard(null)}
            onClick={() => {
              setSelectedCard(isSelected ? null : card.title);
              setHoveredCard(null);
            }}
            className={`absolute right-[10px] w-[230px] rounded-[1.6rem] p-6 border transition-all duration-300 z-30 flex flex-col justify-center cursor-pointer ${
              isSelected
                ? 'bg-white border-primary shadow-[0_20px_50px_rgba(79,70,229,0.25)] border-[2.5px]' 
                : isHovered 
                  ? 'bg-white shadow-[0_20px_50px_rgba(79,70,229,0.18)] border-primary' 
                  : 'bg-white border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)]'
            }`}
            style={{ 
              top: card.top, 
              transform: 'translateY(-50%)', 
              minHeight: '105px',
              pointerEvents,
              borderColor: isSelected || isHovered ? ACCENT_COLOR : undefined
            }}
          >
            <h4 className="text-center font-extrabold text-[16px] mb-2 transition-colors duration-300" 
              style={{ color: isSelected || isHovered ? ACCENT_COLOR : "#1f2937" }}>
              {card.title}
            </h4>
            <p className="text-center text-gray-600 text-[12.5px] leading-relaxed transition-colors duration-300 font-medium">
              {card.desc}
            </p>
          </motion.div>
        );
      })}

    </div>
  );
};

// ─── Animated Phone Screen Component ────────────────────────────────────────
const AnimatedPhoneScreen = () => {
  const [eta, setEta] = useState(7);
  const [progress, setProgress] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  // SVG path for the route - an organic curve inside the map area
  const PATH = "M 20 100 C 40 80, 60 110, 80 90 C 100 70, 110 95, 130 85 C 150 75, 165 90, 180 75";
  const PATH_LENGTH = 200; // approximate length

  // Car travels along path
  const getCarPos = (t: number) => {
    // parametric approximation along the bezier
    const x = 20 + t * 160;
    // simple sine wave to stay near the path
    const y = 100 - t * 25 + Math.sin(t * Math.PI * 3) * 8;
    return { x, y };
  };

  useEffect(() => {
    const duration = 4000; // 4s per loop
    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % (duration + 1200); // 1.2s pause
      const t = Math.min(elapsed / duration, 1);
      setProgress(t);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    // Show AI badge after 1s
    const badgeTimer = setTimeout(() => setShowBadge(true), 1200);

    // Tick ETA down
    const etaTimer = setInterval(() => {
      setEta(prev => (prev <= 1 ? 7 : prev - 1));
    }, 1000);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      clearTimeout(badgeTimer);
      clearInterval(etaTimer);
    };
  }, []);

  const carPos = getCarPos(Math.min(progress, 0.98));
  const dashOffset = PATH_LENGTH * (1 - progress);

  return (
    <div className="flex h-full flex-col">
      {/* Phone header */}
      <div className="bg-foreground px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-background/70">SafeGo</p>
          <p className="text-sm font-semibold text-background">Book a Ride</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] text-primary font-bold">LIVE</span>
        </div>
      </div>

      {/* Mode pills */}
      <div className="bg-secondary px-3 pt-2 pb-1 flex gap-1.5">
        {modes.map(m => (
          <span key={m.id} className="rounded-full px-2 py-0.5 text-[9px] font-medium" style={{ backgroundColor: m.lightBg, color: m.accent }}>
            {m.name.replace(" Mode", "")}
          </span>
        ))}
      </div>

      {/* ── Animated Map Area ── */}
      <div className="relative mx-3 mt-2 h-[115px] rounded-xl overflow-hidden bg-[#f0f4f0] dark:bg-zinc-800/60 border border-border flex-shrink-0">
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ph-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ph-grid)" />
        </svg>

        {/* Animated SVG route */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 130" preserveAspectRatio="none">
          {/* Route background (faint) */}
          <path
            d={PATH}
            fill="none"
            stroke="hsl(var(--teal))"
            strokeWidth="3"
            strokeDasharray="5 4"
            opacity="0.2"
          />
          {/* Animating route draw */}
          <path
            d={PATH}
            fill="none"
            stroke="hsl(var(--teal))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
            opacity="0.9"
          />

          {/* ── Pickup Waypoint (Start) ── */}
          <circle cx="20" cy="100" r="5" fill="hsl(var(--teal))" opacity="0.3">
            <animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="20" cy="100" r="3.5" fill="hsl(var(--teal))" />

          {/* ── Dropoff Waypoint (End) ── */}
          <circle cx="180" cy="75" r="4" fill="hsl(var(--destructive))" opacity="0.3">
            <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <rect x="177" y="72" width="6" height="6" rx="1" fill="hsl(var(--destructive))" />

          {/* ── Animated Car Dot ── */}
          <g transform={`translate(${carPos.x - 7}, ${carPos.y - 7})`}>
            {/* Glow ring */}
            <circle cx="7" cy="7" r="10" fill="hsl(var(--teal))" opacity="0.15">
              <animate attributeName="r" values="8;14;8" dur="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Car body */}
            <circle cx="7" cy="7" r="6" fill="hsl(var(--teal))" />
            <circle cx="7" cy="7" r="3.5" fill="white" opacity="0.9" />
          </g>
        </svg>

        {/* ETA Chip */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-background/90 backdrop-blur px-2 py-1 shadow-md border border-border">
          <Clock size={9} className="text-primary" />
          <span className="text-[9px] font-bold text-foreground">{eta} min</span>
        </div>

        {/* AI Safe Route badge — fades in after delay */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-primary/90 px-2 py-1 shadow-md"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: showBadge ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity 0.5s ease, transform 0.5s ease"
          }}
        >
          <Navigation size={8} className="text-primary-foreground" />
          <span className="text-[8px] font-bold text-primary-foreground">AI Safe Route</span>
        </div>
      </div>

      {/* Driver info card */}
      <div className="mx-3 mt-2 rounded-xl border border-border bg-background p-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-mode-teal-light flex items-center justify-center flex-shrink-0">
            <Star size={12} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-foreground">James D.</p>
            <p className="text-[9px] text-muted-foreground">⭐ 4.9 · Toyota Vios</p>
          </div>
          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <Navigation size={9} className="text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Bottom SOS strip */}
      <div className="mx-3 mt-2 rounded-xl bg-destructive/10 border border-destructive/20 py-1.5 text-center">
        <span className="text-[9px] font-bold text-destructive tracking-widest">SOS · HOLD FOR EMERGENCY</span>
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState("all");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const revealRef = useScrollReveal([activeMode]);
  const filtered = activeMode === "all" ? modes : modes.filter((m) => m.id === activeMode);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt (max 8 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const fullQuote = "True peace of mind is knowing that someone is looking out for you at every turn. We built this platform so you never have to ride alone.";
  const [displayedQuote, setDisplayedQuote] = useState("");

  useEffect(() => {
    const words = fullQuote.split(" ");
    let i = 0;
    const timer = setInterval(() => {
      if (i < words.length) {
        setDisplayedQuote(prev => (prev ? prev + " " : "") + words[i]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={revealRef}>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[100vh] flex items-center bg-white dark:bg-background overflow-hidden pt-20 pb-12">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="mx-auto flex w-full flex-col-reverse items-center gap-16 px-6 py-12 lg:flex-row lg:gap-20 sm:px-10 lg:px-16 relative z-10">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left lg:-mt-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <ShieldCheck size={16} />
              <span>Premium Safety Standard</span>
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Elevate Your Journey
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-primary mx-auto lg:mx-0">
              SafeGo ensures every woman, elderly citizen, and differently-abled passenger travels with safety, dignity, and confidence.
            </p>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground mx-auto lg:mx-0">
              SafeGo adapts to you with tailored routes, verified operators, and real-time monitoring. Premium safety, accessible for all.
            </p>

            
            {/* The SafeGo Promise Quote */}
            <div className="mt-8 max-w-xl hidden lg:block text-left">
              <p className="text-[17px] font-medium text-foreground italic leading-relaxed min-h-[50px]">
                {displayedQuote}
                <span className="inline-block w-1 h-5 bg-primary ml-1 animate-pulse" style={{ visibility: displayedQuote.length === fullQuote.length ? 'hidden' : 'visible' }} />
              </p>
              <p className="mt-4 text-xs font-bold tracking-widest text-primary uppercase">- THE SAFEGO PROMISE</p>
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center items-center py-10 lg:py-0 relative lg:-mt-20"
          >
            {/* Glowing background behind phone */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 opacity-50 pointer-events-none"></div>
            <div className="w-[400px] sm:w-[520px] md:w-[640px] lg:w-[738px] xl:w-[828px] h-[320px] sm:h-[415px] md:h-[515px] lg:h-[590px] xl:h-[660px] flex items-center justify-center overflow-visible shrink-0">
              <ServicesHeroGraphic />
            </div>
          </motion.div>

        </div>
      </section>

      {/* RIDE MODES */}
      <section className="section-padding section-alt">
        <div className="mx-auto w-full px-6 sm:px-10 lg:px-16">
          <div className="text-center scroll-reveal">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Choose Your Safe Ride</h2>
            <p className="mt-3 text-lg text-muted-foreground">Tailored safety experiences for every passenger</p>
          </div>
          <div className="mt-10 scroll-reveal">
            <ModeFilterTabs active={activeMode} onSelect={setActiveMode} />
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {filtered.map((m) => (
              <div key={m.id} className="scroll-reveal">
                <ModeCard mode={m} hideCTA={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section className="section-padding bg-background">
        <div className="mx-auto flex w-full flex-col items-center gap-16 lg:flex-row px-6 sm:px-10 lg:px-16">
          {/* Left text */}
          <div className="flex-1 scroll-reveal">
            <span className="caption-label">SEAMLESS MOBILE EXPERIENCE</span>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Smart App. Smarter Safety.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Track your ride live, access emergency SOS in one tap, and let AI monitor your safety in real-time.
            </p>
            <div className="mt-8 flex flex-col gap-6">
              {[
                { icon: Shield, title: "Real-Time AI Monitoring", desc: "Route safety analyzed continuously" },
                { icon: Bell, title: "Instant SOS Alerts", desc: "One tap to alert contacts and admin" },
                { icon: MapPin, title: "Live GPS Tracking", desc: "Share your location with family anytime" },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mode-teal-light">
                    <f.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right phones */}
          <div className="relative flex flex-1 items-center justify-center scroll-reveal">
            <div className="relative">
              {/* Phone 1 */}
              <div className="animate-float relative z-10 h-[480px] w-[240px] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-secondary shadow-2xl">
                <AnimatedPhoneScreen />
              </div>
              {/* Phone 2 */}
              <div className="absolute -left-16 top-12 h-[420px] w-[210px] rotate-[-8deg] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-foreground shadow-2xl opacity-80">
                <div className="flex h-full flex-col p-4">
                  <p className="text-xs text-background/50">Tracking</p>
                  <p className="text-sm font-semibold text-background">Ride in Progress</p>
                  <div className="mt-3 flex-1 rounded-xl bg-background/10 relative overflow-hidden">
                    {/* Animated Map Pattern inside Phone 2 */}
                    <div className="absolute inset-[-40px] opacity-[0.15] animate-move-map pointer-events-none text-background"
                      style={{ backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    />
                    <div className="absolute top-1/3 left-1/3 z-10 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-background/40 animate-ping absolute duration-1000" />
                      <div className="h-4 w-4 rounded-full border-[3px] border-foreground bg-background relative z-10 shadow-lg" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <SafetyScoreBar score={92} color="hsl(var(--teal))" />
                  </div>
                  <div className="mt-3 rounded-xl bg-destructive/20 py-2 text-center text-[10px] font-bold text-destructive">
                    SOS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section-padding section-alt relative overflow-hidden">
        {/* Decorative background flow lines */}
        <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[300px] opacity-[0.03] pointer-events-none" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <path d="M0 150 C 250 50, 750 250, 1000 150" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" />
        </svg>

        <div className="mx-auto w-full relative z-10 px-6 sm:px-10 lg:px-16">
          <div className="text-center scroll-reveal">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">How SafeGo Works</h2>
            <p className="mt-3 text-lg text-muted-foreground">From booking to arrival, every step is protected</p>
          </div>

          <div className="mt-20 relative">
            {/* Connecting line (Desktop only) */}
            <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-primary/30 z-0"></div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { num: "01", icon: <CheckCircle className="text-foreground" size={24} />, color: "text-foreground", border: "border-foreground/10", title: "Select Your Mode", desc: "Choose the ride mode that fits your specific needs. Exclusive safety features and filters activate automatically based on your selection." },
                { num: "02", icon: <ShieldCheck className="text-primary" size={24} />, color: "text-primary", border: "border-primary/20", title: "AI Plans Your Route", desc: "Our machine learning model analyzes real-time crime data, street lighting, and historical road safety to select the absolute safest path." },
                { num: "03", icon: <MapPin className="text-mode-purple" size={24} />, color: "text-mode-purple", border: "border-mode-purple/20", title: "Ride with Protection", desc: "Real-time AI monitoring, verified driver tracking, emergency SOS alerts, and live family sharing remain active for your whole trip." },
              ].map((s, idx) => (
                <div key={s.num} className="relative scroll-reveal group">
                  {/* Arrow indicator for flow */}
                  {idx < 2 && (
                    <div className="hidden md:flex absolute -right-6 top-12 z-20 h-5 w-5 items-center justify-center text-primary/50 translate-x-1/2">
                      <ArrowRight size={20} />
                    </div>
                  )}

                  <div className={`safego-card relative overflow-hidden p-8 h-full z-10 bg-card border-2 ${s.border} hover:border-primary/40 transition-colors`}>
                    <span className="absolute -right-2 -top-4 font-display text-[80px] font-extrabold text-secondary/80 transition-transform group-hover:scale-110">{s.num}</span>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary font-display text-xl font-bold shadow-sm ${s.color}`}>
                        {s.icon}
                      </div>
                      <div className={`font-display text-xl font-bold ${s.color}`}>Step {s.num}</div>
                    </div>

                    <h3 className="relative z-10 mt-8 font-display text-2xl font-bold text-foreground">{s.title}</h3>
                    <p className="relative z-10 mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="section-padding section-alt overflow-hidden">
        <div className="text-center scroll-reveal mb-12">
          <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Trusted by Thousands</h2>
          <p className="mt-3 text-lg text-muted-foreground">Real stories from real passengers</p>
        </div>

        {/* Marquee track */}
        <div
          className="relative w-full"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            className="flex gap-6 w-max"
            style={{
              animation: "marquee-scroll 32s linear infinite",
            }}
            onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
          >
            {/* Render testimonials twice for seamless loop */}
            {[
              { mode: "Pink Mode", color: "hsl(var(--pink))", bg: "hsl(var(--pink-light))", quote: "As a woman commuting late at night, SafeGo's Pink Mode gives me genuine peace of mind. The verified female drivers and live tracking changed everything.", name: "Maria S.", city: "Manila" },
              { mode: "PWD Mode", color: "hsl(var(--purple))", bg: "hsl(var(--purple-light))", quote: "Finally a ride service that treats accessibility as a priority, not an afterthought. The voice navigation and pickup assistance are incredible.", name: "David L.", city: "Cebu" },
              { mode: "Elderly Mode", color: "hsl(var(--blue))", bg: "hsl(var(--blue-light))", quote: "My father uses SafeGo every week for his hospital visits. The patient drivers and door assistance make all the difference for our family.", name: "Ana R.", city: "Davao" },
              { mode: "Standard", color: "hsl(var(--teal))", bg: "hsl(var(--teal-light))", quote: "I love how SafeGo matches me with top-rated drivers every time. The app is smooth and the in-ride AI monitoring gives me real confidence.", name: "Carlo M.", city: "Quezon City" },
              { mode: "Pink Mode", color: "hsl(var(--pink))", bg: "hsl(var(--pink-light))", quote: "The SOS button saved me once during a sketchy route. Authorities were notified in seconds. SafeGo is not just an app — it's a safety net.", name: "Joyce T.", city: "Makati" },
              { mode: "PWD Mode", color: "hsl(var(--purple))", bg: "hsl(var(--purple-light))", quote: "As a wheelchair user, I struggled with regular ride apps. SafeGo's PWD Mode had a ramp-equipped driver at my door in under 10 minutes.", name: "Ben A.", city: "Pasig" },
              // Duplicate for loop
              { mode: "Pink Mode", color: "hsl(var(--pink))", bg: "hsl(var(--pink-light))", quote: "As a woman commuting late at night, SafeGo's Pink Mode gives me genuine peace of mind. The verified female drivers and live tracking changed everything.", name: "Maria S.", city: "Manila" },
              { mode: "PWD Mode", color: "hsl(var(--purple))", bg: "hsl(var(--purple-light))", quote: "Finally a ride service that treats accessibility as a priority, not an afterthought. The voice navigation and pickup assistance are incredible.", name: "David L.", city: "Cebu" },
              { mode: "Elderly Mode", color: "hsl(var(--blue))", bg: "hsl(var(--blue-light))", quote: "My father uses SafeGo every week for his hospital visits. The patient drivers and door assistance make all the difference for our family.", name: "Ana R.", city: "Davao" },
              { mode: "Standard", color: "hsl(var(--teal))", bg: "hsl(var(--teal-light))", quote: "I love how SafeGo matches me with top-rated drivers every time. The app is smooth and the in-ride AI monitoring gives me real confidence.", name: "Carlo M.", city: "Quezon City" },
              { mode: "Pink Mode", color: "hsl(var(--pink))", bg: "hsl(var(--pink-light))", quote: "The SOS button saved me once during a sketchy route. Authorities were notified in seconds. SafeGo is not just an app — it's a safety net.", name: "Joyce T.", city: "Makati" },
              { mode: "PWD Mode", color: "hsl(var(--purple))", bg: "hsl(var(--purple-light))", quote: "As a wheelchair user, I struggled with regular ride apps. SafeGo's PWD Mode had a ramp-equipped driver at my door in under 10 minutes.", name: "Ben A.", city: "Pasig" },
            ].map((t, i) => (
              <div
                key={i}
                className="w-[320px] flex-shrink-0 safego-card p-8 cursor-default transition-shadow hover:shadow-xl"
              >
                <span className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: t.bg, color: t.color }}>{t.mode}</span>
                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-primary-foreground flex-shrink-0" style={{ backgroundColor: t.color }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyframe injection */}
        <style>{`
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>



      {/* KEY FEATURES */}
      <section id="features" className="section-padding section-alt overflow-hidden">
        <div className="mx-auto w-full px-6 sm:px-10 lg:px-16">
          <div className="scroll-reveal text-center max-w-2xl mx-auto">
            <span className="caption-label">TAKING CARE OF EVERY CLIENT</span>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Key Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We are all about our client's comfort and safety. That's why we provide the best service you can imagine, from start to finish.
            </p>
          </div>

          <div className="mt-16 relative">
            {/* Background connecting snake line for Flowchart (Desktop) */}
            <div className="hidden lg:block absolute top-[100px] left-[12%] right-[12%] bottom-0 pointer-events-none z-0">
              <svg width="100%" height="100%" preserveAspectRatio="none">
                <path d="M 0 0 C 300 0, 700 0, 1000 0" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-border" fill="none" />
              </svg>
            </div>

            <div className="grid gap-10 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {[
                { icon: Clock, title: "24/7 Car Delivery", bg: "bg-mode-teal-light", color: "text-primary", border: "border-primary", text: "Reserve a ride any time of the day or night. Our fleets are actively running during off-hours to make sure you never get stranded." },
                { icon: Lock, title: "Absolute Confidentiality", bg: "bg-secondary", color: "text-foreground", border: "border-border", text: "Your personal location data and contact info are securely encrypted. Drivers cannot access your real phone number through the app." },
                { icon: Zap, title: "Premium Ride Package", bg: "bg-mode-blue-light", color: "text-mode-blue", border: "border-mode-blue", text: "Enjoy complimentary Wi-Fi, phone chargers, and bottled water included standard on our verified Premium Fleet vehicles." },
                { icon: HelpCircle, title: "Dedicated Support", bg: "bg-mode-pink-light", color: "text-mode-pink", border: "border-mode-pink", text: "Got an issue? Hit the help button to connect instantly with a live human representative at our support center." },
              ].map((f, idx) => (
                <div key={f.title} className="relative scroll-reveal group">
                  {/* Flow Arrows */}
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute -right-4 top-[32px] z-20 h-6 w-6 items-center justify-center text-muted-foreground translate-x-1/2 bg-background rounded-full border border-border shadow-sm">
                      <ArrowRight size={14} />
                    </div>
                  )}

                  <div className={`safego-card relative h-full flex flex-col p-8 transition-colors border-2 border-transparent hover:${f.border} bg-card/90 backdrop-blur-md`}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`flex shrink-0 h-16 w-16 items-center justify-center rounded-2xl ${f.bg} shadow-sm group-hover:scale-110 transition-transform`}>
                        <f.icon size={28} className={f.color} />
                      </div>
                      <span className="font-display font-extrabold text-3xl opacity-10">0{idx + 1}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-foreground">{f.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground flex-1">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DARK CTA BANNER */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-20 text-center sm:px-16 premium-shadow">
          {/* Decorative arcs */}
          <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06]" viewBox="0 0 200 200">
            <circle cx="200" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="100" r="120" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="100" r="160" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
          <h2 className="relative font-display text-3xl font-bold text-background sm:text-5xl">Start Riding Safer Today</h2>
          <p className="relative mt-4 text-background/70">Join thousands of passengers who trust SafeGo for every journey.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                if (downloaded || isDownloading) return;
                setIsDownloading(true);
                setTimeout(() => {
                  setIsDownloading(false);
                  setDownloaded(true);
                  setTimeout(() => setDownloaded(false), 3000);
                }, 1500);
              }}
              className={`rounded-full px-8 py-4 font-semibold transition-all ${downloaded ? 'bg-primary text-primary-foreground scale-100' : isDownloading ? 'bg-background/80 text-foreground/50 scale-95 cursor-wait' : 'bg-background text-foreground hover:scale-[1.02]'}`}
            >
              {isDownloading ? "Starting..." : downloaded ? "Check Downloads!" : "Download the App"}
            </button>
            <a href="#how" className="rounded-full border-2 border-background/30 px-8 py-4 font-semibold text-background transition-colors hover:border-background hover:bg-background/10">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
