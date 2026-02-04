"use client";

import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import { Resource } from '@/types';

// Map options
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
};

// Default map center (you can set this to your preferred default location)
const defaultCenter = {
  lat: 0,
  lng: 0,
};

// Custom marker icons
const markerIcons = {
  SHELTER: {
    url: '/markers/shelter.png',
    scaledSize: new window.google.maps.Size(32, 32),
  },
  FOOD: {
    url: '/markers/food.png',
    scaledSize: new window.google.maps.Size(32, 32),
  },
  MEDICAL: {
    url: '/markers/medical.png',
    scaledSize: new window.google.maps.Size(32, 32),
  },
  WATER: {
    url: '/markers/water.png',
    scaledSize: new window.google.maps.Size(32, 32),
  },
  CLOTHING: {
    url: '/markers/clothing.png',
    scaledSize: new window.google.maps.Size(32, 32),
  },
  OTHER: {
    url: '/markers/other.png',
    scaledSize: new window.google.maps.Size(32, 32),
  },
};

interface GoogleMapComponentProps {
  resources: Resource[];
  selectedResource: Resource | null;
  onResourceSelect: (resource: Resource | null) => void;
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  resources = [],
  selectedResource,
  onResourceSelect,
  center = defaultCenter,
  zoom = 12,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  // Memoize the map to prevent unnecessary re-renders
  const mapComponent = useMemo(() => {
    if (!isLoaded) return <div>Loading map...</div>;

    return (
      <GoogleMap
        zoom={zoom}
        center={center}
        options={mapOptions}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onClick={() => onResourceSelect(null)}
      >
        {resources.map((resource) => (
          <MarkerF
            key={resource.id}
            position={{
              lat: parseFloat(resource.latitude as any),
              lng: parseFloat(resource.longitude as any),
            }}
            icon={markerIcons[resource.type] || markerIcons.OTHER}
            onClick={() => onResourceSelect(resource)}
          >
            {selectedResource?.id === resource.id && (
              <InfoWindow
                position={{
                  lat: parseFloat(resource.latitude as any),
                  lng: parseFloat(resource.longitude as any),
                }}
                onCloseClick={() => onResourceSelect(null)}
              >
                <div className="text-sm">
                  <h3 className="font-bold">{resource.name}</h3>
                  <p>{resource.type}</p>
                  <p className="text-gray-600">{resource.address}</p>
                </div>
              </InfoWindow>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    );
  }, [isLoaded, resources, selectedResource, center, zoom, onResourceSelect]);

  return (
    <div className="w-full h-full">
      {!isLoaded ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading map...</p>
        </div>
      ) : (
        mapComponent
      )}
    </div>
  );
};

export default GoogleMapComponent;
