// Resource types
export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    location: Location;
    status: ResourceStatus;
    description?: string;
    contactInfo?: {
      phone: string,
      email: string,
    };
    verified: boolean;
    lastUpdated: string;
    capacity?: number;
    currentOccupancy?: number;
    notes?: string;
  }
  
  export type ResourceType = 'medical' | 'shelter' | 'food' | 'water' | 'power' | 'other';
  
  export type ResourceStatus = 'available' | 'limited' | 'unavailable' | 'temporary_closed';
  
  export interface Location {
    lat: string;
    lng: string;
    address?: string;
    city?: string;
    country?: string;
  }
  
  // Emergency Alert types
  export interface EmergencyAlert {
    id: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'danger' | 'critical';
    location?: Location;
    startTime: string;
    endTime?: string;
    affectedAreas?: string[];
    instructions?: string;
  }
  
  // User types
  export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'moderator';
    organization?: string;
    lastActive: string;
  }
  
  // Submission types
  export interface Submission {
    id: string;
    resource: Omit<Resource, 'id' | 'verified' | 'lastUpdated'>;
    submittedBy: string; // User ID
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string; // User ID
    reviewedAt?: string;
    reviewNotes?: string;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
  }
  

  // export type Location = {
  //   latitude: number;
  //   longitude: number;
  //   address?: string;
  // };
  
  // export type ResourceType = "SHELTER" | "FOOD" | "MEDICAL" | "WATER" | "CLOTHING";
  // export type ResourceStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
  
  // export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  
  // export type UserRole = "ADMIN" | "VOLUNTEER" | "USER";
  
  // export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
  