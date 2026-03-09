import { Link } from "react-router-dom";
import { SafeGoLogo } from "./SafeGoLogo";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <SafeGoLogo size={22} />
            <p className="mt-3 text-sm text-muted-foreground">Your Safety. Our Priority.</p>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold">Product</h4>
            <div className="mt-3 flex flex-col gap-2">
              {["Home", "Book a Ride", "Safety Features", "Pricing"].map((l) => (
                <Link key={l} to="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold">Company</h4>
            <div className="mt-3 flex flex-col gap-2">
              {["About", "Careers", "Blog", "Press"].map((l) => (
                <Link key={l} to="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-bold">Stay Updated</h4>
            <div className="mt-3 flex rounded-full border border-border bg-secondary">
              <input
                type="email"
                placeholder="Your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors" aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2025 SafeGo Inc. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link to="/home" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/home" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
