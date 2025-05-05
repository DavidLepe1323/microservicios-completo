import { Router } from "express";
import { getAllSales, createSale } from "../controllers/sales_controller";

const router = Router();

// Obtener todas las ventas
router.get("/", async (req, res) => {
    await getAllSales(req, res);
});

// Crear una nueva venta
router.post("/", async (req, res) => {
    await createSale(req, res);
});

export default router;
