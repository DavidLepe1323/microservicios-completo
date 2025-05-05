import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

// Definir las rutas para los usuarios
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/all", userController.getUsers); // Aquí se hace referencia a `getUsers`


export default router;
