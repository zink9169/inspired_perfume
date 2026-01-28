// src/pages/OrderSuccess.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || {};

  return (
    <Container className="py-5 text-center">
      <Card
        className="border-0 shadow-sm mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <Card.Body className="p-5">
          <div className="display-1 text-success mb-4">✅</div>
          <h1 className="mb-3">Order Confirmed!</h1>
          <p className="lead text-muted mb-4">
            Thank you for your pre-order. We'll contact you soon for delivery.
          </p>

          {order.order_number && (
            <div className="bg-light p-3 rounded mb-4">
              <h5>Order #{order.order_number}</h5>
              <p className="mb-2">
                Total: {order.total_amount?.toLocaleString()} MMK
              </p>
              <p className="text-muted small">Status: Pending</p>
            </div>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" as={Link} to="/products">
              Shop More
            </Button>
            <Button variant="outline-primary" as={Link} to="/">
              Back to Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderSuccess;
