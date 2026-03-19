"use client";

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Loader2, Trash2, MapPin, Calendar, Clock } from "lucide-react";
import { WasteRequest } from "@/lib/services/request-service";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CollectorMapProps {
  requests: WasteRequest[];
  onAccept: (request: WasteRequest) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

export function CollectorMap({ requests, onAccept }: CollectorMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selected, setSelected] = useState<WasteRequest | null>(null);

  if (!isLoaded) return <div className="h-[500px] flex items-center justify-center glass rounded-3xl"><Loader2 className="animate-spin text-secondary" /></div>;

  const center = requests.length > 0 
    ? { lat: requests[0].latitude, lng: requests[0].longitude }
    : { lat: 19.0760, lng: 72.8777 };

  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: darkMapStyles,
        }}
      >
        {requests.map((request) => (
          <Marker
            key={request.id}
            position={{ lat: request.latitude, lng: request.longitude }}
            onClick={() => setSelected(request)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2 min-w-[200px] text-slate-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                  <img src={selected.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{selected.type} Waste</h4>
                  <p className="text-[10px] text-slate-500 font-medium">By {selected.userName}</p>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <MapPin size={10} /> {selected.address}
                </p>
                <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Clock size={10} /> {new Date(selected.scheduledAt).toLocaleString()}
                </p>
              </div>
              <Button 
                size="sm" 
                className="w-full py-1 h-8 text-[10px] bg-secondary hover:bg-secondary/80 text-white"
                onClick={() => {
                  onAccept(selected);
                  setSelected(null);
                }}
              >
                Accept Pickup
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
];
