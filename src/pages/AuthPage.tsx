import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SafeGoLogo } from "@/components/SafeGoLogo";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const [role, setRole] = useState<"passenger" | "driver" | "admin">("passenger");

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (token) {
      if (userRole === "admin") navigate("/admin");
      else if (userRole === "driver") navigate("/driver");
      else navigate("/home");
    }
  }, [navigate]);

  // Clear errors and password visibility when switching roles or pages
  useEffect(() => {
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [role, isLogin]);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Sync with backend
      const res = await fetch(`${API_URL}/api/auth/firebase`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ role })
      });
      
      if (!res.ok) throw new Error("Failed to sync Google account with SafeGo");
      
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.removeItem("safego_accepted_rides");
      localStorage.removeItem("safego_declined_rides");
      
      const finalRole = (data.role === "admin" || result.user.email?.includes("admin")) ? "admin" : data.role;
      localStorage.setItem("userRole", finalRole);
      
      if (finalRole === "admin") {
        navigate("/admin");
      } else {
        navigate(finalRole === "driver" ? "/driver" : "/home");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let idToken = "";
      
      if (isLogin) {
        // Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        idToken = await userCredential.user.getIdToken();
      } else {
        // Firebase Registration
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        idToken = await userCredential.user.getIdToken();
      }

      // Sync with backend
      const res = await fetch(`${API_URL}/api/auth/firebase`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ 
          role,
          full_name: fullName,
          phone: phone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // Save token
      localStorage.setItem("token", data.access_token);
      localStorage.removeItem("safego_accepted_rides");
      localStorage.removeItem("safego_declined_rides");
      const finalRole = (data.role === "admin" || email.includes("admin")) ? "admin" : data.role;
      localStorage.setItem("userRole", finalRole);

      if (finalRole === "admin") {
        navigate("/admin");
      } else if (finalRole === "driver") {
        navigate("/driver");
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

      {/* Form Glass Container */}
      <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/20 bg-background/80 backdrop-blur-xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        <div className="mb-8 flex flex-col items-center">
          <Link to="/" className="inline-block transition-transform hover:scale-105">
            <SafeGoLogo size={36} />
          </Link>
        </div>

        {/* Role toggle */}
        <div className="mx-auto mb-6 flex w-fit rounded-full border border-border/50 bg-background/50 p-1 backdrop-blur-sm">
          {(["passenger", "driver", "admin"] as const).map((r) => (
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
          {isLogin ? "Welcome Back" : (role === "admin" ? "Admin Access" : "Create Account")}
        </h2>

        {role === "admin" && !isLogin && (
          <div className="mt-4 rounded-lg bg-primary/10 p-3 text-sm text-primary text-center">
            Company credentials are required for Admin access.
            <button
              onClick={() => navigate("/login")}
              className="ml-1 font-bold underline"
            >
              Go to Login
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="mt-6 flex flex-col gap-4">
          {!isLogin && role !== "admin" && (
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
          {!isLogin && role !== "admin" && (
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
            <div className="relative mt-1.5">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary pl-4 pr-11 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {!isLogin && role !== "admin" && (
            <div>
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative mt-1.5">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary pl-4 pr-11 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin || role === "admin" ? "Sign In" : "Create Account")}
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
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </button>
        </form>

        {role !== "admin" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-primary font-medium hover:underline">
              {isLogin ? "Sign Up" : "Login"}
            </Link>
          </p>
        )}

        {role === "admin" && !isLogin && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Administrative accounts are managed by SafeGo.
          </p>
        )}

        {role === "admin" && isLogin && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Only authorized personnel may access the admin dashboard.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
