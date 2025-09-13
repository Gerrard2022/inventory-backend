"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseByCategoryRelations = exports.expenseSummaryRelations = exports.purchasesRelations = exports.salesRelations = exports.productsRelations = exports.expenseByCategory = exports.expenseSummary = exports.purchaseSummary = exports.salesSummary = exports.expenses = exports.purchases = exports.sales = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Users table
exports.users = (0, pg_core_1.pgTable)('Users', {
    userId: (0, pg_core_1.varchar)('userId').primaryKey(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    email: (0, pg_core_1.varchar)('email').notNull(),
});
// Products table
exports.products = (0, pg_core_1.pgTable)('Products', {
    productId: (0, pg_core_1.varchar)('productId').primaryKey(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    price: (0, pg_core_1.real)('price').notNull(),
    rating: (0, pg_core_1.real)('rating'),
    stockQuantity: (0, pg_core_1.integer)('stockQuantity').notNull(),
});
// Sales table
exports.sales = (0, pg_core_1.pgTable)('Sales', {
    saleId: (0, pg_core_1.varchar)('saleId').primaryKey(),
    productId: (0, pg_core_1.varchar)('productId').notNull(),
    timestamp: (0, pg_core_1.timestamp)('timestamp').notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitPrice: (0, pg_core_1.real)('unitPrice').notNull(),
    totalAmount: (0, pg_core_1.real)('totalAmount').notNull(),
});
// Purchases table
exports.purchases = (0, pg_core_1.pgTable)('Purchases', {
    purchaseId: (0, pg_core_1.varchar)('purchaseId').primaryKey(),
    productId: (0, pg_core_1.varchar)('productId').notNull(),
    timestamp: (0, pg_core_1.timestamp)('timestamp').notNull(),
    quantity: (0, pg_core_1.integer)('quantity').notNull(),
    unitCost: (0, pg_core_1.real)('unitCost').notNull(),
    totalCost: (0, pg_core_1.real)('totalCost').notNull(),
});
// Expenses table
exports.expenses = (0, pg_core_1.pgTable)('Expenses', {
    expenseId: (0, pg_core_1.varchar)('expenseId').primaryKey(),
    category: (0, pg_core_1.varchar)('category').notNull(),
    amount: (0, pg_core_1.real)('amount').notNull(),
    timestamp: (0, pg_core_1.timestamp)('timestamp').notNull(),
});
// Sales Summary table
exports.salesSummary = (0, pg_core_1.pgTable)('SalesSummary', {
    salesSummaryId: (0, pg_core_1.varchar)('salesSummaryId').primaryKey(),
    totalValue: (0, pg_core_1.real)('totalValue').notNull(),
    changePercentage: (0, pg_core_1.real)('changePercentage'),
    date: (0, pg_core_1.timestamp)('date').notNull(),
});
// Purchase Summary table
exports.purchaseSummary = (0, pg_core_1.pgTable)('PurchaseSummary', {
    purchaseSummaryId: (0, pg_core_1.varchar)('purchaseSummaryId').primaryKey(),
    totalPurchased: (0, pg_core_1.real)('totalPurchased').notNull(),
    changePercentage: (0, pg_core_1.real)('changePercentage'),
    date: (0, pg_core_1.timestamp)('date').notNull(),
});
// Expense Summary table
exports.expenseSummary = (0, pg_core_1.pgTable)('ExpenseSummary', {
    expenseSummaryId: (0, pg_core_1.varchar)('expenseSummaryId').primaryKey(),
    totalExpenses: (0, pg_core_1.real)('totalExpenses').notNull(),
    date: (0, pg_core_1.timestamp)('date').notNull(),
});
// Expense By Category table
exports.expenseByCategory = (0, pg_core_1.pgTable)('ExpenseByCategory', {
    expenseByCategoryId: (0, pg_core_1.varchar)('expenseByCategoryId').primaryKey(),
    expenseSummaryId: (0, pg_core_1.varchar)('expenseSummaryId').notNull(),
    category: (0, pg_core_1.varchar)('category').notNull(),
    amount: (0, pg_core_1.bigint)('amount', { mode: 'number' }).notNull(),
    date: (0, pg_core_1.timestamp)('date').notNull(),
});
// Define relations
exports.productsRelations = (0, drizzle_orm_1.relations)(exports.products, ({ many }) => ({
    sales: many(exports.sales),
    purchases: many(exports.purchases),
}));
exports.salesRelations = (0, drizzle_orm_1.relations)(exports.sales, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.sales.productId],
        references: [exports.products.productId],
    }),
}));
exports.purchasesRelations = (0, drizzle_orm_1.relations)(exports.purchases, ({ one }) => ({
    product: one(exports.products, {
        fields: [exports.purchases.productId],
        references: [exports.products.productId],
    }),
}));
exports.expenseSummaryRelations = (0, drizzle_orm_1.relations)(exports.expenseSummary, ({ many }) => ({
    expenseByCategory: many(exports.expenseByCategory),
}));
exports.expenseByCategoryRelations = (0, drizzle_orm_1.relations)(exports.expenseByCategory, ({ one }) => ({
    expenseSummary: one(exports.expenseSummary, {
        fields: [exports.expenseByCategory.expenseSummaryId],
        references: [exports.expenseSummary.expenseSummaryId],
    }),
}));
