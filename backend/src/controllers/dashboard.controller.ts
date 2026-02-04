import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getDashboardStats = async (_: Request, res: Response) => {
  try {
    // Get resource statistics
    const { count: totalResources } = await supabase
      .from("resources")
      .select("*", { count: "exact", head: true });

    const { count: verifiedResources } = await supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("verified", true);

    const { count: availableResources } = await supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("status", "AVAILABLE");

    // Get alert statistics
    const { count: totalAlerts } = await supabase
      .from("alerts")
      .select("*", { count: "exact", head: true });

    const { count: activeAlerts } = await supabase
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("active", true);

    const { count: criticalAlerts } = await supabase
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("severity", "CRITICAL")
      .eq("active", true);

    // Get submission statistics
    const { count: totalSubmissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true });

    const { count: pendingSubmissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING");

    const { count: approvedSubmissions } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "APPROVED");

    // Get user statistics
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: verifiedUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("verified", true);

    // Get recent activities
    const { data: recentSubmissions } = await supabase
      .from("submissions")
      .select(`
        id,
        type,
        status,
        created_at,
        submitted_by:users!submissions_submitted_by_fkey(name)
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: recentResources } = await supabase
      .from("resources")
      .select("id, name, type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    const stats = {
      resources: {
        total: totalResources || 0,
        verified: verifiedResources || 0,
        available: availableResources || 0,
        pendingVerification: (totalResources || 0) - (verifiedResources || 0),
      },
      alerts: {
        total: totalAlerts || 0,
        active: activeAlerts || 0,
        critical: criticalAlerts || 0,
      },
      submissions: {
        total: totalSubmissions || 0,
        pending: pendingSubmissions || 0,
        approved: approvedSubmissions || 0,
      },
      users: {
        total: totalUsers || 0,
        verified: verifiedUsers || 0,
      },
      recentActivity: {
        submissions: recentSubmissions || [],
        resources: recentResources || [],
      },
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getResourceTypeDistribution = async (_: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("type");

    if (error) throw error;

    const distribution = data.reduce((acc: any, resource) => {
      acc[resource.type] = (acc[resource.type] || 0) + 1;
      return acc;
    }, {});

    res.json(distribution);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};