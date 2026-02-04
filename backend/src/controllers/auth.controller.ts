import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: name || 'User',
        role: role || 'USER',
      },
    });

    if (error) {
      return res.status(400).json({ 
        message: error.message,
        error: error.message 
      });
    }

    // User profile is auto-created by database trigger
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || 'User',
        role: role || 'USER',
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ 
        message: "Invalid credentials",
        error: error.message 
      });
    }

    // Get user profile from database
    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    res.json({
      message: "Login successful",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.name,
          role: data.user.user_metadata.role,
          verified: data.user.user_metadata.verified,
          organization: data.user.user_metadata.organization,
          phone: data.user.phone,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at,
        },
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Note: Supabase handles token invalidation automatically
    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: "Signed out successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    res.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: "Password reset email sent" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { password } = req.body;

    // Use admin API to update password
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Get full user profile from database
    const { data: userProfile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(userProfile);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};