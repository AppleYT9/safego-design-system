from __future__ import annotations

import json
from typing import Optional, List

import httpx

from app.config import settings
from app.utils.fare import calculate_fare, calculate_safety_score, haversine_distance, estimate_duration


async def get_route(
    pickup_lat: float,
    pickup_lng: float,
    dest_lat: float,
    dest_lng: float,
    mode: str = "normal",
) -> dict:
    """
    Call OSRM for route data, fall back to Haversine if unavailable.
    Returns dict with distance_km, duration_minutes, fare_amount, safety_score, route_polyline, steps.
    """
    distance_km = 0.0
    duration_minutes = 0.0
    route_polyline = None
    steps: list = []

    try:
        url = (
            f"{settings.OSRM_BASE_URL}/route/v1/driving/"
            f"{pickup_lng},{pickup_lat};{dest_lng},{dest_lat}"
            f"?overview=full&geometries=geojson&steps=true"
        )
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("code") == "Ok" and data.get("routes"):
                    route = data["routes"][0]
                    distance_km = round(route["distance"] / 1000.0, 2)
                    duration_minutes = round(route["duration"] / 60.0, 1)
                    route_polyline = json.dumps(route.get("geometry"))
                    # Extract step instructions
                    for leg in route.get("legs", []):
                        for step in leg.get("steps", []):
                            steps.append({
                                "instruction": step.get("maneuver", {}).get("type", ""),
                                "name": step.get("name", ""),
                                "distance": step.get("distance", 0),
                                "duration": step.get("duration", 0),
                            })
                else:
                    raise Exception("OSRM returned no routes")
            else:
                raise Exception(f"OSRM HTTP {resp.status_code}")
    except Exception:
        # Fallback to Haversine
        distance_km = round(haversine_distance(pickup_lat, pickup_lng, dest_lat, dest_lng), 2)
        duration_minutes = estimate_duration(distance_km)

    fare_amount = calculate_fare(mode, distance_km)
    safety_score = calculate_safety_score(mode, distance_km)

    return {
        "distance_km": distance_km,
        "duration_minutes": duration_minutes,
        "fare_amount": fare_amount,
        "safety_score": safety_score,
        "route_polyline": route_polyline,
        "steps": steps,
    }
