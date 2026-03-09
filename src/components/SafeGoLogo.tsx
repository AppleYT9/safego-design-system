

export const SafeGoLogo = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src="/cab_for_all_logo.png"
      alt="Cab For All Logo"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
    <span className="font-display font-extrabold text-foreground" style={{ fontSize: size * 0.85 }}>
      SafeGo
    </span>
  </div>
);
