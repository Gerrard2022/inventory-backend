"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesController_1 = require("../controllers/salesController");
const router = (0, express_1.Router)();
router.get("/", salesController_1.getSales);
router.post("/", salesController_1.createSale);
exports.default = router;
