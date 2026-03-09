import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import {
    Shield, ArrowRight, CheckCircle, Star, Users, Car, Heart,
    BadgeCheck, Clock, MapPin, Banknote, GraduationCap,
    FileCheck, Fingerprint, HeartHandshake, Award, TrendingUp,
    Smartphone, CalendarCheck, Fuel, Stethoscope, UserCheck,
    ChevronRight, Sparkles, Target, Eye
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
        { icon: Banknote, title: "Competitive Earnings", desc: "Earn up to ₱3,500/day with flexible surge bonuses and weekly incentives." },
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
    ];

    return (
        <div ref={revealRef}>
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-mode-pink-light/30 blur-3xl" />
                    <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="drive-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--teal))" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#drive-grid)" />
                    </svg>
                </div>

                <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-4 py-20 lg:flex-row lg:gap-16 sm:px-6 lg:px-8">
                    {/* Left */}
                    <div className="flex-1 scroll-reveal">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                            <Car size={14} /> Now Hiring Drivers
                        </span>
                        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] text-foreground sm:text-7xl">
                            Drive With<br />SafeGo.
                        </h1>
                        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                            Join our growing family of verified drivers — both men and women. Earn great income while making every ride safe for everyone.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <a
                                href="#apply"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:brightness-110 hover:scale-[1.02]"
                            >
                                Apply Now <ArrowRight size={18} />
                            </a>
                            <a
                                href="#requirements"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-foreground px-8 py-4 font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
                            >
                                View Requirements
                            </a>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-primary" /> Equal Opportunity</span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-primary" /> ₱3,500+/day Potential</span>
                            <span className="text-border">•</span>
                            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-primary" /> Free Training</span>
                        </div>
                    </div>

                    {/* Right — floating driver card */}
                    <div className="relative flex-1 scroll-reveal hidden lg:flex justify-center">
                        {/* Concentric rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[200, 280, 360].map((s) => (
                                <div key={s} className="absolute rounded-full border border-primary/[0.08]" style={{ width: s, height: s }} />
                            ))}
                        </div>

                        <div className="animate-float relative z-10 w-[360px] rounded-3xl border border-border bg-background p-8 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                                    SG
                                </div>
                                <div>
                                    <p className="font-display text-lg font-bold text-foreground">SafeGo Driver</p>
                                    <p className="text-sm text-muted-foreground">Verified & Certified</p>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-xl bg-secondary p-3">
                                    <p className="font-display text-xl font-bold text-foreground">₱3.5K</p>
                                    <p className="text-[10px] text-muted-foreground">Avg/Day</p>
                                </div>
                                <div className="rounded-xl bg-secondary p-3">
                                    <p className="font-display text-xl font-bold text-foreground">4.9</p>
                                    <p className="text-[10px] text-muted-foreground">Rating</p>
                                </div>
                                <div className="rounded-xl bg-secondary p-3">
                                    <p className="font-display text-xl font-bold text-foreground">flex</p>
                                    <p className="text-[10px] text-muted-foreground">Schedule</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-2.5">
                                {["Insurance Covered", "Free Training", "Weekly Payouts"].map((b) => (
                                    <div key={b} className="flex items-center gap-2.5 text-sm">
                                        <CheckCircle size={16} className="text-primary shrink-0" />
                                        <span className="text-foreground">{b}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
                                Join SafeGo Today
                            </button>
                        </div>

                        {/* Floating badges */}
                        <div className="absolute -right-4 top-8 z-20 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 shadow-lg">
                            <Users size={18} className="text-primary" />
                            <span className="text-xs font-semibold">3,200+ Active Drivers</span>
                        </div>
                        <div className="absolute -left-4 bottom-16 z-20 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 shadow-lg">
                            <Heart size={18} className="text-pink-500" />
                            <span className="text-xs font-semibold">Men & Women Welcome</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY DRIVE WITH SAFEGO */}
            <section className="section-padding section-alt">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center scroll-reveal">
                        <span className="caption-label">WHY JOIN US</span>
                        <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Benefits of Being a SafeGo Driver</h2>
                        <p className="mt-3 text-lg text-muted-foreground">We invest in our drivers because you're the heart of SafeGo</p>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {benefits.map((b) => (
                            <div key={b.title} className="safego-card p-8 scroll-reveal group hover:border-primary/20 transition-all duration-300">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mode-teal-light group-hover:bg-primary/10 transition-colors">
                                    <b.icon size={24} className="text-primary" />
                                </div>
                                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{b.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EQUAL OPPORTUNITY — MEN & WOMEN */}
            <section className="section-padding bg-background">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground via-foreground to-primary/80 px-8 py-20 sm:px-16">
                        {/* Decorative */}
                        <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.06]" viewBox="0 0 200 200">
                            <circle cx="200" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" />
                            <circle cx="200" cy="100" r="120" fill="none" stroke="white" strokeWidth="0.5" />
                            <circle cx="200" cy="100" r="160" fill="none" stroke="white" strokeWidth="0.5" />
                        </svg>

                        <div className="relative flex flex-col lg:flex-row items-center gap-12">
                            <div className="flex-1">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80">
                                    <HeartHandshake size={14} /> Equal Opportunity Employer
                                </span>
                                <h2 className="mt-6 font-display text-3xl font-bold text-white sm:text-5xl">
                                    Everyone Deserves<br />the Driver's Seat
                                </h2>
                                <p className="mt-4 text-lg leading-relaxed text-white/70">
                                    At SafeGo, we believe greatness has no gender. We actively hire and support both men and women drivers. Our inclusive hiring practices ensure equal pay, equal training, and equal growth opportunities for everyone.
                                </p>
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Target, text: "Equal Pay for All" },
                                        { icon: GraduationCap, text: "Same Training Programs" },
                                        { icon: Shield, text: "Safety for Every Driver" },
                                        { icon: TrendingUp, text: "Equal Promotion Paths" },
                                    ].map((item) => (
                                        <div key={item.text} className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                                                <item.icon size={16} className="text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-white/90">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 flex justify-center">
                                <div className="grid grid-cols-2 gap-4 max-w-sm">
                                    <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center">
                                        <p className="font-display text-4xl font-extrabold text-white">45%</p>
                                        <p className="mt-1 text-sm text-white/60">Female Drivers</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 text-center">
                                        <p className="font-display text-4xl font-extrabold text-white">55%</p>
                                        <p className="mt-1 text-sm text-white/60">Male Drivers</p>
                                    </div>
                                    <div className="rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 p-6 text-center col-span-2">
                                        <p className="font-display text-4xl font-extrabold text-white">100%</p>
                                        <p className="mt-1 text-sm text-white/60">Equal Opportunity & Respect</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* REQUIREMENTS */}
            <section id="requirements" className="section-padding section-alt">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center scroll-reveal">
                        <span className="caption-label">WHAT WE LOOK FOR</span>
                        <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">Hiring Requirements</h2>
                        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                            We maintain high standards to ensure passenger safety. Here's what you need to join — the same for both men and women.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {requirements.map((r) => (
                            <div key={r.title} className="safego-card p-8 scroll-reveal relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary">
                                        <Users size={10} /> All Genders
                                    </span>
                                </div>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mode-teal-light group-hover:bg-primary/10 transition-colors">
                                    <r.icon size={24} className="text-primary" />
                                </div>
                                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{r.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
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
                                        <span>Earn {mode.mode} badge + ₱500 bonus/ride</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HIRING PROCESS */}
            <section className="section-padding section-alt">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center scroll-reveal">
                        <span className="caption-label">STEP BY STEP</span>
                        <h2 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">How to Get Started</h2>
                        <p className="mt-3 text-lg text-muted-foreground">From application to your first ride in as little as 5 days</p>
                    </div>
                    <div className="mt-16 relative">
                        {/* Connecting line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block" />

                        <div className="space-y-12 lg:space-y-0">
                            {hiringProcess.map((step, i) => (
                                <div
                                    key={step.step}
                                    className={`relative scroll-reveal lg:flex items-center gap-12 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                        } ${i > 0 ? "lg:mt-[-2rem]" : ""}`}
                                    style={{ marginTop: i > 0 ? "3rem" : undefined }}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}>
                                        <div className={`safego-card inline-block p-8 text-left max-w-md ${i % 2 === 0 ? "lg:ml-auto" : ""}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mode-teal-light">
                                                    <step.icon size={22} className="text-primary" />
                                                </div>
                                                <span className="font-display text-3xl font-extrabold text-secondary">{step.step}</span>
                                            </div>
                                            <h3 className="font-display text-xl font-bold text-foreground">{step.title}</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                                        </div>
                                    </div>

                                    {/* Center dot */}
                                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg z-10">
                                        {step.step}
                                    </div>

                                    <div className="flex-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* DRIVER TESTIMONIALS */}
            <section className="section-padding bg-background">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center scroll-reveal">
                        <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">Hear From Our Drivers</h2>
                        <p className="mt-3 text-lg text-muted-foreground">Real stories from real SafeGo partners</p>
                    </div>
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {driverTestimonials.map((t) => (
                            <div key={t.name} className="safego-card p-8 scroll-reveal">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="ml-2 text-xs font-semibold text-foreground">{t.rating}</span>
                                </div>
                                <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">"{t.quote}"</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                                        <p className="text-xs text-primary font-medium">{t.role}</p>
                                        <p className="text-[11px] text-muted-foreground">{t.duration}</p>
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
                                a: "Top-performing drivers earn ₱3,000–₱5,000 per day depending on hours, surge periods, and mode certifications. Mode-certified drivers earn bonus per ride.",
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

            {/* CTA — APPLY NOW */}
            <section id="apply" className="px-4 py-16 sm:px-6 lg:px-8">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-emerald-400 px-8 py-20 text-center sm:px-16">
                    {/* Decorative */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
                    </div>

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white mb-6">
                            <Sparkles size={14} /> Join 3,200+ drivers
                        </div>
                        <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">Ready to Start Your Journey?</h2>
                        <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
                            Whether you're a man or a woman, full-time or part-time — there's a place for you at SafeGo. Apply today and start earning within a week.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/signup"
                                className="rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:scale-[1.02] hover:shadow-lg"
                            >
                                Apply as a Driver
                            </Link>
                            <a
                                href="#requirements"
                                className="rounded-full border-2 border-white/40 px-8 py-4 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                            >
                                View Requirements
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default DriveWithUs;
