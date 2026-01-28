import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { productService } from "../../services/productService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [size, setSize] = useState("10ml");
  const [quantity, setQuantity] = useState(1);
  const [priceInfo, setPriceInfo] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      setError("Failed to load product details");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async () => {
    try {
      const data = await productService.calculatePrice(id, size, quantity);
      setPriceInfo(data);
    } catch (error) {
      console.error("Error calculating price:", error);
    }
  };

  useEffect(() => {
    if (product) {
      calculatePrice();
    }
  }, [size, quantity, product]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product, size, quantity);
      toast.success(`${product.name} (${size}) added to cart!`, {
        icon: "🛒",
        position: "top-right",
      });
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Product not found"}</Alert>
        <Link to="/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* Product Image */}
        <Col xs={12} md={6}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            <Card.Img
              variant="top"
              src={
                product.image_url
                  ? `https://ucqmnvvtdmzgepkekbjs.supabase.co/storage/v1/object/public/my_soul/${product.image_url}`
                  : "../../assets/images/burberry_her.jpg"
              }
              alt={product.name}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
          </Card>
        </Col>

        {/* Product Details */}
        <Col xs={12} md={6}>
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted mb-4">{product.description}</p>

          {/* Pricing Cards */}
          <div className="mb-4">
            <h5>Pricing</h5>
            <Row className="g-3">
              <Col xs={6}>
                <Card className="text-center shadow-sm rounded-3">
                  <Card.Body>
                    <Card.Title>10ml</Card.Title>
                    <Card.Text className="h5 text-primary mb-0">
                      {product.price_10ml?.toLocaleString()} MMK
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="text-center shadow-sm rounded-3">
                  <Card.Body>
                    <Card.Title>35ml</Card.Title>
                    <Card.Text className="h5 text-primary mb-0">
                      {product.price_35ml?.toLocaleString()} MMK
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Order Form */}
          <div className="mb-4">
            <h5>Calculate Your Order</h5>
            <Form>
              <Row className="g-3">
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Size</Form.Label>
                    <Form.Select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <option value="10ml">10ml</option>
                      <option value="35ml">35ml</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                    />
                    <Form.Text className="text-muted">
                      Available stock: {product.stock} units
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>

          {/* Price Info */}
          {priceInfo && (
            <Card className="bg-light mb-4 shadow-sm rounded-3">
              <Card.Body>
                <h6 className="mb-3">Price Calculation</h6>
                <Row className="mb-1">
                  <Col>Unit Price:</Col>
                  <Col className="text-end">
                    {priceInfo.unit_price?.toLocaleString()} MMK
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>Quantity:</Col>
                  <Col className="text-end">{quantity}</Col>
                </Row>
                <hr />
                <Row className="h5">
                  <Col>Total:</Col>
                  <Col className="text-end text-primary">
                    {priceInfo.total_price?.toLocaleString()} MMK
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Action Buttons - SIMPLIFIED */}
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              onClick={handleAddToCart}
              disabled={addingToCart}
              size="lg"
              className="py-3"
            >
              {addingToCart ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Adding to Cart...
                </>
              ) : (
                <>
                  <span className="me-2">🛒</span>
                  Add to Cart
                </>
              )}
            </Button>

            <Link to="/products">
              <Button variant="outline-secondary" className="w-100 py-2">
                ← Back to Products
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
