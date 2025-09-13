import { Request, Response } from "express";
import { db } from "../db/connection";
import { sales, products } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const createSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, quantity, customerName } = req.body;

    // Get product details
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.productId, productId));

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Check if sufficient stock
    if (product.stockQuantity < quantity) {
      res.status(400).json({ 
        message: "Insufficient stock", 
        availableStock: product.stockQuantity,
        requestedQuantity: quantity 
      });
      return;
    }

    // Calculate totals
    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    // Create sale record
    const saleId = randomUUID();
    const newSale = {
      saleId,
      productId,
      timestamp: new Date(),
      quantity,
      unitPrice,
      totalAmount,
    };

    const [createdSale] = await db
      .insert(sales)
      .values(newSale)
      .returning();

    // Update product stock
    const newStockQuantity = product.stockQuantity - quantity;
    await db
      .update(products)
      .set({ stockQuantity: newStockQuantity })
      .where(eq(products.productId, productId));

    // Return sale with product details
    const saleWithProduct = {
      ...createdSale,
      product: {
        name: product.name,
        price: product.price,
      },
      customerName,
    };

    res.status(201).json(saleWithProduct);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Error creating sale" });
  }
};

export const getSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const salesData = await db
      .select({
        saleId: sales.saleId,
        productId: sales.productId,
        timestamp: sales.timestamp,
        quantity: sales.quantity,
        unitPrice: sales.unitPrice,
        totalAmount: sales.totalAmount,
        productName: products.name,
        productPrice: products.price,
      })
      .from(sales)
      .leftJoin(products, eq(sales.productId, products.productId))
      .orderBy(sales.timestamp);

    res.json(salesData);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Error fetching sales" });
  }
};
