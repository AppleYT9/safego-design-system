import { SafeGoLogo } from "@/components/SafeGoLogo";
import { StatsCard } from "@/components/StatsCard";
import { modes } from "@/config/modeConfig";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, Car, Shield, Users as UsersIcon, Settings, LogOut,
  Star, TrendingUp, ArrowRight, User, Lock, Bell, Moon, MapPin,
  Accessibility, Mic, Check
} from "lucide-react";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

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
  "In Progress": "bg-amber-500/10 text-amber-500",
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const [myRides, setMyRides] = useState(rides);

  const [contacts, setContacts] = useState([
    { name: "Jane Smith", relation: "Sister", phone: "+63 912 345 6789", isEmergency: true },
    { name: "Robert Doe", relation: "Father", phone: "+63 998 765 4321", isEmergency: false }
  ]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "", isEmergency: false });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    if (editIndex !== null) {
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = newContact;
      setContacts(updatedContacts);
    } else {
      setContacts([newContact, ...contacts]);
    }

    setNewContact({ name: "", relation: "", phone: "", isEmergency: false });
    setShowContactForm(false);
    setEditIndex(null);
  };

  const handleEditContact = (index: number) => {
    setNewContact(contacts[index]);
    setEditIndex(index);
    setShowContactForm(true);
  };

  useEffect(() => {
    const saved = localStorage.getItem("safego_rides");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMyRides([...parsed, ...rides]);
      } catch (e) {
        console.error("Failed to parse rides");
      }
    }
  }, []);

  const [profile, setProfile] = useState({
    name: "John Doe",
    phone: "+63 912 345 6789",
    email: "john.doe@example.com"
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("safego_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse profile");
      }
    }
  }, []);

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => {
      localStorage.setItem("safego_profile", JSON.stringify(profile));
      setIsSavingProfile(false);
      toast.success("Profile updated successfully!");
    }, 500);
  };

  const { setVoiceEnabled } = useVoiceAssistant();

  const handleEnablePWD = () => {
    setVoiceEnabled(true);
    navigate("/pwd-mode");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-background p-4 lg:flex">
        <SafeGoLogo size={22} className="px-2" />
        <div className="mt-6 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'JD'}
          </div>
          <div>
            <p className="font-display text-sm font-bold">Good morning, {profile.name.split(' ')[0] || 'User'}</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Passenger</span>
          </div>
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === item.label
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-border/50">
          <Link to="/home" className="flex items-center justify-center gap-3 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] px-3 py-3 text-sm font-bold text-white transition-all shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-[0.97]">
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-secondary p-6 lg:p-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-display font-bold text-foreground">{activeTab}</h2>
          <p className="text-sm text-muted-foreground">March 8, 2025</p>
        </div>

        {activeTab === "Dashboard" && (
          <>
            {/* Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard icon={Car} value={myRides.length.toString()} label="Total Rides" />
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
                    {myRides.map((r, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-secondary" : ""} hover:bg-primary/5 transition-colors`}>
                        <td className="px-4 py-3 text-muted-foreground">{myRides.length - i}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-secondary text-foreground">{r.mode}</span>
                        </td>
                        <td className="px-4 py-3 text-foreground">{r.route}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.date || "Today"}</td>
                        <td className="px-4 py-3 text-foreground">{r.driver}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {r.rating > 0 ? <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div> : <span className="text-xs text-muted-foreground">None</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab Specific Views */}
        {activeTab === "My Rides" && (
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Ride History</h3>
            <div className="overflow-x-auto rounded-2xl border border-border bg-background shadow-sm">
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
                  {myRides.map((r, i) => (
                    <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-secondary" : ""} hover:bg-primary/5 transition-colors`}>
                      <td className="px-4 py-3 text-muted-foreground">{myRides.length - i}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-secondary text-foreground">{r.mode}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{r.route}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.date || "Today"}</td>
                      <td className="px-4 py-3 text-foreground">{r.driver}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {r.rating > 0 ? <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div> : <span className="text-xs text-muted-foreground">None</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Safety Reports" && (
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Safety Operations Log</h3>
            <div className="grid gap-4">
              {[
                { id: "REP-0824", date: "Mar 8, 2025", type: "Route Deviation Alert", status: "Resolved", details: "Driver took an unmapped alternative route. SafeGo AI confirmed it was due to heavy traffic. Passenger arrived safely." },
                { id: "REP-0811", date: "Mar 5, 2025", type: "SOS Setup Test", status: "Verified", details: "User successfully configured and tested the auto-SOS function for Pink Mode." }
              ].map(report => (
                <div key={report.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-teal-500" />
                      <span className="font-semibold text-foreground">{report.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                  <p className="text-sm text-foreground mb-3">{report.details}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">ID: {report.id}</span>
                    <span className="rounded-full bg-teal-500/10 text-teal-600 px-2.5 py-1 text-xs font-medium">{report.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Emergency Contacts" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Trusted Contacts</h3>
              <button
                onClick={() => {
                  if (showContactForm) {
                    setShowContactForm(false);
                    setEditIndex(null);
                    setNewContact({ name: "", relation: "", phone: "", isEmergency: false });
                  } else {
                    setShowContactForm(true);
                  }
                }}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 transition-all"
              >
                {showContactForm ? "Cancel" : "Add Contact"}
              </button>
            </div>

            {showContactForm && (
              <form onSubmit={handleAddContact} className="mb-6 rounded-2xl border border-border bg-background p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
                <h4 className="font-semibold text-foreground mb-4">{editIndex !== null ? "Edit Contact" : "New Contact Form"}</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    value={newContact.name}
                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Full Name"
                    className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <input
                    required
                    type="tel"
                    value={newContact.phone}
                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Phone Number"
                    className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={newContact.relation}
                    onChange={e => setNewContact({ ...newContact, relation: e.target.value })}
                    placeholder="Relation (e.g., Mother, Boss)"
                    className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  />
                  <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 hover:bg-secondary cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={newContact.isEmergency}
                      onChange={e => setNewContact({ ...newContact, isEmergency: e.target.checked })}
                      className="h-4 w-4 rounded border-border text-pink-500 focus:ring-pink-500 accent-pink-500"
                    />
                    <span className="text-sm font-medium text-foreground">Set as Primary SOS</span>
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="submit" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all">
                    {editIndex !== null ? "Update Contact" : "Save Contact"}
                  </button>
                </div>
              </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {contacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-background p-5 shadow-sm">
                  <div>
                    <h4 className="font-semibold text-foreground">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{contact.relation} • {contact.phone}</p>
                    {contact.isEmergency && <span className="inline-block rounded-full bg-pink-500/10 text-pink-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Primary SOS</span>}
                  </div>
                  <button onClick={() => handleEditContact(i)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="mt-6 max-w-4xl">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Account Settings</h3>

            <div className="flex flex-col gap-8">
              {/* Profile Settings */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <User size={20} className="text-primary" /> Profile Info
                  </h4>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
                <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6 border-b border-border pb-6">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
                      {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'JD'}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground text-lg">{profile.name || 'User'}</h5>
                      <p className="text-sm text-muted-foreground">Passenger Account</p>
                    </div>
                    <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition-colors">Change Photo</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Full Name</label>
                      <input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Phone Number</label>
                      <input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Email Address</label>
                      <input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Password & Security */}
              <section>
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                  <Lock size={20} className="text-primary" /> Password & Security
                </h4>
                <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden divide-y divide-border">
                  <div className="p-5 flex justify-between items-center hover:bg-secondary/50 transition-colors">
                    <div>
                      <h5 className="font-semibold text-foreground">Change Password</h5>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <button className="text-sm font-semibold text-primary hover:underline">Update</button>
                  </div>
                  <div className="p-5 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center hover:bg-secondary/50 transition-colors">
                    <div>
                      <h5 className="font-semibold text-foreground">Two-Factor Authentication</h5>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="p-5 flex justify-between items-center hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div>
                      <h5 className="font-semibold text-foreground">Login Activity</h5>
                      <p className="text-sm text-muted-foreground">Review devices signed into this account</p>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </section>

              {/* Safety Preferences */}
              <section>
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                  <Shield size={20} className="text-teal-500" /> Safety Preferences
                </h4>
                <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden divide-y divide-border">
                  {[
                    { title: "Automatic SOS Detection", desc: "AI will analyze sudden stops or deviations to trigger emergency protocols.", defaultOn: true },
                    { title: "Live Ride Sharing", desc: "Automatically share journey link with emergency contacts when ride begins.", defaultOn: true },
                    { title: "In-Ride Safety Alerts", desc: "Receive notifications about route risks or severe weather changes.", defaultOn: false }
                  ].map((pref, i) => (
                    <div key={i} className="p-5 flex justify-between items-center hover:bg-secondary/50 transition-colors">
                      <div className="pr-4">
                        <h5 className="font-semibold text-foreground">{pref.title}</h5>
                        <p className="text-sm text-muted-foreground">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked={pref.defaultOn} className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ride Preferences */}
              <section>
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                  <Car size={20} className="text-primary" /> Default Ride Preferences
                </h4>
                <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Default Ride Mode</label>
                      <select className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary">
                        <option value="normal">Normal Mode</option>
                        <option value="pink">Pink Mode</option>
                        <option value="pwd">PWD Mode</option>
                        <option value="elderly">Elderly Mode</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Driver Preference (Pink Mode)</label>
                      <select className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none focus:border-primary">
                        <option>Female Driver Required</option>
                        <option>Female Driver Preferred</option>
                        <option>No Preference</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary" />
                      <span className="text-sm font-medium text-foreground">Opt-in for driver assistance (boarding/exiting)</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section>
                <h4 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                  <Bell size={20} className="text-primary" /> Notifications
                </h4>
                <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden divide-y divide-border">
                  {[
                    { title: "Ride Updates", desc: "Driver arrival, ETAs, and trip changes" },
                    { title: "Safety Alerts", desc: "System SOS states and safety scores" },
                    { title: "Promotions & Offers", desc: "Discounts and SafeGo news" },
                    { title: "SMS Alerts", desc: "Receive critical updates via text message" }
                  ].map((notif, i) => (
                    <div key={i} className="p-5 flex justify-between items-center hover:bg-secondary/50 transition-colors">
                      <div>
                        <h5 className="font-semibold text-foreground">{notif.title}</h5>
                        <p className="text-sm text-muted-foreground">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              {/* App Preferences */}
              <section className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                    <Moon size={20} className="text-primary" /> App Settings
                  </h4>
                  <div className="rounded-2xl border border-border bg-background shadow-sm p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Language</span>
                      <select className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm outline-none">
                        <option>English</option>
                        <option>Tagalog</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Theme</span>
                      <select className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm outline-none">
                        <option>System Default</option>
                        <option>Light</option>
                        <option>Dark</option>
                      </select>
                    </div>
                    <label className="flex items-center justify-between pt-2 border-t border-border mt-2">
                      <span className="text-sm font-semibold text-foreground">High Contrast Text</span>
                      <input type="checkbox" className="h-4 w-4 rounded border-border text-primary accent-primary" />
                    </label>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                    <MapPin size={20} className="text-primary" /> Privacy
                  </h4>
                  <div className="rounded-2xl border border-border bg-background shadow-sm divide-y divide-border">
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Location Tracking</span>
                      <select className="rounded-lg border border-border bg-secondary px-3 py-1 text-xs outline-none max-w-[120px]">
                        <option>While Using App</option>
                        <option>Always</option>
                        <option>Never</option>
                      </select>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground">Anonymous Analytics</span>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Actions */}
              <section className="mt-4 pt-8 border-t border-border">
                <h4 className="text-lg font-bold text-destructive mb-4">Danger Zone</h4>
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="font-semibold text-foreground">Delete Account</h5>
                    <p className="text-sm text-muted-foreground">Permanently delete your personal data, rides, and SOS contacts.</p>
                  </div>
                  <button className="rounded-xl bg-destructive px-6 py-2.5 text-sm font-bold text-destructive-foreground hover:brightness-110 shrink-0">Delete Account</button>
                </div>
              </section>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
