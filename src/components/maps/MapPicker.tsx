"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialCenter?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 19.0760, // Mumbai default
  lng: 72.8777,
};

export function MapPicker({ onLocationSelect, initialCenter }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(
    initialCenter || null
  );

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarker(newPos);
      onLocationSelect(newPos.lat, newPos.lng);
    }
  }, [onLocationSelect]);

  if (!isLoaded) return (
    <div className="w-full h-[300px] bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker || initialCenter || defaultCenter}
        zoom={13}
        onClick={onMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: darkMapStyles, // Optional: Add a dark theme to match our app
        }}
      >
        {marker && <Marker position={marker} draggable={true} onDragEnd={(e) => {
          if (e.latLng) {
            const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            setMarker(newPos);
            onLocationSelect(newPos.lat, newPos.lng);
          }
        }} />}
      </GoogleMap>
    </div>
  );
}

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
