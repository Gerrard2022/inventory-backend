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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
/* CONFIGURATIONS */
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* ROUTES */
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/products", productRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/expenses", expenseRoutes_1.default);
app.use("/sales", salesRoutes_1.default);
/* HEALTH CHECK ROUTE */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});
/* ERROR HANDLING MIDDLEWARE */
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
/* 404 HANDLER */
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
/* SERVER */
const port = Number(process.env.PORT) || 3001;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        app.listen(port, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
});
startServer();
