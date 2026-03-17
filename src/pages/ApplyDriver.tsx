import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";
import { ArrowRight, Car, User, FileText, CheckCircle, ShieldCheck, UploadCloud, Shield, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ApplyDriver = () => {
    const revealRef = useScrollReveal();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [files, setFiles] = useState<{ [key: number]: File }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [idx]: e.target.files![0] }));
        }
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Application submitted successfully", {
                position: "top-right",
                description: "Our onboarding team will contact you within 24 hours.",
                style: {
                    background: "#10b981", // Emerald 500 (Primary Green)
                    color: "#ffffff",
                    border: "none",
                },
            });
            navigate("/drive-with-us");
        }, 2000);
    };

    return (
        <div ref={revealRef} className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col pt-24 pb-16 px-4">
                <div className="max-w-4xl w-full mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 scroll-reveal">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary shadow-sm mb-6 backdrop-blur-md">
                            <ShieldCheck size={14} /> Official SafeGo Application
                        </div>
                        <h1 className="font-display text-4xl font-black text-foreground sm:text-5xl tracking-tight">
                            Start Earning With <span className="text-primary">SafeGo</span>
                        </h1>
                        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                            Complete our secure onboarding process to join the elite tier of verified drivers.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-12 relative max-w-2xl mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border/50 -translate-y-1/2 rounded-full z-0 overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />
                        </div>
                        <div className="relative z-10 flex justify-between">
                            {[
                                { id: 1, icon: User, label: "Personal Info" },
                                { id: 2, icon: Car, label: "Vehicle Data" },
                                { id: 3, icon: FileText, label: "Verification" }
                            ].map((s) => (
                                <div key={s.id} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${step >= s.id
                                            ? "bg-primary text-primary-foreground border-2 border-primary"
                                            : "bg-card text-muted-foreground border-2 border-border/50"
                                        }`}>
                                        {step > s.id ? <Check size={20} className="animate-in zoom-in" /> : <s.icon size={20} />}
                                    </div>
                                    <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${step >= s.id ? "text-primary" : "text-muted-foreground"
                                        }`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="bg-card/40 border border-border/60 rounded-[2.5rem] shadow-xl backdrop-blur-xl p-8 sm:p-12 relative overflow-hidden">
                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">

                            {/* Step 1: Personal Profile */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                                        <User className="text-primary" /> Personal Profile
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Legal Name</label>
                                            <input required type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
                                            <input required type="tel" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="+1 (555) 000-0000" />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                                            <input required type="email" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Home Address</label>
                                            <textarea required rows={2} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" placeholder="123 SafeGo Street..." />
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleNext} className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 bg-foreground text-background font-bold px-8 py-4 rounded-xl hover:bg-primary transition-colors hover:shadow-lg mt-8">
                                        Continue to Vehicle <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Vehicle Information */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                                        <Car className="text-primary" /> Vehicle Data
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Vehicle Make</label>
                                            <select required className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="">Select Make...</option>
                                                <option value="toyota">Toyota</option>
                                                <option value="honda">Honda</option>
                                                <option value="hyundai">Hyundai</option>
                                                <option value="ford">Ford</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Vehicle Model & Year</label>
                                            <input required type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Camry 2021" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">License Plate Number</label>
                                            <input required type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase" placeholder="ABC-1234" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Service Mode Preference</label>
                                            <select required className="w-full bg-background/50 border border-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                                <option value="standard">Standard Ride (All Passengers)</option>
                                                <option value="pink">Pink Mode (Women Only - Certification Required)</option>
                                                <option value="pwd">PWD Access (Certification Required)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-8">
                                        <button type="button" onClick={handlePrev} className="px-6 py-4 font-bold text-muted-foreground hover:text-foreground transition-colors">
                                            Back
                                        </button>
                                        <button type="button" onClick={handleNext} className="flex items-center justify-center gap-2 bg-foreground text-background font-bold px-8 py-4 rounded-xl hover:bg-primary transition-colors hover:shadow-lg">
                                            Continue to Documents <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Verification */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                                    <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                                        <Shield className="text-primary" /> Verification Documents
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-6">In order to maintain our high safety standards, we require valid documentation for identity and vehicle registration.</p>

                                    <div className="space-y-4">
                                        {['Driver\'s License (Front & Back)', 'Vehicle Registration (OR/CR)', 'NBI/Police Clearance'].map((docRef, idx) => (
                                            <div key={idx} className="relative border border-border/50 bg-background/30 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-background/80 hover:border-primary/30 transition-all overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept=".pdf,image/*"
                                                    onChange={(e) => handleFileChange(e, idx)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    {files[idx] ? <CheckCircle size={20} /> : <UploadCloud size={20} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-foreground truncate">{docRef}</p>
                                                    <p className={`text-xs mt-0.5 truncate ${files[idx] ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                                                        {files[idx] ? files[idx].name : "PDF, JPG or PNG (Max. 5MB)"}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-bold uppercase tracking-wider pr-2 transition-opacity z-0 ${files[idx] ? "text-primary opacity-100" : "text-primary opacity-0 group-hover:opacity-100"}`}>
                                                    {files[idx] ? "Change" : "Upload"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6 flex gap-3">
                                        <ShieldCheck className="text-primary mt-0.5 shrink-0" size={18} />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            By submitting this application, I consent to a comprehensive background check and agree to <span className="text-primary font-bold cursor-pointer">SafeGo's Terms of Service</span> & <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>.
                                        </p>
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <button type="button" onClick={handlePrev} className="px-6 py-4 font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" disabled={isSubmitting}>
                                            Back
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]">
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</span>
                                            ) : (
                                                <span className="flex items-center gap-2">Submit Application <CheckCircle size={18} /></span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ApplyDriver;
