import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

class UserService {
    async register(name: string, email: string, password: string, role: string = "user") {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Asigna el valor como número (1 para admin, 2 para usuario)
        const roleValue = role === "admin" ? 1 : 2;  // Usa números, no cadenas de texto

        return prisma.user.create({
            data: { 
                name, 
                email, 
                password: hashedPassword,
                role: roleValue,  // Pasa un número (1 o 2)
            },
        });
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Credenciales incorrectas");
        }
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        return { user, token };
    }

    async getUsers() {
        return prisma.user.findMany();
    }
}

export default new UserService();

