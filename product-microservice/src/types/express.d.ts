// src/types/express.d.ts
import { User } from './user'; // Asegúrate de que la ruta sea correcta

declare global {
  namespace Express {
    interface Request {
      user?: User; // La propiedad `user` es opcional y debe ser del tipo `User`
    }
  }
}
