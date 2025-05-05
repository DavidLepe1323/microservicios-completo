import prisma from "./config/prisma";
import bcrypt from "bcrypt";

async function createAdminUser() {
  const adminEmail = "admin@prueba.com";
  const adminPassword = "132321";
  const adminName = "admin";

  // Verificar si ya existe un usuario con el correo admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear el usuario admin
    const adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",  // Asignar el rol de admin
      },
    });

    console.log("Usuario admin creado:", adminUser);
  } else {
    console.log("El usuario admin ya existe");
  }
}

createAdminUser()
  .catch((err) => {
    console.error("Error al crear el usuario admin:", err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
