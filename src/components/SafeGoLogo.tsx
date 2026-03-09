import { Shield } from "lucide-react";

export const SafeGoLogo = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <Shield className="text-primary fill-primary" size={size} strokeWidth={0} />
      <svg className="absolute inset-0" viewBox="0 0 24 24" width={size} height={size}>
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <span className="font-display font-extrabold text-foreground" style={{ fontSize: size * 0.85 }}>
      SafeGo
    </span>
  </div>
);
