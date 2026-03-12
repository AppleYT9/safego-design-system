import { SafeGoLogo } from "@/components/SafeGoLogo";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Car, FileText, DollarSign, Settings, LogOut, Star, Check, Clock, AlertCircle, Upload
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/driver" },
  { icon: Car, label: "Available Rides", to: "/driver" },
  { icon: FileText, label: "My History", to: "/driver" },
  { icon: FileText, label: "Documents", to: "/driver" },
  { icon: DollarSign, label: "Earnings", to: "/driver" },
  { icon: Settings, label: "Settings", to: "/driver" },
];

const requests = [
  { id: 1, pickup: "SM Megamall", dest: "Makati CBD", mode: "Pink", modeColor: "hsl(var(--pink))", modeBg: "hsl(var(--pink-light))", dist: "8.2 km", fare: "₹195" },
  { id: 2, pickup: "QC Memorial", dest: "Eastwood", mode: "Normal", modeColor: "hsl(var(--teal))", modeBg: "hsl(var(--teal-light))", dist: "5.1 km", fare: "₹142" },
];

const docs = [
  { name: "National ID", status: "Verified", icon: Check, color: "text-primary", bg: "bg-primary/10" },
  { name: "Driver's License", status: "Verified", icon: Check, color: "text-primary", bg: "bg-primary/10" },
  { name: "Vehicle Registration", status: "Pending Review", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  { name: "NBI Clearance", status: "Upload Required", icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
];

const DriverPortal = () => (
  <div className="flex min-h-screen">
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
      <SafeGoLogo size={22} className="px-2" />
      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <item.icon size={18} /> {item.label}
          </Link>
        ))}
      </nav>
      <Link to="/home" className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
        <LogOut size={18} /> Logout
      </Link>
    </aside>

    <main className="flex-1 overflow-y-auto bg-secondary p-6 lg:p-8">
      {/* Profile header */}
      <div className="rounded-2xl border border-border bg-background p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">JD</div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">James Dela Cruz</h2>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> 4.9 Rating</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Verified Driver ✓</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-8 text-sm">
          <div><p className="text-2xl font-bold font-display text-foreground">12</p><p className="text-muted-foreground">Today's Rides</p></div>
          <div><p className="text-2xl font-bold font-display text-foreground">₹3,240</p><p className="text-muted-foreground">Earnings</p></div>
          <div><p className="text-2xl font-bold font-display text-foreground">94%</p><p className="text-muted-foreground">Acceptance</p></div>
        </div>
      </div>

      {/* Ride requests */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-foreground">Incoming Ride Requests</h3>
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border p-4">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold text-foreground">{r.pickup} → {r.dest}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.dist} · Est. {r.fare}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: r.modeBg, color: r.modeColor }}>{r.mode}</span>
              <div className="flex gap-2">
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all">Accept</button>
                <button className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Documents</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <div key={d.name} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${d.bg}`}>
                  <d.icon size={16} className={d.color} />
                </div>
                <span className="text-sm font-medium text-foreground">{d.name}</span>
              </div>
              {d.status === "Upload Required" ? (
                <button className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">
                  <Upload size={12} /> Upload
                </button>
              ) : (
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.bg} ${d.color}`}>{d.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default DriverPortal;
