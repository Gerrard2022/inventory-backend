import { Request, Response } from "express";
import { db } from "../db/connection";
import { products } from "../db/schema";
import { like, eq } from "drizzle-orm";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const result = search && search.length > 0
      ? await db.select().from(products).where(like(products.name, `%${search}%`))
      : await db.select().from(products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const [product] = await db
      .insert(products)
      .values({ productId, name, price, rating, stockQuantity })
      .returning();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [updated] = await db
      .update(products)
      .set(updates)
      .where(eq(products.productId, id))
      .returning();
    if (!updated) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const [deleted] = await db
      .delete(products)
      .where(eq(products.productId, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted successfully", product: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
