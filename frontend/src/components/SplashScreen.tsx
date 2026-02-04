"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  isLoading: boolean;
  children: React.ReactNode;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading, children }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 2 seconds if loading is complete
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // If still loading or splash screen is still visible, show the splash screen
  if (isLoading || isVisible) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <div className='text-5xl font-bold text-foreground'>
                🌍
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">CrisisAid</h1>
            <p className="text-muted-foreground mt-2">Connecting help with those in need</p>
          </motion.div>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-2 text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading resources...</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // When splash screen is done, render the children
  return <>{children}</>;
};

export default SplashScreen;