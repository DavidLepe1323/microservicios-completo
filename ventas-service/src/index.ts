import express, { Application } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import salesRoutes from "./routes/sales_routes";

const app: Application = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Rutas
app.use("/api/sales", salesRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Microservicio de ventas corriendo en el puerto ${PORT}`);
});
