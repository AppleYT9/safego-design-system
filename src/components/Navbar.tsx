import { Link, useLocation } from "react-router-dom";
import { SafeGoLogo } from "./SafeGoLogo";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", to: "/home" },
  { label: "Book", to: "/book/normal" },
  { label: "Drive With Us", to: "/drive-with-us" },
  { label: "Safety", to: "/safety" },
  { label: "Dashboard", to: "/dashboard" },
];

export const Navbar = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl transition-all ${scrolled ? "shadow-sm" : ""}`}
    >
      <div className={`relative flex h-20 w-full items-center mx-auto ${fullWidth ? "px-4 sm:px-6 lg:px-8" : "max-w-[1400px] px-6 sm:px-8 lg:px-12"}`}>
        {/* Logo */}
        <Link to="/home" className="flex-shrink-0">
          <SafeGoLogo size={24} />
        </Link>

        <div className="hidden items-center justify-center gap-10 md:flex absolute left-1/2 -translate-x-1/2">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[14px] font-bold tracking-tight transition-all hover:text-primary relative py-1 ${location.pathname === l.to ? "text-foreground after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-primary" : "text-muted-foreground"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex ml-auto">
          {localStorage.getItem("token") ? (
            <>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="rounded-full bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 text-destructive px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-[1rem] bg-foreground px-6 py-2.5 text-sm font-bold text-background transition-all hover:bg-primary hover:text-white premium-shadow hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-3 text-[15px] font-medium text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-3">
            {localStorage.getItem("token") ? (
              <>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setOpen(false);
                    window.location.href = "/login";
                  }}
                  className="rounded-full bg-destructive px-5 py-2 text-sm font-semibold text-destructive-foreground"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border-2 border-foreground px-5 py-2 text-sm font-semibold">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
