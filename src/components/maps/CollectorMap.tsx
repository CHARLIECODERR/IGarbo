"use client";

import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer, DirectionsService, Circle } from "@react-google-maps/api";
import { Loader2, Trash2, MapPin, Calendar, Clock, Navigation } from "lucide-react";
import { WasteRequest } from "@/lib/services/request-service";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CollectorMapProps {
  requests: WasteRequest[];
  onAccept?: (request: WasteRequest) => void;
  showRoute?: boolean;
  showClusters?: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

export function CollectorMap({ requests, onAccept, showRoute, showClusters }: CollectorMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selected, setSelected] = useState<WasteRequest | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isLoaded && showRoute && requests.length >= 2) {
      const service = new google.maps.DirectionsService();
      const waypoints = requests.slice(1, -1).map(r => ({
        location: { lat: r.latitude, lng: r.longitude },
        stopover: true
      }));

      service.route(
        {
          origin: { lat: requests[0].latitude, lng: requests[0].longitude },
          destination: { lat: requests[requests.length - 1].latitude, lng: requests[requests.length - 1].longitude },
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [isLoaded, requests, showRoute]);

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
        {directions ? (
          <DirectionsRenderer 
            directions={directions} 
            options={{
              polylineOptions: {
                strokeColor: "#10b981",
                strokeWeight: 4,
                strokeOpacity: 0.8
              },
              suppressMarkers: false
            }}
          />
        ) : (
          <>
            {requests.map((request) => (
              <div key={request.id}>
                {showClusters && (
                  <Circle
                    center={{ lat: request.latitude, lng: request.longitude }}
                    radius={500}
                    options={{
                      fillColor: "#10b981",
                      fillOpacity: 0.1,
                      strokeColor: "#10b981",
                      strokeOpacity: 0.3,
                      strokeWeight: 1,
                    }}
                  />
                )}
                <Marker
                  position={{ lat: request.latitude, lng: request.longitude }}
                  onClick={() => setSelected(request)}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                />
              </div>
            ))}
          </>
        )}

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
              {onAccept && (
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
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Route Info Overlay */}
      {directions && (
        <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-xl">
              <Navigation className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimized Route</p>
              <h4 className="text-sm font-bold text-white">
                {directions.routes[0].legs.length} Stops • {Math.round(directions.routes[0].legs.reduce((acc, leg) => acc + (leg.distance?.value || 0), 0) / 1000)} km total
              </h4>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Est. Travel Time</p>
             <h4 className="text-sm font-bold text-primary">
               ~{Math.round(directions.routes[0].legs.reduce((acc, leg) => acc + (leg.duration?.value || 0), 0) / 60)} mins
             </h4>
          </div>
        </div>
      )}
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
