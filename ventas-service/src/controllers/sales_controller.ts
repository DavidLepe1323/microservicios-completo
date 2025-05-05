import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear una nueva venta
export const createSale = async (req: Request, res: Response) => {
  try {
    const { sales } = req.body; // Recibe los productos en la venta

    if (!sales || sales.length === 0) {
      return res.status(400).json({ message: "No hay productos en la venta" });
    }

    // Calcular el total de la venta
    const total = sales.reduce(
      (acc: number, item: { totalPrice: number }) => acc + item.totalPrice,
      0
    );

    // Crear la venta en la base de datos
    const sale = await prisma.sale.create({
      data: {
        total: total,
        items: {
          create: sales.map((item: { productId: number; quantity: number; totalPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.totalPrice / item.quantity, // Precio unitario
          })),
        },
      },
      include: { items: true }, // Retornar los productos dentro de la venta
    });

    res.status(201).json({ message: "Venta creada con éxito", data: sale });
  } catch (error) {
    console.error("Error al crear la venta:", error);

    // Manejo seguro del error
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    res.status(500).json({ message: "Error al crear la venta", error: errorMessage });
  }
};

// Obtener todas las ventas
export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { items: true }, // Incluir los productos vendidos
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error al obtener ventas:", error);

    // Manejo seguro del error
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";

    res.status(500).json({ message: "Error al obtener ventas", error: errorMessage });
  }
};
