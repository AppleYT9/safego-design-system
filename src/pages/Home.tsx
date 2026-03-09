import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModeCard } from "@/components/ModeCard";
import { ModeFilterTabs } from "@/components/ModeFilterTabs";
import { SafetyScoreBar } from "@/components/SafetyScoreBar";
import { modes } from "@/config/modeConfig";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Bell, MapPin, CheckCircle, ArrowRight, Star,
  Clock, Users, Car, ShieldCheck, Zap, HelpCircle, Package, Lock,
  Banknote, GraduationCap, Heart, CalendarCheck
} from "lucide-react";

const Home = () => {
  const [activeMode, setActiveMode] = useState("all");
  const revealRef = useScrollReveal();
  const filtered = activeMode === "all" ? modes : modes.filter((m) => m.id === activeMode);

  return (
    <div ref={revealRef}>
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
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

        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-20 lg:flex-row lg:gap-16 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex-1 scroll-reveal">
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
              AI-Powered Safety Platform
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] text-foreground sm:text-7xl">
              Ride Safe.<br />Arrive Safe.<br />Always.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              AI-powered ride safety for everyone. Smarter routes. Verified drivers. Real-time protection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/book/normal" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02]">
                Book a Ride <ArrowRight size={18} />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 rounded-full border-2 border-foreground px-8 py-4 font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background">
                Learn How It Works
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-primary" /> AI Verified Routes</span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-primary" /> 10K+ Safe Rides</span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-primary" /> 24/7 Monitoring</span>
            </div>
          </div>

          {/* Right — floating card */}
          <div className="relative flex-1 scroll-reveal hidden lg:flex justify-center">
            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[200, 280, 360].map((s) => (
                <div key={s} className="absolute rounded-full border border-primary/[0.08]" style={{ width: s, height: s }} />
              ))}
            </div>

            <div className="animate-float relative z-10 w-[340px] rounded-3xl border border-border bg-background p-6 shadow-xl">
              <p className="text-sm font-semibold text-foreground">Select Your Ride</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {modes.map((m) => (
                  <span key={m.id} className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: m.lightBg, color: m.accent }}>
                    {m.name.replace(" Mode", "")}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary" /> Pickup location
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-amber-500" /> Destination
                </div>
              </div>
              <button className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                Find Safe Route
              </button>
              <div className="mt-4">
                <SafetyScoreBar score={96} />
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-4 top-8 z-20 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 shadow-lg">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-xs font-semibold">Driver Verified ✓</span>
            </div>
            <div className="absolute -left-4 bottom-16 z-20 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 shadow-lg">
              <MapPin size={18} className="text-primary" />
              <span className="text-xs font-semibold">Safe Route Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* RIDE MODES */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-7xl">
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
                <ModeCard mode={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP SHOWCASE */}
      <section className="section-padding bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">
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
                <div className="flex h-full flex-col">
                  <div className="bg-foreground px-4 py-3">
                    <p className="text-xs text-background/70">SafeGo</p>
                    <p className="text-sm font-semibold text-background">Book a Ride</p>
                  </div>
                  <div className="flex-1 bg-secondary p-3">
                    <div className="flex gap-1.5 mb-3">
                      {modes.map(m => (
                        <span key={m.id} className="rounded-full px-2 py-0.5 text-[9px] font-medium" style={{ backgroundColor: m.lightBg, color: m.accent }}>
                          {m.name.replace(" Mode", "")}
                        </span>
                      ))}
                    </div>
                    <div className="h-32 rounded-xl bg-foreground/5 mb-3" />
                    <div className="rounded-xl border border-border bg-background p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-mode-teal-light flex items-center justify-center">
                          <Star size={12} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-foreground">James D.</p>
                          <p className="text-[9px] text-muted-foreground">⭐ 4.9 · Toyota Vios</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Phone 2 */}
              <div className="absolute -left-16 top-12 h-[420px] w-[210px] rotate-[-8deg] overflow-hidden rounded-[2.5rem] border-[6px] border-foreground bg-foreground shadow-2xl opacity-80">
                <div className="flex h-full flex-col p-4">
                  <p className="text-xs text-background/50">Tracking</p>
                  <p className="text-sm font-semibold text-background">Ride in Progress</p>
                  <div className="mt-3 flex-1 rounded-xl bg-background/10" />
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
      <section id="how" className="section-padding section-alt">
        <div className="mx-auto max-w-7xl">
          <div className="text-center scroll-reveal">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">How SafeGo Works</h2>
            <p className="mt-3 text-lg text-muted-foreground">From booking to arrival, every step is protected</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { num: "01", color: "text-foreground", title: "Select Your Mode", desc: "Choose the ride mode that fits your needs — safety features activate automatically." },
              { num: "02", color: "text-primary", title: "AI Plans Your Route", desc: "Our ML model analyzes crime data, lighting, and road history to select the safest path." },
              { num: "03", color: "text-foreground", title: "Ride with Protection", desc: "Real-time monitoring, verified driver, emergency SOS, and family tracking — active for your whole trip." },
            ].map((s) => (
              <div key={s.num} className="safego-card relative overflow-hidden p-8 scroll-reveal">
                <span className="absolute -right-2 -top-4 font-display text-[80px] font-extrabold text-secondary/80">{s.num}</span>
                <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-secondary font-display text-xl font-bold ${s.color}`}>
                  {s.num}
                </div>
                <h3 className="relative z-10 mt-5 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="border-y border-border py-16">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center scroll-reveal">
              {[
                { val: "98%", label: "Safe Ride Completion" },
                { val: "10,000+", label: "Verified Drivers" },
                { val: "500K+", label: "Passengers Protected" },
                { val: "< 90s", label: "Emergency Response" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">{s.val}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-7xl">
          <div className="text-center scroll-reveal">
            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Trusted by Thousands</h2>
            <p className="mt-3 text-lg text-muted-foreground">Real stories from real passengers</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { mode: "Pink Mode", color: "hsl(var(--pink))", bg: "hsl(var(--pink-light))", quote: "As a woman commuting late at night, SafeGo's Pink Mode gives me genuine peace of mind. The verified female drivers and live tracking changed everything.", name: "Maria S.", city: "Manila" },
              { mode: "PWD Mode", color: "hsl(var(--purple))", bg: "hsl(var(--purple-light))", quote: "Finally a ride service that treats accessibility as a priority, not an afterthought. The voice navigation and pickup assistance are incredible.", name: "David L.", city: "Cebu" },
              { mode: "Elderly Mode", color: "hsl(var(--blue))", bg: "hsl(var(--blue-light))", quote: "My father uses SafeGo every week for his hospital visits. The patient drivers and door assistance make all the difference for our family.", name: "Ana R.", city: "Davao" },
            ].map((t) => (
              <div key={t.name} className="safego-card p-8 scroll-reveal">
                <span className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: t.bg, color: t.color }}>{t.mode}</span>
                <div className="mt-3 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-primary-foreground" style={{ backgroundColor: t.color }}>
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
      </section>

      {/* BECOME A DRIVER CTA */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary via-background to-mode-teal-light/30 p-8 sm:p-16">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-mode-pink-light/40 blur-2xl" />

            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 scroll-reveal">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  <Car size={14} /> Now Hiring
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-5xl">
                  Become a SafeGo<br />Driver Today
                </h2>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Join our team of 3,200+ verified drivers. Men and women welcome — earn great income while keeping rides safe for everyone.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                  {[
                    { icon: Banknote, text: "₱3,500+/day Potential" },
                    { icon: CalendarCheck, text: "Flexible Schedule" },
                    { icon: GraduationCap, text: "Free Training" },
                    { icon: Heart, text: "Men & Women Welcome" },
                  ].map((b) => (
                    <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <b.icon size={16} className="text-primary shrink-0" />
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/drive-with-us"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02]"
                  >
                    Apply Now <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/drive-with-us#requirements"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-foreground px-8 py-4 font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    View Requirements
                  </Link>
                </div>
              </div>

              <div className="flex-1 flex justify-center scroll-reveal">
                <div className="grid grid-cols-2 gap-4 max-w-xs">
                  <div className="safego-card p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mode-teal-light">
                      <Shield size={22} className="text-primary" />
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">Insured Drivers</p>
                  </div>
                  <div className="safego-card p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mode-pink-light">
                      <Users size={22} className="text-mode-pink" />
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold text-foreground">3,200+</p>
                    <p className="text-xs text-muted-foreground">Active Drivers</p>
                  </div>
                  <div className="safego-card p-6 text-center col-span-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mode-blue-light">
                      <Star size={22} className="text-mode-blue" />
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold text-foreground">4.8 ⭐</p>
                    <p className="text-xs text-muted-foreground">Average Driver Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-7xl">
          <div className="scroll-reveal">
            <span className="caption-label">TAKING CARE OF EVERY CLIENT</span>
            <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Key Features</h2>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              We are all about our client's comfort and safety. That's why we provide the best service you can imagine.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, title: "24-hour car delivery", bg: "bg-mode-teal-light", color: "text-primary" },
              { icon: HelpCircle, title: "24/7 technical support", bg: "bg-secondary", color: "text-foreground" },
              { icon: Zap, title: "All modes have a premium package", bg: "bg-mode-blue-light", color: "text-mode-blue" },
              { icon: Lock, title: "Absolute confidentiality", bg: "bg-mode-teal-light/50", color: "text-foreground" },
            ].map((f) => (
              <div key={f.title} className="safego-card p-8 scroll-reveal">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${f.bg}`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-foreground">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARK CTA BANNER */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-foreground px-8 py-20 text-center sm:px-16">
          {/* Decorative arcs */}
          <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06]" viewBox="0 0 200 200">
            <circle cx="200" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="100" r="120" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="100" r="160" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
          <h2 className="relative font-display text-3xl font-bold text-background sm:text-5xl">Start Riding Safer Today</h2>
          <p className="relative mt-4 text-background/70">Join thousands of passengers who trust SafeGo for every journey.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="rounded-full bg-background px-8 py-4 font-semibold text-foreground transition-all hover:scale-[1.02]">
              Download the App
            </Link>
            <Link to="/book/normal" className="rounded-full border-2 border-background/30 px-8 py-4 font-semibold text-background transition-colors hover:border-background">
              Book a Ride
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
