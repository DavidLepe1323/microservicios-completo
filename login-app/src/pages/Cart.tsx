import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Navbar, Nav } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const calculateTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const createSale = () => {
    const saleData = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
    }));

    axios
      .post("http://localhost:4001/api/sales", { sales: saleData })
      .then((response) => {
        console.log("Venta realizada correctamente", response.data);
        setCart([]);
        localStorage.removeItem("cart");
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Error al crear la venta", err);
      });
  };

  const clearCart = () => {
    const confirmClear = window.confirm("¿Estás seguro de que deseas vaciar el carrito?");
    if (confirmClear) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
        <Container>
          <Navbar.Brand className="fw-bold fs-5" onClick={() => navigate("/dashboard")}>
            <i className="bi bi-laptop me-2"></i> TechStore
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link className="fw-semibold" onClick={() => navigate("/dashboard")}>
                <i className="bi bi-house-door me-1"></i> Inicio
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart content */}
      <Container className="py-4 flex-grow-1">
        <h2 className="mb-4 text-center text-primary">Tu Carrito</h2>
        <Row>
          {cart.length > 0 ? (
            cart.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} className="d-flex mb-4">
                <Card className="h-100 w-100">
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Cantidad: {item.quantity}</Card.Text>
                    <Card.Text>
                      Precio Unitario: ${item.price.toLocaleString()}
                    </Card.Text>
                    <Card.Text>
                      Total: ${(item.price * item.quantity).toLocaleString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Tu carrito está vacío</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {cart.length > 0 && (
          <>
            <div className="text-end mb-3">
              <h4>Total: ${calculateTotalPrice().toLocaleString()}</h4>
            </div>
            <div className="text-center d-flex justify-content-center gap-3">
              <Button variant="danger" size="lg" onClick={clearCart}>
                <i className="bi bi-trash3 me-2"></i> Vaciar Carrito
              </Button>
              <Button variant="success" size="lg" onClick={createSale}>
                <i className="bi bi-check-circle me-2"></i> Confirmar Compra
              </Button>
            </div>
          </>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Venta Confirmada</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¡Gracias por tu compra! El proceso ha sido realizado correctamente.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
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

export default Cart;
