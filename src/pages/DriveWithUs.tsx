import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import {
    Shield, ArrowRight, CheckCircle, Star, Users, Car, Heart,
    BadgeCheck, Clock, MapPin, Banknote, GraduationCap,
    FileCheck, Fingerprint, HeartHandshake, Award, TrendingUp,
    Smartphone, CalendarCheck, Fuel, Stethoscope, UserCheck,
    ChevronRight, Sparkles, Target, Eye, ShieldCheck, Zap
} from "lucide-react";

const DriveWithUs = () => {
    const revealRef = useScrollReveal();

    const requirements = [
        {
            icon: FileCheck,
            title: "Valid Driver's License",
            desc: "Professional or non-professional with restriction code 1, 2, or 3. Must be valid and not expired.",
            forAll: true,
        },
        {
            icon: Fingerprint,
            title: "NBI / Police Clearance",
            desc: "Clean criminal record. We perform thorough background checks to ensure passenger safety.",
            forAll: true,
        },
        {
            icon: Stethoscope,
            title: "Medical Certificate",
            desc: "Fit-to-drive certification from a licensed physician. Annual renewal required.",
            forAll: true,
        },
        {
            icon: Car,
            title: "Vehicle Requirements",
            desc: "Well-maintained vehicle (2015 or newer), complete documentation, and passing inspection.",
            forAll: true,
        },
        {
            icon: UserCheck,
            title: "Age Requirement",
            desc: "Must be between 21–60 years old. Both men and women equally welcome to apply.",
            forAll: true,
        },
        {
            icon: Smartphone,
            title: "Smartphone with Data",
            desc: "Android 8.0+ or iOS 14+ with a stable internet connection for the SafeGo Driver App.",
            forAll: true,
        },
    ];

    const hiringProcess = [
        {
            step: "01",
            title: "Apply Online",
            desc: "Fill out the application form with your personal details and upload required documents.",
            icon: FileCheck,
        },
        {
            step: "02",
            title: "Background Verification",
            desc: "Our team verifies your identity, driving record, and criminal background for safety compliance.",
            icon: Shield,
        },
        {
            step: "03",
            title: "Vehicle Inspection",
            desc: "Bring your vehicle for a comprehensive safety and quality inspection at any partner hub.",
            icon: Car,
        },
        {
            step: "04",
            title: "Safety Training",
            desc: "Complete our certified safety and sensitivity training — covering all ride modes including PWD, Pink, and Elderly.",
            icon: GraduationCap,
        },
        {
            step: "05",
            title: "Start Earning",
            desc: "Get verified, go online, and start accepting ride requests. Welcome to the SafeGo family!",
            icon: Sparkles,
        },
    ];

    const benefits = [
        { icon: Banknote, title: "Competitive Earnings", desc: "Earn up to ₹3,500/day with flexible surge bonuses and weekly incentives." },
        { icon: CalendarCheck, title: "Flexible Schedule", desc: "Drive when you want. Full-time or part-time — you're in control of your hours." },
        { icon: Shield, title: "Insurance Coverage", desc: "Comprehensive accident and health insurance for all verified SafeGo drivers." },
        { icon: Fuel, title: "Fuel Discounts", desc: "Exclusive fuel discount cards and partner deals to reduce your operating costs." },
        { icon: GraduationCap, title: "Free Training", desc: "Certified safety and customer service training — boost your skills at no cost." },
        { icon: TrendingUp, title: "Career Growth", desc: "Top-rated drivers can advance to Team Lead, Trainer, or Hub Manager roles." },
        { icon: HeartHandshake, title: "Community Support", desc: "Join a supportive driver community with 24/7 hotline and mental health resources." },
        { icon: Award, title: "Recognition Program", desc: "Monthly awards, bonuses, and badges for outstanding safety and service ratings." },
    ];

    const specialModeTraining = [
        {
            mode: "PWD Mode",
            color: "hsl(var(--purple))",
            bg: "hsl(var(--purple-light))",
            tag: "Accessibility Training",
            points: [
                "Wheelchair assistance & loading techniques",
                "Voice-guided navigation protocols",
                "Patience and sensitivity awareness",
                "Accessible vehicle modification knowledge",
            ],
        },
        {
            mode: "Pink Mode",
            color: "hsl(var(--pink))",
            bg: "hsl(var(--pink-light))",
            tag: "Women's Safety Training",
            points: [
                "Gender sensitivity and respect protocols",
                "Emergency SOS response procedures",
                "Safe route awareness for female passengers",
                "De-escalation and conflict resolution",
            ],
        },
        {
            mode: "Elderly Mode",
            color: "hsl(var(--blue))",
            bg: "hsl(var(--blue-light))",
            tag: "Senior Care Training",
            points: [
                "Patient and calm driving techniques",
                "Door-to-door physical assistance",
                "Medical emergency first response",
                "Communication with hearing/vision impaired",
            ],
        },
    ];

    const driverTestimonials = [
        {
            name: "Carlos M.",
            role: "Full-time Driver",
            duration: "2 years with SafeGo",
            quote: "SafeGo changed my life. The flexible hours let me spend mornings with my kids, and I earn enough to support my whole family. The training also made me a much better driver.",
            rating: 4.9,
            avatar: "CM",
        },
        {
            name: "Anna L.",
            role: "Pink Mode Specialist",
            duration: "1 year with SafeGo",
            quote: "As a female driver, I feel respected and safe here. The Pink Mode training was empowering, and I love knowing I'm making other women feel safe on their commute.",
            rating: 4.8,
            avatar: "AL",
        },
        {
            name: "Miguel R.",
            role: "PWD Mode Certified",
            duration: "1.5 years with SafeGo",
            quote: "The sensitivity training opened my eyes. Helping PWD passengers get to their destinations safely is the most rewarding job I've ever had. SafeGo truly cares.",
            rating: 5.0,
            avatar: "MR",
        },
        {
            name: "Sarah T.",
            role: "Part-time Driver",
            duration: "8 months with SafeGo",
            quote: "I drive on weekends to earn extra cash for college. The community support is incredible, and the instant weekly payouts are a lifesaver.",
            rating: 4.7,
            avatar: "ST",
        },
        {
            name: "David K.",
            role: "Night Shift Driver",
            duration: "3 years with SafeGo",
            quote: "I feel incredibly secure driving at night thanks to the live tracking and SOS features. SafeGo has the best safety protocols hands down.",
            rating: 4.9,
            avatar: "DK",
        }
    ];

    return (
        <div ref={revealRef}>
            <Navbar />

            {/* HERO SECTION - PROFESSIONAL SAAS LOOK */}
            <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-background py-20 pb-24">
                {/* Advanced Background Gradients & Grid */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-mode-pink-light/40 blur-[100px] pointer-events-none" />
                    <svg className="absolute inset-0 h-full w-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="premium-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#premium-grid)" />
                    </svg>
                    {/* Linear fade out at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col-reverse items-center gap-12 px-6 lg:flex-row lg:gap-20 sm:px-8 lg:px-12">
                    {/* Left Content */}
                    <div className="flex-1 scroll-reveal">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-md transition-all hover:bg-primary/10">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Now Hiring Operators
                        </div>
                        
                        <h1 className="mt-8 font-display text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                            Earn More With<br />
                            <span className="bg-gradient-to-r from-primary to-mode-blue bg-clip-text text-transparent">SafeGo.</span>
                        </h1>
                        
                        <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground/90">
                            Join an elite tier of verified drivers. Enjoy flexible hours, premium pay rates, and the most advanced safety technology in the industry.
                        </p>
                        
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <Link
                                to="/apply-driver"
                                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-foreground px-8 py-4 font-bold text-background transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-foreground/20 active:scale-[0.98]"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Earning <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                            <a
                                href="#requirements"
                                className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-background/50 px-8 py-4 font-bold text-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5"
                            >
                                View Requirements
                            </a>
                        </div>
                        
                        <div className="mt-10 flex flex-wrap items-center gap-6 rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <Banknote size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="font-display text-sm font-bold text-foreground">₹3,500+</p>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Daily Potential</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border/60" />
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mode-blue/10">
                                    <CalendarCheck size={16} className="text-mode-blue" />
                                </div>
                                <div>
                                    <p className="font-display text-sm font-bold text-foreground">100%</p>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Flexible Hours</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border/60" />
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mode-pink/10">
                                    <Heart size={16} className="text-mode-pink" />
                                </div>
                                <div>
                                    <p className="font-display text-sm font-bold text-foreground">Equal</p>
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Opportunity</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Interactive SaaS Driver Card */}
                    <div className="relative flex-1 scroll-reveal hidden lg:flex justify-center items-center">
                        {/* Dynamic Radar/Pulse Effect */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="absolute w-[450px] h-[450px] rounded-full border-[1.5px] border-primary/10 animate-[spin_20s_linear_infinite]" />
                            <div className="absolute w-[350px] h-[350px] rounded-full border border-primary/15 animate-[spin_15s_linear_infinite_reverse]" />
                            <div className="absolute w-[250px] h-[250px] rounded-full bg-primary/5 blur-xl animate-pulse" />
                        </div>

                        {/* Top Floating Badge */}
                        <div className="absolute -right-8 top-12 z-30 flex animate-bounce items-center gap-3 rounded-xl border border-border/60 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-xl" style={{ animationDuration: '4s' }}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                                <Users size={16} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">3,200+</p>
                                <p className="text-[10px] text-muted-foreground">Active Drivers</p>
                            </div>
                        </div>

                        {/* Bottom Floating Badge */}
                        <div className="absolute -left-6 bottom-16 z-30 flex animate-bounce items-center gap-3 rounded-xl border border-border/60 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-xl" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mode-pink-light">
                                <Heart size={16} className="text-mode-pink" />
                            </div>
                            <span className="text-xs font-bold text-foreground">Men & Women<br/>Welcome</span>
                        </div>

                        {/* Main Glass Card - High-Fidelity 3D ID Card */}
                        <div className="relative z-20 w-[420px] group rounded-[2.5rem] bg-gradient-to-b from-white/90 to-white/40 p-[2px] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.2)]">
                            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/40 via-transparent to-black/5 pointer-events-none" />
                            {/* Inner Card Container */}
                            <div className="relative h-full w-full rounded-[calc(2.5rem-2px)] bg-background/80 p-8 overflow-hidden">
                                {/* Holographic Sweep on Hover */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 opacity-0 transition-all duration-1000 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                
                                {/* Card Header - ID Badge Style */}
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:bg-primary/40 transition-colors duration-500" />
                                            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-primary to-emerald-600 text-2xl font-black text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)]">
                                                SG
                                                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background bg-emerald-500 shadow-sm">
                                                    <CheckCircle size={10} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                                                <ShieldCheck size={12} /> verified
                                            </div>
                                            <p className="font-display text-2xl font-black text-foreground tracking-tight">SafeGo Elite</p>
                                            <p className="text-sm font-medium text-muted-foreground">ID: SG-9920-X</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <div className="h-1 w-1 rounded-full bg-border" />
                                        <div className="h-1 w-1 rounded-full bg-border" />
                                        <div className="h-1 w-1 rounded-full bg-border" />
                                    </div>
                                </div>

                                {/* Stats Bar - Pill shape */}
                                <div className="relative z-10 flex items-stretch justify-between rounded-2xl border border-border/40 bg-white/50 p-2 shadow-inner backdrop-blur-md">
                                    <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
                                        <p className="font-display text-2xl font-black text-foreground">₹3.5K</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Avg/Day</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-border/50" />
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center py-2 relative group/stat cursor-default">
                                        <div className="absolute inset-0 bg-amber-400/10 rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                        <div className="flex items-center gap-1 z-10">
                                            <p className="font-display text-2xl font-black text-foreground">4.9</p>
                                            <Star size={16} className="fill-amber-400 text-amber-400 animate-[pulse_3s_infinite]" />
                                        </div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5 z-10">Rating</p>
                                        <div className="absolute right-0 top-2 bottom-2 w-px bg-border/50" />
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center py-2 text-primary">
                                        <p className="font-display text-2xl font-black">100%</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest mt-0.5">Flexible</p>
                                    </div>
                                </div>

                                {/* Benefits List - 3D embossed look */}
                                <div className="mt-8 space-y-3 relative z-10">
                                    {[
                                        { icon: Shield, text: "Comprehensive Insurance", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                                        { icon: GraduationCap, text: "Free Professional Training", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                                        { icon: Zap, text: "Instant Weekly Payouts", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" }
                                    ].map((b, i) => (
                                        <div key={i} className={`flex items-center gap-4 rounded-xl border ${b.border} bg-white/40 p-3.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-white/60`}>
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-border/30`}>
                                                <b.icon size={18} className={b.color} />
                                            </div>
                                            <span className="text-sm font-bold text-foreground/90">{b.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Premium Action Button */}
                                <Link to="/apply-driver" className="relative z-10 mt-8 w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-foreground to-foreground/90 py-4 text-sm font-black text-background transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.2)] overflow-hidden group/btn">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-400 to-primary opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                                    <span className="relative z-10 flex items-center gap-2">Claim Your Spot <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY DRIVE WITH SAFEGO - PREMIUM GRID */}
            <section className="relative py-28 px-4 sm:px-6 lg:px-12 bg-secondary/30">
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
                     style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '32px 32px' }}></div>
                
                <div className="mx-auto max-w-7xl relative">
                    <div className="text-center scroll-reveal mb-16">
                        <span className="caption-label">Ecosystem Excellence</span>
                        <h2 className="mt-4 font-display text-4xl font-black text-foreground sm:text-6xl tracking-tighter">
                            The Heart of <span className="text-primary">SafeGo.</span>
                        </h2>
                        <p className="mt-6 text-lg font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            We've engineered a driver-first platform designed for maximum earning potential and industry-leading safety.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {benefits.map((b, i) => (
                            <div key={b.title} className="group relative rounded-[2rem] border border-border/50 bg-background/60 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 scroll-reveal">
                                <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Sparkles size={16} className="text-primary animate-pulse" />
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 group-hover:bg-primary/10 transition-colors">
                                    <b.icon size={28} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h3 className="mt-6 font-display text-xl font-black text-foreground">{b.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-medium">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EQUAL OPPORTUNITY — SAAS STYLE DASHBOARD LOOK */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
                <div className="mx-auto max-w-[1400px]">
                    <div className="relative rounded-[3rem] border border-border/60 bg-foreground p-12 lg:p-20 shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden">
                        {/* High-tech background elements */}
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-mode-pink/15 blur-[100px]" />
                            <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 100 100">
                                <defs>
                                    <pattern id="dot-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1" fill="white" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 scroll-reveal">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 mb-8 backdrop-blur-md">
                                    <HeartHandshake size={14} className="text-primary" /> Equal Opportunity Employer
                                </div>
                                <h2 className="font-display text-5xl font-black text-white sm:text-6xl tracking-tight leading-[1.1]">
                                    Everyone Deserves <br/><span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">The Front Seat.</span>
                                </h2>
                                <p className="mt-8 text-xl leading-relaxed text-white/60 font-medium max-w-2xl">
                                    Greatness has no gender. We actively hire, train, and support both men and women. Our inclusive practices ensure everyone gets equal pay, protection, and promotion paths.
                                </p>
                                
                                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { icon: Target, text: "Equal Pay Policy", color: "text-primary" },
                                        { icon: GraduationCap, text: "Universal Training", color: "text-mode-blue" },
                                        { icon: Shield, text: "Safety for Everyone", color: "text-mode-pink" },
                                        { icon: TrendingUp, text: "Fair Advancement", color: "text-emerald-400" },
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-4 group transition-all">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-all">
                                                <item.icon size={20} className={item.color} />
                                            </div>
                                            <span className="text-base font-bold text-white/90">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 w-full lg:max-w-md scroll-reveal">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="group rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 text-center transition-all hover:bg-white/[0.08] hover:border-white/20">
                                        <div className="font-display text-6xl font-black text-white tracking-tighter">45%</div>
                                        <div className="mt-2 text-[11px] font-black uppercase tracking-widest text-white/40">Female Operators</div>
                                    </div>
                                    <div className="group rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 text-center transition-all hover:bg-white/[0.08] hover:border-white/20">
                                        <div className="font-display text-6xl font-black text-white tracking-tighter">55%</div>
                                        <div className="mt-2 text-[11px] font-black uppercase tracking-widest text-white/40">Male Operators</div>
                                    </div>
                                    <div className="group rounded-[2.5rem] bg-primary/20 backdrop-blur-xl border border-primary/30 p-12 text-center col-span-2 shadow-[0_0_50px_rgba(5,150,105,0.1)] transition-all hover:bg-primary/30">
                                        <div className="font-display text-7xl font-black text-white tracking-tighter">100%</div>
                                        <div className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-white">Equal Opportunity & Respect</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* REQUIREMENTS - GRID CARDS */}
            <section id="requirements" className="py-28 px-4 sm:px-6 lg:px-8 bg-secondary/20">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center scroll-reveal mb-20">
                        <span className="caption-label">The Blueprint</span>
                        <h2 className="mt-4 font-display text-4xl font-black text-foreground sm:text-6xl tracking-tighter">Membership <span className="text-primary">Criteria.</span></h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg font-medium text-muted-foreground leading-relaxed">
                            Elite standards for elite professionals. We maintain a high bar to ensure the safest ecosystem in the country.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {requirements.map((r) => (
                            <div key={r.title} className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/80 p-10 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 scroll-reveal">
                                <div className="absolute top-0 right-0 p-6">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Users size={12} /> Standardized
                                    </span>
                                </div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary group-hover:bg-primary/10 transition-colors">
                                    <r.icon size={28} className="text-foreground transition-all group-hover:text-primary group-hover:scale-110" />
                                </div>
                                <h3 className="mt-8 font-display text-xl font-black text-foreground">{r.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-medium">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SPECIAL MODE TRAINING */}
            <section className="section-padding bg-background">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center scroll-reveal">
                        <span className="caption-label">SPECIALIZED TRAINING</span>
                        <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Mode-Specific Certifications</h2>
                        <p className="mt-3 text-lg text-muted-foreground">
                            Unlock higher earnings and specialized badges by completing mode-specific training
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {specialModeTraining.map((mode) => (
                            <div
                                key={mode.mode}
                                className="safego-card overflow-hidden scroll-reveal"
                            >
                                <div className="h-2 w-full" style={{ backgroundColor: mode.color }} />
                                <div className="p-8">
                                    <span
                                        className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                                        style={{ backgroundColor: mode.bg, color: mode.color }}
                                    >
                                        {mode.tag}
                                    </span>
                                    <h3 className="mt-4 font-display text-xl font-bold text-foreground">{mode.mode} Certification</h3>
                                    <div className="mt-5 space-y-3">
                                        {mode.points.map((point) => (
                                            <div key={point} className="flex items-start gap-3">
                                                <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: mode.color }} />
                                                <span className="text-sm text-muted-foreground">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-sm font-medium" style={{ color: mode.color }}>
                                        <BadgeCheck size={16} />
                                        <span>Earn {mode.mode} badge + ₹500 bonus/ride</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HIRING PROCESS - SAAS VERTICAL TIMELINE */}
            <section className="py-28 px-4 sm:px-6 lg:px-12 bg-secondary/30 relative">
                <div className="mx-auto max-w-6xl relative">
                    <div className="text-center scroll-reveal mb-24">
                        <span className="caption-label">Fast Track Activation</span>
                        <h2 className="mt-4 font-display text-4xl font-black text-foreground sm:text-6xl tracking-tighter">Onboarding <span className="text-primary">Flow.</span></h2>
                        <p className="mt-6 text-lg font-medium text-muted-foreground max-w-2xl mx-auto">From registration to revenue in less than 96 hours. Guaranteed.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line - Premium Gradient */}
                        <div className="absolute left-[39px] lg:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-border to-primary/20 transform lg:-translate-x-1/2" />

                        <div className="space-y-20 relative">
                            {hiringProcess.map((step, i) => (
                                <div key={step.step} className={`relative flex items-center gap-12 lg:gap-24 scroll-reveal ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                                    {/* Content side */}
                                    <div className={`flex-1 pl-20 lg:pl-0 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                                        <div className="group inline-block w-full max-w-lg">
                                            <div className={`inline-flex items-center gap-3 mb-4 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black group-hover:scale-110 transition-transform">
                                                    {step.step}
                                                </div>
                                                <h3 className="font-display text-2xl font-black text-foreground">{step.title}</h3>
                                            </div>
                                            <p className="text-base font-medium text-muted-foreground leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Center marker */}
                                    <div className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 h-20 w-20 flex items-center justify-center">
                                        <div className="h-4 w-4 rounded-full bg-background border-[4px] border-primary z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Placeholder side to balance grid */}
                                    <div className="flex-1 hidden lg:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DRIVER TESTIMONIALS - MARQUEE */}
            <section className="py-24 bg-background overflow-hidden relative">
                <div className="mx-auto max-w-7xl text-center scroll-reveal relative z-20 mb-16">
                    <span className="caption-label">COMMUNITY VOICES</span>
                    <h2 className="mt-4 font-display text-4xl font-bold text-foreground sm:text-5xl">Hear From Our Drivers</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Real stories from real SafeGo partners</p>
                </div>
                
                {/* Left/Right Fades for Marquee Masking */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="relative flex overflow-hidden group">
                    <div className="flex w-max animate-marquee items-stretch gap-6 px-3">
                        {/* Duplicate the array twice to create a seamless infinite loop */}
                        {[...driverTestimonials, ...driverTestimonials].map((t, i) => (
                            <div key={i} className="safego-card w-[350px] md:w-[400px] p-8 shrink-0 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]">
                                <div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <Star key={idx} size={14} className="fill-amber-400 text-amber-400" />
                                        ))}
                                        <span className="ml-2 text-xs font-semibold text-foreground">{t.rating}</span>
                                    </div>
                                    <p className="mt-6 text-sm italic leading-relaxed text-muted-foreground">"{t.quote}"</p>
                                </div>
                                <div className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider">{t.role}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5 opacity-60 font-semibold">{t.duration}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding section-alt">
                <div className="mx-auto max-w-3xl">
                    <div className="text-center scroll-reveal">
                        <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Frequently Asked Questions</h2>
                        <p className="mt-3 text-lg text-muted-foreground">Got questions? We've got answers.</p>
                    </div>
                    <div className="mt-12 space-y-4">
                        {[
                            {
                                q: "Can women apply as SafeGo drivers?",
                                a: "Absolutely! SafeGo actively recruits and supports female drivers. Women drivers are especially valued for our Pink Mode service, though they can drive any mode they choose.",
                            },
                            {
                                q: "What is the minimum age requirement?",
                                a: "You must be between 21 and 60 years old with a valid driver's license. This applies equally to all applicants regardless of gender.",
                            },
                            {
                                q: "How much can I earn per day?",
                                a: "Top-performing drivers earn ₹3,000–₹5,000 per day depending on hours, surge periods, and mode certifications. Mode-certified drivers earn bonus per ride.",
                            },
                            {
                                q: "Do I need my own vehicle?",
                                a: "Yes, you need a well-maintained vehicle (2015 or newer). However, we have partner financing programs if you need help acquiring one.",
                            },
                            {
                                q: "Is the training really free?",
                                a: "Yes! All safety and mode-specific training is 100% free. We invest in our drivers because your skill directly impacts passenger safety.",
                            },
                            {
                                q: "How long does the hiring process take?",
                                a: "The full process from application to activation typically takes 5–7 business days, depending on document verification and vehicle inspection scheduling.",
                            },
                        ].map((faq) => (
                            <details key={faq.q} className="safego-card group scroll-reveal">
                                <summary className="flex cursor-pointer items-center justify-between p-6 font-display text-base font-semibold text-foreground list-none">
                                    <span>{faq.q}</span>
                                    <ChevronRight size={18} className="shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                                </summary>
                                <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
};

export default DriveWithUs;
