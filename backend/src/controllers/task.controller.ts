import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.userId!,
      },
    });

    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const search = (req.query.search as string) || "";
    const status = req.query.status as string;
    const sort = (req.query.sort as string) || "desc";

    const whereCondition: any = {
      userId: req.userId,
      AND: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };

    if (status === "completed") {
      whereCondition.completed = true;
    }

    if (status === "pending") {
      whereCondition.completed = false;
    }

    const tasks = await prisma.task.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
    });

    const total = await prisma.task.count({
      where: whereCondition,
    });

    res.json({
      success: true,
      data: tasks,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await prisma.task.updateMany({
      where: {
        id,
        userId: req.userId,
      },
      data: req.body,
    });

    if (!updated.count)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.task.deleteMany({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!deleted.count)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    const updated = await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};