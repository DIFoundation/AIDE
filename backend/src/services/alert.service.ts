import { supabase } from "../config/supabase";

export const getAlerts = async () => {
  return supabase
    .from("alerts")
    .select("*, created_by:users!alerts_created_by_fkey(id, name)")
    .order("created_at", { ascending: false });
};

export const getActiveAlerts = async () => {
  return supabase
    .from("alerts")
    .select("*, created_by:users!alerts_created_by_fkey(id, name)")
    .eq("active", true)
    .order("severity", { ascending: false })
    .order("created_at", { ascending: false });
};

export const getAlertById = async (id: string) => {
  return supabase
    .from("alerts")
    .select("*, created_by:users!alerts_created_by_fkey(id, name)")
    .eq("id", id)
    .single();
};

export const getAlertsForLocation = async (
  latitude: number,
  longitude: number
) => {
  // Get all active alerts
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("active", true);

  if (error) return { data: null, error };

  // Filter alerts that affect this location using the database function
  const affectingAlerts = [];
  
  for (const alert of data || []) {
    if (alert.latitude && alert.longitude && alert.radius_km) {
      const { data: isAffected } = await supabase.rpc(
        "is_location_in_alert_radius",
        {
          alert_lat: alert.latitude,
          alert_lng: alert.longitude,
          alert_radius: alert.radius_km,
          check_lat: latitude,
          check_lng: longitude,
        }
      );

      if (isAffected) {
        affectingAlerts.push(alert);
      }
    }
  }

  return { data: affectingAlerts, error: null };
};

export const createAlert = async (data: any) => {
  return supabase.from("alerts").insert(data);
};

export const updateAlert = async (id: string, data: any) => {
  return supabase
    .from("alerts")
    .update(data)
    .eq("id", id);
};

export const deactivateAlert = async (id: string) => {
  return supabase
    .from("alerts")
    .update({ active: false })
    .eq("id", id);
};

export const deleteAlert = async (id: string) => {
  return supabase
    .from("alerts")
    .delete()
    .eq("id", id);
};