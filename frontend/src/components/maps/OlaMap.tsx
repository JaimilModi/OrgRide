"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { LngLat, toMapLngLat, toDirectionsLatLng } from "@/lib/coordinates";

interface OlaMapProps {
  sourceCoords: LngLat;
  destinationCoords: LngLat;
  sourceLabel?: string;
  destinationLabel?: string;
}

// Standard polyline decoding function
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    // GeoJSON expects [longitude, latitude]
    points.push([lng / 1e5, lat / 1e5]);
  }
  return points;
}

export function OlaMap({ sourceCoords, destinationCoords }: OlaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const initializeMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY;
      if (!apiKey) {
        if (isMounted) {
          setError("Ola Maps API key is missing. Route cannot be displayed.");
          setLoading(false);
        }
        return;
      }

      if (!mapContainer.current) return;
      
      // Prevent duplicate initialization in Strict Mode
      if (mapInstanceRef.current) return;

      try {
        const sdk = await import("olamaps-web-sdk");
        const OlaMaps = sdk.OlaMaps;
        const olaMaps = new OlaMaps({
          apiKey: apiKey,
        });

        const map = await olaMaps.init({
          style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: mapContainer.current,
          center: toMapLngLat(sourceCoords),
          zoom: 12,
        });
        
        mapInstanceRef.current = map;

        map.on('load', async () => {
          if (!isMounted) return;

          try {
            // Add Markers
            // Source: Blue (#42C7FF)
            const sourcePopup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' }).setHTML("<div style='color: black'><b>Pickup</b></div>");
            olaMaps
              .addMarker({ offset: [0, -10], anchor: 'bottom', color: '#42C7FF' })
              .setLngLat(toMapLngLat(sourceCoords))
              .setPopup(sourcePopup)
              .addTo(map);

            // Destination: Green/Success (#18F2C2)
            const destPopup = olaMaps.addPopup({ offset: [0, -30], anchor: 'bottom' }).setHTML("<div style='color: black'><b>Dropoff</b></div>");
            olaMaps
              .addMarker({ offset: [0, -10], anchor: 'bottom', color: '#18F2C2' })
              .setLngLat(toMapLngLat(destinationCoords))
              .setPopup(destPopup)
              .addTo(map);

            // Fetch Route geometry
            const origin = toDirectionsLatLng(sourceCoords);
            const destination = toDirectionsLatLng(destinationCoords);
            
            const response = await fetch(`/ola-api/routing/v1/directions?origin=${origin}&destination=${destination}&api_key=${apiKey}`, {
              method: 'POST',
              signal: abortController.signal
            });
            if (!response.ok) {
               throw new Error(`Directions API failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              
              if (route.legs && route.legs[0]) {
                const leg = route.legs[0];
                if (isMounted) {
                  setRouteInfo({
                    distance: leg.distance?.text || `${(leg.distance / 1000).toFixed(1)} km`,
                    duration: leg.duration?.text || `${Math.round(leg.duration / 60)} mins`
                  });
                }
              }

              let coordinates: [number, number][] = [];

              if (route.overview_polyline) {
                coordinates = decodePolyline(route.overview_polyline);
              } else if (route.geometry) { // fallback if Ola returns direct geometry
                if (typeof route.geometry === 'string') {
                    coordinates = decodePolyline(route.geometry);
                } else if (route.geometry.coordinates) {
                    coordinates = route.geometry.coordinates;
                }
              }

              if (coordinates.length > 0) {
                map.addSource('route', {
                  'type': 'geojson',
                  'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                      'type': 'LineString',
                      'coordinates': coordinates
                    }
                  }
                });

                map.addLayer({
                  'id': 'route',
                  'type': 'line',
                  'source': 'route',
                  'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  'paint': {
                    'line-color': '#42C7FF',
                    'line-width': 4
                  }
                });
              }
            }

            // Fit bounds
            const swLng = Math.min(sourceCoords.longitude, destinationCoords.longitude);
            const swLat = Math.min(sourceCoords.latitude, destinationCoords.latitude);
            const neLng = Math.max(sourceCoords.longitude, destinationCoords.longitude);
            const neLat = Math.max(sourceCoords.latitude, destinationCoords.latitude);

            const bounds = [
              [swLng, swLat],
              [neLng, neLat]
            ] as [[number, number], [number, number]];
            
            map.fitBounds(bounds, {
              padding: 60,
              maxZoom: 16
            });

          } catch (err: any) {
            if (err.name === 'AbortError') return;
            console.error("Route fetching failed", err);
            // Non-blocking error. We just won't show the polyline, but map and markers still exist.
          } finally {
            if (isMounted) setLoading(false);
          }
        });
      } catch (err: any) {
        console.error("Map initialization failed", err);
        if (isMounted) {
          setError("Failed to load Ola Maps SDK.");
          setLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      abortController.abort();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
      }
      mapInstanceRef.current = null;
    };
  }, [sourceCoords.latitude, sourceCoords.longitude, destinationCoords.latitude, destinationCoords.longitude]);

  if (error) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl p-6 text-center shadow-sm">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#94A3B8] mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5">
           <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        <h4 className="text-lg font-bold text-[#10233F] mb-2">Route map unavailable</h4>
        <p className="text-[#64748B] max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-[#F8FAFC]">
      {loading && (
        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {routeInfo && (
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-[#E2E8F0] px-4 py-3 rounded-xl shadow-md flex gap-4 animate-in fade-in zoom-in duration-300">
           <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">Est. Time</span>
              <span className="text-sm font-bold text-[#10233F]">{routeInfo.duration}</span>
            </div>
            <div className="w-px h-8 bg-[#E2E8F0]"></div>
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-0.5">Distance</span>
              <span className="text-sm font-bold text-[#10233F]">{routeInfo.distance}</span>
           </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full min-h-[350px]" />
    </div>
  );
}
