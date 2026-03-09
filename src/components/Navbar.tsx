import { Link, useLocation } from "react-router-dom";
import { SafeGoLogo } from "./SafeGoLogo";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", to: "/home" },
  { label: "Book", to: "/book/normal" },
  { label: "Drive With Us", to: "/drive-with-us" },
  { label: "Safety", to: "/ride/tracking" },
  { label: "About", to: "/dashboard" },
];

export const Navbar = () => {
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
      className={`sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-all ${scrolled ? "shadow-sm" : ""
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/home">
          <SafeGoLogo size={24} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[15px] font-medium transition-colors hover:text-foreground ${location.pathname === l.to ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full border-2 border-foreground px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Sign Up
          </Link>
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
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border-2 border-foreground px-5 py-2 text-sm font-semibold">
              Login
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
