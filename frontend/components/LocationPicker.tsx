"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Custom marker
const pickerIcon = L.divIcon({
  html: `<div class="bg-orange-600 p-2.5 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
  className: "custom-picker-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Move map when center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);
  return null;
}

// Handle clicks on the map
function ClickHandler({ onSelect }: { onSelect: (location: LocationData) => void }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export type LocationData = {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
};

interface LocationPickerProps {
  formData: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any; // Allow for additional form fields
  };
  setFormData: React.Dispatch<React.SetStateAction<any>> | ((data: any) => void);
}

export default function LocationPicker({ formData, setFormData }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);

  const updateLocationData = async (lat: number, lng: number) => {
    setLoading(true);

    // Update only the location fields while preserving other form data
    setFormData((prev: any) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: prev.address || ''
    }));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const addr = data.address || {};

      setFormData((prev: any) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address: data.display_name || prev.address,
        city: addr.city || addr.town || addr.village || "",
        state: addr.state || "",
        country: addr.country || ""
      }));
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setLoading(false);
    }
  };

  const locateUser = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => updateLocationData(pos.coords.latitude, pos.coords.longitude),
      () => {
        setLoading(false);
        alert("Permission denied. Please select manually on the map.");
      }
    );
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 shadow-inner">
      <MapContainer
        center={[formData.latitude || 37.7749, formData.longitude || -122.4194]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-10"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <ClickHandler onSelect={(loc) => updateLocationData(loc.lat, loc.lng)} />
        {formData.latitude !== 0 && formData.longitude !== 0 && (
          <>
            <Marker position={[formData.latitude, formData.longitude]} icon={pickerIcon} />
            <ChangeView center={[formData.latitude, formData.longitude]} />
          </>
        )}
      </MapContainer>

      {/* Instructions overlay */}
      {/* {formData.latitude === 0 && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-500">
          <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
            <MapPin size={14} className="text-orange-500" />
            <span className="text-xs font-medium text-white">Tap map to set location</span>
          </div>
        </div>
      )} */}

      {/* Current location button */}
      <div className="absolute top-4 right-4 z-400">
        <button
          type="button"
          onClick={locateUser}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          Use My Location
        </button>
      </div>

      {/* Address footer */}
      <div className="absolute bottom-0 left-0 right-0 z-400 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            Selected Location
          </p>
          <p className="text-sm text-slate-200 font-medium line-clamp-1">
            {loading ? "Searching coordinates..." : formData.address || "No location selected yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
