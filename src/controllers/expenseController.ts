import { Request, Response } from "express";
import { db } from "../db/connection";
import { expenses, expenseByCategory, expenseSummary } from "../db/schema";
import { desc, eq, gte, lte, and, like } from "drizzle-orm";

export const getExpensesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenseByCategorySummaryRaw = await db
      .select()
      .from(expenseByCategory)
      .orderBy(desc(expenseByCategory.date));

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json(expenseByCategorySummary);
  } catch (error) {
    console.error("Error retrieving expenses by category:", error);
    res.status(500).json({ message: "Error retrieving expenses by category" });
  }
};

export const getExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, startDate, endDate } = req.query;
    
    const conditions = [];

    if (category) {
      conditions.push(like(expenses.category, `%${category}%`));
    }
    if (startDate) {
      conditions.push(gte(expenses.timestamp, new Date(startDate as string)));
    }
    if (endDate) {
      conditions.push(lte(expenses.timestamp, new Date(endDate as string)));
    }

    const expensesList =
      conditions.length > 0
        ? await db
            .select()
            .from(expenses)
            .where(and(...conditions))
            .orderBy(desc(expenses.timestamp))
        : await db
            .select()
            .from(expenses)
            .orderBy(desc(expenses.timestamp));
    res.json(expensesList);
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const [expense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.expenseId, id));

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json(expense);
  } catch (error) {
    console.error("Error retrieving expense:", error);
    res.status(500).json({ message: "Error retrieving expense" });
  }
};

export const createExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { expenseId, category, amount, timestamp } = req.body;
    
    const [newExpense] = await db
      .insert(expenses)
      .values({
        expenseId,
        category,
        amount,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      })
      .returning();

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Error creating expense" });
  }
};

export const updateExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.timestamp) {
      updates.timestamp = new Date(updates.timestamp);
    }

    const [updatedExpense] = await db
      .update(expenses)
      .set(updates)
      .where(eq(expenses.expenseId, id))
      .returning();

    if (!updatedExpense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const [deletedExpense] = await db
      .delete(expenses)
      .where(eq(expenses.expenseId, id))
      .returning();

    if (!deletedExpense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json({ 
      message: "Expense deleted successfully", 
      expense: deletedExpense 
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};

export const getExpenseSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    
    const conditions = [];

    if (startDate) {
      conditions.push(gte(expenseSummary.date, new Date(startDate as string)));
    }
    if (endDate) {
      conditions.push(lte(expenseSummary.date, new Date(endDate as string)));
    }

    const summary =
      conditions.length > 0
        ? await db
            .select()
            .from(expenseSummary)
            .where(and(...conditions))
            .orderBy(desc(expenseSummary.date))
        : await db
            .select()
            .from(expenseSummary)
            .orderBy(desc(expenseSummary.date));
    res.json(summary);
  } catch (error) {
    console.error("Error retrieving expense summary:", error);
    res.status(500).json({ message: "Error retrieving expense summary" });
  }
};