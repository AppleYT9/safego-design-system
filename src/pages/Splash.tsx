import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SafeGoLogo } from "@/components/SafeGoLogo";

const Splash = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => navigate("/home"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Faint map grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="splash-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--teal))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#splash-grid)" />
      </svg>

      <div className={`flex flex-col items-center transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        <SafeGoLogo size={56} />
        <p className="mt-4 text-lg text-muted-foreground">Your Safety. Our Priority.</p>
      </div>

      <div className="absolute bottom-12 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-secondary">
        <div className="animate-progress h-full rounded-full bg-primary" />
      </div>
    </div>
  );
};

export default Splash;
