import express, { Request, Response, NextFunction } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// **Configuración de microservicios**
const services: Record<string, string> = {
  products: "http://localhost:3001/api/products",
  users: "http://localhost:3002/api/users",
};

// **Middleware para redirigir solicitudes a los microservicios**
app.use("/api/:service/*", (req: Request, res: Response, next: NextFunction) => {
  handleRequest(req, res).catch(next);
});

// **Función para manejar las solicitudes a los microservicios**
async function handleRequest(req: Request, res: Response) {
  const { service } = req.params;
  const serviceUrl = services[service];

  if (!serviceUrl) {
    return res.status(404).json({ error: "Microservicio no encontrado" });
  }

  try {
    const path = req.params[0]; // Captura el resto de la URL después de /api/:service/
    const url = `${serviceUrl}/${path}`;
    const method = req.method.toLowerCase();

    const response = await axios({
      method,
      url,
      data: req.body,
      params: req.query,
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Error en el API Gateway",
    });
  }
}

// **Iniciar el servidor**
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
