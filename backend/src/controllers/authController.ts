import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const { accessToken, refreshToken } = await authService.login(username, password);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return res.status(401).json({ error: message });
  }
}

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const user = await authService.register(username, password);
    return res.status(201).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return res.status(400).json({ error: message });
  }
}

export function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) return res.status(500).json({ error: "JWT_REFRESH_SECRET not configured" });
  try {
    const payload = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
    const accessToken = authService.createAccessToken(payload.id, payload.username, payload.role);
    return res.json({ accessToken });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Refresh token expired" });
    }
    return res.status(403).json({ error: "Invalid refresh token" });
  }
}

