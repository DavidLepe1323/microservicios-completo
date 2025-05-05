import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Dashboard from "./pages/Dashboard"; // Importa correctamente tu Dashboard
import Cart from "./pages/Cart"; // Asegúrate de importar el componente Cart


// URLs de la API
const API_URL = "http://localhost:4000/api/users/";

// Definir la interfaz User con el campo role
interface User {
  id: string;
  name: string;
  email: string;
  role: 1 | 2; // El role ahora es 1 para admin y 2 para user
}

// Componente de Login
const Login = ({ setUser }: { setUser: (user: User | null) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError("Error en el login");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "30rem", padding: "20px", borderRadius: "10px" }}>
        <h2 className="text-center text-primary">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control-lg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control-lg"
            />
          </Form.Group>
          <Button variant="primary" type="submit" size="lg" block>
            Ingresar
          </Button>
          <Button
            variant="link"
            onClick={() => navigate("/register")}
            className="ms-2 d-block text-center w-100 mt-2"
          >
            Registrarse
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

// Componente de Registro con selección de rol
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<1 | 2>(2); // Por defecto "Usuario"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role,
      });
      setSuccess("Registro exitoso. Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Error al registrar usuario");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "30rem", padding: "20px", borderRadius: "10px" }}>
        <h2 className="text-center text-primary">Registro</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control-lg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control-lg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control-lg"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control-lg"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(Number(e.target.value) as 1 | 2)}
              required
              className="form-control-lg"
            >
              <option value={1}>Administrador</option>
              <option value={2}>Usuario</option>
            </Form.Select>
          </Form.Group>
<Button variant="success" type="submit" size="lg" className="w-100">
  Registrarse
</Button>
        </Form>
      </Card>
    </Container>
  );
};

// Componente Principal
const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} /> {/* Ruta para el carrito */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
