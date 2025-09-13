import { Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.select().from(users);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, email } = req.body;
    const [user] = await db.insert(users).values({ userId, name, email }).returning();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await db.update(users).set(updates).where(eq(users.userId, id)).returning();
    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [deleted] = await db.delete(users).where(eq(users.userId, id)).returning();
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully", user: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
