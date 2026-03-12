import { SafeGoLogo } from "@/components/SafeGoLogo";
import { StatsCard } from "@/components/StatsCard";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Car, MapPin, AlertTriangle, Settings, LogOut,
  Eye, Check, X, Bell, Navigation, Search, Filter, ShieldCheck, Clock,
  MoreVertical, ShieldAlert, Phone, Mail, Map, Download, Save, Trash2,
  ChevronRight, ArrowUpRight, ArrowDownRight, Globe, Shield, Lock
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

type AdminTab = "dashboard" | "users" | "drivers" | "live-rides" | "alerts" | "settings";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" as AdminTab },
  { icon: Users, label: "Users", id: "users" as AdminTab },
  { icon: Car, label: "Drivers", id: "drivers" as AdminTab },
  { icon: MapPin, label: "Live Rides", id: "live-rides" as AdminTab },
  { icon: AlertTriangle, label: "Safety Alerts", id: "alerts" as AdminTab },
  { icon: Settings, label: "Settings", id: "settings" as AdminTab },
];

const barData = [
  { mode: "Normal", rides: 420 },
  { mode: "Pink", rides: 310 },
  { mode: "PWD", rides: 180 },
  { mode: "Elderly", rides: 240 },
];

const lineData = [
  { month: "Jan", score: 88 }, { month: "Feb", score: 90 }, { month: "Mar", score: 92 },
  { month: "Apr", score: 91 }, { month: "May", score: 94 }, { month: "Jun", score: 96 },
];

const initialPendingDrivers = [
  { name: "Carlos M.", docs: "4/4", date: "Mar 7, 2025", plate: "ABC-123", rating: 4.8 },
  { name: "Anna L.", docs: "3/4", date: "Mar 6, 2025", plate: "XYZ-789", rating: 4.5 },
];

const initialAlerts = [
  { severity: "Critical", time: "2 min ago", location: "Makati Ave", id: "SOS-2891", type: "Panic Button", user: "Maria S." },
  { severity: "Moderate", time: "18 min ago", location: "QC Circle", id: "SOS-2890", type: "Route Deviation", user: "John R." },
  { severity: "Low", time: "45 min ago", location: "BGC Stopover", id: "SOS-2889", type: "Extended Stop", user: "David L." },
];

const initialLiveRides = [
  { id: "R-4521", passenger: "Maria S.", mode: "Pink", driver: "Ana M.", route: "SM → BGC", status: "In Progress", lat: 14.59, lng: 121.02 },
  { id: "R-4520", passenger: "David L.", mode: "PWD", driver: "James D.", route: "Home → Hospital", status: "Completed", lat: 14.58, lng: 121.05 },
  { id: "R-4519", passenger: "John R.", mode: "Normal", driver: "Carlos M.", route: "Makati → QC", status: "In Progress", lat: 14.55, lng: 121.01 },
];

const initialUsersList = [
  { id: "U-101", name: "Sarah Jenkins", email: "sarah.j@email.com", rides: 42, joined: "Jan 12, 2024", status: "Active" },
  { id: "U-102", name: "Mark Wilson", email: "m.wilson@email.com", rides: 12, joined: "Feb 05, 2024", status: "Active" },
  { id: "U-103", name: "Eliza Smith", email: "eliza.s@email.com", rides: 8, joined: "Mar 01, 2024", status: "Inactive" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [liveRides, setLiveRides] = useState(initialLiveRides);
  const [pendingDrivers, setPendingDrivers] = useState(initialPendingDrivers);
  const [showNotificationTray, setShowNotificationTray] = useState(false);
  const navigate = useNavigate();

  const handleApproveDriver = (name: string) => {
    setPendingDrivers(prev => prev.filter(d => d.name !== name));
    // Optionally add a notification for the approval
    const note = {
      id: Date.now(),
      title: "Driver Approved",
      message: `${name} has been successfully verified and added to the fleet.`,
      time: "Just now",
      icon: Check,
      color: "text-green-500"
    };
    setNotifications(prev => [note, ...prev]);
  };

  const handleRejectDriver = (name: string) => {
    setPendingDrivers(prev => prev.filter(d => d.name !== name));
  };

  useEffect(() => {
    const checkBookings = () => {
      const latest = localStorage.getItem("safego_latest_booking");
      if (latest) {
        const booking = JSON.parse(latest);
        if (Date.now() - booking.timestamp < 5000) {
          addNotification(booking);
          setLiveRides(prev => [
            { ...booking, lat: 14.5 + Math.random() * 0.1, lng: 121.0 + Math.random() * 0.1 }, 
            ...prev
          ]);
          localStorage.removeItem("safego_latest_booking");
        }
      }
    };
    const interval = setInterval(checkBookings, 1000);
    window.addEventListener("storage", checkBookings);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", checkBookings);
    };
  }, []);

  const addNotification = (booking: any) => {
    const newNote = {
      id: Date.now(),
      title: "New Ride Booked",
      message: `${booking.passenger} just booked a ${booking.mode} ride.`,
      time: "Just now",
      icon: Navigation,
      color: "text-primary"
    };
    setNotifications(prev => [newNote, ...prev]);
    setShowNotificationTray(true);
    setTimeout(() => setShowNotificationTray(false), 5000);
  };

  const renderDashboard = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Overview</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNotificationTray(!showNotificationTray)} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-secondary transition-all">
              <Bell size={20} className="text-muted-foreground" />
              {notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background">{notifications.length}</span>}
            </button>
            {showNotificationTray && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border p-4 bg-secondary/30">
                  <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                  <button onClick={() => setNotifications([])} className="text-xs font-semibold text-primary hover:underline">Clear all</button>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors border-b border-border last:border-0 text-left">
                        <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ${n.color}`}><n.icon size={16} /></div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <p className="text-[10px] font-medium text-muted-foreground mt-1 opacity-60">{n.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center"><p className="text-sm text-muted-foreground">No new notifications</p></div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setActiveTab("live-rides")} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all shadow-lg shadow-primary/20">View Live Map</button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Users} value="12,450" label="Total Users" iconColor="hsl(var(--purple))" iconBg="hsl(var(--purple-light))" />
        <StatsCard icon={Car} value="3,200" label="Active Drivers" />
        <StatsCard icon={MapPin} value={liveRides.length.toString()} label="Live Rides" iconColor="#F59E0B" iconBg="#FEF3C7" />
        <StatsCard icon={AlertTriangle} value="3" label="Safety Alerts" iconColor="hsl(var(--destructive))" iconBg="hsl(0 84% 60% / 0.1)" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Pending Driver Approvals</h3>
          <div className="mt-4 flex flex-col gap-3">
            {pendingDrivers.length > 0 ? pendingDrivers.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-secondary/20 transition-all">
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
                  <button 
                    onClick={() => handleApproveDriver(d.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={() => handleRejectDriver(d.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No pending approvals</p>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Recent Safety Alerts</h3>
          <div className="mt-4 flex flex-col gap-3">
            {initialAlerts.slice(0, 2).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-secondary/20 transition-all">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.severity === "Critical" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"}`}>{a.severity}</span>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{a.type} · {a.user}</p>
                </div>
                <button onClick={() => setActiveTab("alerts")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"><Eye size={12} /> View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6">
          <h3 className="font-display text-lg font-bold text-foreground">Ride Volume by Mode</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="mode" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Bar dataKey="rides" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
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
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))", stroke: "white" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
        <div className="flex gap-3">
          <div className="relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search users..." className="h-10 w-64 rounded-xl border border-border bg-background pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 ring-primary/20" /></div>
          <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold hover:bg-secondary transition-all"><Filter size={14} /> Filter</button>
        </div>
      </div>
      <div className="rounded-[2rem] border border-border bg-background overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <th className="p-5">User</th><th className="p-5">Joined</th><th className="p-5">Total Rides</th><th className="p-5">Status</th><th className="p-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialUsersList.map(u => (
              <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-5"><div className="flex items-center gap-3"><div className="h-9 w-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">{u.name[0]}</div><div><p className="text-sm font-bold">{u.name}</p><p className="text-[11px] text-muted-foreground">{u.email}</p></div></div></td>
                <td className="p-5 text-sm text-muted-foreground">{u.joined}</td>
                <td className="p-5 text-sm font-bold">{u.rides}</td>
                <td className="p-5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{u.status}</span></td>
                <td className="p-5"><button className="p-2 hover:bg-secondary rounded-lg"><MoreVertical size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrivers = () => (
    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Fleet Control</h1>
        <button className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg shadow-primary/20">+ Add New Driver</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {initialPendingDrivers.map(d => (
          <div key={d.name} className="p-6 rounded-[2rem] border border-border bg-background group hover:border-primary transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center font-black text-lg">{d.name[0]}</div>
                <div><h4 className="font-bold text-foreground">{d.name}</h4><p className="text-xs text-muted-foreground">Vehicle: {d.plate}</p></div>
              </div>
              <span className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-xs">⭐ {d.rating}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-secondary py-2 text-xs font-bold hover:bg-primary hover:text-white transition-all">View Dossier</button>
              <button className="rounded-xl border border-border px-3 py-2"><Mail size={16} /></button>
              <button className="rounded-xl border border-border px-3 py-2 text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlertsList = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Safety Command Log</h1>
        <span className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 border border-red-500/20"><ShieldAlert size={14} /> 3 Active Alerts</span>
      </div>
      <div className="space-y-4">
        {initialAlerts.map(a => (
          <div key={a.id} className={`p-6 rounded-[2.5rem] border bg-background flex flex-wrap items-center justify-between gap-6 transition-all hover:scale-[1.01] ${a.severity === "Critical" ? "border-red-500/30" : "border-border"}`}>
            <div className="flex items-center gap-6">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${a.severity === "Critical" ? "bg-red-500 text-white" : "bg-amber-100 text-amber-600"}`}><ShieldAlert size={28} /></div>
              <div>
                <h4 className="text-lg font-black text-foreground">{a.type}</h4>
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase opacity-60"><span>{a.id}</span><span>{a.time}</span><span>{a.user}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block"><p className="text-sm font-bold">{a.location}</p><p className="text-[10px] text-muted-foreground">Reported from Device</p></div>
              <button className="rounded-2xl bg-foreground text-background px-6 py-3 text-sm font-black hover:bg-primary transition-all">INTERSCEPT</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground mb-8">System Configuration</h1>
      <div className="space-y-6">
        <div className="p-8 rounded-[2.5rem] border border-border bg-background shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">General Access</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30"><div className="flex items-center gap-3"><Globe size={18} /><span>Multi-Region Support</span></div><button className="h-6 w-12 rounded-full bg-primary relative"><div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" /></button></div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30"><div className="flex items-center gap-3"><Lock size={18} /><span>Two-Factor Authentication</span></div><button className="h-6 w-12 rounded-full bg-slate-300 relative"><div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" /></button></div>
          </div>
        </div>
        <div className="p-8 rounded-[2.5rem] border border-border bg-background shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">Security & Protocols</h3>
          <button className="w-full rounded-2xl bg-primary py-4 text-sm font-black text-white hover:brightness-110 flex items-center justify-center gap-3"><Save size={18} /> SAVE PROTOCOLS</button>
        </div>
      </div>
    </div>
  );

  const renderLiveRidesMap = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-foreground">Fleet Monitor</h1><p className="text-sm text-muted-foreground mt-1">Real-time tracking of active trips.</p></div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-[10px] font-black"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> LIVE SYSTEM ACTIVE</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] border border-border bg-[#0f172a] shadow-inner group">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          {liveRides.map((ride, i) => (
            <div key={ride.id + i} className="absolute flex flex-col items-center gap-1 transition-all duration-[3000ms] ease-in-out" style={{ top: `${(ride.lat % 1) * 800 + 40}%`, left: `${(ride.lng % 1) * 800 + 40}%` }}>
              <div className="group relative">
                <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
                <div className="h-8 w-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white cursor-pointer hover:scale-125 transition-all"><Car size={14} /></div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-background border border-border px-3 py-1.5 rounded-xl text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">{ride.passenger}</div>
              </div>
            </div>
          ))}
          <div className="absolute top-6 left-6 right-6 flex gap-4"><div className="flex-1 relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search ride..." className="w-full bg-background/80 backdrop-blur border border-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold shadow-xl outline-none" /></div></div>
          <div className="absolute bottom-6 left-6 flex gap-2"><button className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center shadow-lg"><Map size={16} /></button><button className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center shadow-lg"><Download size={16} /></button></div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-foreground">Fleet Stats</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border"><p className="text-2xl font-black">{liveRides.length}</p><p className="text-[10px] font-bold text-muted-foreground uppercase">On Trip</p></div>
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border"><p className="text-2xl font-black">42</p><p className="text-[10px] font-bold text-muted-foreground uppercase">Idle</p></div>
            </div>
          </div>
          <div className="flex-1 rounded-3xl border border-border bg-background p-6 shadow-sm overflow-hidden flex flex-col">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Activity Log</h3>
            <div className="flex-1 overflow-y-auto space-y-3" style={{ scrollbarWidth: "thin" }}>
              {liveRides.map(r => (
                <div key={r.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border">
                  <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0"><Navigation size={14} /></div>
                  <div><p className="text-xs font-bold">{r.passenger} <span className="opacity-40 tracking-widest ml-1">{r.mode}</span></p><p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{r.route}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#0b0e14] p-4 lg:flex sticky top-0 h-screen transition-all">
        <div className="mb-8 px-2 flex flex-col items-center border-b border-white/5 pb-6"><SafeGoLogo size={24} className="[&_span]:text-background [&_svg]:text-primary" /><div className="mt-4 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-black text-primary/80 uppercase tracking-widest">Command Center</div></div>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[13px] font-bold transition-all text-left ${activeTab === item.id ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"}`}>
              <item.icon size={19} strokeWidth={activeTab === item.id ? 2.5 : 2} /> {item.label}
              {activeTab === item.id && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }} className="mt-auto flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-[13px] font-bold text-red-400 hover:bg-red-400/10 transition-all text-left w-full border border-transparent hover:border-red-400/20"><LogOut size={18} /> Logout Session</button>
      </aside>

      <main className="flex-1 overflow-y-auto bg-transparent p-6 lg:p-10 relative">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "drivers" && renderDrivers()}
        {activeTab === "live-rides" && renderLiveRidesMap()}
        {activeTab === "alerts" && renderAlertsList()}
        {activeTab === "settings" && renderSettings()}
      </main>
    </div>
  );
};

export default AdminDashboard;
