export type ResourceType = 'SHELTER' | 'FOOD' | 'MEDICAL' | 'WATER' | 'CLOTHING' | 'OTHER'; 

export type ResourceStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'TEMPORARY_CLOSED';

export type AlertSeverity = 'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL';

export type SubmissionType = 'NEW_RESOURCE' | 'RESOURCE_UPDATE' | 'REPORT';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'VOLUNTEER';
  verified: boolean;
  organization?: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  lat: string;
  lng: string;
  address?: string;
  city?: string;
  country?: string;
}

// Resource types
export interface Resource{
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  description: string;
  verified: boolean;
  capacity: number;
  current_occupancy: number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  operating_hours: string;
  notes: string;
  submitted_by: User;
  verified_by: User;
  created_at: string;
  updated_at: string;
}

// Emergency Alert types
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  latitude: number;
  longitude: number;
  radius_km: number;
  address: string;
  affected_areas: [string];
  instructions: string;
  active: boolean;
  start_time: string;
  end_time: string;
  created_by: User;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id:	string;
  type:	SubmissionType;
  resource_id:	string;
  data:	Resource;
  status:	SubmissionStatus;
  submitted_by:	User;
  reviewed_by?:	User;
  review_notes?:	string;
  created_at:	string;
  reviewed_at?:	string
}