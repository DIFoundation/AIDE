// components/Dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gem, Send, TriangleAlert, Users } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/cookies';

interface Stats {
  alerts: {
    active: number;
    critical: number;
    total: number;
  }
  recentActivity: {
    resources: [];
    submissions: [];
  }
  resources: {
    available: number;
    pendingVerification: number;
    total: number;
    verified: number;
  }
  submissions: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
  }
  users: {
    total: number;
    verified: number;
  }
}

interface Distribution {
  CLOTHING: number;
  FOOD: number;
  MEDICAL: number;
  SHELTER: number;
}

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null);
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getAuthToken()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://crisisaid-backend.onrender.com/api/dashboard/stats', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // console.log('response: ', response)

        if (!response.ok) {
          // throw new Error('Failed to fetch stats');
          toast.error('Unauthorized, please login');
          router.push('/user');
          return;
        }

        const data = await response.json();
        setStats(data);
        // console.log('stat data: ', data)
      } catch (err) {
        setError(err as string || 'Failed to load stats');
        // console.error('Stats error:', err);
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    const fetchDistribution = async () => {
      try {
        const response = await fetch('https://crisisaid-backend.onrender.com/api/dashboard/resources/distribution', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // console.log('response: ', response)

        if (!response.ok) {
          // throw new Error('Failed to fetch stats');
          toast.error('Unauthorized, please login');
          router.push('/user');
          return;
        }

        const data = await response.json();
        setDistribution(data);
        // console.log('distribution data: ', data)
      } catch (err) {
        setError(err as string || 'Failed to load stats');
        // console.error('Stats error:', err);
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchDistribution();
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Resources"
          value={stats?.resources.total || 0}
          icon={<Gem className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Submissions"
          value={stats?.submissions.pending || 0}
          icon={<Send className="h-4 w-4" />}
        />
        <StatCard
          title="Active Alerts"
          value={stats?.alerts.total || 0}
          icon={<TriangleAlert className="h-4 w-4" />}
        />
        <StatCard
          title="Total Users"
          value={stats?.users.total || 0}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <h1 className="text-2xl font-bold">Resources Distribution</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Clothing"
          value={distribution?.CLOTHING || 0}
          icon={<Gem className="h-4 w-4" />}
        />
        <StatCard
          title="Food"
          value={distribution?.FOOD || 0}
          icon={<Send className="h-4 w-4" />}
        />
        <StatCard
          title="Medical"
          value={distribution?.MEDICAL || 0}
          icon={<TriangleAlert className="h-4 w-4" />}
        />
        <StatCard
          title="Shelter"
          value={distribution?.SHELTER || 0}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Add more dashboard widgets here */}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}