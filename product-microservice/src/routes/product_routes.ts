import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product_controller";

const router = Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    await getAllProducts(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    await getProductById(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
});

// Crear un nuevo producto (ahora también espera imageUrl en el body)
router.post("/", async (req, res) => {
  try {
    await createProduct(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Actualizar un producto por ID (también puede incluir imageUrl en el body)
router.put("/:id", async (req, res) => {
  try {
    await updateProduct(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    await deleteProduct(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

export default router;
