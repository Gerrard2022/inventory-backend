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
exports.getExpenseSummary = exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getExpenseById = exports.getExpenses = exports.getExpensesByCategory = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getExpensesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenseByCategorySummaryRaw = yield connection_1.db
            .select()
            .from(schema_1.expenseByCategory)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.expenseByCategory.date));
        const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => (Object.assign(Object.assign({}, item), { amount: item.amount.toString() })));
        res.json(expenseByCategorySummary);
    }
    catch (error) {
        console.error("Error retrieving expenses by category:", error);
        res.status(500).json({ message: "Error retrieving expenses by category" });
    }
});
exports.getExpensesByCategory = getExpensesByCategory;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, startDate, endDate } = req.query;
        const conditions = [];
        if (category) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.expenses.category, `%${category}%`));
        }
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.expenses.timestamp, new Date(startDate)));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schema_1.expenses.timestamp, new Date(endDate)));
        }
        const expensesList = conditions.length > 0
            ? yield connection_1.db
                .select()
                .from(schema_1.expenses)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.expenses.timestamp))
            : yield connection_1.db
                .select()
                .from(schema_1.expenses)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.expenses.timestamp));
        res.json(expensesList);
    }
    catch (error) {
        console.error("Error retrieving expenses:", error);
        res.status(500).json({ message: "Error retrieving expenses" });
    }
});
exports.getExpenses = getExpenses;
const getExpenseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [expense] = yield connection_1.db
            .select()
            .from(schema_1.expenses)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.expenseId, id));
        if (!expense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }
        res.json(expense);
    }
    catch (error) {
        console.error("Error retrieving expense:", error);
        res.status(500).json({ message: "Error retrieving expense" });
    }
});
exports.getExpenseById = getExpenseById;
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { expenseId, category, amount, timestamp } = req.body;
        const [newExpense] = yield connection_1.db
            .insert(schema_1.expenses)
            .values({
            expenseId,
            category,
            amount,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
        })
            .returning();
        res.status(201).json(newExpense);
    }
    catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({ message: "Error creating expense" });
    }
});
exports.createExpense = createExpense;
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.timestamp) {
            updates.timestamp = new Date(updates.timestamp);
        }
        const [updatedExpense] = yield connection_1.db
            .update(schema_1.expenses)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.expenseId, id))
            .returning();
        if (!updatedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }
        res.json(updatedExpense);
    }
    catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Error updating expense" });
    }
});
exports.updateExpense = updateExpense;
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [deletedExpense] = yield connection_1.db
            .delete(schema_1.expenses)
            .where((0, drizzle_orm_1.eq)(schema_1.expenses.expenseId, id))
            .returning();
        if (!deletedExpense) {
            res.status(404).json({ message: "Expense not found" });
            return;
        }
        res.json({
            message: "Expense deleted successfully",
            expense: deletedExpense
        });
    }
    catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Error deleting expense" });
    }
});
exports.deleteExpense = deleteExpense;
const getExpenseSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const conditions = [];
        if (startDate) {
            conditions.push((0, drizzle_orm_1.gte)(schema_1.expenseSummary.date, new Date(startDate)));
        }
        if (endDate) {
            conditions.push((0, drizzle_orm_1.lte)(schema_1.expenseSummary.date, new Date(endDate)));
        }
        const summary = conditions.length > 0
            ? yield connection_1.db
                .select()
                .from(schema_1.expenseSummary)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.expenseSummary.date))
            : yield connection_1.db
                .select()
                .from(schema_1.expenseSummary)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.expenseSummary.date));
        res.json(summary);
    }
    catch (error) {
        console.error("Error retrieving expense summary:", error);
        res.status(500).json({ message: "Error retrieving expense summary" });
    }
});
exports.getExpenseSummary = getExpenseSummary;
