import { Request, Response } from "express";
import * as ResourceService from "../services/resource.service";

export const fetchResources = async (req: Request, res: Response) => {
  try {
    const { type, status, limit, offset } = req.query;
    const filters = {
      type: type as string,
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    };

    const { data, error } = await ResourceService.getResources(filters);
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchResourceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await ResourceService.getResourceById(id as string);
    if (error) return res.status(400).json({ message: error.message });
    if (!data) return res.status(404).json({ message: "Resource not found" });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchResourcesByLocation = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius } = req.query;

    const { data, error } = await ResourceService.searchByLocation(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      radius ? parseFloat(radius as string) : 10
    );

    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addResource = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const resourceData = {
      ...req.body,
      submitted_by: user.id,
      // Auto-verify if user is admin or volunteer
      verified: ["ADMIN", "VOLUNTEER"].includes(user.user_metadata?.role),
      verified_by: ["ADMIN", "VOLUNTEER"].includes(user.user_metadata?.role) 
        ? user.id 
        : null,
    };

    const { error } = await ResourceService.createResource(resourceData);
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({ message: "Resource created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await ResourceService.updateResource(id as string, req.body);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Resource updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const { error } = await ResourceService.verifyResource(id as string, user.id);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Resource verified successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await ResourceService.deleteResource(id as string);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Resource deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};