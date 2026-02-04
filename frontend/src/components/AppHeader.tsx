"use client";

import { useState } from 'react';
import { Search, Menu, X, MapPin, LogOut, User, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { ResourceType } from '@/types';
import Image from 'next/image';
import { getAuthToken, removeAuthToken } from '@/lib/cookies';

interface AppHeaderProps {
  searchPlaceholder?: string;
  onSearch?: (query: string, type?: ResourceType) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  initialSearchQuery?: string;
  initialResourceType?: ResourceType;
}

export default function AppHeader({
  searchPlaceholder = 'Search for resources...',
  onSearch,
  showBackButton = false,
  onBack,
  initialSearchQuery = '',
  //   initialResourceType = 'all',
}: AppHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [resourceType, setResourceType] = useState<ResourceType>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery, resourceType);
  };

  const token = getAuthToken();

  const handleLogout = async () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    try {
      await fetch('https://crisisaid-backend.onrender.com/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.ok) {
            removeAuthToken();
            setIsLoggedIn(false);
            router.push('/user');
          }
        })
        .catch(error => {
          console.error('Logout failed:', error);
        });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    router.push('/user');
  };

  return (
    <header className="sticky top-0 z-400 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6 justify-between">
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <nav className="flex flex-col h-full p-4 space-y-4">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => router.push('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => router.push('/userProfile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" className="justify-start" onClick={handleLogin}>
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {showBackButton && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <X className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
        </div>

        {/* Logo / Title */}
        <div className="hidden md:flex items-center">
          <div className="text-2xl font-bold text-foreground">🌍</div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 px-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 bg-transparent text-sm focus:outline-none"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as ResourceType)}
            >
              <option value="--">All Types</option>
              <option value="FOOD">Food</option>
              <option value="SHELTER">Shelter</option>
              <option value="MEDICAL">Medical</option>
              <option value="WATER">Water</option>
              <option value="CLOTHING">Clothing</option>
              <option value="OTHER">Other</option>
            </select>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/userProfile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleLogin}>
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
