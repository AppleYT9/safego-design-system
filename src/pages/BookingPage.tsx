import { useParams, Link } from "react-router-dom";
import { getModeConfig, modes } from "@/config/modeConfig";
import type { RideMode } from "@/config/modeConfig";
import { Navbar } from "@/components/Navbar";
import { SafetyScoreBar } from "@/components/SafetyScoreBar";
import {
  ArrowLeft, Star, MessageCircle, Shield, Loader2, CheckCircle2,
  MapPin, Navigation, Car, AlertCircle, Locate, Send, X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Simulated nearby cabs ───────────────────────────────────────────────────
const generateNearbyCabs = (lat: number, lng: number) =>
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    lat: lat + (Math.random() - 0.5) * 0.012,
    lng: lng + (Math.random() - 0.5) * 0.012,
    name: ["James D.", "Sarah M.", "Alex J.", "Maria C.", "Robert P.", "Joyce T."][i],
    rating: (Math.random() * 0.3 + 4.7).toFixed(1),
    eta: Math.floor(Math.random() * 6 + 1),
  }));

// ─── Leaflet Map Panel (no API key) ─────────────────────────────────────────
declare global { interface Window { L: any } }

const MapPanel = ({ accent, centerLoc, triggerRoute, onRouteExtracted, onCabSelect }: { accent: string, centerLoc: { lat: number, lng: number } | null, triggerRoute: { from: string, to: string } | null, onRouteExtracted?: (dist: number, cabs: any) => void, onCabSelect?: (cab: any) => void }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [cabs, setCabs] = useState<any[]>([]);
  const [locating, setLocating] = useState(true);
  const [locError, setLocError] = useState(false);
  const [selectedCab, setSelectedCab] = useState<number | null>(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = (lat: number, lng: number, isError: boolean) => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const L = window.L;
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([lat, lng], 15);
      mapInstanceRef.current = map;

      // Add zoom control bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Satellite tiles (ESRI World Imagery)
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        maxZoom: 18,
      }).addTo(map);

      // ── Pulsing "You are here" marker ──
      const pulseHtml = `
        <div style="position:relative;width:22px;height:22px;">
          <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(59,130,246,0.2);animation:pulse-ring 1.5s ease-out infinite;"></div>
          <div style="position:absolute;inset:-4px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulse-ring 1.5s ease-out 0.3s infinite;"></div>
          <div style="width:22px;height:22px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.6);"></div>
        </div>
        <style>
          @keyframes pulse-ring {
            0%   { transform:scale(1); opacity:0.8; }
            100% { transform:scale(2.5); opacity:0; }
          }
        </style>
      `;
      const youIcon = L.divIcon({ html: pulseHtml, className: "", iconSize: [22, 22], iconAnchor: [11, 11] });
      const youMarker = L.marker([lat, lng], { icon: youIcon }).addTo(map);
      youMarker.bindPopup("<b>📍 You are here</b>", { closeButton: false });

      // Accuracy circle
      L.circle([lat, lng], { radius: 60, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1.5, dashArray: "5 5" }).addTo(map);

      // ── Cab markers ──
      const cabData = generateNearbyCabs(lat, lng);
      setCabs(cabData);

      cabData.forEach((cab) => {
        const cabHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
            <div style="background:${accent};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);">
              ${cab.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div style="background:hsl(var(--card));border-radius:6px;padding:1px 5px;font-size:9px;font-weight:700;color:hsl(var(--card-foreground));margin-top:2px;box-shadow:0 1px 4px rgba(0,0,0,0.15);white-space:nowrap;">
              ${cab.eta} min
            </div>
            <div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:6px solid white;margin-top:-1px;"></div>
          </div>
        `;
        const cabIcon = L.divIcon({ html: cabHtml, className: "", iconSize: [36, 52], iconAnchor: [18, 52] });
        L.marker([cab.lat, cab.lng], { icon: cabIcon })
          .addTo(map)
          .bindPopup(`<b>${cab.name}</b><br>⭐ ${cab.rating} &nbsp;·&nbsp; ETA ${cab.eta} min`, { closeButton: false });
      });

      setLocating(false);
      if (isError) setLocError(true);
    };

    const loadLeaflet = () => {
      if (window.L) {
        // Already loaded — get location
        getLocation();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => getLocation();
      document.head.appendChild(script);
    };

    const getLocation = () => {
      // Keep trying to locate
      navigator.geolocation?.getCurrentPosition(
        (pos) => initMap(pos.coords.latitude, pos.coords.longitude, false),
        (err) => {
          console.warn("Geolocation error:", err);
          // Fallback to initial default (Vadodara) or just use standard Manila if totally blocked
          initMap(22.3, 73.19, true);
        },
        { timeout: 15000, maximumAge: 0, enableHighAccuracy: true }
      );
    };

    loadLeaflet();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [accent]);

  // Handle routing when user clicks "Find Safest Route"
  useEffect(() => {
    if (!triggerRoute || !mapInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    (async () => {
      try {
        // Simple Nominatim fetch for the 2 text addresses
        const [resfrom, resto] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(triggerRoute.from)}`),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(triggerRoute.to)}`)
        ]);
        const dataFrom = await resfrom.json();
        const dataTo = await resto.json();

        let ptFrom = centerLoc || { lat: 14.5995, lng: 120.9842 };
        let ptTo = { lat: ptFrom.lat + 0.05, lng: ptFrom.lng + 0.05 }; // fallback dummy dest offset

        if (dataFrom && dataFrom[0]) ptFrom = { lat: parseFloat(dataFrom[0].lat), lng: parseFloat(dataFrom[0].lon) };
        if (dataTo && dataTo[0]) ptTo = { lat: parseFloat(dataTo[0].lat), lng: parseFloat(dataTo[0].lon) };

        // Fetch driving route via OSRM Demo Server
        const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${ptFrom.lng},${ptFrom.lat};${ptTo.lng},${ptTo.lat}?overview=full&geometries=geojson`);
        const osrmData = await osrmRes.json();

        // Clear old routing layers
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer.options && layer.options.isRouteLayer) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        if (osrmData.routes && osrmData.routes[0]) {
          const coordsList = osrmData.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]); // reverse for Leaflet
          const distKm = osrmData.routes[0].distance / 1000;

          // Update cab prices based on distance
          let updatedCabs = cabs;
          setCabs(prev => {
            updatedCabs = prev.map(c => ({ ...c, price: Math.floor(distKm * 20 + 50 + (c.eta * 2)) }));
            return updatedCabs;
          });

          if (onRouteExtracted) onRouteExtracted(distKm, updatedCabs);

          // Draw Glowing Safest Route Line
          L.polyline(coordsList, { color: accent, weight: 6, opacity: 0.8, className: 'route-glow', isRouteLayer: true }).addTo(mapInstanceRef.current);
          L.polyline(coordsList, { color: 'white', weight: 2, dashArray: '8 8', isRouteLayer: true }).addTo(mapInstanceRef.current);

          // Draw Distance Tag in Blue
          if (coordsList.length > 2) {
            const midPt = coordsList[Math.floor(coordsList.length / 2)];
            const distHtml = `<div style="background:hsl(var(--card));color:#2563eb;font-weight:900;padding:4px 8px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #2563eb;font-size:12px;white-space:nowrap;margin-top:-20px;text-align:center;">${distKm.toFixed(1)} km</div>`;
            const distIcon = L.divIcon({ html: distHtml, className: "", iconSize: [60, 24], iconAnchor: [30, 12] });
            L.marker(midPt, { icon: distIcon, isRouteLayer: true }).addTo(mapInstanceRef.current);
          }

          // Fit bounds
          const bounds = L.latLngBounds([ptFrom.lat, ptFrom.lng], [ptTo.lat, ptTo.lng]);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

          // Add simple marker for destination
          const destIconHtml = `<div style="background:#111;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">B</div>`;
          const dIcon = L.divIcon({ html: destIconHtml, className: "", iconSize: [24, 24], iconAnchor: [12, 12] });
          L.marker([ptTo.lat, ptTo.lng], { icon: dIcon, isRouteLayer: true }).addTo(mapInstanceRef.current);
        } else {
          L.polyline([[ptFrom.lat, ptFrom.lng], [ptTo.lat, ptTo.lng]], { color: accent, weight: 4, dashArray: "10 10", isRouteLayer: true }).addTo(mapInstanceRef.current);
          mapInstanceRef.current.fitBounds(L.latLngBounds([ptFrom.lat, ptFrom.lng], [ptTo.lat, ptTo.lng]), { padding: [50, 50] });
        }
      } catch (err) {
        console.warn("Routing failed", err);
      }
    })();
  }, [triggerRoute, accent]);

  // Handle external center update from "Locate Me" button
  useEffect(() => {
    if (centerLoc && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([centerLoc.lat, centerLoc.lng], 15, { duration: 1.5 });

      // Update cab data around new location
      const newCabs = generateNearbyCabs(centerLoc.lat, centerLoc.lng);
      setCabs(newCabs);

      // Re-add "You are here" marker at exact new center
      const L = window.L;
      if (L) {
        // Create the pulsing dot again
        const pulseHtml = `
          <div style="position:relative;width:22px;height:22px;">
            <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(59,130,246,0.2);animation:pulse-ring 1.5s ease-out infinite;"></div>
            <div style="position:absolute;inset:-4px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulse-ring 1.5s ease-out 0.3s infinite;"></div>
            <div style="width:22px;height:22px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.6);"></div>
          </div>
          <style>@keyframes pulse-ring { 0% { transform:scale(1); opacity:0.8; } 100% { transform:scale(2.5); opacity:0; } }</style>
        `;
        const youIcon = L.divIcon({ html: pulseHtml, className: "", iconSize: [22, 22], iconAnchor: [11, 11] });

        // Let's clear existing markers (except tiles/controls) before adding new ones
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.Circle) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Add the new "you are here" marker
        const userMarker = L.marker([centerLoc.lat, centerLoc.lng], { icon: youIcon }).addTo(mapInstanceRef.current);
        userMarker.bindPopup("<b>📍 You are here</b>", { closeButton: false });
        L.circle([centerLoc.lat, centerLoc.lng], { radius: 60, color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1.5, dashArray: "5 5" }).addTo(mapInstanceRef.current);

        // Add the new cab markers
        newCabs.forEach((cab: any) => {
          const cabHtml = `<div style="position:relative;display:flex;flex-direction:column;align-items:center;"><div style="background:${accent};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);">${cab.name.split(" ").map((n: string) => n[0]).join("")}</div><div style="background:hsl(var(--card));border-radius:6px;padding:1px 5px;font-size:9px;font-weight:700;color:hsl(var(--card-foreground));margin-top:2px;box-shadow:0 1px 4px rgba(0,0,0,0.15);white-space:nowrap;">${cab.eta} min</div><div style="width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:6px solid hsl(var(--card));margin-top:-1px;"></div></div>`;
          const cabIcon = L.divIcon({ html: cabHtml, className: "", iconSize: [36, 52], iconAnchor: [18, 52] });
          L.marker([cab.lat, cab.lng], { icon: cabIcon }).addTo(mapInstanceRef.current).bindPopup(`<b>${cab.name}</b><br>⭐ ${cab.rating} &nbsp;·&nbsp; ETA ${cab.eta} min`, { closeButton: false });
        });

        setLocError(false); // Clear error because we have a manual center
      }
    }
  }, [centerLoc, accent]);

  return (
    <div className="relative h-full w-full bg-secondary">
      {/* Leaflet map container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-10" />

      {/* Locating spinner */}
      {locating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary/95 z-20">
          <Locate size={32} className="text-primary animate-pulse" />
          <p className="text-sm font-semibold text-foreground">Finding your location…</p>
          <p className="text-xs text-muted-foreground">Please allow location access if prompted</p>
        </div>
      )}

      {/* Default-location warning */}
      {locError && !locating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur px-4 py-2 shadow-lg text-white text-xs font-semibold whitespace-nowrap">
          <AlertCircle size={13} />
          Using default location · Enable GPS for best results
        </div>
      )}

      {/* Cabs Nearby badge */}
      {!locating && (
        <div
          className="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow-lg text-xs font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          <Car size={12} />
          {cabs.length} Cabs Nearby
        </div>
      )}

      {/* Cab cards strip */}
      {!locating && cabs.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-3">
          <div
            className="rounded-2xl p-3 flex gap-2 overflow-x-auto"
            style={{
              background: "hsl(var(--card) / 0.93)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: "0 -2px 20px rgba(0,0,0,0.08)",
              scrollbarWidth: "none",
            }}
          >
            {cabs.map((cab) => (
              <div
                key={cab.id}
                onClick={() => {
                  const isSelecting = cab.id !== selectedCab;
                  setSelectedCab(isSelecting ? cab.id : null);
                  if (onCabSelect) onCabSelect(isSelecting ? cab : null);
                }}
                className="flex-shrink-0 flex flex-col items-center rounded-2xl border px-4 py-3 min-w-[115px] cursor-pointer transition-all relative"
                style={{
                  borderColor: cab.id === selectedCab ? accent : "hsl(var(--border))",
                  borderWidth: cab.id === selectedCab ? "2px" : "1px",
                  backgroundColor: cab.id === selectedCab ? `${accent}12` : "hsl(var(--background))",
                  transform: cab.id === selectedCab ? "translateY(-3px)" : "none",
                  boxShadow: cab.id === selectedCab ? `0 6px 16px ${accent}30` : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {/* Checkmark badge when selected */}
                {cab.id === selectedCab && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-white rounded-full">
                    <CheckCircle2 size={16} style={{ color: accent }} className="fill-white" />
                  </div>
                )}

                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white mb-2 shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  {cab.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <p className="text-xs font-bold text-foreground leading-tight text-center">{cab.name}</p>
                <div className="flex gap-1.5 items-center mt-1 whitespace-nowrap">
                  <span className="text-[11px] text-muted-foreground font-medium">⭐ {cab.rating}</span>
                  {cab.price > 0 && <span className="text-[11px] font-black text-blue-600">₹{cab.price}</span>}
                </div>
                <span
                  className="mt-2.5 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  {cab.eta} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Booking Page ───────────────────────────────────────────────────────
const BookingPage = () => {
  const { mode: modeId } = useParams<{ mode: string }>();
  const mode = getModeConfig((modeId as RideMode) || "normal");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [isLocatingAddress, setIsLocatingAddress] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number } | null>(null);
  const [triggerRoute, setTriggerRoute] = useState<{ from: string, to: string } | null>(null);

  const handleUseCurrentLocation = () => {
    setIsLocatingAddress(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter({ lat: latitude, lng: longitude }); // Tell map to fly here

        try {
          // Free reverse geocoding using Nominatim (no API key required)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            // Simplify address (e.g., take first 3 parts)
            const shortAddress = data.display_name.split(", ").slice(0, 3).join(", ");
            setPickup(shortAddress);
          } else {
            setPickup("Current Location");
          }
        } catch (e) {
          setPickup("Current Location");
        }
        setIsLocatingAddress(false);
      },
      () => {
        alert("Unable to retrieve location. Please check browser permissions.");
        setIsLocatingAddress(false);
      },
      { timeout: 10000 }
    );
  };

  // Auto-fill on mount
  useEffect(() => {
    handleUseCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rideDetails, setRideDetails] = useState({
    distance: "12.4 km", distanceNum: 12.4, score: 94,
    etaNum: 24, traffic: "Light", riskFactors: 1,
  });

  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [askStatus, setAskStatus] = useState<"idle" | "asking" | "accepted" | "rejected">("idle");
  const [flowState, setFlowState] = useState<"booking" | "confirmed" | "review">("booking");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs] = useState<{ sender: string, text: string }[]>([]);
  const leftRef = useRef<HTMLDivElement>(null);

  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const pickupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const destTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickup(val);
    setShowPickupDropdown(true);

    if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
    if (!val.trim()) {
      setPickupSuggestions([]);
      return;
    }
    pickupTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
        const data = await res.json();
        setPickupSuggestions(data);
      } catch (e) {
        console.error("Geocoding fetch error:", e);
      }
    }, 500);
  };

  const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDestination(val);
    setShowDestDropdown(true);

    if (destTimeoutRef.current) clearTimeout(destTimeoutRef.current);
    if (!val.trim()) {
      setDestSuggestions([]);
      return;
    }
    destTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
        const data = await res.json();
        setDestSuggestions(data);
      } catch (e) {
        console.error("Geocoding fetch error:", e);
      }
    }, 500);
  };

  const selectPickup = (place: any) => {
    setPickup(place.display_name);
    setShowPickupDropdown(false);
  };

  const selectDest = (place: any) => {
    setDestination(place.display_name);
    setShowDestDropdown(false);
  };

  const handleRouteExtracted = (km: number) => {
    setRideDetails(prev => ({ ...prev, distance: `${km.toFixed(1)} km`, distanceNum: km }));
  };

  const handleAskDriver = () => {
    setAskStatus("asking");
    setChatOpen(false);
    setChatMsgs([]);
    leftRef.current?.scrollTo({ top: leftRef.current.scrollHeight, behavior: "smooth" });
    // Simulate network wait for driver
    setTimeout(() => {
      if (Math.random() > 0.15) {
        setAskStatus("accepted"); // 85% accept rate
        setTimeout(() => handleConfirmRide(), 1500); // auto confirm and wrap up
      } else {
        setAskStatus("rejected");
      }
    }, 2500 + Math.random() * 2000);
  };

  const handleFindRoute = () => {
    if (!pickup.trim() || !destination.trim()) {
      alert("Please enter both a pickup location and a destination.");
      return;
    }
    setIsAnalyzing(true);
    setRouteFound(false);
    setSelectedDriver(null);
    setAskStatus("idle");
    setChatOpen(false);
    setTriggerRoute({ from: pickup, to: destination });

    setTimeout(() => {
      const trafficOptions = ["Light", "Moderate", "Heavy"];
      const randomTraffic = trafficOptions[Math.floor(Math.random() * trafficOptions.length)];
      setRideDetails(prev => ({
        ...prev,
        score: Math.floor(Math.random() * 10 + 90),
        etaNum: Math.floor(prev.distanceNum * 3 + Math.random() * 5),
        traffic: randomTraffic,
        riskFactors: Math.floor(Math.random() * 3) + 1
      }));
      setIsAnalyzing(false);
      setRouteFound(true);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => [...prev, { sender: "user", text: chatInput }]);
    setChatInput("");

    // Fake driver response
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { sender: "driver", text: "Got it, I'm on my way!" }]);
    }, 1500);
  };

  const handleConfirmRide = () => {
    const bookingData = {
      id: `R-${Math.floor(Math.random() * 9000 + 1000)}`,
      passenger: "Guest User",
      mode: mode.name.replace(" Mode", ""),
      driver: selectedDriver?.name || "Driver",
      route: `${pickup} → ${destination}`,
      status: "In Progress",
      type: "booking",
      timestamp: Date.now()
    };

    const newRide = { ...bookingData, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), rating: 0 };

    try {
      const saved = localStorage.getItem("safego_rides");
      localStorage.setItem("safego_rides", JSON.stringify([newRide, ...(saved ? JSON.parse(saved) : [])]));

      // Emit event for Admin Dashboard
      localStorage.setItem("safego_latest_booking", JSON.stringify(bookingData));
      window.dispatchEvent(new Event("storage"));
    } catch (_) { }

    setFlowState("confirmed");
    leftRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteRide = () => {
    setFlowState("review");
    leftRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitReview = () => {
    try {
      const saved = localStorage.getItem("safego_rides");
      if (saved) {
        const ridesList = JSON.parse(saved);
        if (ridesList.length > 0) {
          // Update the most recent in-progress ride
          for (let i = 0; i < ridesList.length; i++) {
            if (ridesList[i].status === "In Progress") {
              ridesList[i].status = "Completed";
              ridesList[i].rating = rating || 0;
              break;
            }
          }
          localStorage.setItem("safego_rides", JSON.stringify(ridesList));
        }
      }
    } catch (_) { }

    setFlowState("booking");
    setPickup("");
    setDestination("");
    setRouteFound(false);
    setSelectedDriver(null);
    setAskStatus("idle");
    setChatOpen(false);
    setRating(0);
    setReviewText("");
    setTriggerRoute(null);
    handleUseCurrentLocation(); // Reset to current location
    leftRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <Navbar fullWidth={true} />

      {/* ── Split layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ════ LEFT PANEL ════ */}
        <div
          ref={leftRef}
          className="w-full lg:w-1/2 overflow-y-auto border-r border-border bg-gradient-to-br from-background via-background to-secondary/30"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="px-6 py-8 lg:px-12 lg:py-12 relative min-h-full flex flex-col">

            {flowState === "booking" && (
              <>
                {/* Top bar */}
                {rideConfirmed && (
                  <div className="mb-4 flex items-center gap-3 rounded-2xl bg-green-500 p-4 text-white shadow-lg animate-in slide-in-from-top-4 fade-in duration-500">
                    <CheckCircle2 size={22} />
                    <div>
                      <p className="font-bold">Ride Confirmed!</p>
                      <p className="text-sm text-green-50">Your driver is on the way. Safest route selected.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Link to="/home" className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm hover:bg-secondary transition-all shadow-sm hover:shadow-md">
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Select Ride Type</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h1 className="font-display text-3xl font-black tracking-tight text-foreground lg:text-4xl">
                    Ready for a <span className="text-primary" style={{ color: mode.accent }}>Safe Journey?</span>
                  </h1>
                  <p className="mt-2 text-muted-foreground text-sm font-medium">Configure your pickup and destination for a secure ride.</p>
                </div>

                {/* ── 1. Route Form ── */}
                <div className="mt-8 rounded-[2rem] border border-border/40 bg-card p-8 premium-shadow relative transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${mode.accent}15` }}>
                      <Navigation size={16} style={{ color: mode.accent }} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Route Details</h3>
                  </div>

                  <div className="flex flex-col gap-0 relative">
                    <div className="flex items-center gap-3 relative z-50">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: mode.accent }} />
                      <div className="flex-1 relative flex items-center">
                        <input
                          value={pickup}
                          onChange={handlePickupChange}
                          onFocus={() => setShowPickupDropdown(true)}
                          onBlur={() => setTimeout(() => setShowPickupDropdown(false), 200)}
                          className="w-full rounded-xl border border-border dark:border-white/10 bg-secondary/60 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-colors pr-10 dark:text-white dark:placeholder:text-white/30"
                          placeholder="Pickup location"
                        />

                        {showPickupDropdown && pickupSuggestions.length > 0 && (
                          <div className="absolute top-[105%] left-0 right-0 z-[60] max-h-48 overflow-y-auto rounded-xl border border-border bg-background shadow-xl animate-in fade-in zoom-in-95 duration-200">
                            {pickupSuggestions.map((place, i) => (
                              <div
                                key={i}
                                className="w-full text-left px-4 py-3 text-xs hover:bg-secondary transition-colors border-b border-border/40 last:border-0 cursor-pointer flex items-center gap-2"
                                onClick={() => selectPickup(place)}
                              >
                                <MapPin size={12} className="text-muted-foreground shrink-0" />
                                <span className="truncate">{place.display_name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={handleUseCurrentLocation}
                          disabled={isLocatingAddress}
                          className="absolute right-3 p-1 rounded hover:bg-black/5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                          title="Use current location"
                        >
                          {isLocatingAddress ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="ml-[5px] h-5 border-l-2 border-dashed border-border/60" />
                    <div className="flex items-center gap-3 relative z-40">
                      <div className="h-2.5 w-2.5 rounded-sm shrink-0 bg-amber-500" />
                      <div className="flex-1 relative">
                        <input
                          value={destination}
                          onChange={handleDestChange}
                          onFocus={() => setShowDestDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFindRoute();
                              setShowDestDropdown(false);
                            }
                          }}
                          className="w-full rounded-xl border border-border dark:border-white/10 bg-secondary/60 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-colors dark:text-white dark:placeholder:text-white/30"
                          placeholder="Destination"
                        />

                        {showDestDropdown && destSuggestions.length > 0 && (
                          <div className="absolute top-[105%] left-0 right-0 z-[60] max-h-48 overflow-y-auto rounded-xl border border-border bg-background shadow-xl animate-in fade-in zoom-in-95 duration-200">
                            {destSuggestions.map((place, i) => (
                              <div
                                key={i}
                                className="w-full text-left px-4 py-3 text-xs hover:bg-secondary transition-colors border-b border-border/40 last:border-0 cursor-pointer flex items-center gap-2"
                                onClick={() => selectDest(place)}
                              >
                                <MapPin size={12} className="text-muted-foreground shrink-0" />
                                <span className="truncate">{place.display_name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date/Time Row added based on imagery */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Date</label>
                      <div className="relative">
                        <input type="date" className="w-full rounded-xl border border-border dark:border-white/10 bg-secondary/30 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-all focus:ring-4 focus:ring-primary/5 dark:text-white dark:[color-scheme:dark]" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Time</label>
                      <div className="relative">
                        <input type="time" className="w-full rounded-xl border border-border dark:border-white/10 bg-secondary/30 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-all focus:ring-4 focus:ring-primary/5 dark:text-white dark:[color-scheme:dark]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 2. Mode Selector ── */}
                <div className="mt-10 mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Service Type</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tap to switch</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {modes.map((m) => {
                    const isActive = m.id === mode.id;
                    return (
                      <Link
                        key={m.id}
                        to={`/book/${m.id}`}
                        className={`group relative flex flex-col items-center justify-center rounded-[2.5rem] border p-6 transition-all duration-500 overflow-hidden ${isActive ? "border-transparent bg-card premium-shadow scale-[1.05] z-10" : "border-border bg-background/40 hover:bg-card hover:border-border/80 shadow-sm"}`}
                        style={isActive ? { boxShadow: `0 20px 40px -10px ${m.accent}25` } : {}}
                      >
                        {isActive && (
                          <div className="absolute top-4 right-4 h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: m.accent }} />
                        )}
                        <m.icon size={28} className="mb-3 transition-transform group-hover:scale-110" style={{ color: isActive ? m.accent : "hsl(var(--muted-foreground))" }} />
                        <span className="text-[10px] font-black tracking-widest text-center uppercase" style={isActive ? { color: m.accent } : { color: "hsl(var(--muted-foreground))" }}>
                          {m.name.replace(" Mode", "")}
                        </span>
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: m.accent }} />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* ── 3. Mode Features ── */}
                <div className="mt-6 rounded-[2rem] border border-dashed border-border/60 bg-secondary/30 p-6 transition-all hover:bg-secondary/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-background shadow-sm">
                      <mode.icon size={18} style={{ color: mode.accent }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-tight">{mode.name}</h3>
                      <p className="text-[10px] text-muted-foreground font-medium">Standard safety protocols active</p>
                    </div>
                    {mode.id === "pink" && (
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter border shadow-sm animate-pulse" style={{ backgroundColor: mode.lightBg, color: mode.accent, borderColor: `${mode.accent}40` }}>
                        <Shield size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {mode.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                        <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: `${mode.accent}20` }}>
                          <CheckCircle2 size={10} style={{ color: mode.accent }} />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── PWD extras ── */}
                {mode.id === "pwd" && (
                  <div className="mt-4 rounded-[2rem] border border-border/40 bg-card p-6 premium-shadow animate-in fade-in slide-in-from-bottom-2 duration-400 transition-all hover:-translate-y-1">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                       <Shield size={16} className="text-[hsl(var(--purple))]" /> Accessibility Needs
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Wheelchair Accessible Vehicle", "Driver Assistance Required", "Vision Assistance", "Hearing Assistance"].map((n, i) => (
                        <label key={i} className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-3 hover:bg-secondary cursor-pointer transition-all text-xs font-semibold text-foreground/90">
                          <input type="checkbox" className="accent-[hsl(var(--purple))] h-4 w-4 cursor-pointer" />
                          {n}
                        </label>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold text-foreground mt-6 mb-3">Emergency Contact</h3>
                    <input type="tel" placeholder="+63 912 345 6789" className="w-full rounded-xl border border-border bg-secondary/50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-colors dark:text-white dark:placeholder:text-white/30" />
                  </div>
                )}

                {/* ── Pink extras ── */}
                {mode.id === "pink" && (
                  <div className="mt-4 rounded-[2rem] border border-border/40 bg-card p-6 premium-shadow animate-in fade-in slide-in-from-bottom-2 duration-400 transition-all hover:-translate-y-1">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                       <Shield size={16} className="text-[hsl(var(--pink))]" /> Safety Preferences
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {["Prefer Female Driver", "Share Live Location with Emergency Contact", "Enable Auto SOS in unsafe situations"].map((n, i) => (
                        <label key={i} className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-3 hover:bg-secondary cursor-pointer transition-all text-xs font-semibold text-foreground/90">
                          <input type="checkbox" defaultChecked={i === 0} className="accent-[hsl(var(--pink))] h-4 w-4 cursor-pointer" />
                          {n}
                        </label>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold text-foreground mt-6 mb-3">Emergency Contact</h3>
                    <input type="tel" placeholder="Emergency contact number" className="w-full rounded-xl border border-border bg-secondary/50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-colors dark:text-white dark:placeholder:text-white/30" />
                  </div>
                )}

                {/* ── Elderly extras ── */}
                {mode.id === "elderly" && (
                  <div className="mt-4 rounded-[2rem] border border-border/40 bg-card p-6 premium-shadow animate-in fade-in slide-in-from-bottom-2 duration-400 transition-all hover:-translate-y-1">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                       <Shield size={16} className="text-[hsl(var(--blue))]" /> Assistance Options
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {["Driver Assistance Required", "Help with Boarding and Exiting Vehicle", "Medical Support Contact"].map((n, i) => (
                        <label key={i} className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-3 hover:bg-secondary cursor-pointer transition-all text-xs font-semibold text-foreground/90">
                          <input type="checkbox" className="accent-[hsl(var(--blue))] h-4 w-4 cursor-pointer" />
                          {n}
                        </label>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold text-foreground mt-6 mb-3">Emergency Contact</h3>
                    <input type="tel" placeholder="Family or caregiver's number" className="w-full rounded-xl border border-border bg-secondary/50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-colors dark:text-white dark:placeholder:text-white/30" />
                  </div>
                )}

                {/* ── Submit Button ── */}
                <div className="mt-10 mb-4 relative z-20">
                  <button
                    onClick={handleFindRoute}
                    disabled={isAnalyzing}
                    className="w-full relative group flex items-center justify-center gap-3 rounded-2xl py-5 text-sm font-black text-white transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                    style={{ backgroundColor: mode.accent }}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    {isAnalyzing ? (
                      <><Loader2 size={20} className="animate-spin" /> RUNNING PREDICTIVE ANALYSIS...</>
                    ) : (
                      <><Navigation size={20} className="group-hover:rotate-12 transition-transform" /> START SAFETY ROUTING</>
                    )}
                  </button>
                </div>

                {/* ── Route Result ── */}
                {routeFound && !isAnalyzing && (
                  <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700 pb-12">
                    <div className="rounded-[2.5rem] bg-card premium-shadow border border-border/40 p-8 relative overflow-hidden transition-all hover:-translate-y-1">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Shield size={120} style={{ color: mode.accent }} />
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                        <div className="p-1.5 rounded-full bg-green-500/10">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-foreground">AI Intelligence Report</h4>
                      </div>

                      <div className="relative z-10">
                        <SafetyScoreBar score={rideDetails.score} color={mode.accent} />
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 transition-colors hover:bg-secondary/60">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Route Length</span>
                          <div className="mt-1 flex items-center gap-2">
                            <MapPin size={16} style={{ color: mode.accent }} />
                            <span className="text-lg font-black text-foreground">{rideDetails.distance}</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 transition-colors hover:bg-secondary/60">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Travel Time</span>
                          <div className="mt-1 flex items-center gap-2">
                            <Navigation size={16} className="text-blue-500" />
                            <span className="text-lg font-black text-foreground">{rideDetails.etaNum} <span className="text-xs font-bold text-muted-foreground">min</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/30">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full shadow-sm animate-pulse ${rideDetails.traffic === 'Light' ? 'bg-green-500' : rideDetails.traffic === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <span className="text-xs font-black uppercase tracking-widest text-foreground">{rideDetails.traffic} Traffic</span>
                        </div>
                        <div className="h-4 w-px bg-border/50" />
                        <div className="flex items-center gap-3">
                          <AlertCircle size={16} className="text-amber-500" />
                          <span className="text-xs font-black uppercase tracking-widest text-foreground">{rideDetails.riskFactors} Alerts Found</span>
                        </div>
                      </div>
                    </div>

                    {/* ── Driver Selected OR Select Please ── */}
                    {/* ── Driver Selected OR Select Please ── */}
                    <div className="pt-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 pl-1 text-center">Available Operators Nearby</h3>
                      {!selectedDriver ? (
                        <div className="group rounded-[2rem] border-2 border-dashed border-border/60 bg-secondary/10 p-10 text-center transition-all hover:bg-secondary/20 active:scale-[0.99] cursor-default">
                          <div className="mx-auto w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm mb-4 group-hover:rotate-12 transition-transform">
                            <Car size={24} className="text-muted-foreground" />
                          </div>
                          <p className="text-sm font-bold text-foreground">Awaiting Selection</p>
                          <p className="text-xs text-muted-foreground mt-1 font-medium">Please tap a vehicle on the interactive map.</p>
                        </div>
                      ) : (
                        <div className="rounded-[2.5rem] bg-card border border-border/40 p-8 premium-shadow animate-in slide-in-from-bottom-4 duration-500 relative transition-all hover:-translate-y-1">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                              Active Status
                            </div>
                            <div className="flex items-center gap-1 font-black text-amber-500 text-xs">
                              <Star size={14} className="fill-current" />
                              {selectedDriver.rating}
                            </div>
                          </div>

                          <div className={`flex items-center gap-5 transition-all duration-500 ${askStatus === "rejected" ? "opacity-40 grayscale" : "opacity-100"}`}>
                            <div className="relative">
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black text-white shadow-xl shadow-black/20" style={{ backgroundColor: askStatus === "accepted" ? "#10b981" : mode.accent }}>
                                {selectedDriver.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background bg-green-500 shadow-sm" title="Verified Driver" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xl font-black text-foreground tracking-tight leading-none">{selectedDriver.name}</p>
                              <p className="text-xs text-muted-foreground mt-2 font-black uppercase tracking-widest opacity-60">Plate: ABC 123</p>
                            </div>
                            <div className="text-right">
                              <span className="block text-2xl font-black text-foreground tracking-tighter">₹{selectedDriver.price}</span>
                              <span className="block mt-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">ETA {selectedDriver.eta}m</span>
                            </div>
                          </div>

                          <div className={`mt-8 transition-all duration-500 ${askStatus === "rejected" ? "opacity-40" : "opacity-100"}`}>
                            {chatOpen ? (
                              <div className="rounded-3xl border border-border/50 bg-secondary/20 p-2 animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex items-center justify-between px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Operator Console</span>
                                  </div>
                                  <button onClick={() => setChatOpen(false)} className="p-1.5 rounded-full hover:bg-background transition-colors"><X size={14} /></button>
                                </div>
                                <div className="h-32 overflow-y-auto px-4 py-2 flex flex-col gap-3 scrollbar-hide">
                                  {chatMsgs.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                                      <MessageCircle size={32} />
                                      <p className="text-[10px] font-bold uppercase mt-2">New Conversation</p>
                                    </div>
                                  )}
                                  {chatMsgs.map((msg, i) => (
                                    <div key={i} className={`max-w-[85%] rounded-[1.2rem] px-4 py-2.5 text-xs font-medium shadow-sm leading-relaxed ${msg.sender === "user" ? "bg-primary text-primary-foreground self-end rounded-tr-none" : "bg-background text-foreground self-start rounded-tl-none border border-border/50"}`}>
                                      {msg.text}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 p-1.5 flex gap-2">
                                  <input
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                                    className="flex-1 bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl px-5 py-3 text-xs outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                    placeholder="Secure message..."
                                  />
                                  <button onClick={handleSendMessage} disabled={!chatInput.trim()} className="bg-primary text-primary-foreground p-3.5 rounded-2xl disabled:opacity-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                                    <Send size={18} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="relative group">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <MessageCircle size={16} />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Add specialized instructions..."
                                    className="w-full rounded-2xl border border-border/60 bg-secondary/30 pl-11 pr-5 py-4 text-xs font-semibold outline-none focus:bg-background transition-all focus:ring-4 focus:ring-primary/5"
                                    disabled={askStatus !== "idle"}
                                  />
                                </div>
                                <div className="flex gap-4">
                                  <button
                                    className="flex-1 group relative rounded-2xl border border-border/80 py-4 text-xs font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                                    disabled={askStatus === "asking" || askStatus === "rejected"}
                                    onClick={() => setChatOpen(true)}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      <MessageCircle size={14} className="transition-transform group-hover:scale-110" />
                                      Direct Contact
                                    </div>
                                  </button>
                                  <button
                                    onClick={askStatus === "accepted" ? handleConfirmRide : handleAskDriver}
                                    disabled={askStatus === "asking"}
                                    className="flex-1 group relative rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                                    style={{ backgroundColor: askStatus === "accepted" ? "#10b981" : askStatus === "rejected" ? "#ef4444" : mode.accent }}
                                  >
                                    <div className="flex items-center justify-center gap-2">
                                      {askStatus === "idle" || askStatus === "rejected" ? (
                                        <>SEND REQUEST</>
                                      ) : askStatus === "asking" ? (
                                        <><Loader2 size={16} className="animate-spin" /> PENDING...</>
                                      ) : (
                                        <>SECURE BOOKING NOW</>
                                      )}
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {askStatus === "accepted" && (
                            <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                              <CheckCircle2 size={12} />
                              Driver is ready to assist you
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ════ CONFIRMED JOURNEY STATE ════ */}
            {flowState === "confirmed" && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6 max-w-lg mx-auto py-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-500/10 flex items-center justify-center rounded-full mb-4 shadow-sm">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">Ride Confirmed!</h2>
                  <p className="text-muted-foreground mt-2 text-sm">Your driver is on the way to your pickup location.</p>
                </div>

                <div className="rounded-[2.5rem] bg-card border border-border/40 premium-shadow p-8 mt-8 transition-all hover:-translate-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Driver Details</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white shadow-md bg-green-500">
                      {selectedDriver?.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{selectedDriver?.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5"><Star size={12} className="inline fill-amber-400 text-amber-400 mr-1" />{selectedDriver?.rating} Rating</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-black text-foreground">₹{selectedDriver?.price}</span>
                      <span className="block text-xs font-semibold text-blue-600 mt-1 uppercase">Arriving in {selectedDriver?.eta}m</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Destination</h3>
                    <p className="text-sm font-medium text-foreground">{destination}</p>
                  </div>
                </div>

                <button
                  onClick={handleCompleteRide}
                  className="w-full mt-8 rounded-xl py-4 text-sm font-bold text-white hover:brightness-110 transition-all shadow-md active:scale-[0.98]"
                  style={{ backgroundColor: mode.accent }}
                >
                  Simulate Ride Completion
                </button>
              </div>
            )}

            {/* ════ REVIEW STATE ════ */}
            {flowState === "review" && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6 max-w-lg mx-auto py-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-sm" style={{ backgroundColor: `${mode.accent}20`, color: mode.accent }}>
                    <Star size={32} className="fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-foreground">You've reached your destination!</h2>
                  <p className="text-muted-foreground mt-2 text-sm">How was your journey with {selectedDriver?.name}?</p>
                </div>

                <div className="rounded-[2.5rem] bg-card border border-border/40 premium-shadow p-8 mt-8 text-center flex flex-col items-center transition-all hover:-translate-y-1">
                  <h3 className="text-sm font-bold text-foreground mb-4">Rate your driver</h3>

                  {/* Interactive Star Rating */}
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          size={36}
                          className={`transition-colors duration-200 ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-muted-foreground/30'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 font-medium min-h-[16px]">
                    {rating === 5 ? "Excellent service!" : rating === 4 ? "Great ride!" : rating === 3 ? "It was okay." : rating > 0 ? "Needs improvement" : " "}
                  </p>

                  <div className="w-full mt-6 text-left">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Leave a review (optional)</label>
                    <textarea
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={`Tell us what you liked about ${selectedDriver?.name}...`}
                      className="w-full rounded-xl border border-border bg-secondary/30 dark:bg-white/5 p-3 text-sm focus:border-primary outline-none transition-colors resize-none dark:text-white dark:placeholder:text-white/30"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className="w-full mt-6 rounded-xl py-4 text-sm font-bold text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                  style={{ backgroundColor: rating > 0 ? mode.accent : 'hsl(var(--muted))' }}
                >
                  Submit & Finish
                </button>
                <button onClick={handleSubmitReview} className="w-full mt-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Skip for now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════ RIGHT PANEL — Live Map ════ */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <MapPanel accent={mode.accent} centerLoc={mapCenter} triggerRoute={triggerRoute} onRouteExtracted={handleRouteExtracted} onCabSelect={(cab: any) => { setSelectedDriver(cab); setAskStatus("idle"); }} />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
