import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModeCard } from "@/components/ModeCard";
import { ModeFilterTabs } from "@/components/ModeFilterTabs";
import { SafetyScoreBar } from "@/components/SafetyScoreBar";
import { modes } from "@/config/modeConfig";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Bell, MapPin, CheckCircle, ArrowRight, Star,
  Clock, Users, Car, ShieldCheck, Zap, HelpCircle, Lock,
  Banknote, GraduationCap, Heart, CalendarCheck, Navigation
} from "lucide-react";

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
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
        {/* Animated Background 3D Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/20 blur-3xl animate-pulse"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        {/* Faint map decoration on right */}
        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-map" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1.5" fill="hsl(var(--teal))" />
              <path d="M 0 25 L 50 25 M 25 0 L 25 50" stroke="hsl(var(--teal))" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-map)" />
        </svg>

        <div className="mx-auto flex w-full max-w-[1400px] flex-col-reverse items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 sm:px-8 lg:px-12">
          {/* Left */}
          <div className="flex-1 scroll-reveal">
            <h1 className="mt-8 font-display text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Real Safety for<br /><span className="text-primary">Every</span> Passenger.
            </h1>
            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground/80">
              SafeGo adapts to you with tailored routes, verified operators, and real-time monitoring. Premium safety, accessible for all.
            </p>
            <div className="mt-10 max-w-xl">
              <p className="text-[17px] font-medium text-foreground italic leading-relaxed min-h-[50px]">
                {displayedQuote}
                <span className="inline-block w-1 h-5 bg-primary ml-1 animate-pulse" style={{ visibility: displayedQuote.length === fullQuote.length ? 'hidden' : 'visible' }} />
              </p>
              <p className="mt-4 text-xs font-bold tracking-widest text-primary uppercase">— The SafeGo Promise</p>
            </div>
          </div>

          {/* Right — Interactive 3D Booking Card */}
          <div className="relative flex-1 scroll-reveal hidden lg:flex justify-center perspective-[2000px]">
            {/* Radar Animation Background rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
              {[200, 300, 400].map((s) => (
                <div key={s} className="absolute rounded-full border border-primary/[0.08]" style={{ width: s, height: s }} />
              ))}
            </div>

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.1s ease-out"
              }}
              className="relative z-10 w-[380px] group rounded-[2.5rem] border-2 border-border/50 bg-background/80 backdrop-blur-xl p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:border-primary/40"
            >
              {/* Inner elements with translation on Z-axis for depth */}
              <div style={{ transform: "translateZ(30px)" }} className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Quick Book</h3>
                  <p className="text-xs text-muted-foreground mt-1">Select your specialized ride</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="text-primary" size={20} />
                </div>
              </div>

              <div style={{ transform: "translateZ(45px)" }} className="grid grid-cols-2 gap-3 mb-6">
                <Link to="/book/pink" className="flex flex-col items-center justify-center rounded-xl border border-mode-pink/20 bg-mode-pink-light/50 p-3 transition-colors hover:bg-mode-pink-light">
                  <Shield className="text-mode-pink mb-1" size={18} />
                  <span className="text-xs font-semibold text-mode-pink">Pink Mode</span>
                </Link>
                <Link to="/book/pwd" className="flex flex-col items-center justify-center rounded-xl border border-mode-purple/20 bg-mode-purple-light/50 p-3 transition-colors hover:bg-mode-purple-light">
                  <Users className="text-mode-purple mb-1" size={18} />
                  <span className="text-xs font-semibold text-mode-purple">PWD Mode</span>
                </Link>
                <Link to="/book/elderly" className="flex flex-col items-center justify-center rounded-xl border border-mode-blue/20 bg-mode-blue-light/50 p-3 transition-colors hover:bg-mode-blue-light">
                  <Heart className="text-mode-blue mb-1" size={18} />
                  <span className="text-xs font-semibold text-mode-blue">Elderly Mode</span>
                </Link>
                <Link to="/book/normal" className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-3 transition-colors hover:bg-primary/10">
                  <MapPin className="text-primary mb-1" size={18} />
                  <span className="text-xs font-semibold text-primary">Standard</span>
                </Link>
              </div>

              <div style={{ transform: "translateZ(20px)" }} className="flex flex-col gap-3 relative">
                {/* Connecting line between inputs */}
                <div className="absolute left-[15px] top-[24px] bottom-[24px] w-[2px] bg-border z-0"></div>
                <div className="relative z-10 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                  <span className="opacity-50">Current Location</span>
                </div>
                <div className="relative z-10 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                  <div className="h-2.5 w-2.5 rounded-sm bg-destructive ring-4 ring-destructive/20" />
                  <span className="opacity-50">Where to?</span>
                </div>
              </div>

              <Link to="/book/normal" style={{ transform: "translateZ(60px)" }} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-4 text-sm font-bold text-background transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]">
                Book Ride Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Orbiting badges with high Z-translation */}
            <div
              className="absolute -right-6 top-16 z-20 flex animate-bounce items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-xl"
              style={{
                animationDuration: '3s',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(100px)`
              }}
            >
              <ShieldCheck size={20} className="text-primary" />
              <span className="text-sm font-bold text-foreground">Verified ✓</span>
            </div>
            <div
              className="absolute -left-8 bottom-24 z-20 flex animate-bounce items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-xl"
              style={{
                animationDuration: '4s',
                animationDelay: '1s',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(120px)`
              }}
            >
              <Clock size={20} className="text-mode-pink" />
              <span className="text-sm font-bold text-foreground">24/7 Monitored</span>
            </div>
          </div>
        </div>
      </section>

      {/* RIDE MODES */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-[1400px]">
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
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-16 lg:flex-row">
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

        <div className="mx-auto max-w-[1400px] relative z-10">
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
        <div className="mx-auto max-w-[1400px]">
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
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-20 text-center sm:px-16 premium-shadow">
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
