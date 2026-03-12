import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SafeGoLogo } from "@/components/SafeGoLogo";

const Splash = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setShow(true);
    // Force play the video to ensure autoplay works on all browsers
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Autoplay prevents video from playing:", err);
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center relative bg-black overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/SplSH.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => navigate("/home")}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle overlay to ensure the logo and text remain readable */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Logo & Text Overlay */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ "--foreground": "0 0% 100%" } as React.CSSProperties}
      >
        <SafeGoLogo size={56} />
        <p className="mt-4 text-lg text-white font-medium drop-shadow-md">Your Safety. Our Priority.</p>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-12 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-secondary/50">
        <div className="animate-progress h-full rounded-full bg-primary" />
      </div>
    </div>
  );
};

export default Splash;
