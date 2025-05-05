import { Request, Response } from 'express';
import * as productService from '../services/product_service';

// Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const products = await productService.getAllProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving products", error });
  }
};

// Obtener un producto por ID
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await productService.getProductById(numericId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving product", error });
  }
};

// Crear un nuevo producto
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
  const { name, price, description, category, imageUrl } = req.body;

  if (!name || !price || !description || !category || !imageUrl) {
    return res.status(400).json({
      message: "All fields (name, price, description, category, imageUrl) are required"
    });
  }

  try {
    const newProduct = await productService.createProduct({
      name,
      price,
      description,
      category,
      imageUrl,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
  }
};

// Actualizar un producto por ID
export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, price, description, category, imageUrl } = req.body;

  if (!name || !price || !description || !category || !imageUrl) {
    return res.status(400).json({
      message: "All fields (name, price, description, category, imageUrl) are required"
    });
  }

  try {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await productService.updateProduct(numericId, {
      name,
      price,
      description,
      category,
      imageUrl,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error updating product", error });
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await productService.deleteProduct(numericId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
};
