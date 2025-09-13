import { pgTable, varchar, real, integer, timestamp, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('Users', {
  userId: varchar('userId').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull(),
});

// Products table
export const products = pgTable('Products', {
  productId: varchar('productId').primaryKey(),
  name: varchar('name').notNull(),
  price: real('price').notNull(),
  rating: real('rating'),
  stockQuantity: integer('stockQuantity').notNull(),
});

// Sales table
export const sales = pgTable('Sales', {
  saleId: varchar('saleId').primaryKey(),
  productId: varchar('productId').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unitPrice').notNull(),
  totalAmount: real('totalAmount').notNull(),
});

// Purchases table
export const purchases = pgTable('Purchases', {
  purchaseId: varchar('purchaseId').primaryKey(),
  productId: varchar('productId').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  quantity: integer('quantity').notNull(),
  unitCost: real('unitCost').notNull(),
  totalCost: real('totalCost').notNull(),
});

// Expenses table
export const expenses = pgTable('Expenses', {
  expenseId: varchar('expenseId').primaryKey(),
  category: varchar('category').notNull(),
  amount: real('amount').notNull(),
  timestamp: timestamp('timestamp').notNull(),
});

// Sales Summary table
export const salesSummary = pgTable('SalesSummary', {
  salesSummaryId: varchar('salesSummaryId').primaryKey(),
  totalValue: real('totalValue').notNull(),
  changePercentage: real('changePercentage'),
  date: timestamp('date').notNull(),
});

// Purchase Summary table
export const purchaseSummary = pgTable('PurchaseSummary', {
  purchaseSummaryId: varchar('purchaseSummaryId').primaryKey(),
  totalPurchased: real('totalPurchased').notNull(),
  changePercentage: real('changePercentage'),
  date: timestamp('date').notNull(),
});

// Expense Summary table
export const expenseSummary = pgTable('ExpenseSummary', {
  expenseSummaryId: varchar('expenseSummaryId').primaryKey(),
  totalExpenses: real('totalExpenses').notNull(),
  date: timestamp('date').notNull(),
});

// Expense By Category table
export const expenseByCategory = pgTable('ExpenseByCategory', {
  expenseByCategoryId: varchar('expenseByCategoryId').primaryKey(),
  expenseSummaryId: varchar('expenseSummaryId').notNull(),
  category: varchar('category').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  date: timestamp('date').notNull(),
});

// Define relations
export const productsRelations = relations(products, ({ many }) => ({
  sales: many(sales),
  purchases: many(purchases),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  product: one(products, {
    fields: [sales.productId],
    references: [products.productId],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  product: one(products, {
    fields: [purchases.productId],
    references: [products.productId],
  }),
}));

export const expenseSummaryRelations = relations(expenseSummary, ({ many }) => ({
  expenseByCategory: many(expenseByCategory),
}));

export const expenseByCategoryRelations = relations(expenseByCategory, ({ one }) => ({
  expenseSummary: one(expenseSummary, {
    fields: [expenseByCategory.expenseSummaryId],
    references: [expenseSummary.expenseSummaryId],
  }),
}));