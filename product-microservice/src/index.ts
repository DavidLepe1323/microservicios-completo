import express, { Application } from 'express';
import cors from 'cors';  // Importa CORS
import { PrismaClient } from '@prisma/client';  // Prisma Client
import productRoutes from './routes/product_routes';  // Asegúrate de que la ruta sea correcta

const app: Application = express();

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Middlewares
app.use(express.json());

// Configura CORS para permitir solicitudes desde tu frontend (http://localhost:5173)
app.use(cors({
  origin: "http://localhost:5173",  // Permite solicitudes desde tu frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",  // Métodos permitidos
  credentials: true,  // Permite el envío de cookies
}));

// Conexión a la base de datos SQLite con Prisma
prisma.$connect()
  .then(() => console.log("Conectado a la base de datos SQLite"))
  .catch((err) => console.error("Error de conexión a la base de datos SQLite:", err));

// Rutas
app.use('/api/products', productRoutes);

// Inicio del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
