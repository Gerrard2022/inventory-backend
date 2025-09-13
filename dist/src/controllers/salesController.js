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
exports.getSales = exports.createSale = void 0;
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity, customerName } = req.body;
        // Get product details
        const [product] = yield connection_1.db
            .select()
            .from(schema_1.products)
            .where((0, drizzle_orm_1.eq)(schema_1.products.productId, productId));
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
        const saleId = (0, crypto_1.randomUUID)();
        const newSale = {
            saleId,
            productId,
            timestamp: new Date(),
            quantity,
            unitPrice,
            totalAmount,
        };
        const [createdSale] = yield connection_1.db
            .insert(schema_1.sales)
            .values(newSale)
            .returning();
        // Update product stock
        const newStockQuantity = product.stockQuantity - quantity;
        yield connection_1.db
            .update(schema_1.products)
            .set({ stockQuantity: newStockQuantity })
            .where((0, drizzle_orm_1.eq)(schema_1.products.productId, productId));
        // Return sale with product details
        const saleWithProduct = Object.assign(Object.assign({}, createdSale), { product: {
                name: product.name,
                price: product.price,
            }, customerName });
        res.status(201).json(saleWithProduct);
    }
    catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ message: "Error creating sale" });
    }
});
exports.createSale = createSale;
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesData = yield connection_1.db
            .select({
            saleId: schema_1.sales.saleId,
            productId: schema_1.sales.productId,
            timestamp: schema_1.sales.timestamp,
            quantity: schema_1.sales.quantity,
            unitPrice: schema_1.sales.unitPrice,
            totalAmount: schema_1.sales.totalAmount,
            productName: schema_1.products.name,
            productPrice: schema_1.products.price,
        })
            .from(schema_1.sales)
            .leftJoin(schema_1.products, (0, drizzle_orm_1.eq)(schema_1.sales.productId, schema_1.products.productId))
            .orderBy(schema_1.sales.timestamp);
        res.json(salesData);
    }
    catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: "Error fetching sales" });
    }
});
exports.getSales = getSales;
