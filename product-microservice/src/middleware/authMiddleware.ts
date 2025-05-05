import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

// Middleware para verificar si el usuario es un admin
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extraemos el token del header 'Authorization'

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token' });
  }

  try {
    // Verificamos el token JWT
    const decoded: any = jwt.verify(token, 'SECRET_KEY');
    
    // Verificamos si el rol es 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }

    // Almacenamos la información del usuario decodificado en la solicitud
    req.user = decoded;

    next();  // Llamamos al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

