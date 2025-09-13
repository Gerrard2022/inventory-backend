import { Request, Response } from "express";
import { db } from "../db/connection";
import {
  products,
  salesSummary,
  purchaseSummary,
  expenseSummary,
  expenseByCategory,
} from "../db/schema";
import { desc } from "drizzle-orm";

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const popularProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.stockQuantity))
      .limit(15);

    const recentSalesSummary = await db
      .select()
      .from(salesSummary)
      .orderBy(desc(salesSummary.date))
      .limit(5);

    const recentPurchaseSummary = await db
      .select()
      .from(purchaseSummary)
      .orderBy(desc(purchaseSummary.date))
      .limit(5);

    const recentExpenseSummary = await db
      .select()
      .from(expenseSummary)
      .orderBy(desc(expenseSummary.date))
      .limit(5);

    const expenseByCategorySummaryRaw = await db
      .select()
      .from(expenseByCategory)
      .orderBy(desc(expenseByCategory.date))
      .limit(5);
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json({
      popularProducts,
      salesSummary: recentSalesSummary,
      purchaseSummary: recentPurchaseSummary,
      expenseSummary: recentExpenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};
