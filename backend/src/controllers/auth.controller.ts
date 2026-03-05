import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    res.json({ accessToken });

  } catch (error: unknown) {
  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_SECRET as string
    ) as any;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: "Forbidden" });

    const newAccessToken = generateAccessToken(user.id);

    res.json({ accessToken: newAccessToken });

  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(204);

  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_SECRET as string
    ) as any;

    await prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });

  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};