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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const result = search && search.length > 0
            ? yield connection_1.db.select().from(schema_1.products).where((0, drizzle_orm_1.like)(schema_1.products.name, `%${search}%`))
            : yield connection_1.db.select().from(schema_1.products);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, price, rating, stockQuantity } = req.body;
        const [product] = yield connection_1.db
            .insert(schema_1.products)
            .values({ productId, name, price, rating, stockQuantity })
            .returning();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const [updated] = yield connection_1.db
            .update(schema_1.products)
            .set(updates)
            .where((0, drizzle_orm_1.eq)(schema_1.products.productId, id))
            .returning();
        if (!updated) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [deleted] = yield connection_1.db
            .delete(schema_1.products)
            .where((0, drizzle_orm_1.eq)(schema_1.products.productId, id))
            .returning();
        if (!deleted) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json({ message: "Product deleted successfully", product: deleted });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
