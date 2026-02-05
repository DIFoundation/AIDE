import React from 'react';
import { X, MapPin, Clock, Phone, AlertTriangle, CheckCircle, XCircle, User, Shield, Mail, Settings, Pin } from 'lucide-react';
import { Resource } from '@/types';

type ResourceDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
};

const ResourceDrawer: React.FC<ResourceDrawerProps> = ({ isOpen, onClose, resource }) => {

  if (!isOpen || !resource) return null;

  const getStatusBadge = () => {
    if (resource.verified === true) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success/20 text-success">
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning/20 text-warning">
        <AlertTriangle className="w-3 h-3 mr-1" /> Unverified
      </span>
    );
  };

  const getContactInfo = () => {
    if (!resource.phone) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-bold text-foreground/80">Contact Information</h4>
        {resource.phone && (
          <div className="flex items-center text-sm text-foreground/70">
            <Phone className="w-4 h-4 mr-2 text-primary" />
            <a href={`tel:${resource.phone}`} className="hover:underline">
              {resource.phone}
            </a>
          </div>
        )}
        {resource.email && (
          <div className="flex items-center text-sm text-foreground/70">
            <Mail className="w-4 h-4 mr-2 text-primary" />
            <a href={`mailto:${resource.email}`} className="hover:underline">
              {resource.email}
            </a>
          </div>
        )}
      </div>
    );
  };

  // const getAdminActions = () => {
  //   return (
  //     <div className="mt-6 pt-4 border-t border-border">
  //       <h4 className="text-sm font-bold text-foreground/80 mb-3">Admin Actions</h4>
  //       <div className="space-y-2">
  //         <button className="w-full px-3 py-2 text-sm font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
  //           Edit Resource
  //         </button>
  //         <button className="w-full px-3 py-2 text-sm font-bold rounded-md bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
  //           Delete Resource
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="fixed inset-0 z-400 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-background shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">{resource.name}</h2>
                <button
                  onClick={onClose}
                  className="rounded-md text-foreground/50 hover:text-foreground focus:outline-none"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-bold text-foreground/80'>Resource Type:</p>
                <h3 className="text-sm font-bold text-foreground/80">{resource.type}</h3>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      resource.status === 'AVAILABLE' ? 'bg-success' : 
                      resource.status === 'LIMITED' ? 'bg-warning' :
                      resource.status === 'TEMPORARY_CLOSED' ? 'bg-card' : 'bg-danger'
                    }`}
                  />
                  <span className="text-sm font-bold capitalize">
                    {resource.status === 'AVAILABLE' ? 'Available' : 
                     resource.status === 'LIMITED' ? 'Limited Availability' :
                     resource.status === 'TEMPORARY_CLOSED' ? 'Temporary Closed' : 'Unavailable'}
                  </span>
                </div>
                {getStatusBadge()}
              </div>

              <div className="mt-4 flex items-center text-sm text-foreground/70">
                <Pin className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>{resource.latitude}N, {resource.longitude}E</span>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-foreground/70">
                <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>{resource.address}, {resource.city}, {resource.country}</span>
              </div>

              <div className="mt-2 flex items-center text-sm text-foreground/70">
                <Clock className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>Submitted at: {new Date(resource.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="mt-2 flex items-center text-sm text-foreground/70">
                <Clock className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span>Last updated: {new Date(resource.updated_at).toLocaleDateString()}</span>
              </div>
              
              {resource.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-foreground/80 mb-1">Description</h4>
                  <p className="text-sm text-foreground/70">{resource.description}</p>
                </div>
              )}
              
              {resource.capacity ? (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-foreground/80 mb-1">Capacity</h4>
                  <p className="text-sm text-foreground/70">{resource.capacity} people</p>
                </div>
              ) : ('')}
              {resource.current_occupancy ? (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-foreground/80 mb-1">Current Occupancy</h4>
                  <p className="text-sm text-foreground/70">{resource.current_occupancy} people</p>
                </div>
              ) : ('')}

              {resource.operating_hours ? (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-foreground/80 mb-1">Operating Hours</h4>
                  <p className="text-sm text-foreground/70">{resource.operating_hours}</p>
                </div>
              ) : ('')}
              
              {getContactInfo()}
              {/* {getHours()} */}
              
              {resource.notes && (
                <div className="mt-4 p-3 bg-secondary/10 rounded-md">
                  <h4 className="text-sm font-bold text-foreground/80 mb-1">Important Notes</h4>
                  <p className="text-sm text-foreground/70">{resource.notes}</p>
                </div>
              )}
              
              {resource.submitted_by && (
                <div className="mt-4 text-xs text-foreground/50">
                  <p>Submitted by: {resource.submitted_by.name}</p>
                </div>
              )}
              
              {/* {getAdminActions()} */}
            </div>
            
            <div className="mt-auto p-4 bg-card border-t border-border">
              <button
                onClick={() => {
                  // TODO: Implement get directions
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(resource.address || ''), encodeURIComponent(resource.city || ''), encodeURIComponent(resource.country || '')}`;
                  window.open(mapsUrl, '_blank');
                }}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDrawer;