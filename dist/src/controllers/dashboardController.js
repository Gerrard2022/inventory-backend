"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const popularProducts = yield connection_1.db
            .select()
            .from(schema_1.products)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.products.stockQuantity))
            .limit(15);
        const recentSalesSummary = yield connection_1.db
            .select()
            .from(schema_1.salesSummary)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.salesSummary.date))
            .limit(5);
        const recentPurchaseSummary = yield connection_1.db
            .select()
            .from(schema_1.purchaseSummary)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.purchaseSummary.date))
            .limit(5);
        const recentExpenseSummary = yield connection_1.db
            .select()
            .from(schema_1.expenseSummary)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.expenseSummary.date))
            .limit(5);
        const expenseByCategorySummaryRaw = yield connection_1.db
            .select()
            .from(schema_1.expenseByCategory)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.expenseByCategory.date))
            .limit(5);
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => (Object.assign(Object.assign({}, item), { amount: item.amount.toString() })));
        res.json({
            popularProducts,
            salesSummary: recentSalesSummary,
            purchaseSummary: recentPurchaseSummary,
            expenseSummary: recentExpenseSummary,
            expenseByCategorySummary,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard metrics" });
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
