import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SafeGoLogo } from "@/components/SafeGoLogo";
import { CheckCircle } from "lucide-react";

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [role, setRole] = useState<"passenger" | "driver">("passenger");

  return (
    <div className="flex min-h-screen">
      {/* Left branding */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-secondary p-12 lg:flex relative overflow-hidden">
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--teal))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
        <div className="relative z-10 text-center">
          <SafeGoLogo size={48} className="justify-center" />
          <div className="mt-10 flex flex-col gap-4 text-left">
            {["AI-verified routes every trip", "Emergency SOS in one tap", "Rides tailored for your needs"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-primary shrink-0" />
                <span className="text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[420px]">
          <Link to="/home" className="lg:hidden mb-8 block">
            <SafeGoLogo size={28} />
          </Link>

          {/* Role toggle */}
          <div className="flex w-fit rounded-full border border-border p-1">
            {(["passenger", "driver"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${
                  role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold text-foreground">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          <div className="mt-6 flex flex-col gap-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or continue with email</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="John Doe" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input type="email" className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="you@email.com" />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <input type="tel" className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="+63 900 000 0000" />
              </div>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                {isLogin && <Link to="/login" className="text-xs text-primary hover:underline">Forgot Password?</Link>}
              </div>
              <input type="password" className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <input type="password" className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="••••••••" />
              </div>
            )}

            <button className="mt-2 w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign Up" : "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
