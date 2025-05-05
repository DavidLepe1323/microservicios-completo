import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Button,
  Card,
  Navbar,
  Nav,
  Row,
  Col,
  Dropdown,
  Form,
} from "react-bootstrap";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;  // Agregado para la imagen del producto
}

interface User {
  id: string;
  name: string;
  email: string;
  role: number; // 1 = admin, 2 = user
}

const Dashboard = ({ user }: { user: User }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(existingCart);
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://localhost:4000/api/products/")
      .then(({ data }) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    let updatedCart = [...cartItems];

    const existingItemIndex = updatedCart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const getCartQuantity = () => {
    return cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este producto?");
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:4000/api/products/${productId}`)
      .then(() => {
        fetchProducts(); // Recarga la lista después de eliminar
      })
      .catch((err) => console.error("Error deleting product:", err));
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand className="fw-bold fs-5">
            <i className="bi bi-laptop me-2"></i>TechStore
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar" className="justify-content-between">
            <Nav className="me-auto">
              <Nav.Link active className="fw-semibold">
                <i className="bi bi-house-door me-1"></i> Inicio
              </Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center">
              {user.role !== 1 && (
                <Button
                  variant="outline-light"
                  className="me-3 position-relative"
                  size="sm"
                  onClick={() => navigate("/cart")}
                >
                  <i className="bi bi-cart3 me-1"></i> Carrito
                  {getCartQuantity() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {getCartQuantity()}
                    </span>
                  )}
                </Button>
              )}
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="user-dropdown" size="sm">
                  <i className="bi bi-person-circle me-1"></i> {user.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                  </Dropdown.Item>
                  {user.role === 1 && (
                    <Dropdown.Item onClick={() => navigate("/add-product")}>
                      <i className="bi bi-plus-circle me-2"></i> Agregar Producto
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Dashboard content */}
      <Container className="py-4 flex-grow-1">
        <h2 className="mb-4 text-primary text-center">Productos</h2>
        <Row className="g-4 justify-content-center">
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  {/* Imagen del producto */}
                  {product.imageUrl && (
                    <Card.Img
                      variant="top"
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ objectFit: "cover", height: "200px", width: "100%" }}
                    />
                  )}
                  <Card.Title className="fs-6 mb-1">{product.name}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <div className="mt-2">
                    <div className="text-primary fw-bold h6 mb-2">
                      ${product.price.toLocaleString()}
                    </div>

                    {user.role === 1 ? (
                      <div className="d-flex flex-column gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <i className="bi bi-pencil me-1"></i> Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Eliminar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Form.Group>
                          <Form.Label className="small">Cantidad:</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={quantities[product.id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(product.id, Number(e.target.value))
                            }
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          className="mt-3 w-100"
                          size="sm"
                          onClick={() => addToCart(product)}
                        >
                          <i className="bi bi-cart-plus me-2"></i> Agregar al carrito
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <Container className="text-center">
          <p className="text-muted small mb-0">
            &copy; {new Date().getFullYear()} TechStore - Todos los derechos reservados
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Dashboard;
