// src/components/Layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const AppNavbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <span className="fs-3">🌸</span> Perfume Store
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="px-3">
              Shop
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className="px-3">
                Admin
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-center">
            {/* Cart Icon Button */}
            <Button
              variant="outline-primary"
              className="position-relative me-3 d-flex align-items-center"
              onClick={() => navigate("/checkout")}
            >
              <span className="fs-5">🛒</span>
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {isAuthenticated ? (
              <NavDropdown
                title={<span>{user?.email?.split("@")[0]}</span>}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {isAdmin && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin">
                      Admin Panel
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  className="me-2"
                >
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
