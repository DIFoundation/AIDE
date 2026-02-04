import { z } from "zod";

// Resource Validation
export const createResourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  type: z.enum(["SHELTER", "FOOD", "MEDICAL", "WATER", "CLOTHING", "OTHER"]),
  status: z.enum(["AVAILABLE", "LIMITED", "UNAVAILABLE", "TEMPORARILY_CLOSED"]).default("AVAILABLE"),
  description: z.string().max(1000).optional(),
  capacity: z.number().int().positive().optional(),
  current_occupancy: z.number().int().min(0).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  operating_hours: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateResourceSchema = createResourceSchema.partial();

// Alert Validation
export const createAlertSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  message: z.string().min(1, "Message is required").max(2000),
  severity: z.enum(["INFO", "WARNING", "DANGER", "CRITICAL"]),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radius_km: z.number().positive().max(1000).default(10),
  address: z.string().max(500).optional(),
  affected_areas: z.array(z.string()).optional(),
  instructions: z.string().max(2000).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
});

export const updateAlertSchema = createAlertSchema.partial();

// Submission Validation
export const createSubmissionSchema = z.object({
  type: z.enum(["NEW_RESOURCE", "RESOURCE_UPDATE", "REPORT"]),
  resource_id: z.string().uuid().optional(),
  data: z.record(z.string(), z.any()),
});

// User Validation
export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  organization: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "VOLUNTEER", "USER"]),
});

// Query Validation
export const resourceQuerySchema = z.object({
  type: z.enum(["SHELTER", "FOOD", "MEDICAL", "WATER", "CLOTHING", "OTHER"]).optional(),
  status: z.enum(["AVAILABLE", "LIMITED", "UNAVAILABLE", "TEMPORARILY_CLOSED"]).optional(),
  verified: z.string().transform(val => val === "true").optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().int().positive().max(100)).optional(),
  offset: z.string().transform(val => parseInt(val)).pipe(z.number().int().min(0)).optional(),
});

export const locationQuerySchema = z.object({
  latitude: z.string().transform(val => parseFloat(val)).pipe(z.number().min(-90).max(90)),
  longitude: z.string().transform(val => parseFloat(val)).pipe(z.number().min(-180).max(180)),
  radius: z.string().transform(val => parseFloat(val)).pipe(z.number().positive().max(1000)).default(10),
});

// Auth Validation Schemas
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(255),
  role: z.enum(["ADMIN", "VOLUNTEER", "USER"]).optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
});
