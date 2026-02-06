'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { getAuthToken, removeAuthToken } from '@/lib/cookies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/user');
          return;
        }

        const response = await fetch('https://aide-backend-qj4f.onrender.com/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile, kindly try to log in again');
        router.push('/user  ');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = getAuthToken();
      await fetch('https://aide-backend-qj4f.onrender.com/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      removeAuthToken();
      toast.success('You have been logged out');
      router.push('/user');
    } catch (error) {
      console.error(error);
    }
  }

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    toast.info('Edit profile functionality coming soon');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <Card>
            <CardContent className="pt-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-32 mt-6" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground mb-6">Unable to load user profile. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <ArrowLeft size={20} onClick={() => router.back()} />
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>
          <Button onClick={handleEditProfile} variant="outline">
            Edit Profile
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'}>
                {user.role}
              </Badge>

              {user.role === 'ADMIN' && (
                <Button variant="default" onClick={() => router.push('/admin')}>
                  Admin Dashboard
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="mt-1">{user.email}</p>
            </div>

            {user.phone && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p className="mt-1">{user.phone}</p>
              </div>
            )}

            {user.organization && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
                <p className="mt-1">{user.organization}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
              <div className="mt-1 flex items-center">
                {user.verified ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    <span>Pending Verification</span>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
              <p className="mt-1">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <Button
                variant='destructive'
                onClick={handleLogout}
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
