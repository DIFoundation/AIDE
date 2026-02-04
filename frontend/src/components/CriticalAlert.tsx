"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Info, AlertCircle, Bell } from 'lucide-react';
import { Alert, AlertSeverity } from '@/types';

interface CriticalAlertProps {
  alerts?: Alert[];
  onDismiss?: (alertId: string) => void;
}

const getAlertIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'INFO':
      return <Info size={20} className="text-white" />;
    case 'DANGER':
      return <AlertTriangle size={20} className="text-white" />;
    case 'WARNING':
      return <AlertCircle size={20} className="text-white" />;
    case 'CRITICAL':
    default:
      return <AlertTriangle size={20} className="text-white" />;
  }
};

const getAlertColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-600/90 border-red-600/80 shadow-[0_0_30px_rgba(239,68,68,0.4)]';
    case 'DANGER':
      return 'bg-red-500/90 border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)]';
    case 'WARNING':
      return 'bg-yellow-500/90 border-yellow-500/80 shadow-[0_0_30px_rgba(234,179,8,0.3)]';
    case 'INFO':
    default:
      return 'bg-blue-600/90 border-blue-600/80 shadow-[0_0_30px_rgba(30,58,138,0.3)]';
  }
};

export default function CriticalAlert({ 
  alerts = [], 
  onDismiss = () => {} 
}: CriticalAlertProps) {
  const [visibleAlert, setVisibleAlert] = React.useState<Alert | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // Auto-dismiss after 10 seconds, unless hovered
  React.useEffect(() => {
    if (!alerts.length || isHovered) return;

    const timer = setTimeout(() => {
      setVisibleAlert(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, [alerts, isHovered]);

  // Show the next alert when the current one is dismissed
  const handleDismiss = (alertId: string) => {
    onDismiss(alertId);
    setVisibleAlert(null);
  };

  // Set the next alert to show when alerts change or current is dismissed
  React.useEffect(() => {
    if (alerts.length > 0 && !visibleAlert) {
      setVisibleAlert(alerts[0]);
    } else if (alerts.length === 0) {
      setVisibleAlert(null);
    }
  }, [alerts, visibleAlert]);

  if (!visibleAlert) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-2000 w-[90%] max-w-lg rounded-xl border ${getAlertColor(visibleAlert.severity)}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-full animate-pulse">
            {getAlertIcon(visibleAlert.severity)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-white/80" />
                <h4 className="font-bold text-sm uppercase tracking-wider text-white/90">
                  {visibleAlert.title}
                </h4>
              </div>
              <button 
                onClick={() => handleDismiss(visibleAlert.id)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Dismiss alert"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-sm text-white/90 leading-relaxed">
              {visibleAlert.message}
            </p>
            
            {visibleAlert.instructions && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-xs font-medium text-white/80">Instructions:</p>
                <p className="text-xs text-white/70">{visibleAlert.instructions}</p>
              </div>
            )}
            
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-xs text-white/60">
                {new Date(visibleAlert.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}