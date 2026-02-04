import { supabase } from "../config/supabase";

export const getUserById = async (id: string) => {
  return supabase.from("users").select("*").eq("id", id).single();
};

export const getAllUsers = async () => {
  return supabase
    .from("users")
    .select("id, name, email, role, verified, organization, phone, created_at")
    .order("created_at", { ascending: false });
};

export const createUser = async (data: any) => {
  return supabase.from("users").insert(data);
};

export const updateUser = async (id: string, data: any) => {
  return supabase.from("users").update(data).eq("id", id);
};

export const updateUserRole = async (id: string, role: string) => {
  return supabase.from("users").update({ role }).eq("id", id);
};

export const verifyUser = async (id: string) => {
  return supabase.from("users").update({ verified: true }).eq("id", id);
};

export const getUserStats = async () => {
  // Get total counts
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: verifiedUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("verified", true);

  const { count: admins } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "ADMIN");

  const { count: volunteers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "VOLUNTEER");

  return {
    data: {
      total: totalUsers || 0,
      verified: verifiedUsers || 0,
      admins: admins || 0,
      volunteers: volunteers || 0,
      users: (totalUsers || 0) - (admins || 0) - (volunteers || 0),
    },
    error: null,
  };
};