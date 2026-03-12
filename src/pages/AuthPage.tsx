import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SafeGoLogo } from "@/components/SafeGoLogo";
import { AlertCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";
  
  const [role, setRole] = useState<"passenger" | "driver">("passenger");
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    setShowGoogleAccounts(true);
  };

  const selectGoogleAccount = (email: string) => {
    localStorage.setItem("userEmail", email);
    localStorage.setItem("token", "google-dummy-token");
    if (email.includes("admin")) {
      window.location.href = "/admin";
    } else {
      window.location.href = role === "driver" ? "/driver" : "/home";
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let endpoint = "";
      let payload = {};

      if (isLogin) {
        endpoint = `${API_URL}/api/auth/login`;
        payload = { email, password };
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        endpoint = `${API_URL}/api/auth/register`;
        payload = {
          full_name: fullName,
          email,
          phone,
          password,
          confirm_password: confirmPassword,
          role
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = "Authentication failed";
        if (data.detail) {
          if (typeof data.detail === "string") {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            // Handle FastAPI validation errors (422 Unprocessable Content)
            errorMessage = data.detail.map((err: any) => {
              const field = err.loc[err.loc.length - 1];
              return `${field}: ${err.msg}`;
            }).join(" | ");
          }
        }
        throw new Error(errorMessage);
      }

      // Save token (Assume backend returns access_token in data or data.access_token)
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      // Registration might not return a token directly depending on the backend, 
      // but if it does or if it's login:
      if (role === "driver") {
        navigate("/driver");
      } else if (data.role === "admin" || email.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/unnamed.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Google Account Chooser Modal */}
      {showGoogleAccounts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-[400px] rounded-2xl bg-background p-6 shadow-2xl">
            <div className="flex flex-col items-center mb-6">
              <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h2 className="text-xl font-medium text-foreground">Choose an account</h2>
              <p className="text-sm text-muted-foreground mt-1">to continue to SafeGo</p>
            </div>
            
            <div className="flex flex-col gap-2">
              {[
                { name: "John Doe", email: "johndoe@gmail.com", avatar: "J" },
                { name: "Maria Santos", email: "maria.santos@gmail.com", avatar: "M" },
                { name: "SafeGo Admin", email: "admin@safego.ph", avatar: "A" }
              ].map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => selectGoogleAccount(acc.email)}
                  className="flex items-center gap-4 rounded-xl p-3 px-4 transition-colors hover:bg-secondary/80 text-left border border-transparent hover:border-border"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                    {acc.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-[15px]">{acc.name}</div>
                    <div className="text-sm text-muted-foreground">{acc.email}</div>
                  </div>
                </button>
              ))}
              
              <div className="h-px bg-border my-2 mx-2"></div>
              
              <button
                onClick={() => setShowGoogleAccounts(false)}
                className="flex items-center gap-4 rounded-xl p-3 px-4 transition-colors hover:bg-secondary/40 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </div>
                <div className="font-medium text-foreground text-[15px]">Cancel</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Glass Container */}
      <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/20 bg-background/80 backdrop-blur-xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <SafeGoLogo size={36} />
          </Link>
        </div>

        {/* Role toggle */}
        <div className="mx-auto mb-6 flex w-fit rounded-full border border-border/50 bg-background/50 p-1 backdrop-blur-sm">
          {(["passenger", "driver"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all ${role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        <h2 className="mt-2 font-display text-3xl font-bold text-foreground text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="mt-6 flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                placeholder="John Doe" 
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
              placeholder="you@email.com" 
            />
          </div>
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                placeholder="+63 900 000 0000" 
              />
            </div>
          )}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
            </div>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
              placeholder="••••••••" 
            />
          </div>
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input 
                required
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" 
                placeholder="••••••••" 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Sign In" : "Create Account")}
          </button>

          <div className="relative mt-2 flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="shrink-0 px-4 text-xs text-muted-foreground uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-2 flex w-full justify-center items-center gap-3 rounded-xl border border-border bg-background py-4 text-sm font-medium text-foreground transition-all hover:bg-muted"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/signup" : "/login"} className="text-primary font-medium hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
