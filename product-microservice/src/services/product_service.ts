import { PrismaClient, Product } from "@prisma/client";

// Instancia de Prisma
const prisma = new PrismaClient();

// Obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    throw new Error("Error retrieving products");
  }
};

// Obtener un producto por ID
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    return await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error("Error retrieving product");
  }
};

// Crear un nuevo producto
export const createProduct = async (productData: {
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string; // <- agregado
}): Promise<Product> => {
  try {
    return await prisma.product.create({
      data: productData,
    });
  } catch (error) {
    throw new Error("Error creating product");
  }
};

// Actualizar un producto por ID
export const updateProduct = async (
  id: number,
  productData: {
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl?: string; // <- agregado
  }
): Promise<Product | null> => {
  try {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: productData,
    });
  } catch (error) {
    throw new Error("Error updating product");
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (id: number): Promise<Product | null> => {
  try {
    return await prisma.product.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw new Error("Error deleting product");
  }
};
