import { SafeGoLogo } from "@/components/SafeGoLogo";
import { StatsCard } from "@/components/StatsCard";
import { modes } from "@/config/modeConfig";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Car, Shield, Users as UsersIcon, Settings, LogOut,
  Star, TrendingUp, ArrowRight
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Car, label: "My Rides", to: "/dashboard" },
  { icon: Shield, label: "Safety Reports", to: "/dashboard" },
  { icon: UsersIcon, label: "Emergency Contacts", to: "/dashboard" },
  { icon: Settings, label: "Settings", to: "/dashboard" },
];

const rides = [
  { id: 1, mode: "Pink", route: "SM Mall → BGC", date: "Mar 8", driver: "Ana M.", status: "Completed", rating: 5 },
  { id: 2, mode: "Normal", route: "Makati → QC", date: "Mar 7", driver: "James D.", status: "Completed", rating: 4 },
  { id: 3, mode: "PWD", route: "Home → Hospital", date: "Mar 6", driver: "Carlos R.", status: "Cancelled", rating: 0 },
  { id: 4, mode: "Elderly", route: "Church → Home", date: "Mar 5", driver: "Maria S.", status: "Completed", rating: 5 },
];

const statusColors: Record<string, string> = {
  Completed: "bg-primary/10 text-primary",
  Cancelled: "bg-destructive/10 text-destructive",
  "In Progress": "bg-amber-100 text-amber-700",
};

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
        <SafeGoLogo size={22} className="px-2" />
        <div className="mt-6 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">JD</div>
          <div>
            <p className="font-display text-sm font-bold">Good morning, John</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Passenger</span>
          </div>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link to="/home" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-secondary p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">March 8, 2025</p>
          <Link to="/book/normal" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all">
            Book a Ride
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={Car} value="24" label="Total Rides" />
          <StatsCard icon={Shield} value="92%" label="Safety Score" iconColor="hsl(var(--teal))" />
          <StatsCard icon={Star} value="Pink" label="Most Used Mode" iconColor="hsl(var(--pink))" iconBg="hsl(var(--pink-light))" />
          <StatsCard icon={TrendingUp} value="8" label="This Month" />
        </div>

        {/* Quick book */}
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold text-foreground">Quick Book</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {modes.map((m) => (
              <Link key={m.id} to={`/book/${m.id}`} className="safego-card flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: m.lightBg }}>
                  <m.icon size={18} style={{ color: m.accent }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{m.name.replace(" Mode", "")}</p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent rides */}
        <div className="mt-8">
          <h3 className="font-display text-lg font-bold text-foreground">Recent Rides</h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-background shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-secondary" : ""} hover:bg-primary/5 transition-colors`}>
                    <td className="px-4 py-3 text-muted-foreground">{r.id}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-secondary text-foreground">{r.mode}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.route}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3 text-foreground">{r.driver}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.rating > 0 && <div className="flex gap-0.5">{Array.from({length: r.rating}).map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
