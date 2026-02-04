import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const fetchCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { data, error } = await UserService.getUserById(user.id);
    if (error) return res.status(400).json({ message: error.message });
    if (!data) return res.status(404).json({ message: "User not found" });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchAllUsers = async (_: Request, res: Response) => {
  try {
    const { data, error } = await UserService.getAllUsers();
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { error } = await UserService.updateUser(user.id, req.body);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "User updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const { error } = await UserService.updateUserRole(id as string, role);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "User role updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await UserService.verifyUser(id as string);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "User verified successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchUserStats = async (_: Request, res: Response) => {
  try {
    const { data, error } = await UserService.getUserStats();
    if (error) return res.status(400).json({ message: error });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error } = await UserService.createUser(req.body);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};