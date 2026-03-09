import { useParams, Link } from "react-router-dom";
import { getModeConfig, modes } from "@/config/modeConfig";
import type { RideMode } from "@/config/modeConfig";
import { Navbar } from "@/components/Navbar";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { SafetyScoreBar } from "@/components/SafetyScoreBar";
import { ArrowLeft, ArrowUpDown, Star, MessageCircle } from "lucide-react";
import { useState } from "react";

const BookingPage = () => {
  const { mode: modeId } = useParams<{ mode: string }>();
  const mode = getModeConfig((modeId as RideMode) || "normal");
  const [routeFound, setRouteFound] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full overflow-y-auto border-r border-border bg-background p-6 lg:w-[42%]">
          <div className="flex items-center gap-3">
            <Link to="/home" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: mode.lightBg, color: mode.accent }}>
              <mode.icon className="inline mr-1" size={12} /> {mode.name}
            </span>
          </div>

          <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Book Your Ride</h2>

          <div className="mt-6 rounded-2xl border border-border p-5">
            <div className="flex flex-col gap-0">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <input className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Pickup location" />
              </div>
              <div className="ml-1.5 h-6 border-l border-dashed border-border" />
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <input className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Destination" />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <input type="date" className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none" />
              <input type="time" className="flex-1 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm outline-none" />
            </div>
            <button
              onClick={() => setRouteFound(true)}
              className="mt-4 w-full rounded-xl py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              style={{ backgroundColor: mode.accent }}
            >
              Find Safest Route
            </button>
          </div>

          {routeFound && (
            <>
              {/* Route result */}
              <div className="mt-4 rounded-2xl border p-4 animate-fade-in" style={{ backgroundColor: mode.lightBg, borderColor: `${mode.accent}33` }}>
                <p className="text-sm font-semibold text-foreground">✨ Route Analysis Complete</p>
                <div className="mt-3">
                  <SafetyScoreBar score={94} color={mode.accent} />
                </div>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>12.4 km</span><span>~25 min</span><span>₱284</span>
                </div>
              </div>

              {/* Driver card */}
              <div className="mt-4 rounded-2xl border border-border p-5">
                <div className="flex items-center gap-1 text-sm text-primary font-medium">
                  <div className="h-2 w-2 rounded-full bg-primary" /> Driver Assigned
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-primary-foreground" style={{ backgroundColor: mode.accent }}>JD</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">James D.</p>
                    <p className="text-xs text-muted-foreground"><Star size={10} className="inline fill-amber-400 text-amber-400" /> 4.9 · Toyota Vios · ABC 123</p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">ETA 4 min</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
                    <MessageCircle size={14} className="inline mr-1" /> Message
                  </button>
                  <button
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                    style={{ backgroundColor: mode.accent }}
                  >
                    Confirm Ride
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right map */}
        <div className="hidden flex-1 lg:block">
          <MapPlaceholder />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
