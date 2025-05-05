import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user; // Asegúrate de que el usuario esté en req.user, normalmente lo agregas después de la autenticación con JWT

  // Verifica si el usuario tiene el rol de admin
  if (user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: Admins only' }); // Si no es admin, responde con un error 403
    return; // Terminamos la ejecución del middleware si no es admin
  }

  // Si es admin, pasa al siguiente middleware o controlador
  next(); // Llama a next() para continuar con el flujo
};
