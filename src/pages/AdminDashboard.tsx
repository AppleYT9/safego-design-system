import { SafeGoLogo } from "@/components/SafeGoLogo";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Car, MapPin, AlertTriangle, Settings, LogOut,
  Eye, Check, X
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Users" },
  { icon: Car, label: "Drivers" },
  { icon: MapPin, label: "Live Rides" },
  { icon: AlertTriangle, label: "Safety Alerts" },
  { icon: Settings, label: "Settings" },
];

const barData = [
  { mode: "Normal", rides: 420 },
  { mode: "Pink", rides: 310 },
  { mode: "PWD", rides: 180 },
  { mode: "Elderly", rides: 240 },
];
const barColors: Record<string, string> = { Normal: "#00C9A7", Pink: "#D4498A", PWD: "#7C3AED", Elderly: "#0EA5E9" };

const lineData = [
  { month: "Jan", score: 88 }, { month: "Feb", score: 90 }, { month: "Mar", score: 92 },
  { month: "Apr", score: 91 }, { month: "May", score: 94 }, { month: "Jun", score: 96 },
];

const pendingDrivers = [
  { name: "Carlos M.", docs: "4/4", date: "Mar 7, 2025" },
  { name: "Anna L.", docs: "3/4", date: "Mar 6, 2025" },
];

const alerts = [
  { severity: "Critical", time: "2 min ago", location: "Makati Ave", id: "SOS-2891" },
  { severity: "Moderate", time: "18 min ago", location: "QC Circle", id: "SOS-2890" },
];

const liveRides = [
  { id: "R-4521", passenger: "Maria S.", mode: "Pink", driver: "Ana M.", route: "SM → BGC", status: "In Progress" },
  { id: "R-4520", passenger: "David L.", mode: "PWD", driver: "James D.", route: "Home → Hospital", status: "Completed" },
  { id: "R-4519", passenger: "John R.", mode: "Normal", driver: "Carlos M.", route: "Makati → QC", status: "In Progress" },
];

const AdminDashboard = () => (
  <div className="flex min-h-screen">
    {/* Dark sidebar */}
    <aside className="hidden w-[260px] shrink-0 flex-col bg-foreground p-4 lg:flex">
      <SafeGoLogo size={22} className="px-2 [&_span]:text-background [&_svg]:text-primary" />
      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => (
          <button key={item.label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-background/60 transition-colors hover:bg-background/10 hover:text-background">
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>
      <Link to="/home" className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-background/60 hover:bg-background/10 hover:text-background">
        <LogOut size={18} /> Logout
      </Link>
    </aside>

    <main className="flex-1 overflow-y-auto bg-secondary p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">SafeGo Admin Panel</h1>
        <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all">
          View Live Map
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Users} value="12,450" label="Total Users" iconColor="hsl(var(--purple))" iconBg="hsl(var(--purple-light))" />
        <StatsCard icon={Car} value="3,200" label="Active Drivers" />
        <StatsCard icon={MapPin} value="847" label="Live Rides" iconColor="#F59E0B" iconBg="#FEF3C7" />
        <StatsCard icon={AlertTriangle} value="3" label="Safety Alerts" iconColor="hsl(var(--destructive))" iconBg="hsl(0 84% 60% / 0.1)" />
      </div>

      {/* Two column */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Pending drivers */}
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Pending Driver Approvals</h3>
          <div className="mt-4 flex flex-col gap-3">
            {pendingDrivers.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-bold text-sm text-foreground">
                    {d.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">Docs: {d.docs} · {d.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><Check size={14} /></button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety alerts */}
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Safety Alerts</h3>
          <div className="mt-4 flex flex-col gap-3">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.severity === "Critical" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}`}>
                      {a.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{a.id} · {a.location}</p>
                </div>
                <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors">
                  <Eye size={12} /> View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live rides */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Live Rides Monitor</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3">Ride ID</th>
                <th className="px-4 py-3">Passenger</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {liveRides.map((r, i) => (
                <tr key={r.id} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-secondary" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-4 py-3 text-foreground">{r.passenger}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{r.mode}</span></td>
                  <td className="px-4 py-3 text-foreground">{r.driver}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.route}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Ride Volume by Mode</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="mode" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="rides" radius={[8, 8, 0, 0]} fill="hsl(var(--teal))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Monthly Safety Score</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(166, 100%, 39%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(166, 100%, 39%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default AdminDashboard;
