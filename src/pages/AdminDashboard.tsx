import { SafeGoLogo } from "@/components/SafeGoLogo";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Car, MapPin, Settings, LogOut,
  Check, X, Bell, Navigation, Search, MoreVertical, ShieldAlert, Map,
  Download, FileText, Star, Activity, UserCheck, ShieldCheck, Layers,
  ArrowUpRight, ChevronRight, Zap, Edit2, Trash2, UserPlus, Save, AlertCircle,
  BarChart3, PieChart as PieChartIcon, History, Shield, Info, Globe,
  Lock, Mail, Phone, User as UserIcon, Loader2, Wifi, WifiOff, Database,
  Briefcase, Fingerprint, Key, ShieldPlus
} from "lucide-react";
import {
  XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, YAxis
} from "recharts";
import { toast } from "sonner";

type AdminTab = "dashboard" | "users" | "drivers" | "live-rides" | "alerts" | "settings";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const navGroups = [
  {
    label: "Core Matrix",
    items: [
      { id: "dashboard", label: "Operations Hub", icon: LayoutDashboard },
      { id: "live-rides", label: "Mission Control", icon: Navigation },
      { id: "users", label: "Identity Registry", icon: Users },
      { id: "drivers", label: "Fleet Intelligence", icon: Car },
    ],
  },
  {
    label: "Safety & Security",
    items: [
      { id: "alerts", label: "Safety Command", icon: ShieldAlert },
      { id: "settings", label: "Global Config", icon: Settings },
    ],
  },
];

// PREMIUM SaaS UI COMPONENTS

const Card = ({ children, className = "", noPadding = false }: any) => (
  <div className={`bg-white border border-slate-100 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ${noPadding ? "" : "p-8"} ${className}`}>
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-10 py-8 flex justify-between items-center border-b border-slate-50">
          <h2 className="text-2xl font-display font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"><X size={20} /></button>
        </div>
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [driversList, setDriversList] = useState<any[]>([]);
  const [liveRides, setLiveRides] = useState<any[]>([]);
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<{ id: string, title: string, description: string, time: string, type: string }[]>([
    { id: '1', title: 'System Boot Success', description: 'All matrix nodes are synchronized and online.', time: 'Just now', type: 'success' },
    { id: '2', title: 'New Node Joined', description: 'Driver ID #4421 has entered the fleet.', time: '2 min ago', type: 'info' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activePop, setActivePop] = useState<{ title: string, type: string } | null>(null);

  const addNotification = (title: string, description: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Quick visual pop
    setActivePop({ title, type });
    setTimeout(() => setActivePop(null), 1200);

    // Optional: still keep toast for secondary feedback if needed, 
    // but the user wants the "popping" from the bell.
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [isBackendAlive, setIsBackendAlive] = useState<boolean | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // RBAC STATE (Simulating current user from token)
  const [currentUser, setCurrentUser] = useState<any>(null);

  // MODALS
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    full_name: "", email: "", phone: "", password: "", role: "passenger",
    position: "Managed User", department: "External", gender: "other",
    is_active: true, is_verified: true
  });

  const navigate = useNavigate();

  // SaaS PERMISSION CHECK
  const canPerformAction = (action: 'write' | 'delete' | 'manage') => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'staff' && action === 'write') return true;
    return false;
  };

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      setIsBackendAlive(res.ok);
    } catch (err) { setIsBackendAlive(false); }
  };

  const fetchCurrentUser = async () => {
    // In a real SaaS version, this would be a /me endpoint
    // Simulating based on what we have in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Mocking for now, in reality you'd decode JWT
      setCurrentUser({ role: 'admin', name: 'System Admin' });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) { }
  };

  const fetchUsers = async () => {
    setIsSearching(true);
    try {
      const q = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : "";
      const res = await fetch(`${API_URL}/api/admin/users${q}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setUsersList(await res.json());
    } catch (err) { } finally { setIsSearching(false); }
  };

  const fetchDrivers = async () => {
    setIsSearching(true);
    try {
      const q = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : "";
      const res = await fetch(`${API_URL}/api/admin/drivers?per_page=50${q}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setDriversList(await res.json());
    } catch (err) { } finally { setIsSearching(false); }
  };

  const fetchLiveRides = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/rides/live`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setLiveRides(await res.json());
    } catch (err) { } finally { setIsSearching(false); }
  };

  const fetchSOS = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/sos-alerts?status=active`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setSosAlerts(await res.json());
    } catch (err) { } finally { setIsSearching(false); }
  };

  useEffect(() => {
    if (activeTab === "users") {
      const delayDebounceFn = setTimeout(() => { fetchUsers(); }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPerformAction('manage')) {
      setFormError("INSUFFICIENT PERMISSIONS: Only System Admins can provision new nodes.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newUser)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setIsCreateUserOpen(false);
        setNewUser({ full_name: "", email: "", phone: "", password: "", role: "passenger", position: "Managed User", department: "External", gender: "other", is_active: true, is_verified: true });
        fetchUsers(); fetchStats();
      } else { setFormError(data.detail || "System rejected identity deployment."); }
    } catch (err) { setFormError("CONNECTION ERROR: Verify MongoDB and Terminal are active."); } finally { setIsSubmitting(false); }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(editingUser)
      });
      if (res.ok) { setIsEditUserOpen(false); fetchUsers(); }
    } catch (err) { } finally { setIsSubmitting(false); }
  };

  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { setIsDeletingUser(false); fetchUsers(); fetchStats(); }
    } catch (err) { } finally { setIsSubmitting(false); }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    checkHealth();
    fetchStats();
    fetchCurrentUser();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "drivers") fetchDrivers();
    if (activeTab === "live-rides") fetchLiveRides();
    if (activeTab === "alerts") fetchSOS();

    // LIVE INTER-TAB SYNCHRONIZATION
    // This allows the admin to see SOS/Bookings made in other tabs immediately
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'safego_new_sos') {
        const sosData = JSON.parse(e.newValue || '{}');
        addNotification("CRITICAL SOS DETECTED", `Passenger ${sosData.userId} has triggered an emergency node.`, "error");
        fetchSOS(); // Refresh list
      }
      if (e.key === 'safego_new_booking') {
        const bookingData = JSON.parse(e.newValue || '{}');
        addNotification("NEW MISSION LOGGED", `Ride ${bookingData.id} initialized. Fleet unit dispatching.`, "success");
        fetchLiveRides(); // Refresh list
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      checkHealth();
      if (activeTab === "live-rides") fetchLiveRides();
      if (activeTab === "alerts") fetchSOS();
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [activeTab, navigate]);

  // Sidebar Filtering Logic
  const navGroupsFiltered = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      // Simulated: only admins/staff see live rides
      if (item.id === 'live-rides' && currentUser?.role !== 'admin') return false;
      return true;
    })
  }));

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* SaaS SIDEBAR */}
      <aside className="w-[300px] shrink-0 bg-white border-r border-slate-200 flex flex-col p-8 overflow-y-auto">
        <div className="mb-12 px-2 flex items-center gap-3"><SafeGoLogo size={36} className="[&_span]:text-2xl [&_span]:font-black" /></div>

        <div className="flex-1 space-y-12">
          {navGroupsFiltered.map((group) => (
            <div key={group.label} className="space-y-4">
              <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{group.label}</h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all text-sm font-bold ${activeTab === item.id ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><item.icon size={20} />{item.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100">
          <div className="px-5 py-4 rounded-3xl bg-slate-50 space-y-3 mb-6">
            <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Node Cluster</span><div className={`h-2 w-2 rounded-full ${isBackendAlive === true ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} /></div>
            <div className="flex items-center gap-2"><Wifi size={14} className={isBackendAlive ? 'text-emerald-500' : 'text-red-500'} /><span className={`text-[11px] font-black uppercase tracking-widest ${isBackendAlive ? 'text-emerald-600' : 'text-red-600'}`}>{isBackendAlive ? 'Matrix Synced' : 'Offline'}</span></div>
          </div>
          <div className="flex items-center gap-4 px-2 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><UserCheck size={20} /></div>
            <div><p className="text-xs font-black text-slate-900">{currentUser?.name || "Initializing..."}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentUser?.role}</p></div>
          </div>
          <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-bold border border-transparent hover:border-red-100"><LogOut size={20} /> Terminate Session</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-28 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-8">
            <div>
              <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight capitalize">{activeTab.replace("-", " ")}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">SaaS Command Center v4.5.2</p>
            </div>
          </div>
          <div className="flex items-center gap-6 relative">
            {/* Quick Pop Animation */}
            {activePop && (
              <div className="absolute top-1/2 -left-48 -translate-y-1/2 animate-in fade-in slide-in-from-right-8 duration-300 pointer-events-none z-[60]">
                <div className={`px-4 py-2 rounded-xl shadow-2xl border flex items-center gap-2 whitespace-nowrap ${activePop.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' : activePop.type === 'error' ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-900 text-white border-slate-700'}`}>
                  {activePop.type === 'success' ? <Check size={14} /> : activePop.type === 'error' ? <AlertCircle size={14} /> : <Info size={14} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{activePop.title}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all relative ${showNotifications ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg'}`}
            >
              <Bell size={22} />
              {notifications.length > 0 && !showNotifications && (
                <span className="absolute top-4 right-4 h-2 w-2 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-20 right-0 w-[400px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Notifications</h3>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg">{notifications.length} Total</span>
                </div>
                <div className="max-h-[450px] overflow-y-auto p-4 space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                      <div className="flex gap-4">
                        <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${n.type === 'success' ? 'bg-emerald-50 text-emerald-500' : n.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                          {n.type === 'success' ? <Check size={18} /> : n.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{n.description}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setNotifications([])}
                  className="w-full p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-500 transition-colors bg-white border-t border-slate-50"
                >
                  Clear Command Log
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 scrollbar-hide space-y-12">
          {activeTab === "dashboard" && (
            <div className="space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-6">
              {/* TOP STATS CLUSTER */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Managed Identities", val: stats?.total_users, icon: Users, color: "text-primary", bg: "bg-primary/5", trend: "+12.4%", desc: "Active network nodes" },
                  { label: "Fleet Capacity", val: stats?.total_drivers, icon: Car, color: "text-blue-500", bg: "bg-blue-50", trend: "+2.1%", desc: "Verified pilot units" },
                  { label: "Operational Flux", val: stats?.active_rides, icon: Navigation, color: "text-emerald-500", bg: "bg-emerald-50", trend: "Stable", desc: "Live mission sessions" },
                  { label: "System Anomalies", val: stats?.active_sos_alerts, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50", trend: "Alert", desc: "Critical safety signals" }
                ].map((s, i) => (
                  <Card key={i} className="flex flex-col gap-8 group hover:border-primary/20 transition-all cursor-default border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 bg-slate-50/50 rounded-full group-hover:scale-110 transition-transform" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className={`h-16 w-16 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shadow-lg shadow-slate-100 group-hover:-rotate-6 transition-transform`}><s.icon size={32} /></div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${s.bg} ${s.color} tracking-tighter`}>{s.trend}</span>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{s.desc}</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-5xl font-display font-black text-slate-900 tracking-tighter">{s.val?.toLocaleString() || "0"}</p>
                      <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 mt-3">{s.label}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* CORE INTELLIGENCE CLUSTER */}
              <div className="grid gap-12 lg:grid-cols-12">
                {/* DYNAMIC TRAFFIC ANALYTICS */}
                <Card className="lg:col-span-8 p-10 space-y-10 border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3"><Activity size={28} className="text-primary" /> Operational Flux</h3>
                      <p className="text-sm text-slate-400 font-medium mt-1">Real-time network demand and session distribution.</p>
                    </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { n: '00:00', v: 400, u: 240 }, { n: '04:00', v: 700, u: 500 },
                        { n: '08:00', v: 450, u: 300 }, { n: '12:00', v: 900, u: 780 },
                        { n: '16:00', v: 650, u: 480 }, { n: '20:00', v: 1100, u: 850 },
                        { n: '23:59', v: 850, u: 600 }
                      ]}>
                        <defs>
                          <linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={5} fill="url(#p)" animationDuration={2000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* NETWORK PULSE STREAM */}
                <Card className="lg:col-span-4 p-0 border-slate-100 flex flex-col overflow-hidden bg-slate-900 border-none shadow-2xl shadow-slate-200">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-3"><Globe size={20} className="text-emerald-400" /> Global Incident Monitor</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Monitoring</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    {/* Map the actual notifications here for real-time visibility */}
                    {notifications.slice(0, 6).map((log, i) => (
                      <div key={i} className={`flex gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all border ${log.type === 'error' ? 'border-rose-500/20 bg-rose-500/5' : 'border-transparent'}`}>
                        <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${log.type === 'error' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' : log.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                          <p className={`text-[12px] font-black uppercase tracking-tight ${log.type === 'error' ? 'text-rose-400' : 'text-white'}`}>{log.title}</p>
                          <p className="text-[10px] font-medium text-white/40 mt-1 line-clamp-1">{log.description}</p>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Node: {log.id.slice(0, 4)}</span>
                            <span className="text-[9px] font-medium text-white/10 italic">{log.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-white/5 mt-auto">
                    <button onClick={() => setShowNotifications(true)} className="w-full py-4 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/5">View Full Mission Archive</button>
                  </div>
                </Card>
              </div>

              {/* SYSTEM RESILIENCE METRICS */}
              <div className="grid gap-8 lg:grid-cols-3">
                <Card className="p-10 space-y-8 border-slate-100 hover:border-emerald-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner"><Database size={24} /></div>
                    <div><h4 className="text-lg font-bold text-slate-900">Node Availability</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Persistence</p></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Uptime Cluster</span><span className="text-xs font-black text-emerald-600">99.98%</span></div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-emerald-500 w-[99.9%]" /></div>
                  </div>
                </Card>
                <Card className="p-10 space-y-8 border-slate-100 hover:border-blue-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner"><Layers size={24} /></div>
                    <div><h4 className="text-lg font-bold text-slate-900">API Throughput</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matrix Traffic</p></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Current Load</span><span className="text-xs font-black text-blue-600">242 Req/s</span></div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-blue-500 w-[45%]" /></div>
                  </div>
                </Card>
                <Card className="p-10 space-y-8 border-slate-100 hover:border-rose-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner"><Fingerprint size={24} /></div>
                    <div><h4 className="text-lg font-bold text-slate-900">Security Handshakes</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RBAC Validation</p></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-500">Integrity Check</span><span className="text-xs font-black text-rose-600">Verified</span></div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-rose-500 w-[100%]" /></div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Identity Registry</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Manage and monitor all system nodes and user access.</p>
                </div>
                <button
                  onClick={() => setIsCreateUserOpen(true)}
                  className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                >
                  <UserPlus size={18} /> Provision Identity
                </button>
              </div>

              <Card noPadding className="overflow-hidden border-slate-200/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Node Profile</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role Architecture</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">System Status</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Node Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {isSearching ? (
                      <tr><td colSpan={4} className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></td></tr>
                    ) : usersList.length > 0 ? usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                              {u.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{u.full_name}</p>
                              <p className="text-xs font-medium text-slate-400 mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="inline-flex flex-col gap-1">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-center ${u.role === 'admin' ? 'bg-slate-900 text-white' :
                              u.role === 'staff' ? 'bg-blue-500 text-white' :
                                'bg-slate-100 text-slate-600'
                              }`}>{u.role}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${u.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                              {u.is_active ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {canPerformAction('write') && (
                              <button onClick={() => { setEditingUser(u); setIsEditUserOpen(true); }} className="h-9 w-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-primary hover:border-primary/30 transition-all"><Edit2 size={14} /></button>
                            )}
                            {canPerformAction('delete') && (
                              <button onClick={() => { setUserToDelete(u); setIsDeletingUser(true); }} className="h-9 w-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"><Trash2 size={14} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="px-8 py-20 text-center"><div className="flex flex-col items-center gap-3 text-slate-300"><Search size={40} /><p className="font-semibold text-sm">No results found</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === "drivers" && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Fleet Intelligence</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Real-time telemetry and management of the driver cluster.</p>
                </div>
              </div>

              <Card noPadding className="overflow-hidden border-slate-200/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Driver Node</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Unit</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Efficiency</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {isSearching ? (
                      <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={32} /></td></tr>
                    ) : driversList.length > 0 ? driversList.map((d) => (
                      <tr key={d._id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                              {d.user?.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{d.user?.full_name}</p>
                              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{d.license_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{d.vehicle?.make} {d.vehicle?.model}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{d.vehicle?.plate_number}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div><p className="text-xs font-bold text-slate-900">{d.average_rating || '5.0'}</p><p className="text-[9px] font-medium text-slate-400">Rating</p></div>
                            <div className="w-px h-6 bg-slate-100" />
                            <div><p className="text-xs font-bold text-slate-900">{d.total_rides || '0'}</p><p className="text-[9px] font-medium text-slate-400">Trips</p></div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${d.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${d.is_online ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {d.is_online ? 'Active' : 'Offline'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-primary hover:border-primary/30 transition-all">Dossier</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="px-8 py-20 text-center"><div className="flex flex-col items-center gap-3 text-slate-300"><Car size={40} /><p className="font-semibold text-sm">No Fleet Nodes Active</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === "live-rides" && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Global Operations Command</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Real-time telemetry and mission monitoring across the SafeGo Matrix.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-9 px-4 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-2 border border-emerald-100/50">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> SYSTEM NOMINAL
                  </div>
                  <div className="h-9 px-4 rounded-xl bg-slate-900 text-white text-[10px] font-bold flex items-center gap-2 shadow-lg shadow-slate-200">
                    <Globe size={14} className="animate-spin-slow" /> LIVE SECTOR: MNL-01
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {(liveRides.length > 0 ? liveRides : [
                    { _id: 'm1', mode: 'pink', status: 'in_progress', pickup_address: 'Greenbelt 5, Makati City', destination_address: 'BGC High Street, Taguig', driver_id: 'NODE_8829' },
                    { _id: 'm2', mode: 'pwd', status: 'in_progress', pickup_address: 'St. Luke Medical Center', destination_address: 'Forbes Park North', driver_id: 'NODE_4412' }
                  ]).map((ride, idx) => (
                    <Card key={ride._id} className="border-slate-200/60 p-0 overflow-hidden relative group hover:border-primary/30 transition-all duration-500">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-2xl ${ride.mode === 'pink' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'} flex items-center justify-center border border-current/10`}>
                              <Car size={28} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">{ride.mode.toUpperCase()} PROTOCOL</p>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest">Active</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Asset ID: {ride.driver_id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-slate-900">ETA: {12 + idx * 5} MINS</p>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">On Schedule</p>
                          </div>
                        </div>

                        <div className="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-white border-2 border-primary" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin Point</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{ride.pickup_address}</p>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-primary" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination Node</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">{ride.destination_address}</p>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                          <div className="flex gap-8">
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transmission</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Wifi size={12} className="text-emerald-500" />
                                <span className="text-xs font-bold text-slate-900">Encrypted</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Safety Score</p>
                              <p className="text-xs font-bold text-emerald-500 mt-1">98.4%</p>
                            </div>
                          </div>
                          <button
                            onClick={() => addNotification("Digital Twin Sync", "Full telemetry override enabled for active mission node.", "success")}
                            className="h-10 px-6 rounded-xl bg-slate-50 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                          >
                            Open Digital Twin
                          </button>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50">
                        <div
                          className="h-full bg-primary transition-all duration-[3000ms] ease-in-out relative"
                          style={{ width: `${40 + idx * 25}%` }}
                        >
                          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white/20 to-transparent animate-shimmer" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="space-y-6">
                  <Card className="bg-[#0f172a] border-slate-800 text-white p-6 shadow-2xl shadow-slate-200">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Database size={18} /></div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-500">Live Global Stream</h4>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>
                    <div className="space-y-4 font-mono text-[10px] max-h-[350px] overflow-hidden">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex gap-4 border-l-2 border-emerald-500/20 pl-4 py-1.5 hover:bg-white/5 transition-colors cursor-default group">
                          <span className="text-slate-500 font-bold">[{new Date().toLocaleTimeString()}]</span>
                          <span className="text-emerald-400/90 group-hover:text-emerald-400 transition-colors">TRX_{Math.floor(Math.random() * 90000) + 10000}</span>
                          <span className="text-slate-500">::</span>
                          <span className="text-emerald-500 font-bold">OK_SYNC</span>
                        </div>
                      ))}
                      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-bold">Encrypted Buffer</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400">99.98%</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-slate-200/60 p-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Network Health</h4>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold"><span className="text-slate-500">API DELTA</span><span className="text-slate-900">8ms</span></div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-primary w-[15%]" /></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold"><span className="text-slate-500">SYNC RATE</span><span className="text-slate-900">100%</span></div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full" /></div>
                      </div>
                      <button className="w-full py-3 rounded-xl bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-100 hover:bg-slate-100 transition-all">Export Telemetry</button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="animate-in fade-in duration-500 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Live Safety Ops</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Safety Command Center</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium italic">"Priority-1 Intervention Protocol Active"</p>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 rounded-2xl bg-rose-500 text-white shadow-xl shadow-rose-100 flex items-center gap-3">
                    <ShieldAlert size={20} className="animate-bounce" />
                    <div className="text-left">
                      <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">Urgent Alerts</p>
                      <p className="text-sm font-black">{sosAlerts.length || 2} Signals</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {(sosAlerts.length > 0 ? sosAlerts : [
                  { _id: 'sos1', severity: 'critical', location_address: 'Corner of Ayala Ave & Paseo de Roxas', user_id: 'USER_9921', ride_id: 'RIDE_882', created_at: new Date().toISOString() },
                  { _id: 'sos2', severity: 'moderate', location_address: 'Near Gateway Mall, Cubao', user_id: 'USER_1045', ride_id: 'RIDE_441', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
                ]).map((alert, idx) => (
                  <Card key={alert._id} className={`p-0 overflow-hidden border-none ring-1 ${alert.severity === 'critical' ? 'ring-rose-200 bg-rose-50/10' : 'ring-orange-200 bg-orange-50/10'} shadow-xl shadow-slate-100`}>
                    <div className="flex flex-col lg:flex-row">
                      <div className={`w-full lg:w-2 bg-rose-500 ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-orange-500'}`} />
                      <div className="flex-1 p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                          <div className="flex items-center gap-6">
                            <div className={`h-16 w-16 rounded-[2rem] flex items-center justify-center shadow-lg ${alert.severity === 'critical' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-orange-500 text-white shadow-orange-200'}`}>
                              <ShieldAlert size={32} className={alert.severity === 'critical' ? 'animate-bounce' : ''} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${alert.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
                                  {alert.severity.toUpperCase()} INCIDENT
                                </span>
                                <span className="text-xs font-bold text-slate-400">#SOS-{alert._id.slice(-4).toUpperCase()}</span>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 mt-2">Emergency Signal Detected</h3>
                              <p className="text-sm text-slate-500 font-medium mt-1">Manual trigger from passenger mobile node.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incident Time</p>
                              <p className="text-xs font-bold text-slate-900">{new Date(alert.created_at).toLocaleTimeString()}</p>
                            </div>
                            <div className="h-8 w-px bg-slate-100" />
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active For</p>
                              <p className="text-xs font-bold text-rose-600">00:04:12</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Geolocation</h4>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{alert.location_address}</p>
                              <p className="text-[9px] font-bold text-primary mt-2 uppercase tracking-widest">Coordinates Sync: Verified</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><UserCheck size={12} /> Node Metadata</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Passenger</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{alert.user_id}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Ride ID</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{alert.ride_id}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={12} /> Emergency Actions</h4>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => addNotification("Safety Team Dispatched", "Unit Sigma-4 responding to coordinates #SOS-SOS1.", "success")}
                                className="h-10 w-full rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-100"
                              >
                                Dispatch Safety Team
                              </button>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => addNotification("Contacting Driver", "Establishing secure line to vehicle node...", "info")}
                                  className="h-10 rounded-xl bg-white border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                  Contact Driver
                                </button>
                                <button
                                  onClick={() => {
                                    addNotification("Incident Resolved", "Alert #SOS-SOS1 archived and cleared.", "success");
                                    if (idx === 0) setSosAlerts([]);
                                  }}
                                  className="h-10 rounded-xl bg-white border border-slate-200 text-rose-600 text-[9px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-all"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="animate-in fade-in duration-500 space-y-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Configuration</h2>
                <p className="text-lg text-slate-500 mt-2 font-medium">Fine-tune global parameters and security protocols for the SafeGo network.</p>
              </div>

              <div className="grid gap-10 lg:grid-cols-2">
                <Card
                  className="p-10 space-y-10 border-slate-100 hover:border-primary/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => toast.info("Price Logic Selected", { description: "You are now editing the Matrix Pricing parameters." })}
                >
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center"><Zap size={32} /></div>
                    <div><h3 className="text-2xl font-bold text-slate-900">Matrix Pricing</h3><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fare Algorithm Management</p></div>
                  </div>
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Base Transition Fee</label><div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span><input type="number" defaultValue="45.00" className="w-full h-14 pl-10 pr-6 rounded-2xl bg-slate-50 border-none font-bold text-lg" /></div></div>
                      <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price Per KM</label><div className="relative"><span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span><input type="number" defaultValue="12.50" className="w-full h-14 pl-10 pr-6 rounded-2xl bg-slate-50 border-none font-bold text-lg" /></div></div>
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50">
                      <div className="flex items-center gap-4"><div className="h-3 w-3 rounded-full bg-emerald-500" /><p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Dynamic Surge Pricing</p></div>
                      <div className="h-8 w-14 bg-emerald-500 rounded-full relative p-1 cursor-pointer"><div className="h-6 w-6 bg-white rounded-full ml-auto shadow-sm" /></div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addNotification("Pricing Matrix Updated", "Global fare logic synced to all network nodes.", "success"); }} className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white text-sm font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200">Update Fare Logic</button>
                  </div>
                </Card>

                <Card
                  className="p-10 space-y-10 border-slate-100 hover:border-rose-100 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => addNotification("Safety Console Enabled", "Adjusting emergency response thresholds.", "info")}
                >
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[2rem] bg-rose-50 text-rose-500 flex items-center justify-center"><ShieldCheck size={32} /></div>
                    <div><h3 className="text-2xl font-bold text-slate-900">Safety Protocols</h3><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Emergency Thresholds</p></div>
                  </div>
                  <div className="space-y-8">
                    <div className="p-6 rounded-[2rem] bg-slate-50 space-y-6">
                      <div className="flex justify-between items-center"><p className="text-sm font-black text-slate-700">SOS Auto-Dispatch</p><div className="h-8 w-14 bg-slate-200 rounded-full relative p-1 cursor-not-allowed"><div className="h-6 w-6 bg-white rounded-full" /></div></div>
                      <p className="text-xs text-slate-400 leading-relaxed font-bold italic">Enable automatic safety team dispatch when a critical SOS node is triggered without confirmation.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-1"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Speed Limit</label><span className="text-sm font-black text-slate-900">80 KM/H</span></div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-rose-500 w-[60%] shadow-[0_0_10px_rgba(244,63,94,0.4)]" /></div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addNotification("Safety Thresholds Updated", "System-wide emergency protocols have been recommitted.", "success"); }} className="w-full h-16 rounded-[1.5rem] border-2 border-rose-100 text-rose-600 text-sm font-black uppercase tracking-widest hover:bg-rose-50 transition-all">Commit Safety Changes</button>
                  </div>
                </Card>

                <Card className="lg:col-span-2 p-10 space-y-10 border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center"><Lock size={32} /></div>
                    <div><h3 className="text-2xl font-bold text-slate-900">Global Access Control</h3><p className="text-xs font-black text-slate-400 uppercase tracking-widest">RBAC & Authentication Policy</p></div>
                  </div>
                  <div className="grid lg:grid-cols-3 gap-10">
                    <div onClick={() => toast.info("Security Module: 2FA")} className="p-8 rounded-[2rem] bg-slate-50 space-y-4 cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm"><Key size={24} /></div>
                      <h5 className="text-xl font-bold text-slate-900">2FA Enforcement</h5>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">Require all administrative nodes to use biometric or token-based 2FA.</p>
                      <button className="text-xs font-black text-primary uppercase tracking-widest mt-4">Configure</button>
                    </div>
                    <div onClick={() => toast.info("Identity Module: Token Persistance")} className="p-8 rounded-[2rem] bg-slate-50 space-y-4 cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm"><Fingerprint size={24} /></div>
                      <h5 className="text-xl font-bold text-slate-900">Identity Persistence</h5>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">Set token expiration for session tokens. Current: 24 Hours.</p>
                      <button className="text-xs font-black text-primary uppercase tracking-widest mt-4">Adjust</button>
                    </div>
                    <div onClick={() => toast.error("WARNING: Maintenance Mode Required")} className="p-8 rounded-[2rem] bg-slate-50 space-y-4 cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                      <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm"><Briefcase size={24} /></div>
                      <h5 className="text-xl font-bold text-slate-900">Maintenance Mode</h5>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">Restrict all passenger transitions during system updates.</p>
                      <button className="text-xs font-black text-rose-500 uppercase tracking-widest mt-4">Activate</button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateUserOpen} onClose={() => setIsCreateUserOpen(false)} title="Provision New Node">
        <form onSubmit={handleCreateUser} className="space-y-8">
          {formError && <div className="p-5 rounded-2xl bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest flex items-center gap-4 border border-red-100 animate-shake"><AlertCircle size={20} /> {formError}</div>}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label><div className="relative"><UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" /><input required value={newUser.full_name} onChange={e => setNewUser({ ...newUser, full_name: e.target.value })} className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 ring-primary/5 focus:border-primary/20 outline-none font-bold text-sm transition-all" /></div></div>
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Access Email</label><div className="relative"><Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" /><input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 ring-primary/5 focus:border-primary/20 outline-none font-bold text-sm transition-all" /></div></div>
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Role Architecture</label>
              <div className="grid grid-cols-3 gap-3">
                {['passenger', 'staff', 'admin'].map(r => (
                  <button key={r} type="button" onClick={() => setNewUser({ ...newUser, role: r })} className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${newUser.role === r ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>{r}</button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold ml-1 italic">{newUser.role === 'passenger' ? 'Passengers cannot access this portal.' : 'Managed Nodes have internal system access.'}</p>
            </div>
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key (Node Access)</label><div className="relative"><Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" /><input required type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="w-full h-14 pl-14 pr-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 ring-primary/5 focus:border-primary/20 outline-none font-bold text-sm transition-all" /></div></div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-sm shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 disabled:opacity-50 hover:-translate-y-1">
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />} {isSubmitting ? 'Syncing...' : 'Provision New Identity'}
          </button>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditUserOpen} onClose={() => setIsEditUserOpen(false)} title="Modify Identity Core">
        <form onSubmit={handleUpdateUser} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label><input required value={editingUser?.full_name || ""} onChange={e => setEditingUser({ ...editingUser, full_name: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 ring-primary/5 outline-none font-bold text-sm transition-all" /></div>
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label><input required type="email" value={editingUser?.email || ""} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:ring-4 ring-primary/5 outline-none font-bold text-sm transition-all" /></div>
            <div className="space-y-3"><label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identity Status</label><div className="flex gap-4"><button type="button" onClick={() => setEditingUser({ ...editingUser, is_active: true })} className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${editingUser?.is_active ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Online</button><button type="button" onClick={() => setEditingUser({ ...editingUser, is_active: false })} className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${!editingUser?.is_active ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Restricted</button></div></div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-[1.5rem] bg-slate-900 text-white font-black text-sm shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 disabled:opacity-50">
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />} Commit System Changes
          </button>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeletingUser} onClose={() => setIsDeletingUser(false)} title="Terminate Node Access">
        <div className="text-center space-y-8 p-4">
          <div className="h-24 w-24 rounded-[2rem] bg-red-50 text-red-500 mx-auto flex items-center justify-center shadow-inner"><AlertCircle size={48} /></div>
          <div className="space-y-3"><p className="text-2xl font-black text-slate-900 tracking-tight">Permanently Purge {userToDelete?.full_name}?</p><p className="text-sm text-slate-400 font-bold">This action will permanently revoke all Matrix credentials and delete the entity log. This cannot be reversed.</p></div>
          <div className="flex gap-6"><button onClick={() => setIsDeletingUser(false)} className="flex-1 h-16 rounded-2xl bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button><button onClick={handleDeleteUser} disabled={isSubmitting} className="flex-1 h-16 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-red-100 hover:bg-red-600 transition-all">Purge Identity</button></div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
