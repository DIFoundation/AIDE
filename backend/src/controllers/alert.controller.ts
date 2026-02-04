import { Request, Response } from "express";
import * as AlertService from "../services/alert.service";

export const fetchAlerts = async (_: Request, res: Response) => {
  try {
    const { data, error } = await AlertService.getAlerts();
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchActiveAlerts = async (_: Request, res: Response) => {
  try {
    const { data, error } = await AlertService.getActiveAlerts();
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAlertById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await AlertService.getAlertById(id as string);
    if (error) return res.status(400).json({ message: error.message });
    if (!data) return res.status(404).json({ message: "Alert not found" });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAlertsForLocation = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;
    const { data, error } = await AlertService.getAlertsForLocation(
      parseFloat(latitude as string),
      parseFloat(longitude as string)
    );
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const alertData = {
      ...req.body,
      created_by: user.id,
    };
    
    const { error } = await AlertService.createAlert(alertData);
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Alert created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await AlertService.updateAlert(id as string, req.body);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Alert updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await AlertService.deactivateAlert(id as string);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Alert deactivated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await AlertService.deleteAlert(id as string);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Alert deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};