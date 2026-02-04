// eslint-disable-file @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from "express";

export const authorize =
  (roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!roles.includes(user.user_metadata.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
