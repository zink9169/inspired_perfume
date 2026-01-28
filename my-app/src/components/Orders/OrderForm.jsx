// src/components/Orders/OrderForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import toast from "react-hot-toast";

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, size, quantity } = location.state || {};

  const [formData, setFormData] = useState({
    customer_name: "",
    age: "",
    school: "",
    address: "",
    email: "",
    phone_number: "",
    notes: "",
  });

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSize, setSelectedSize] = useState("10ml");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (productId) fetchProductDetails();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts(1, 100);
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const product = await productService.getProductById(productId);
      setSelectedProduct(productId);
      setSelectedSize(size || "10ml");
      setSelectedQuantity(quantity || 1);
      addItem(productId, size || "10ml", quantity || 1, product);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const addItem = (productId, size, quantity, product = null) => {
    const unitPrice = size === "10ml" ? product.price_10ml : product.price_35ml;
    const subtotal = unitPrice * quantity;

    const newItem = {
      product_id: parseInt(productId),
      size,
      quantity: parseInt(quantity),
      unit_price: unitPrice,
      subtotal,
      product_name: product?.name || `Product ${productId}`,
    };

    setItems([...items, newItem]);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one item to your order");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
        })),
      };
      const result = await orderService.createOrder(orderData);
      toast.success("Order created successfully!");
      navigate(`/orders/${result.order.id}`, {
        state: { order: result.order },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.error || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (product) {
      addItem(selectedProduct, selectedSize, selectedQuantity, product);
      setSelectedProduct("");
      setSelectedSize("10ml");
      setSelectedQuantity(1);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Place Your Order</h1>

      <Form onSubmit={handleSubmit}>
        {/* Customer Info */}
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Customer Information</Card.Title>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Age *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="1"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-2">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>School/University</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.school}
                    onChange={(e) =>
                      setFormData({ ...formData, school: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Form.Group>

            <Row className="g-3 mt-2">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Delivery instructions, gift message, etc."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Order Items */}
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Order Items</Card.Title>

            <div className="mb-4">
              <h6>Add New Item</h6>
              <Row className="g-2 align-items-end">
                <Col xs={12} sm={6} md={4}>
                  <Form.Group>
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - Stock: {product.stock}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} sm={3} md={2}>
                  <Form.Group>
                    <Form.Label>Size</Form.Label>
                    <Form.Select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      <option value="10ml">10ml</option>
                      <option value="35ml">35ml</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={6} sm={3} md={2}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} sm={12} md={4} className="d-grid">
                  <Button variant="outline-primary" onClick={handleAddItem}>
                    Add to Order
                  </Button>
                </Col>
              </Row>
            </div>

            {items.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product_name}</td>
                          <td>{item.size}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unit_price?.toLocaleString()} MMK</td>
                          <td>{item.subtotal?.toLocaleString()} MMK</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeItem(index)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-end mt-3">
                  <h4>Total Amount: {totalAmount.toLocaleString()} MMK</h4>
                </div>
              </>
            ) : (
              <Alert variant="info">
                No items added yet. Please add products to your order.
              </Alert>
            )}
          </Card.Body>
        </Card>

        {/* Submit */}
        <div className="text-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || items.length === 0}
            className="px-5"
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default OrderForm;
