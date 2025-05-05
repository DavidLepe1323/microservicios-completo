import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";  // 📌 Importa cors
import userRoutes from "./routes/user-routes";
import prisma from "./config/prisma";

dotenv.config();

const app: Application = express();

app.use(express.json());

// 📌 Habilitar CORS
app.use(cors({
  origin: "http://localhost:5173", // Permite solicitudes desde tu frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

// Conexión a la base de datos
prisma.$connect()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error de conexión:", err));

// Rutas
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));
