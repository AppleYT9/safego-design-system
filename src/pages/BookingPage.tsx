import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getModeConfig, modes } from "@/config/modeConfig";
import type { RideMode } from "@/config/modeConfig";
import { Navbar } from "@/components/Navbar";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";
import { SafetyScoreBar } from "@/components/SafetyScoreBar";
import {
  ArrowLeft, Star, MessageCircle, Shield, Loader2, CheckCircle2,
  MapPin, Navigation, Car, AlertCircle, Locate, Send, X, Users, Zap
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Simulated nearby cabs ───────────────────────────────────────────────────
const generateNearbyCabs = (lat: number, lng: number, mode: string = "normal") => {
  const maleNames = ["James D.", "Alex J.", "Robert P.", "David L.", "Michael S.", "Chris B."];
  const femaleNames = ["Sarah M.", "Maria C.", "Joyce T.", "Emma W.", "Sophia K.", "Olivia R."];
  const names = mode === "pink" ? femaleNames : maleNames;

  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    lat: lat + (Math.random() - 0.5) * 0.012,
    lng: lng + (Math.random() - 0.5) * 0.012,
    name: names[i % names.length],
    rating: (Math.random() * 0.3 + 4.7).toFixed(1),
    eta: Math.floor(Math.random() * 6 + 1),
  }));
};

// ─── Leaflet Map Panel (no API key) ─────────────────────────────────────────
declare global { interface Window { L: any } }

const MapPanel = ({ accent, mode, centerLoc, triggerRoute, routePolyline, onRouteExtracted, onCabSelect, simulatingTravel, onTravelComplete }: { accent: string, mode: string, centerLoc: { lat: number, lng: number } | null, triggerRoute: { from: string, to: string } | null, routePolyline?: string | null, onRouteExtracted?: (dist: number, cabs: any) => void, onCabSelect?: (cab: any) => void, simulatingTravel?: boolean, onTravelComplete?: () => void }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [cabs, setCabs] = useState<any[]>([]);
  const [locating, setLocating] = useState(true);
  const [locError, setLocError] = useState(false);
  const [selectedCab, setSelectedCab] = useState<number | null>(null);
  const carMarkerRef = useRef<any>(null);
  const simulationIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = async (lat: number, lng: number, isError: boolean) => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const L = window.L;
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([lat, lng], 15);
      mapInstanceRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri",
        maxZoom: 18,
      }).addTo(map);

      const pulseHtml = `
        <div style="position:relative;width:22px;height:22px;">
          <div style="position:absolute;inset:-8px;border-radius:50%;background:rgba(59,130,246,0.2);animation:pulse-ring 1.5s ease-out infinite;"></div>
          <div style="width:22px;height:22px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.6);"></div>
        </div>
        <style>@keyframes pulse-ring { 0% { transform:scale(1); opacity:0.8; } 100% { transform:scale(2.5); opacity:0; } }</style>
      `;
      const youIcon = L.divIcon({ html: pulseHtml, className: "", iconSize: [22, 22], iconAnchor: [11, 11] });
      L.marker([lat, lng], { icon: youIcon }).addTo(map).bindPopup("<b>📍 You are here</b>");

      L.circle([lat, lng], { radius: 60, color: "#3b82f6", fillOpacity: 0.08, weight: 1.5 }).addTo(map);

      const fallbackCabs = generateNearbyCabs(lat, lng, mode);
      setCabs(fallbackCabs);
      
      fallbackCabs.forEach((cab: any) => {
        const cabHtml = `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
            <div style="background:${accent};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);">
              ${(cab.name || "D").split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div style="background:hsl(var(--card));border-radius:6px;padding:1px 5px;font-size:9px;font-weight:700;color:hsl(var(--card-foreground));margin-top:2px;box-shadow:0 1px 4px rgba(0,0,0,0.15);white-space:nowrap;">
              ${cab.eta} min
            </div>
          </div>
        `;
        const cabIcon = L.divIcon({ html: cabHtml, className: "", iconSize: [36, 52], iconAnchor: [18, 52] });
        L.marker([cab.lat, cab.lng], { icon: cabIcon })
          .addTo(map)
          .bindPopup(`<b>${cab.name}</b><br>⭐ ${cab.rating} &nbsp;·&nbsp; ETA ${cab.eta} min`);
      });

      setLocating(false);
      if (isError) setLocError(true);
    };

    const loadLeaflet = () => {
      if (window.L) {
        getLocation();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => getLocation();
      document.head.appendChild(script);
    };

    const getLocation = () => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => initMap(pos.coords.latitude, pos.coords.longitude, false),
        (err) => {
          console.warn("Geolocation error:", err);
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

  useEffect(() => {
    const L = window.L;
    if (!mapInstanceRef.current || !L) return;

    if (!triggerRoute) {
      // Clear routing layers if route is reset
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer.options && layer.options.isRouteLayer) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });
      return;
    }

    (async () => {
      if (routePolyline) {
        try {
          const geojson = JSON.parse(routePolyline);
          const coordsList = geojson.coordinates.map((c: any) => [c[1], c[0]]);
          
          mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer.options && layer.options.isRouteLayer) {
              mapInstanceRef.current.removeLayer(layer);
            }
          });

          L.polyline(coordsList, { color: accent, weight: 6, opacity: 0.8, className: 'route-glow', isRouteLayer: true }).addTo(mapInstanceRef.current);
          L.polyline(coordsList, { color: 'white', weight: 2, dashArray: '8 8', isRouteLayer: true }).addTo(mapInstanceRef.current);

          // Add Pickup and Destination Markers
          const pickupIcon = L.divIcon({
            html: `<div style="background:${accent};width:12px;height:12px;border:2px solid white;border-radius:50%;box-shadow:0 0 10px ${accent}80;"></div>`,
            className: "", iconSize: [12, 12], iconAnchor: [6, 6]
          });
          const destIcon = L.divIcon({
            html: `<div style="background:#ef4444;width:12px;height:12px;border:2px solid white;border-radius:2px;box-shadow:0 0 10px #ef444480;"></div>`,
            className: "", iconSize: [12, 12], iconAnchor: [6, 6]
          });

          L.marker(coordsList[0], { icon: pickupIcon, isRouteLayer: true }).addTo(mapInstanceRef.current);
          L.marker(coordsList[coordsList.length - 1], { icon: destIcon, isRouteLayer: true }).addTo(mapInstanceRef.current);

          const bounds = L.latLngBounds(coordsList);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
          return;
        } catch (e) {
          console.warn("Polyline parse failed, falling back to OSRM", e);
        }
      }

      try {
        const fromQuery = encodeURIComponent(triggerRoute.from);
        const toQuery = encodeURIComponent(triggerRoute.to);
        const [resfrom, resto] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fromQuery}&limit=1`),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${toQuery}&limit=1`)
        ]);
        const dataFrom = await resfrom.json();
        const dataTo = await resto.json();

        let ptFrom = centerLoc || { lat: 14.5995, lng: 120.9842 };
        let ptTo = { lat: ptFrom.lat + 0.05, lng: ptFrom.lng + 0.05 };

        if (dataFrom && dataFrom[0]) ptFrom = { lat: parseFloat(dataFrom[0].lat), lng: parseFloat(dataFrom[0].lon) };
        if (dataTo && dataTo[0]) ptTo = { lat: parseFloat(dataTo[0].lat), lng: parseFloat(dataTo[0].lon) };

        const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${ptFrom.lng},${ptFrom.lat};${ptTo.lng},${ptTo.lat}?overview=full&geometries=geojson`);
        const osrmData = await osrmRes.json();

        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer.options && layer.options.isRouteLayer) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        if (osrmData.routes && osrmData.routes[0]) {
          const coordsList = osrmData.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
          const distKm = osrmData.routes[0].distance / 1000;

          if (onRouteExtracted) onRouteExtracted(distKm, cabs);

          L.polyline(coordsList, { color: accent, weight: 6, opacity: 0.8, className: 'route-glow', isRouteLayer: true }).addTo(mapInstanceRef.current);
          L.polyline(coordsList, { color: 'white', weight: 2, dashArray: '8 8', isRouteLayer: true }).addTo(mapInstanceRef.current);

          // Add Pickup and Destination Markers
          const pickupIcon = L.divIcon({
            html: `<div style="background:${accent};width:12px;height:12px;border:2px solid white;border-radius:50%;box-shadow:0 0 10px ${accent}80;"></div>`,
            className: "", iconSize: [12, 12], iconAnchor: [6, 6]
          });
          const destIcon = L.divIcon({
            html: `<div style="background:#ef4444;width:12px;height:12px;border:2px solid white;border-radius:2px;box-shadow:0 0 10px #ef444480;"></div>`,
            className: "", iconSize: [12, 12], iconAnchor: [6, 6]
          });

          L.marker(coordsList[0], { icon: pickupIcon, isRouteLayer: true }).addTo(mapInstanceRef.current);
          L.marker(coordsList[coordsList.length - 1], { icon: destIcon, isRouteLayer: true }).addTo(mapInstanceRef.current);

          const bounds = L.latLngBounds(coordsList);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        } else {
          L.polyline([[ptFrom.lat, ptFrom.lng], [ptTo.lat, ptTo.lng]], { color: accent, weight: 4, dashArray: "10 10", isRouteLayer: true }).addTo(mapInstanceRef.current);
          mapInstanceRef.current.fitBounds(L.latLngBounds([ptFrom.lat, ptFrom.lng], [ptTo.lat, ptTo.lng]), { padding: [50, 50] });
        }
      } catch (err) {
        console.warn("Routing failed", err);
      }
    })();
  }, [triggerRoute, accent, routePolyline]);

  // Car Animation Simulation
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !simulatingTravel || !routePolyline) return;

    const geojson = JSON.parse(routePolyline);
    const coordsList = geojson.coordinates.map((c: any) => [c[1], c[0]]);
    
    if (coordsList.length < 2) return;

    const carHtml = `
      <div style="background:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:2px solid ${accent};">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>
    `;
    const carIcon = L.divIcon({ html: carHtml, className: "", iconSize: [32, 32], iconAnchor: [16, 16] });
    
    if (carMarkerRef.current) {
      mapInstanceRef.current.removeLayer(carMarkerRef.current);
    }
    
    const carMarker = L.marker(coordsList[0], { icon: carIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
    carMarkerRef.current = carMarker;

    let step = 0;
    const totalSteps = coordsList.length;
    
    // Ensure animation always takes ~600ms regardless of distance
    const targetDuration = 600; 
    const frameRate = 30; // 30ms per update
    const totalUpdates = targetDuration / frameRate; 
    const stepIncrement = Math.max(1, Math.ceil(totalSteps / totalUpdates));

    simulationIntervalRef.current = setInterval(() => {
      step += stepIncrement;
      if (step >= totalSteps) {
        carMarker.setLatLng(coordsList[totalSteps - 1]);
        clearInterval(simulationIntervalRef.current);
        if (onTravelComplete) onTravelComplete();
        return;
      }
      carMarker.setLatLng(coordsList[step]);
    }, frameRate);

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [simulatingTravel, routePolyline, accent]);

  useEffect(() => {
    if (centerLoc && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([centerLoc.lat, centerLoc.lng], 15, { duration: 1.5 });
      const fallbackCabs = generateNearbyCabs(centerLoc.lat, centerLoc.lng, mode);
      setCabs(fallbackCabs);
      
      const L = window.L;
      if (L) {
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.Circle) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        const pulseHtml = `<div style="position:relative;width:22px;height:22px;"><div style="background:#3b82f6;border-radius:50%;width:22px;height:22px;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.6);"></div></div>`;
        const youIcon = L.divIcon({ html: pulseHtml, className: "", iconSize: [22, 22], iconAnchor: [11, 11] });
        L.marker([centerLoc.lat, centerLoc.lng], { icon: youIcon }).addTo(mapInstanceRef.current).bindPopup("<b>📍 You are here</b>");

        fallbackCabs.forEach((cab: any) => {
          const cabHtml = `<div style="position:relative;display:flex;flex-direction:column;align-items:center;"><div style="background:${accent};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);">${(cab.name || "D").split(" ").map((n: string) => n[0]).join("")}</div><div style="background:hsl(var(--card));border-radius:6px;padding:1px 5px;font-size:9px;font-weight:700;color:hsl(var(--card-foreground));margin-top:2px;box-shadow:0 1px 4px rgba(0,0,0,0.15);white-space:nowrap;">${cab.eta} min</div></div>`;
          const cabIcon = L.divIcon({ html: cabHtml, className: "", iconSize: [36, 52], iconAnchor: [18, 52] });
          L.marker([cab.lat, cab.lng], { icon: cabIcon }).addTo(mapInstanceRef.current).bindPopup(`<b>${cab.name}</b>`);
        });
      }
      setLocError(false);
    }
  }, [centerLoc, accent, mode]);

  return (
    <div className="relative h-full w-full bg-secondary">
      <div ref={mapContainerRef} className="absolute inset-0 z-10" />
      {locating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-secondary/95 z-20">
          <Locate size={32} className="text-primary animate-pulse" />
          <p className="text-sm font-semibold text-foreground">Finding your location…</p>
          <p className="text-xs text-muted-foreground">Please allow location access if prompted</p>
        </div>
      )}
      {locError && !locating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur px-4 py-2 shadow-lg text-white text-xs font-semibold whitespace-nowrap">
          <AlertCircle size={13} />
          Using default location · Enable GPS for best results
        </div>
      )}
      {!locating && (
        <div
          className="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow-lg text-xs font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          <Car size={12} />
          {cabs.length} Cabs Nearby
        </div>
      )}
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
                {cab.id === selectedCab && (
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-white rounded-full">
                    <CheckCircle2 size={16} style={{ color: accent }} className="fill-white" />
                  </div>
                )}
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold text-white mb-2 shadow-sm"
                  style={{ backgroundColor: accent }}
                >
                  {(cab.name || "D").split(" ").map((n: string) => n[0]).join("")}
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
  const location = useLocation();
  const navigate = useNavigate();
  const voiceState = location.state as { pickup?: string, destination?: string, auto_search?: boolean, auto_confirm?: boolean };

  const mode = getModeConfig((modeId as RideMode) || "normal");
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (voiceState?.pickup) setPickup(voiceState.pickup);
    if (voiceState?.destination) setDestination(voiceState.destination);

    if (modeId === "pwd") {
      speak("You are now on the booking page. I am finding your current location.");
    }
  }, [modeId, voiceState]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [isLocatingAddress, setIsLocatingAddress] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number } | null>(null);
  const [triggerRoute, setTriggerRoute] = useState<{ from: string, to: string } | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState<string[]>([]);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [routePolyline, setRoutePolyline] = useState<string | null>(null);
  const [isSimulatingTravel, setIsSimulatingTravel] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleUseCurrentLocation = () => {
    setIsLocatingAddress(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setPickupCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
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

  useEffect(() => {
    if (!voiceState?.pickup) {
      handleUseCurrentLocation();
    }
  }, []);

  const [rideDetails, setRideDetails] = useState({
    distance: "12.4 km", distanceNum: 12.4, score: 94,
    etaNum: 24, traffic: "Light", riskFactors: 1,
    aiPrediction: "Stable", fare: 0
  });

  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [askStatus, setAskStatus] = useState<"idle" | "asking" | "accepted" | "rejected">("idle");
  const [flowState, setFlowState] = useState<"booking" | "confirmed" | "review">("booking");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (voiceState?.auto_search && voiceState.destination) {
      const timer = setTimeout(() => {
        handleFindRoute();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [voiceState]);

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
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const pickupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const destTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickup(val);
    if (!val.trim()) {
      setPickupSuggestions([]);
      setShowPickupDropdown(false);
      return;
    }
    
    setShowPickupDropdown(true);
    setIsSearchingPickup(true);

    if (pickupTimeoutRef.current) clearTimeout(pickupTimeoutRef.current);
    pickupTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=8&addressdetails=1&countrycodes=in`);
        const data = await res.json();
        setPickupSuggestions(data);
      } catch (e) {
        console.error("Geocoding fetch error:", e);
      } finally {
        setIsSearchingPickup(false);
      }
    }, 400);
  };

  const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDestination(val);
    if (!val.trim()) {
      setDestSuggestions([]);
      setShowDestDropdown(false);
      return;
    }

    setShowDestDropdown(true);
    setIsSearchingDest(true);

    if (destTimeoutRef.current) clearTimeout(destTimeoutRef.current);
    destTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=8&addressdetails=1&countrycodes=in`);
        const data = await res.json();
        setDestSuggestions(data);
      } catch (e) {
        console.error("Geocoding fetch error:", e);
      } finally {
        setIsSearchingDest(false);
      }
    }, 400);
  };

  const selectPickup = (place: any) => {
    setPickup(place.display_name);
    setPickupCoords({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setShowPickupDropdown(false);
    if (destination) {
      setTimeout(() => handleFindRoute(), 300);
    }
  };

  const selectDest = (place: any) => {
    setDestination(place.display_name);
    setDestinationCoords({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setShowDestDropdown(false);
    if (pickup) {
      setTimeout(() => handleFindRoute(), 300);
    }
  };

  const handleRouteExtracted = (km: number) => {
    setRideDetails(prev => ({ ...prev, distance: `${km.toFixed(1)} km`, distanceNum: km }));
  };

  const handleAskDriver = () => {
    setAskStatus("asking");
    setChatOpen(false);
    setChatMsgs([]);
    leftRef.current?.scrollTo({ top: leftRef.current.scrollHeight, behavior: "smooth" });
    setTimeout(() => {
      if (Math.random() > 0.15) {
        setAskStatus("accepted"); 
        setTimeout(() => handleConfirmRide(), 1500); 
      } else {
        setAskStatus("rejected");
      }
    }, 2500 + Math.random() * 2000);
  };

  const handleFindRoute = async () => {
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

    try {
      const res = await fetch(`${API_URL}/api/map/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup_latitude: pickupCoords?.lat || 22.3,
          pickup_longitude: pickupCoords?.lng || 73.19,
          destination_latitude: destinationCoords?.lat || 22.35,
          destination_longitude: destinationCoords?.lng || 73.24,
          mode: mode.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        const trafficOptions = ["Light", "Moderate", "Heavy"];
        const randomTraffic = trafficOptions[Math.floor(Math.random() * trafficOptions.length)];
        
        setRideDetails({
          distance: `${data.distance_km} km`,
          distanceNum: data.distance_km,
          score: data.safety_score,
          etaNum: data.duration_minutes,
          traffic: randomTraffic,
          riskFactors: Math.floor(Math.random() * 2),
          aiPrediction: data.ai_safety_prediction || "Stable",
          fare: data.fare_amount
        });
        setRoutePolyline(data.route_polyline);
        setRouteFound(true);
      }
    } catch (err) {
      console.error("Route fetch error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => [...prev, { sender: "user", text: chatInput }]);
    setChatInput("");

    setTimeout(() => {
      setChatMsgs(prev => [...prev, { sender: "driver", text: "Got it, I'm on my way!" }]);
    }, 1500);
  };

  const handleConfirmRide = async () => {
    localStorage.setItem('safego_new_booking', JSON.stringify({
      id: 'RID_' + Math.floor(Math.random() * 1000),
      passenger: 'User Node #88',
      driver: selectedDriver?.name || 'Assigned Pilot',
      timestamp: new Date().toISOString()
    }));

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a ride");
      navigate("/login");
      return;
    }

    try {
      setAskStatus("asking");

      const payload = {
        mode: mode.id,
        pickup_address: pickup,
        pickup_latitude: pickupCoords?.lat || mapCenter?.lat || 22.3,
        pickup_longitude: pickupCoords?.lng || mapCenter?.lng || 73.19,
        destination_address: destination,
        destination_latitude: destinationCoords?.lat || (mapCenter?.lat || 22.3) + 0.05,
        destination_longitude: destinationCoords?.lng || (mapCenter?.lng || 73.19) + 0.05,
        passenger_count: passengers,
        passenger_details: passengerDetails.filter(d => d.trim() !== ""),
        driver_id: selectedDriver?.driver_id || null
      };

      const res = await fetch(`${API_URL}/api/rides/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to create ride");
      const rideData = await res.json();

      // Trigger simulation instead of immediate confirmed state
      setIsSimulatingTravel(true);
      leftRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error(err);
      setAskStatus("rejected");
      alert("Error booking ride. Please try again.");
    }
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
    setRoutePolyline(null);
    setRouteFound(false);
    handleUseCurrentLocation(); 
    leftRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <Navbar fullWidth={true} />
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={leftRef}
          className={`${flowState === "booking" ? "w-full lg:w-1/2" : "w-full"} overflow-y-auto border-r border-border bg-gradient-to-br from-background via-background to-secondary/30 transition-all duration-500 ease-in-out`}
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="px-6 py-8 lg:px-12 lg:py-12 relative min-h-full flex flex-col">
            {flowState === "booking" && (
              <>
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
                        {showPickupDropdown && (pickupSuggestions.length > 0 || isSearchingPickup) && (
                          <div className="absolute top-[105%] left-0 right-0 z-[60] max-h-64 overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-2">
                            {isSearchingPickup && (
                              <div className="flex items-center gap-3 px-4 py-3 text-xs text-muted-foreground italic">
                                <Loader2 size={14} className="animate-spin text-primary" />
                                Analyzing places...
                              </div>
                            )}
                            {pickupSuggestions.map((place, i) => (
                              <div
                                key={i}
                                className="w-full text-left px-4 py-3 text-xs hover:bg-primary/5 rounded-xl transition-all border-b border-border/5 last:border-0 cursor-pointer flex items-start gap-3 group"
                                onMouseDown={(e) => {
                                  e.preventDefault(); 
                                  selectPickup(place);
                                }}
                              >
                                <div className="mt-0.5 p-1.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                                  <MapPin size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-foreground truncate">{place.display_name?.split(',')[0] || "Location"}</span>
                                  <span className="text-[10px] text-muted-foreground truncate">{place.display_name?.split(',').slice(1).join(',').trim() || ""}</span>
                                </div>
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
                        {showDestDropdown && (destSuggestions.length > 0 || isSearchingDest) && (
                          <div className="absolute top-[105%] left-0 right-0 z-[60] max-h-64 overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-2">
                            {isSearchingDest && (
                              <div className="flex items-center gap-3 px-4 py-3 text-xs text-muted-foreground italic">
                                <Loader2 size={14} className="animate-spin text-primary" />
                                Analyzing places...
                              </div>
                            )}
                            {destSuggestions.map((place, i) => (
                              <div
                                key={i}
                                className="w-full text-left px-4 py-3 text-xs hover:bg-primary/5 rounded-xl transition-all border-b border-border/5 last:border-0 cursor-pointer flex items-start gap-3 group"
                                onMouseDown={(e) => {
                                  e.preventDefault(); 
                                  selectDest(place);
                                }}
                              >
                                <div className="mt-0.5 p-1.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                                  <MapPin size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-foreground truncate">{place.display_name?.split(',')[0] || "Location"}</span>
                                  <span className="text-[10px] text-muted-foreground truncate">{place.display_name?.split(',').slice(1).join(',').trim() || ""}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
                  <div className="mt-6 flex items-center justify-between p-4 rounded-3xl bg-secondary/30 border border-border/40 transition-all hover:bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-background shadow-sm ring-1 ring-border/50">
                        <Users size={20} style={{ color: mode.accent }} />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-black text-foreground leading-none">Passengers</label>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">How many people?</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-background rounded-2xl p-1.5 shadow-sm border border-border/50">
                      <button
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-all text-foreground text-lg active:scale-90"
                      >
                        -
                      </button>
                      <div className="h-10 w-10 flex items-center justify-center">
                        <span className="text-sm font-black text-foreground">{passengers}</span>
                      </div>
                      <button
                        onClick={() => setPassengers(Math.min(4, passengers + 1))}
                        className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-all text-foreground text-lg active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {passengers > 1 && (
                    <div className="mt-4 p-6 rounded-[2rem] border border-border/40 bg-card premium-shadow animate-in fade-in slide-in-from-top-2 duration-300">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Passenger Details</h4>
                      <div className="space-y-3">
                        {Array.from({ length: passengers - 1 }).map((_, i) => (
                          <div key={i} className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-muted-foreground ml-1">Passenger {i + 2} Name</label>
                            <input
                              type="text"
                              placeholder={`Enter name for passenger ${i + 2}`}
                              className="w-full rounded-xl border border-border bg-secondary/50 dark:bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition-colors dark:text-white dark:placeholder:text-white/30"
                              value={passengerDetails[i] || ""}
                              onChange={(e) => {
                                const newDetails = [...passengerDetails];
                                newDetails[i] = e.target.value;
                                setPassengerDetails(newDetails);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
                {mode.id === "pink" && (
                  <div className="flex flex-col gap-4">
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
                    <div className="rounded-[2rem] border border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20 p-5 animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <AlertCircle size={18} className="text-amber-600 dark:text-amber-500" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">Important Pink Mode Policy</h4>
                          <p className="text-[11px] font-medium leading-relaxed text-amber-800/80 dark:text-amber-200/60">
                            Pink Mode is a female-focused safety service. If male passengers accompany the traveler,
                            the driver reserves the right to cancel the ride on the spot if they feel uncomfortable.
                            Please ensure all travelers are disclosed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                            <span className="text-lg font-black text-foreground">
                              {rideDetails.etaNum > 60 
                                ? `${Math.floor(rideDetails.etaNum / 60)}h ${Math.round(rideDetails.etaNum % 60)}m` 
                                : `${Math.round(rideDetails.etaNum)} min`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 transition-all hover:bg-primary/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10">
                              <Star size={18} className="text-primary fill-primary" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Estimated Fare</span>
                              <div className="text-2xl font-black text-foreground">₹{rideDetails.fare.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Incl. Taxes</span>
                            <div className="text-xs font-bold text-green-600">Secure Payment</div>
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
                          <Zap size={16} className="text-primary" />
                          <span className="text-xs font-black uppercase tracking-widest text-foreground">AI: {rideDetails.aiPrediction}</span>
                        </div>
                      </div>
                    </div>
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
                                {(selectedDriver?.name || "D").split(" ").map((n: string) => n[0]).join("")}
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
            {flowState === "confirmed" && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6 max-w-lg mx-auto py-8">
                <div className="flex justify-start mb-4">
                  <button 
                    onClick={() => setFlowState("booking")}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm hover:bg-secondary transition-all shadow-sm hover:shadow-md"
                  >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
                  </button>
                </div>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2
                    }}
                    className="mx-auto w-20 h-20 bg-green-500/10 flex items-center justify-center rounded-full mb-6 shadow-sm border border-green-500/20"
                  >
                    <CheckCircle2 size={40} className="text-green-600" />
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold font-display text-foreground"
                  >
                    Ride Confirmed!
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground mt-2 text-sm"
                  >
                    Your driver is on the way to your pickup location.
                  </motion.p>
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
        {flowState === "booking" && (
          <div className="hidden lg:block lg:w-1/2 relative animate-in fade-in slide-in-from-right duration-500">
            <MapPanel
              accent={mode.accent}
              mode={mode.id}
              centerLoc={mapCenter}
              triggerRoute={triggerRoute}
              routePolyline={routePolyline}
              onRouteExtracted={handleRouteExtracted}
              onCabSelect={setSelectedDriver}
              simulatingTravel={isSimulatingTravel}
              onTravelComplete={() => {
                setAskStatus("accepted");
                setFlowState("confirmed");
                setIsSimulatingTravel(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
