import { Request, Response } from "express";
import * as SubmissionService from "../services/submission.service";

export const fetchSubmissions = async (req: Request, res: Response) => {
  try {
    const { verified } = req.query;
    const { data, error } = await SubmissionService.getSubmissions(verified as string);
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchPendingSubmissions = async (_: Request, res: Response) => {
  try {
    const { data, error } = await SubmissionService.getPendingSubmissions();
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchMySubmissions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { data, error } = await SubmissionService.getUserSubmissions(user.id);
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const submissionData = {
      ...req.body,
      submitted_by: user.id,
    };
    
    const { error } = await SubmissionService.createSubmission(submissionData);
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Submission created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const approveSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    // Get submission details
    const { data: submission, error: fetchError } = 
      await SubmissionService.getSubmissionById(id as string);
    
    if (fetchError || !submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Process based on submission type
    let processError = null;
    
    if (submission.type === "NEW_RESOURCE") {
      processError = await SubmissionService.approveNewResource(
        submission, 
        user.id
      );
    } else if (submission.type === "RESOURCE_UPDATE") {
      processError = await SubmissionService.approveResourceUpdate(
        submission, 
        user.id
      );
    } else if (submission.type === "REPORT") {
      processError = await SubmissionService.approveReport(
        submission, 
        user.id
      );
    }

    if (processError) {
      return res.status(400).json({ message: processError.message });
    }

    res.json({ message: "Submission approved successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const { review_notes } = req.body;
    
    const { error } = await SubmissionService.rejectSubmission(
      id as string, 
      user.id, 
      review_notes
    );
    
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Submission rejected successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};