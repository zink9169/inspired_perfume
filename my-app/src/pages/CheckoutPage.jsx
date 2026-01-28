import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    age: "",
    school: "",
    address: "",
    email: "",
    phone_number: "",
    notes: "",
  });

  // Handle quantity increase
  const handleIncrease = (itemId, size) => {
    const item = cartItems.find(
      (item) => item.id === itemId && item.size === size,
    );
    if (item) {
      updateQuantity(itemId, size, item.quantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecrease = (itemId, size) => {
    const item = cartItems.find(
      (item) => item.id === itemId && item.size === size,
    );
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(itemId, size, item.quantity - 1);
      } else {
        removeFromCart(itemId, size);
      }
    }
  };

  // Handle remove item
  const handleRemove = (itemId, size) => {
    removeFromCart(itemId, size);
    toast.success("Item removed from cart");
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          <Alert.Heading>Your cart is empty</Alert.Heading>
          <p>Add some perfumes to your cart first.</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </Alert>
      </Container>
    );
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.customer_name ||
      !formData.age ||
      !formData.address ||
      !formData.phone_number
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        age: parseInt(formData.age),
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
        })),
      };

      const result = await orderService.createOrder(orderData);
      clearCart();
      toast.success("Order placed successfully!");

      navigate("/order-success", {
        state: { order: result.order },
      });
    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Container className="py-4 py-md-5">
        <h1 className="mb-4 fs-3 fs-md-2">Checkout</h1>

        {/* CART ITEMS */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Your Cart</Card.Title>

            <div className="table-responsive mt-3">
              <Table className="align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={`${item.id}-${item.size}`}>
                      <td>{item.name}</td>
                      <td>
                        <span className="badge bg-secondary">{item.size}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleDecrease(item.id, item.size)}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0",
                            }}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleIncrease(item.id, item.size)}
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0",
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>{item.unit_price.toLocaleString()} MMK</td>
                      <td className="fw-bold">
                        {(item.unit_price * item.quantity).toLocaleString()} MMK
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemove(item.id, item.size)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* TOTAL + CTA */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
              <div>
                <h4 className="mb-1">
                  Total: {cartTotal.toLocaleString()} MMK
                </h4>
                <small className="text-muted">Free delivery included</small>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowForm(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* INFO CARDS */}
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>📦 Pre-order Info</Card.Title>
                <ul className="mb-0">
                  <li>Cash on Delivery</li>
                  <li>Free delivery (Yangon)</li>
                  <li>2–3 business days</li>
                  <li>We will contact before delivery</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100 bg-light">
              <Card.Body>
                <Card.Title>ℹ️ Need Help?</Card.Title>
                <p className="mb-1">
                  <strong>Phone:</strong> 09-123-456-789
                </p>
                <p className="mb-0">
                  <strong>Hours:</strong> 9AM – 6PM
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MODAL - FIXED TO MATCH BACKEND */}
      <Modal
        show={showForm}
        onHide={() => setShowForm(false)}
        centered
        size="lg"
      >
        <Form onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Shipping Information</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Age *</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    min="1"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="25"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>School/University (Optional)</Form.Label>
                  <Form.Control
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    placeholder="University of Yangon"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Email (Optional)</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    placeholder="09-123-456-789"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Delivery Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House number, street, township, city"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Order Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Delivery instructions, gift message, etc."
                  />
                </Form.Group>
              </Col>

              {/* Order Summary in Modal */}
              <Col xs={12}>
                <Card className="mt-3">
                  <Card.Body>
                    <Card.Title>Order Summary</Card.Title>
                    {cartItems.map((item) => (
                      <div
                        key={`${item.id}-${item.size}`}
                        className="d-flex justify-content-between mb-2"
                      >
                        <span>
                          {item.name} ({item.size}) × {item.quantity}
                        </span>
                        <span>
                          {(item.unit_price * item.quantity).toLocaleString()}{" "}
                          MMK
                        </span>
                      </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>{cartTotal.toLocaleString()} MMK</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Placing Order...
                </>
              ) : (
                `Place Order – ${cartTotal.toLocaleString()} MMK`
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CheckoutPage;
