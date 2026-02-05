"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Resource } from '@/types';
import { Loader2 } from 'lucide-react';

// Create a dynamic import for the map container to avoid SSR issues
const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

// Create a dynamic import for other Leaflet components
const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const DynamicPopup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// const DynamicCircle = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Circle),
//   { ssr: false }
// );

// Component to handle map view changes
const MapController = ({
  selectedResource,
}: {
  selectedResource: Resource | null;
  resources: Resource[];
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedResource) {
      map.flyTo(
        [(selectedResource.latitude), (selectedResource.longitude)],
        15
      );
    }
  }, [selectedResource, map]);

  return null;
};

interface LeafletMapProps {
  resources: Resource[];
  selectedResource: Resource | null;
  onResourceSelect: (resource: Resource) => void;
  center: [number, number];
  zoom: number;
}

function LeafletMap({
  resources,
  selectedResource,
  onResourceSelect,
  center: propCenter,
  zoom,
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    setMounted(true);
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to retrieve your location. Using default coordinates.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser. Using default coordinates.');
    }

    // Fix for default marker icons
    if (typeof window !== 'undefined') {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/images/marker-icon.jpg',
        iconUrl: '/images/marker-icon.jpg',
        shadowUrl: '/images/marker-shadow.jpg',
      });
    }
    
    return () => setMounted(false);
  }, []);

  // Use current location if available, otherwise fall back to prop center
  const center = currentLocation || propCenter;

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const createCustomIcon = (status: string) => {
    const color = {
      available: '#10B981', // green-500
      limited: '#F59E0B',   // amber-500
      unavailable: '#EF4444', // red-500
    }[status] || '#3B82F6'; // blue-500 as default

    return L.divIcon({
      html: `
        <div class="relative">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M16 0C7.163 0 0 7.163 0 16C0 27.5 16 40 16 40C16 40 32 27.5 32 16C32 7.163 24.837 0 16 0Z" 
              fill="${color}"
              class="drop-shadow-lg"
            />
            <circle cx="16" cy="14" r="8" fill="white" fillOpacity="0.9" />
          </svg>
        </div>
      `,
      className: 'bg-transparent border-none',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <div className="h-full w-full">
      <DynamicMapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
      >
        <DynamicTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController 
          selectedResource={selectedResource} 
          resources={resources} 
        />

        {/* Current Location Marker */}
        {currentLocation && (
          <DynamicMarker 
            position={currentLocation} 
            icon={L.divIcon({
              html: `
                <div class="relative">
                  <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 0C7.163 0 0 7.163 0 16C0 27.5 16 40 16 40C16 40 32 27.5 32 16C32 7.163 24.837 0 16 0Z" fill="#EF4444"/>
                    <circle cx="16" cy="16" r="6" fill="white" fill-opacity="0.9" />
                  </svg>
                </div>
              `,
              className: 'bg-transparent border-none',
              iconSize: [32, 40],
              iconAnchor: [16, 40],
              popupAnchor: [0, -40],
            })}
          >
            <DynamicPopup>Your current location</DynamicPopup>
          </DynamicMarker>
        )}

        {resources.map((resource) => {
          const lat = resource.latitude;
          const lng = resource.longitude;
          
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <DynamicMarker
              key={resource.id}
              position={[lat, lng]}
              icon={createCustomIcon(resource.status?.toLowerCase() || '')}
              eventHandlers={{
                click: () => onResourceSelect(resource),
              }}
            >
              <DynamicPopup>
                <div className="p-2">
                  <h3 className="font-bold">{resource.name}</h3>
                  <p className="text-sm">{resource.address}</p>
                  <p className="text-xs text-gray-500">
                    {resource.city}, {resource.country}
                  </p>
                  <p className="text-xs text-gray-500">
                    {resource.type}
                  </p>
                </div>
              </DynamicPopup>
            </DynamicMarker>
          );
        })}
      </DynamicMapContainer>
    </div>
  );
}

export default LeafletMap;