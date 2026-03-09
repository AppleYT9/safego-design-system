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
    <div
      className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/splash-bg.jpg')" }}
    >
      {/* Dark overlay to ensure the logo and text remain readable */}
      <div className="absolute inset-0 bg-black/50" />

      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ "--foreground": "0 0% 100%" } as React.CSSProperties}
      >
        <SafeGoLogo size={56} />
        <p className="mt-4 text-lg text-white font-medium drop-shadow-md">Your Safety. Our Priority.</p>
      </div>

      <div className="absolute bottom-12 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-secondary">
        <div className="animate-progress h-full rounded-full bg-primary" />
      </div>
    </div>
  );
};

export default Splash;
