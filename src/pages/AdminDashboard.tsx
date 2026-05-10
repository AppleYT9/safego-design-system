import { SafeGoLogo } from "@/components/SafeGoLogo";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Car, MapPin, Settings, LogOut,
  Check, X, Bell, Navigation, Search, MoreVertical, ShieldAlert, Map, 
  Download, FileText, Star, Activity, UserCheck, ShieldCheck, Layers, 
  ArrowUpRight, ChevronRight, Zap, Edit2, Trash2, UserPlus, Save, AlertCircle,
  BarChart3, PieChart as PieChartIcon, History, Shield, Info, Globe, 
  Lock, Mail, Phone, User as UserIcon, Loader2, Wifi, WifiOff, Database
} from "lucide-react";
import {
  XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, YAxis
} from "recharts";

type AdminTab = "dashboard" | "users" | "drivers" | "live-rides" | "alerts" | "settings";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const navGroups = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Intelligence", id: "dashboard" as AdminTab },
      { icon: MapPin, label: "Live Matrix", id: "live-rides" as AdminTab },
    ]
  },
  {
    label: "Management",
    items: [
      { icon: Users, label: "Identity Hub", id: "users" as AdminTab },
      { icon: Car, label: "Fleet Assets", id: "drivers" as AdminTab },
    ]
  },
  {
    label: "Security",
    items: [
      { icon: ShieldAlert, label: "Safety Log", id: "alerts" as AdminTab },
      { icon: Settings, label: "Core System", id: "settings" as AdminTab },
    ]
  }
];

// --- PREMIUM SaaS UI COMPONENTS ---

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isBackendAlive, setIsBackendAlive] = useState<boolean | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
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
    position: "Staff", department: "Operations", gender: "other",
    is_active: true, is_verified: true
  });

  const navigate = useNavigate();

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      setIsBackendAlive(res.ok);
    } catch (err) {
      setIsBackendAlive(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, { 
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } 
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {}
  };

  const fetchUsers = async () => {
    setIsSearching(true);
    try {
      const q = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : "";
      const res = await fetch(`${API_URL}/api/admin/users${q}`, { 
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } 
      });
      if (res.ok) setUsersList(await res.json());
    } catch (err) {} finally {
      setIsSearching(false);
    }
  };

  // INSTANT SEARCH EFFECT
  useEffect(() => {
    if (activeTab === "users") {
      const delayDebounceFn = setTimeout(() => {
        fetchUsers();
      }, 300); // 300ms debounce for "on spot" feel
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setNewUser({ full_name: "", email: "", phone: "", password: "", role: "passenger", position: "Staff", department: "Operations", gender: "other", is_active: true, is_verified: true });
        fetchUsers();
        fetchStats();
      } else {
        setFormError(data.detail || "System rejected identity deployment.");
      }
    } catch (err) {
      setFormError("CONNECTION ERROR: Verify MongoDB and Terminal are active.");
    } finally {
      setIsSubmitting(false);
    }
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
    } catch (err) {} finally { setIsSubmitting(false); }
  };

  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { setIsDeletingUser(false); fetchUsers(); fetchStats(); }
    } catch (err) {} finally { setIsSubmitting(false); }
  };

  useEffect(() => {
    checkHealth();
    fetchStats();
    if (activeTab === "users") fetchUsers();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* SaaS SIDEBAR */}
      <aside className="w-[280px] shrink-0 bg-white border-r border-slate-200 flex flex-col p-6 overflow-y-auto">
        <div className="mb-10 px-4 flex items-center gap-3"><SafeGoLogo size={32} className="[&_span]:text-xl [&_span]:font-black" /></div>
        <div className="flex-1 space-y-10">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <h4 className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-400">{group.label}</h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-semibold ${activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}><item.icon size={20} />{item.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className="px-4 py-3 rounded-2xl bg-slate-50 space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Node Status</span><div className={`h-2.5 w-2.5 rounded-full ${isBackendAlive === true ? 'bg-emerald-500 animate-pulse' : isBackendAlive === false ? 'bg-red-500' : 'bg-slate-300'}`} /></div>
              <div className="flex items-center gap-2">{isBackendAlive === true ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-red-500" />}<span className={`text-[11px] font-bold ${isBackendAlive === true ? 'text-emerald-600' : 'text-red-600'}`}>{isBackendAlive === true ? 'Core Synced' : 'Disconnected'}</span></div>
           </div>
           <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="mt-4 w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-semibold"><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-6"><h2 className="text-xl font-display font-bold text-slate-900 capitalize">{activeTab.replace("-", " ")}</h2><div className="h-6 w-px bg-slate-100" /><div className="text-[11px] font-black uppercase tracking-widest text-slate-400">SafeGo Console v4.5</div></div>
           <div className="flex items-center gap-6"><div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Global Search Registry..." className="h-12 w-64 bg-slate-50 rounded-xl pl-12 pr-4 text-xs font-bold outline-none focus:bg-white focus:ring-2 ring-primary/10 transition-all" /></div><button className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 relative"><Bell size={20} /></button><div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm">A</div></div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">
           {activeTab === "dashboard" && (
             <div className="space-y-10 animate-in fade-in duration-700">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                   {[
                     { label: "Identities", val: stats?.total_users, icon: Users, color: "text-primary", bg: "bg-primary/5" },
                     { label: "Fleet Hub", val: stats?.total_drivers, icon: Car, color: "text-blue-500", bg: "bg-blue-50" },
                     { label: "Active Ops", val: stats?.active_rides, icon: Navigation, color: "text-amber-500", bg: "bg-amber-50" },
                     { label: "SOS Alerts", val: stats?.active_sos_alerts, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50" }
                   ].map((s, i) => (
                     <Card key={i} className="flex flex-col gap-4"><div className={`h-12 w-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}><s.icon size={24} /></div><div><p className="text-3xl font-display font-bold text-slate-900">{s.val?.toLocaleString() || "0"}</p><p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.label}</p></div></Card>
                   ))}
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                   <Card><h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><History size={20} className="text-primary" /> Performance Matrix</h3><div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{n:'01',v:400},{n:'02',v:700},{n:'03',v:450},{n:'04',v:900},{n:'05',v:650}]}><defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#p)" /></AreaChart></ResponsiveContainer></div></Card>
                   <Card><h3 className="text-lg font-bold text-slate-900 mb-6">Fleet Utilization</h3><div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{n:'Normal',v:420},{n:'Pink',v:310},{n:'PWD',v:180},{n:'Elderly',v:240}]}><Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
                </div>
             </div>
           )}

           {activeTab === "users" && (
             <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex justify-between items-center">
                   <div><h2 className="text-2xl font-display font-bold text-slate-900">Identity Management</h2><p className="text-sm text-slate-400 mt-1">Manage global identity registry and access layers.</p></div>
                   <button onClick={() => { setFormError(null); setIsCreateUserOpen(true); }} className="h-12 px-6 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-primary/20"><UserPlus size={16} /> Create User</button>
                </div>
                <Card noPadding className="overflow-hidden">
                   <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                      <div className="relative">
                        <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isSearching ? 'text-primary' : 'text-slate-300'}`} />
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Identities..." className="h-10 w-80 bg-white border border-slate-100 rounded-lg pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 ring-primary/10 transition-all" />
                        {isSearching && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 size={14} className="animate-spin text-primary" /></div>}
                      </div>
                   </div>
                   <table className="w-full text-left"><thead><tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50"><th className="px-8 py-5">Profile</th><th className="px-8 py-5">Access Layer</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-50">
                      {usersList.length > 0 ? usersList.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50/30 transition-colors group"><td className="px-8 py-5"><div className="flex items-center gap-4"><div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-primary">{u.full_name?.[0]}</div><div><p className="text-sm font-bold text-slate-900">{u.full_name}</p><p className="text-[11px] text-slate-400 font-bold">{u.email}</p></div></div></td><td className="px-8 py-5"><span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>{u.role}</span></td><td className="px-8 py-5"><div className="flex items-center gap-3"><div className={`h-2.5 w-2.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`} /><span className="text-[11px] font-bold">{u.is_active ? 'Active' : 'Locked'}</span></div></td><td className="px-8 py-5 text-right"><div className="flex justify-end gap-3"><button onClick={() => { setEditingUser(u); setIsEditUserOpen(true); }} className="h-10 w-10 flex items-center justify-center bg-white hover:bg-primary/10 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm border border-slate-100"><Edit2 size={16} /></button><button onClick={() => { setUserToDelete(u); setIsDeletingUser(true); }} className="h-10 w-10 flex items-center justify-center bg-white hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm border border-slate-100"><Trash2 size={16} /></button></div></td></tr>
                      )) : (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold text-sm">No identities found matching "{searchQuery}"</td></tr>
                      )}
                   </tbody></table>
                </Card>
             </div>
           )}
        </main>
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateUserOpen} onClose={() => setIsCreateUserOpen(false)} title="Provision New Node">
         <form onSubmit={handleCreateUser} className="space-y-6">
            {formError && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100 animate-in slide-in-from-top-2"><AlertCircle size={16} /> {formError}</div>}
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Full Name</label><div className="relative"><UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all" /></div></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Email</label><div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all" /></div></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Phone</label><div className="relative"><Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all" /></div></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Secret Key</label><div className="relative"><Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all" /></div></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Role Layer</label><select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all appearance-none cursor-pointer"><option value="passenger">Passenger (User)</option><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Gender</label><select value={newUser.gender} onChange={e => setNewUser({...newUser, gender: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all appearance-none cursor-pointer"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Deploy Identity
            </button>
         </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditUserOpen} onClose={() => setIsEditUserOpen(false)} title="Update Identity Node">
         <form onSubmit={handleUpdateUser} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Full Name</label><input required value={editingUser?.full_name || ""} onChange={e => setEditingUser({...editingUser, full_name: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all" /></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Email</label><input required type="email" value={editingUser?.email || ""} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:ring-2 ring-primary/10 outline-none font-bold text-sm transition-all" /></div>
               <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Status</label><div className="flex gap-4"><button type="button" onClick={() => setEditingUser({...editingUser, is_active: true})} className={`flex-1 h-12 rounded-xl font-bold text-xs transition-all ${editingUser?.is_active ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>Active</button><button type="button" onClick={() => setEditingUser({...editingUser, is_active: false})} className={`flex-1 h-12 rounded-xl font-bold text-xs transition-all ${!editingUser?.is_active ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-400'}`}>Locked</button></div></div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Commit Changes
            </button>
         </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeletingUser} onClose={() => setIsDeletingUser(false)} title="De-provision Account">
         <div className="text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-red-50 text-red-500 mx-auto flex items-center justify-center"><AlertCircle size={40} /></div>
            <p className="text-lg font-bold text-slate-900">Permanently delete {userToDelete?.full_name}?</p>
            <div className="flex gap-4"><button onClick={() => setIsDeletingUser(false)} className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-900 font-bold text-sm">Cancel</button><button onClick={handleDeleteUser} disabled={isSubmitting} className="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-100 disabled:opacity-50">Delete Identity</button></div>
         </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
