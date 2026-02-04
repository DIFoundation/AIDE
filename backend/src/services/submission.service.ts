import { supabase } from "../config/supabase";

export const getSubmissions = async (verified?: string) => {
  return supabase
    .from("submissions")
    .select(`
      *,
      submitted_by:users!submissions_submitted_by_fkey(id, name, email),
      reviewed_by:users!submissions_reviewed_by_fkey(id, name),
      resource:resources(id, name, type)
    `)
    .eq("verified", verified)
    .order("created_at", { ascending: false });
};

export const getPendingSubmissions = async () => {
  return supabase
    .from("submissions")
    .select(`
      *,
      submitted_by:users!submissions_submitted_by_fkey(id, name, email),
      resource:resources(id, name, type)
    `)
    .eq("status", "PENDING")
    .order("created_at", { ascending: false });
};

export const getUserSubmissions = async (userId: string) => {
  return supabase
    .from("submissions")
    .select(`
      *,
      reviewed_by:users!submissions_reviewed_by_fkey(id, name),
      resource:resources(id, name, type)
    `)
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false });
};

export const getSubmissionById = async (id: string) => {
  return supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();
};

export const createSubmission = async (data: any) => {
  return supabase.from("submissions").insert(data);
};

export const approveNewResource = async (submission: any, reviewerId: string) => {
  // Create the new resource from submission data
  const { error: resourceError } = await supabase
    .from("resources")
    .insert({
      ...submission.data,
      submitted_by: submission.submitted_by,
      verified_by: reviewerId,
      verified: true,
    });

  if (resourceError) return resourceError;

  // Update submission status
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      status: "APPROVED",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submission.id);

  return updateError;
};

export const approveResourceUpdate = async (submission: any, reviewerId: string) => {
  if (!submission.resource_id) {
    return { message: "Resource ID is required for updates" };
  }

  // Update the existing resource
  const { error: resourceError } = await supabase
    .from("resources")
    .update(submission.data)
    .eq("id", submission.resource_id);

  if (resourceError) return resourceError;

  // Update submission status
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      status: "APPROVED",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submission.id);

  return updateError;
};

export const approveReport = async (submission: any, reviewerId: string) => {
  // For reports, just mark as approved
  // You might want to add additional logic here based on report type
  const { error } = await supabase
    .from("submissions")
    .update({
      status: "APPROVED",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submission.id);

  return error;
};

export const rejectSubmission = async (
  id: string, 
  reviewerId: string, 
  notes?: string
) => {
  return supabase
    .from("submissions")
    .update({
      status: "REJECTED",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      review_notes: notes,
    })
    .eq("id", id);
};