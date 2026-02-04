"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from './SplashScreen';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate loading time (you can replace this with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show splash screen on auth pages
  const isAuthPage = pathname === '/user' || pathname.startsWith('/auth');
  const showSplash = !isAuthPage && (isLoading || !pathname);

  return (
    <SplashScreen isLoading={showSplash}>
      {children}
    </SplashScreen>
  );
}
