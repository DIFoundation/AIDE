import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings > API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Type safety for your database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'ADMIN' | 'VOLUNTEER' | 'USER';
          verified: boolean;
          organization: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      resources: {
        Row: {
          id: string;
          name: string;
          type: 'SHELTER' | 'FOOD' | 'MEDICAL' | 'WATER' | 'CLOTHING' | 'OTHER';
          status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'TEMPORARILY_CLOSED';
          description: string | null;
          verified: boolean;
          capacity: number | null;
          current_occupancy: number | null;
          latitude: number | null;
          longitude: number | null;
          address: string | null;
          city: string | null;
          country: string | null;
          phone: string | null;
          email: string | null;
          operating_hours: string | null;
          notes: string | null;
          submitted_by: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          message: string;
          severity: 'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL';
          latitude: number | null;
          longitude: number | null;
          radius_km: number | null;
          address: string | null;
          affected_areas: string[] | null;
          instructions: string | null;
          active: boolean;
          start_time: string;
          end_time: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          type: 'NEW_RESOURCE' | 'RESOURCE_UPDATE' | 'REPORT';
          resource_id: string | null;
          data: any;
          submitted_by: string;
          status: 'PENDING' | 'APPROVED' | 'REJECTED';
          reviewed_by: string | null;
          review_notes: string | null;
          created_at: string;
          reviewed_at: string | null;
        };
      };
    };
  };
};