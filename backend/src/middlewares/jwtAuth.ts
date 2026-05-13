import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.slice(7);
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return res.status(500).json({ error: "JWT_ACCESS_SECRET not configured" });
  try {
    const payload = jwt.verify(token, secret);
    (req as Request & { user: unknown }).user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
}
