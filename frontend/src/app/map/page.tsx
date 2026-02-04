"use client";

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Alert, Resource } from '@/types';
import AppHeader from '@/components/AppHeader';
import ResourceDrawer from '@/components/ResourceDrawer';
import CriticalAlert from '@/components/CriticalAlert';

// Dynamically import LeafletMap with SSR disabled
const LeafletMap = dynamic(
  () => import('@/components/LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
);

export default function MapPage() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([0, 0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // load alert
  useEffect(() => {
    const loadAlert = async () => {
      try {
        const alertData = await fetch('https://crisisaid-backend.onrender.com/api/alerts');
        const data = await alertData.json();

        setAlerts(data)
      } catch (error) {
        toast.error('Error loading alert')
      }
    }
    loadAlert()
  }, [])

  // Load resources
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        toast.loading('Fetching resources...');
        const response = await fetch('https://crisisaid-backend.onrender.com/api/resources');
        const data = await response.json();

        if (data && data.length > 0) {
          const parsedData = data.map((res: any) => ({
            ...res,
            latitude: parseFloat(res.latitude),
            longitude: parseFloat(res.longitude),
          }));
          setAllResources(parsedData);
          setResources(parsedData);
          setCenter([parsedData[0].latitude, parsedData[0].longitude]);
        } else {
          toast.error('No resources found');
        }
      } catch (error) {
        console.error('Error loading resources:', error);
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
        toast.dismiss();
      }
    };
    loadData();
  }, []);

  // Handle resource selection
  const handleResourceSelect = useCallback((resource: Resource) => {
    setSelectedResource(resource);
    setIsDrawerOpen(true);
  }, []);

  const handleDismiss = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  // Handle search
  const handleSearch = useCallback((query: string, type?: string) => {
    setSearchQuery(query);
    
    if (!query.trim() && (!type || type === 'all')) {
      setResources(allResources);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allResources.filter((resource) => {
      const matchesQuery = !query.trim() ||
        resource.name.toLowerCase().includes(lowerQuery) ||
        resource.type.toLowerCase().includes(lowerQuery) ||
        resource.country.toLowerCase().includes(lowerQuery) ||
        resource.city.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery);

      const matchesType = !type || type === 'all' || resource.type.toLowerCase() === type.toLowerCase();

      return matchesQuery && matchesType;
    });

    setResources(filtered);
  }, [allResources]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Search */}
      <AppHeader 
        onSearch={(query, type) => handleSearch(query, type)}
        searchPlaceholder="Search resources by name, type, or location..."
        showBackButton={false}
        onBack={() => router.back()}
        initialSearchQuery={searchQuery}
      />

      {/* Main Content */}
      <main className="flex-1 relative">
        {isClient && (
          <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }>
            <LeafletMap
              resources={resources}
              selectedResource={selectedResource}
              onResourceSelect={handleResourceSelect}
              center={center}
              zoom={13}
            />
          </Suspense>
        )}
      </main>

      {/* Resource Drawer */}
      <ResourceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        resource={selectedResource}
      />
      
      <CriticalAlert 
        alerts={alerts} 
        onDismiss={handleDismiss} 
      />
    </div>
  );
}