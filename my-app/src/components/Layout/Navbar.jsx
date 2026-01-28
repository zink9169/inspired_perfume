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
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-2">
      <Container>
        {/* BRAND */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center"
        >
          <span className="fs-4 text-secondary me-1">My Soul</span>
          <span className="d-none d-sm-inline text-muted">
            Inspired Perfume
          </span>
        </Navbar.Brand>

        {/* RIGHT ICONS (MOBILE FIRST) */}
        <div className="d-flex align-items-center gap-2">
          {/* CART – always visible */}
          <Button
            variant="light"
            className="position-relative p-2"
            onClick={() => navigate("/checkout")}
          >
            <span className="fs-4">🛒</span>
            {cartCount > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* TOGGLE */}
          <Navbar.Toggle aria-controls="navbar-nav" />
        </div>

        {/* COLLAPSE */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto text-center mt-3 mt-lg-0">
            <Nav.Link as={Link} to="/" className="py-2 px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="py-2 px-3">
              Shop
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className="py-2 px-3">
                Admin
              </Nav.Link>
            )}
          </Nav>

          {/* AUTH */}
          <Nav className="text-center mt-3 mt-lg-0 align-items-lg-center">
            {isAuthenticated ? (
              <NavDropdown
                title={user?.email?.split("@")[0]}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>

                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Admin Panel
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />

                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-grid gap-2 d-lg-flex">
                <Button as={Link} to="/login" variant="outline-primary">
                  Login
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
