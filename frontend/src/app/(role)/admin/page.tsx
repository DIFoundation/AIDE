'use client';

import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { getAuthToken } from '@/lib/cookies';
import { LayoutDashboard, Gem, Send, TriangleAlert, Users, User, LogOut, Home, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type Tab = 'dashboard' | 'resources' | 'submissions' | 'alerts' | 'users';

// Dynamically import admin components with SSR disabled
const AdminDashboard = dynamic(
  () => import('./components/Dashboard'),
  { ssr: false }
);

const AdminResources = dynamic(
  () => import('./components/Resources'),
  { ssr: false }
);

const AdminSubmissions = dynamic(
  () => import('./components/Submissions'),
  { ssr: false }
);

const AdminAlerts = dynamic(
  () => import('./components/Alerts'),
  { ssr: false }
);

const AdminUsers = dynamic(
  () => import('./components/Users'),
  { ssr: false }
);

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error('You are not logged in');
      router.push('/user');
      return;
    }

    // Additional authentication logic if needed
    const verifyToken = async () => {
      try {
        const response = await fetch('https://crisisaid-backend.onrender.com/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        toast.error('Session expired. Please log in again.');
        router.push('/user');
      }
    };

    verifyToken();
  }, [router]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'resources', label: 'Resources', icon: <Gem size={20} /> },
    { id: 'submissions', label: 'Submissions', icon: <Send size={20} /> },
    { id: 'alerts', label: 'Alerts', icon: <TriangleAlert size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'resources':
        return <AdminResources />;
      case 'submissions':
        return <AdminSubmissions />;
      case 'alerts':
        return <AdminAlerts />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  useEffect(() => {
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        toast.error('You are not logged in');
        // router.push('/user');
        return;
      }
      const fetchLoggedinUser = async () => {
        const response = await fetch('https://crisisaid-backend.onrender.com/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // console.log('data: ', data);
        setUserData(data);
      };
      fetchLoggedinUser();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://crisisaid-backend.onrender.com/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
        },
      });
      Cookies.remove('authToken');
      toast.success('You have been logged out');
      router.push('/user');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card-dark text-black flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-light-bg/10 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">CrisisAid Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-white/10"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <button 
            onClick={() => router.push('/')}
            className='w-full flex items-center gap-3 p-5 text-light-bg/60 hover:bg-card-light/5 rounded-lg transition-colors'>
            <Home size={20} />
            {sidebarOpen && <span>Home</span>}
          </button>

          <button 
            onClick={() => router.push('/map')}
            className='w-full flex items-center gap-3 p-5 text-light-bg/60 hover:bg-card-light/5 rounded-lg transition-colors'>
            <Map size={20} />
            {sidebarOpen && <span>Map</span>}
          </button>

          <nav className="flex-1 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-light-bg/60 hover:bg-card-light/5'
                  }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                {sidebarOpen && <span className="truncate">{tab.label}</span>}
              </button>
            ))}

            <button
              onClick={() => router.push('/userProfile')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-light-bg/60 hover:bg-card-light/5`}
            >
              <span className="shrink-0"><User size={20} /></span>
              {sidebarOpen && <span className="truncate">Profile</span>}
            </button>

          </nav>
          {/* log out button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-5 text-light-bg/60 hover:bg-card-light/5 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-light-bg/10 bg-white flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {<User size={16} className="text-primary" />}
              </div>
              <span className="text-sm font-medium">
                {userData?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}