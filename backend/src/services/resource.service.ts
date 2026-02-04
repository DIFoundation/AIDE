import { supabase } from "../config/supabase";

interface ResourceFilters {
  type?: string;
  status?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

export const getResources = async (filters: ResourceFilters = {}) => {
  let query = supabase
    .from("resources")
    .select(`
      *,
      submitted_by:users!resources_submitted_by_fkey(id, name),
      verified_by:users!resources_verified_by_fkey(id, name)
    `);

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.verified !== undefined) {
    query = query.eq("verified", filters.verified);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
  }

  return query.order("created_at", { ascending: false });
};

export const getResourceById = async (id: string) => {
  return supabase
    .from("resources")
    .select(`
      *,
      submitted_by:users!resources_submitted_by_fkey(id, name, email, phone),
      verified_by:users!resources_verified_by_fkey(id, name)
    `)
    .eq("id", id)
    .single();
};

export const searchByLocation = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
) => {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) return { data: null, error };

  // Filter by distance using Haversine formula
  const filtered = data?.filter((resource) => {
    const R = 6371; // Earth's radius in km
    const dLat = (resource.latitude - latitude) * (Math.PI / 180);
    const dLon = (resource.longitude - longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latitude * (Math.PI / 180)) *
        Math.cos(resource.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
  });

  // Sort by distance
  const sorted = filtered?.sort((a, b) => {
    const distA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
    const distB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
    return distA - distB;
  });

  return { data: sorted, error: null };
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const createResource = async (data: any) => {
  return supabase.from("resources").insert(data);
};

export const updateResource = async (id: string, data: any) => {
  return supabase.from("resources").update(data).eq("id", id);
};

export const verifyResource = async (id: string, verifierId: string) => {
  return supabase
    .from("resources")
    .update({ 
      verified: true,
      verified_by: verifierId,
    })
    .eq("id", id);
};

export const deleteResource = async (id: string) => {
  return supabase.from("resources").delete().eq("id", id);
};