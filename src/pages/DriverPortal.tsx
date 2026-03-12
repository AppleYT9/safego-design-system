import { useState, useEffect } from "react";
import { SafeGoLogo } from "@/components/SafeGoLogo";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard, Car, FileText, DollarSign, Settings, LogOut, Star, Check, Clock,
  AlertCircle, Upload, MapPin, ArrowRight, TrendingUp, TrendingDown, Calendar, ChevronRight,
  User, Phone, Mail, Shield, Bell, Eye, EyeOff, Camera, Pencil, X, Save,
  IndianRupee, Download, Filter, Search, Menu, ChevronDown, ChevronUp,
  Route, Clock3, Fuel, Award, ThumbsUp, Navigation, CircleDot
} from "lucide-react";

// ───────── Types ─────────
type TabKey = "dashboard" | "rides" | "history" | "documents" | "earnings" | "settings";

const navItems: { icon: any; label: string; tab: TabKey }[] = [
  { icon: LayoutDashboard, label: "Dashboard", tab: "dashboard" },
  { icon: Car, label: "Available Rides", tab: "rides" },
  { icon: Clock, label: "My History", tab: "history" },
  { icon: FileText, label: "Documents", tab: "documents" },
  { icon: DollarSign, label: "Earnings", tab: "earnings" },
  { icon: Settings, label: "Settings", tab: "settings" },
];

// ───────── Tab Components ─────────

const DashboardTab = ({ 
  requests, 
  onAccept, 
  onDecline 
}: { 
  requests: any[], 
  onAccept: (id: number, loc: string) => void, 
  onDecline: (id: number) => void 
}) => (
  <div className="space-y-6 animate-in fade-in duration-700">
    {/* Profile header */}
    <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
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
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Today's Rides", value: "12", icon: Car, trend: "+3", up: true },
          { label: "Earnings", value: "₹3,240", icon: IndianRupee, trend: "+18%", up: true },
          { label: "Acceptance", value: "94%", icon: ThumbsUp, trend: "+2%", up: true },
          { label: "Online Hours", value: "6.5h", icon: Clock3, trend: "-0.5h", up: false },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-4 bg-background hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <s.icon size={18} className="text-muted-foreground" />
              <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.trend}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold font-display text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Ride requests */}
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-foreground">Incoming Ride Requests</h3>
          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">{requests.length} pending</span>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {requests.length > 0 ? (
          requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-border p-4 hover:border-primary/30 hover:shadow-sm transition-all group animate-in slide-in-from-top-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Navigation size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold text-foreground">{r.pickup} → {r.dest}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.dist} · Est. {r.fare} · {r.passengers} passenger{r.passengers > 1 ? "s" : ""}</p>
              </div>
              <span className="text-xs text-muted-foreground">{r.time}</span>
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: r.modeBg, color: r.modeColor }}>{r.mode}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => onAccept(r.id, r.dest)}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all active:scale-95"
                >
                  Accept
                </button>
                <button 
                  onClick={() => onDecline(r.id)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-secondary/10 rounded-2xl border border-dashed border-border transition-all animate-in fade-in zoom-in-95">
            <div className="mx-auto w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Car className="text-muted-foreground opacity-50" size={28} />
            </div>
            <h4 className="text-xl font-display font-bold text-foreground">All Cleared!</h4>
            <p className="text-sm text-muted-foreground mt-1 px-4">You've reached the end of the queue. We'll notify you when new ride requests arrive.</p>
            <button className="mt-6 rounded-xl border border-border bg-background px-6 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
              Refresh Queue
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Performance & Activity */}
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Performance</h3>
        <div className="mt-4 space-y-4">
          {[
            { label: "Completion Rate", value: 96, color: "bg-emerald-500" },
            { label: "On-Time Pickup", value: 91, color: "bg-blue-500" },
            { label: "Customer Satisfaction", value: 98, color: "bg-primary" },
            { label: "Safety Score", value: 100, color: "bg-violet-500" },
          ].map((p) => (
            <div key={p.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{p.label}</span>
                <span className="font-semibold text-foreground">{p.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full ${p.color} transition-all duration-1000`} style={{ width: `${p.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-background p-6">
        <h3 className="font-display text-lg font-bold text-foreground">Recent Activity</h3>
        <div className="mt-4 space-y-3">
          {[
            { text: "Completed ride to Makati CBD", time: "2:30 PM", icon: Check, iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
            { text: "Earned ₹30 tip from passenger", time: "2:32 PM", icon: IndianRupee, iconColor: "text-primary", iconBg: "bg-primary/10" },
            { text: "Document approved: Vehicle Reg.", time: "11:00 AM", icon: FileText, iconColor: "text-blue-600", iconBg: "bg-blue-100" },
            { text: "5-star rating received", time: "10:15 AM", icon: Star, iconColor: "text-amber-500", iconBg: "bg-amber-100" },
            { text: "Went online for the day", time: "8:00 AM", icon: CircleDot, iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0 hover:bg-secondary/20 rounded-lg transition-colors px-2 -mx-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${a.iconBg} shrink-0`}>
                <a.icon size={14} className={a.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{a.text}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AvailableRidesTab = ({ 
  available, 
  onAccept 
}: { 
  available: any[], 
  onAccept: (id: number, loc: string) => void 
}) => {
  const [filter, setFilter] = useState<"all" | "nearby" | "surge">("all");
  const filtered = filter === "surge" ? available.filter(r => r.surge > 1) : 
                   filter === "nearby" ? available.filter(r => parseFloat(r.dist) < 4) : 
                   available;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Available Rides</h2>
            <p className="text-sm text-muted-foreground mt-1">Browse and accept new ride requests in your area</p>
          </div>
          <div className="flex items-center gap-2">
            {(["all", "nearby", "surge"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}
              >
                {f === "all" ? "All Rides" : f === "nearby" ? "Nearby" : "Surge ⚡"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length > 0 ? (
          filtered.map((r, i) => (
            <div key={r.id} className="rounded-2xl border border-border bg-background p-5 hover:border-primary/30 hover:shadow-md transition-all group animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Route size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.pickup}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <ArrowRight size={10} /> {r.dest}
                    </div>
                  </div>
                </div>
                {r.surge > 1 && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">⚡ {r.surge}x Surge</span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-secondary/50 p-2 rounded-lg"><MapPin size={12} /> {r.dist}</span>
                <span className="flex items-center gap-1.5 bg-secondary/50 p-2 rounded-lg"><Clock size={12} /> {r.time}</span>
                <span className="flex items-center gap-1.5 bg-secondary/50 p-2 rounded-lg"><User size={12} /> {r.passengers} Passengers</span>
                <span className="flex items-center gap-1.5 bg-secondary/50 p-2 rounded-lg"><Star size={12} className="text-amber-400 fill-amber-400" /> {r.rating} Rider Rating</span>
              </div>
              <div className="mt-4 py-3 border-t border-border/50 flex items-center justify-between">
                <p className="text-lg font-bold font-display text-foreground">{r.fare}</p>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Details</button>
                  <button 
                    onClick={() => onAccept(r.id, r.dest)}
                    className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all active:scale-95 shadow-sm shadow-primary/20"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-24 text-center rounded-2xl border border-dashed border-border bg-background/40">
            <Search className="mx-auto text-muted-foreground/30 mb-4" size={48} />
            <h3 className="text-xl font-display font-bold text-foreground">No matches found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">Try broadening your filters or wait for more riders in your area.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryTab = () => {
  const history = [
    { id: 100, pickup: "BGC High Street", dest: "Makati CBD", fare: "₹185", date: "Mar 12, 2026", time: "2:30 PM", duration: "22 min", rating: 5, status: "completed", tip: "₹30" },
    { id: 101, pickup: "SM Megamall", dest: "Ortigas", fare: "₹120", date: "Mar 12, 2026", time: "1:15 PM", duration: "15 min", rating: 4, status: "completed", tip: "₹0" },
    { id: 102, pickup: "Eastwood", dest: "QC Memorial", fare: "₹95", date: "Mar 12, 2026", time: "11:00 AM", duration: "18 min", rating: 5, status: "completed", tip: "₹20" },
    { id: 103, pickup: "Ayala Center", dest: "BGC", fare: "₹145", date: "Mar 11, 2026", time: "6:45 PM", duration: "25 min", rating: 5, status: "completed", tip: "₹50" },
    { id: 104, pickup: "Mall of Asia", dest: "Pasay", fare: "₹75", date: "Mar 11, 2026", time: "4:00 PM", duration: "12 min", rating: 3, status: "completed", tip: "₹0" },
    { id: 105, pickup: "Trinoma", dest: "Diliman", fare: "₹110", date: "Mar 11, 2026", time: "2:30 PM", duration: "20 min", rating: 0, status: "cancelled", tip: "₹0" },
    { id: 106, pickup: "Robinson's Place", dest: "Ermita", fare: "₹90", date: "Mar 10, 2026", time: "10:00 AM", duration: "14 min", rating: 4, status: "completed", tip: "₹15" },
    { id: 107, pickup: "Glorietta", dest: "Pasig", fare: "₹230", date: "Mar 10, 2026", time: "8:15 AM", duration: "35 min", rating: 5, status: "completed", tip: "₹40" },
  ];

  const completedRides = history.filter(r => r.status === "completed");
  const totalEarnings = completedRides.reduce((sum, r) => sum + parseInt(r.fare.replace("₹", "").replace(",", "")), 0);
  const totalTips = completedRides.reduce((sum, r) => sum + parseInt(r.tip.replace("₹", "").replace(",", "")), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-2xl border border-border bg-background p-6">
        <h2 className="font-display text-xl font-bold text-foreground">Ride History</h2>
        <p className="text-sm text-muted-foreground mt-1">Your complete ride log with earnings and ratings</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-secondary/80 p-4 text-center">
            <p className="text-2xl font-bold font-display text-foreground">{history.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Rides</p>
          </div>
          <div className="rounded-xl bg-secondary/80 p-4 text-center">
            <p className="text-2xl font-bold font-display text-emerald-600">₹{totalEarnings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Fares</p>
          </div>
          <div className="rounded-xl bg-secondary/80 p-4 text-center">
            <p className="text-2xl font-bold font-display text-primary">₹{totalTips}</p>
            <p className="text-xs text-muted-foreground mt-1">Tips Earned</p>
          </div>
          <div className="rounded-xl bg-secondary/80 p-4 text-center">
            <p className="text-2xl font-bold font-display text-foreground">4.9</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-2 border border-border/50">
            <Search size={18} className="text-muted-foreground" />
            <input type="text" placeholder="Search rides by location, date, or amount..." className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="divide-y divide-border">
          {history.map((r, i) => (
            <div key={r.id} className="flex flex-wrap items-center gap-4 p-5 hover:bg-secondary/30 transition-all group animate-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 30}ms` }}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 shadow-sm ${r.status === "completed" ? "bg-emerald-100/50" : "bg-red-50"}`}>
                {r.status === "completed" ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-red-500" />}
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.pickup} → {r.dest}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                   <span className="flex items-center gap-1"><Calendar size={12} /> {r.date}</span>
                   <span className="flex items-center gap-1"><Clock size={12} /> {r.duration}</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-sm font-display font-black text-foreground">{r.fare}</p>
                {r.tip !== "₹0" && <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">+{r.tip} Tip</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${r.status === "completed" ? "bg-emerald-500 text-white" : "bg-red-100 text-red-600"}`}>
                  {r.status === "completed" ? "Success" : "Failed"}
                </span>
                {r.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocumentsTab = () => {
  const [docList] = useState([
    { name: "National ID", status: "Verified", icon: Check, color: "text-emerald-600", bg: "bg-emerald-100", expiry: "No Expiry", uploaded: "Jan 15, 2026" },
    { name: "Driver's License", status: "Verified", icon: Check, color: "text-emerald-600", bg: "bg-emerald-100", expiry: "Dec 2028", uploaded: "Jan 15, 2026" },
    { name: "Vehicle Registration", status: "Pending Review", icon: Clock, color: "text-amber-600", bg: "bg-amber-100", expiry: "Jun 2027", uploaded: "Mar 08, 2026" },
    { name: "NBI Clearance", status: "Upload Required", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", expiry: "—", uploaded: "—" },
    { name: "Vehicle Insurance", status: "Verified", icon: Check, color: "text-emerald-600", bg: "bg-emerald-100", expiry: "Sep 2026", uploaded: "Feb 01, 2026" },
    { name: "Medical Certificate", status: "Expiring Soon", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100", expiry: "Apr 2026", uploaded: "Apr 10, 2025" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Documents & Verification</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your documents to stay compliant and verified</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2">
            <Shield size={16} className="text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">4 of 6 verified</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {docList.map((d, i) => (
          <div key={d.name} className="rounded-2xl border border-border bg-background p-5 hover:shadow-md transition-shadow animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${d.bg}`}>
                  <d.icon size={18} className={d.color} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{d.name}</h4>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Expires: {d.expiry}</p>
                </div>
              </div>
              <span className={`rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${d.bg} ${d.color}`}>{d.status}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Uploaded: {d.uploaded}</span>
              {d.status === "Upload Required" ? (
                <button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all active:scale-95 shadow-sm shadow-primary/20">
                  <Upload size={14} /> Upload Now
                </button>
              ) : d.status === "Expiring Soon" ? (
                <button className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-100 transition-colors border border-amber-200/50">
                  <Upload size={14} /> Re-upload
                </button>
              ) : (
                <button className="flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all border border-border/50">
                  <Eye size={14} /> View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EarningsTab = () => {
  const earningsData = [
    { day: "Mon", amount: 2900, rides: 14 },
    { day: "Tue", amount: 3100, rides: 16 },
    { day: "Wed", amount: 2500, rides: 11 },
    { day: "Thu", amount: 3500, rides: 18 },
    { day: "Fri", amount: 4200, rides: 22 },
    { day: "Sat", amount: 5200, rides: 26 },
    { day: "Sun", amount: 3900, rides: 19 },
  ];

  const totalWeek = earningsData.reduce((s, d) => s + d.amount, 0);
  const totalRides = earningsData.reduce((s, d) => s + d.rides, 0);
  const maxEarning = Math.max(...earningsData.map(d => d.amount));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-2xl border border-border bg-background p-6">
        <h2 className="font-display text-xl font-bold text-foreground">Earnings Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">Track your income and optimize your driving schedule</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "This Week", value: `₹${totalWeek.toLocaleString()}`, trend: "+12.5%", up: true },
            { label: "Total Rides", value: totalRides.toString(), trend: "+8", up: true },
            { label: "Avg per Ride", value: `₹${Math.round(totalWeek / totalRides)}`, trend: "+₹5", up: true },
            { label: "Tips", value: "₹1,240", trend: "+22%", up: true },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-4 bg-background">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold font-display text-foreground mt-1">{s.value}</p>
              <span className={`flex items-center gap-0.5 text-xs font-bold mt-1.5 ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.trend}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
        <div className="flex items-center justify-between mb-12">
          <div>
             <h3 className="font-display text-lg font-bold text-foreground">Weekly Performance</h3>
             <p className="text-xs text-muted-foreground mt-0.5">Daily earnings analysis for current week</p>
          </div>
          <span className="text-xs font-bold text-muted-foreground bg-secondary px-4 py-1.5 rounded-full border border-border/50 shadow-sm">Mar 6 – Mar 12, 2026</span>
        </div>
        
        {/* The Fixed Graph */}
        <div className="h-72 flex items-end justify-between gap-2 sm:gap-4 px-1 sm:px-4 border-b border-border pb-2 relative">
           {/* Grid Lines */}
           <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-t border-dashed border-muted-foreground"></div>
              <div className="w-full border-t border-dashed border-muted-foreground"></div>
              <div className="w-full border-t border-dashed border-muted-foreground"></div>
              <div className="w-full border-t border-dashed border-muted-foreground"></div>
           </div>

          {earningsData.map((d, i) => (
            <div key={d.day} className="flex flex-col items-center flex-1 group relative h-full justify-end">
              {/* Tooltip Label */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[11px] px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-1 whitespace-nowrap z-20 font-bold flex flex-col items-center pointer-events-none mb-2">
                <span>₹{d.amount.toLocaleString()}</span>
                <span className="text-[9px] opacity-70 uppercase tracking-tighter">{d.rides} rides</span>
                <div className="w-2 h-2 bg-foreground rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>
              
              {/* Bar */}
              <div 
                className="w-full max-w-[48px] rounded-t-xl bg-primary relative hover:brightness-110 transition-all transition-height duration-700 cursor-pointer shadow-[0_-4px_12px_rgba(13,148,136,0.15)] ring-1 ring-inset ring-white/10"
                style={{ 
                  height: `${(d.amount / maxEarning) * 100}%`,
                  transitionDelay: `${i * 75}ms`
                }}
              >
                {/* Visual Glass Shine Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 rounded-t-xl" />
              </div>
              
              {/* Bottom Labels */}
              <div className="absolute -bottom-10 flex flex-col items-center pt-2">
                <span className="text-xs font-bold text-foreground">{d.day}</span>
                <span className="text-[9px] text-muted-foreground font-medium uppercase">{d.rides}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-6 border-t border-border flex justify-end">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                 <span className="text-xs font-bold text-muted-foreground">Daily Earnings</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-secondary"></div>
                 <span className="text-xs font-bold text-muted-foreground">Avg. Rider Activity</span>
              </div>
           </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-bold text-foreground">Recent Transactions</h3>
          <button className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all border border-border/50">
            <Download size={14} /> Export All Data
          </button>
        </div>
        <div className="divide-y divide-border">
          {[
            { desc: "Ride Fare – BGC to Makati", amount: "+₹185", type: "credit", time: "2:30 PM Today" },
            { desc: "Tip from Passenger", amount: "+₹30", type: "tip", time: "2:32 PM Today" },
            { desc: "Ride Fare – SM Megamall to Ortigas", amount: "+₹120", type: "credit", time: "1:15 PM Today" },
            { desc: "Platform Commission (15%)", amount: "-₹45.75", type: "debit", time: "1:15 PM Today" },
            { desc: "Weekly Bonus (20+ rides)", amount: "+₹500", type: "bonus", time: "Mon 12:00 AM" },
          ].map((t, i) => (
            <div key={i} className="flex items-center justify-between py-4 group hover:px-2 rounded-xl transition-all">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${t.type === "debit" ? "bg-red-50" : t.type === "bonus" ? "bg-violet-100" : t.type === "tip" ? "bg-amber-100" : "bg-emerald-100"}`}>
                  {t.type === "debit" ? <TrendingDown size={18} className="text-red-500" /> :
                    t.type === "bonus" ? <Award size={18} className="text-violet-600" /> :
                      t.type === "tip" ? <Star size={18} className="text-amber-500 fill-amber-500" /> :
                        <TrendingUp size={18} className="text-emerald-600" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{t.desc}</p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{t.time}</p>
                </div>
              </div>
              <span className={`text-sm font-display font-black tracking-tight ${t.amount.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>{t.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "James",
    lastName: "Dela Cruz",
    email: "james.delacruz@email.com",
    phone: "+63 917 123 4567",
    address: "123 Rizal Ave, Quezon City, Metro Manila",
    vehicleModel: "Toyota Vios 2023",
    plateNumber: "ABC-1234",
    licenseNo: "N01-23-456789",
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    rideAlerts: true,
    earnings: true,
    promotions: false,
    safety: true,
    email: false,
    sms: true,
  });

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setEditing(false);
    toast.success("Settings saved!", {
       description: "Your profile has been updated successfully.",
       position: "bottom-right",
    });
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-2xl border border-border bg-background p-6">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Account Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your driver profile, vehicle details, and security.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-6">
             <div className="relative group">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-display font-black text-primary-foreground shadow-xl shadow-primary/20 ring-4 ring-background">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                {editing && (
                  <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <Camera size={24} className="text-white" />
                  </button>
                )}
             </div>
             <div>
                <h4 className="font-display text-2xl font-black text-foreground">{profile.firstName} {profile.lastName}</h4>
                <div className="mt-1 flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                   <span>ID: DRV-2026-XJ</span>
                   <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">Verified Driver</span>
                </div>
             </div>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:scale-105 transition-all shadow-lg shadow-primary/20">
              <Pencil size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleCancel} className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-secondary transition-all">Cancel</button>
              <button onClick={handleSave} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20">Save Profile</button>
            </div>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {[
            { label: "First Name", key: "firstName", icon: User },
            { label: "Last Name", key: "lastName", icon: User },
            { label: "Primary Email", key: "email", icon: Mail },
            { label: "Mobile Number", key: "phone", icon: Phone },
            { label: "Vehicle Model", key: "vehicleModel", icon: Car },
            { label: "License Plate", key: "plateNumber", icon: FileText },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">{f.label}</label>
              <div className="relative">
                <f.icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                {editing ? (
                  <input
                    type="text"
                    value={tempProfile[f.key as keyof typeof tempProfile]}
                    onChange={(e) => setTempProfile(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background py-4 pl-12 pr-4 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                ) : (
                  <div className="w-full rounded-xl border border-border/50 bg-secondary/20 py-4 pl-12 pr-4 text-sm font-bold text-foreground">
                    {profile[f.key as keyof typeof profile]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
        <h3 className="font-display text-lg font-bold text-foreground mb-8 pb-4 border-b border-border">Preferences</h3>
        <div className="grid gap-6">
          {[
            { key: "rideAlerts", label: "Real-time Ride Alerts", desc: "Receive instant notifications for nearby passengers" },
            { key: "earnings", label: "Earnings Summaries", desc: "Daily performance and payout reports" },
            { key: "promotions", label: "Bonus & Incentives", desc: "Exclusive rewards for high-demand periods" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border/30 group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                    {n.key === "rideAlerts" ? <Bell size={18} className="text-primary" /> : n.key === "earnings" ? <DollarSign size={18} className="text-primary" /> : <Award size={18} className="text-primary" />}
                 </div>
                 <div>
                    <p className="text-sm font-bold text-foreground">{n.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                 </div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifications] }))}
                className={`relative h-7 w-12 rounded-full transition-all duration-300 ring-2 ring-primary/5 ${notifications[n.key as keyof typeof notifications] ? "bg-primary" : "bg-gray-300"}`}
              >
                <div className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${notifications[n.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ───────── Main Component ─────────

const DriverPortal = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for ride requests
  const [requests, setRequests] = useState([
    { id: 1, pickup: "SM Megamall", dest: "Makati CBD", mode: "Pink", modeColor: "#e91e8c", modeBg: "#fce4f1", dist: "8.2 km", fare: "₹195", time: "2 min ago", passengers: 1 },
    { id: 2, pickup: "QC Memorial", dest: "Eastwood", mode: "Normal", modeColor: "#0d9488", modeBg: "#ccfbf1", dist: "5.1 km", fare: "₹142", time: "5 min ago", passengers: 2 },
    { id: 3, pickup: "BGC High Street", dest: "Ortigas Center", mode: "Premium", modeColor: "#7c3aed", modeBg: "#ede9fe", dist: "6.7 km", fare: "₹285", time: "Just now", passengers: 1 },
    { id: 4, pickup: "Mall of Asia", dest: "Pasay CBD", mode: "Pink", modeColor: "#e91e8c", modeBg: "#fce4f1", dist: "3.4 km", fare: "₹98", time: "1 min ago", passengers: 3 },
  ]);

  const [availableRides, setAvailableRides] = useState([
    { id: 10, pickup: "Ayala Triangle", dest: "Greenhills", dist: "7.3 km", fare: "₹210", time: "3 min ago", surge: 1.2, passengers: 1, rating: 4.8 },
    { id: 11, pickup: "Bonifacio Stopover", dest: "Mandaluyong", dist: "4.5 km", fare: "₹130", time: "1 min ago", surge: 1.0, passengers: 2, rating: 4.5 },
    { id: 12, pickup: "Eastwood City", dest: "Cubao", dist: "3.2 km", fare: "₹95", time: "Just now", surge: 1.5, passengers: 1, rating: 4.9 },
    { id: 13, pickup: "Robinsons Galleria", dest: "Makati Ave", dist: "5.8 km", fare: "₹175", time: "4 min ago", surge: 1.0, passengers: 1, rating: 4.7 },
  ]);

  const handleAcceptRide = (id: number, dest: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setAvailableRides(prev => prev.filter(r => r.id !== id));
    toast.success(`Ride to ${dest} accepted!`, {
      description: "Routing to passenger pickup location...",
      style: { background: "hsl(var(--primary))", color: "white", borderRadius: "16px", border: "none" },
      icon: <Navigation size={18} className="text-white animate-pulse" />
    });
  };

  const handleDeclineRide = (id: number) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    setAvailableRides(prev => prev.filter(r => r.id !== id));
    toast.error("Request Declined", {
      description: "You won't see this specific request again.",
      style: { borderRadius: "16px" }
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab requests={requests} onAccept={handleAcceptRide} onDecline={handleDeclineRide} />;
      case "rides": return <AvailableRidesTab available={availableRides} onAccept={handleAcceptRide} />;
      case "history": return <HistoryTab />;
      case "documents": return <DocumentsTab />;
      case "earnings": return <EarningsTab />;
      case "settings": return <SettingsTab />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary/30 selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-border bg-background lg:flex sticky top-0 h-screen">
        <div className="p-6">
          <SafeGoLogo size={24} className="px-2" />
        </div>
        <nav className="mt-4 flex flex-col gap-1.5 px-4 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[13px] font-bold tracking-tight transition-all text-left w-full group ${
                activeTab === item.tab
                  ? "bg-primary text-white shadow-xl shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon size={20} className={activeTab === item.tab ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors"} /> 
              {item.label}
              {activeTab === item.tab && <ChevronRight size={16} className="ml-auto opacity-70" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all w-full text-left"
          >
            <LogOut size={20} /> Logout Account
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 lg:hidden">
        <SafeGoLogo size={22} />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-xl p-2.5 bg-secondary/50 border border-border/50 text-foreground shadow-sm">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[300px] bg-background p-6 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
               <SafeGoLogo size={22} />
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full bg-secondary">
                  <X size={20} />
               </button>
            </div>
            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActiveTab(item.tab); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all text-left w-full ${
                    activeTab === item.tab
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon size={20} /> {item.label}
                </button>
              ))}
            </nav>
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="flex items-center gap-4 rounded-2xl px-5 py-5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors mt-auto border-t border-border pt-6 text-left w-full"
            >
              <LogOut size={20} /> Logout Account
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-transparent p-4 pt-24 lg:p-10 lg:pt-8">
        <div className="max-w-6xl mx-auto">
           {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};

export default DriverPortal;
