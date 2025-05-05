import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
  // Modificado para aceptar el rol durante el registro
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body; // Incluye `role` en el cuerpo de la solicitud
      const user = await userService.register(name, email, password, role); // Pasa el `role` al servicio
      res.json({ message: "Usuario registrado", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await userService.login(email, password);
      res.json({ message: "Inicio de sesión exitoso", data });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();
