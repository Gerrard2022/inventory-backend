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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.db.select().from(schema_1.users);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, email } = req.body;
        const [user] = yield connection_1.db.insert(schema_1.users).values({ userId, name, email }).returning();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const [updated] = yield connection_1.db.update(schema_1.users).set(updates).where((0, drizzle_orm_1.eq)(schema_1.users.userId, id)).returning();
        if (!updated) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [deleted] = yield connection_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.userId, id)).returning();
        if (!deleted) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "User deleted successfully", user: deleted });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});
exports.deleteUser = deleteUser;
