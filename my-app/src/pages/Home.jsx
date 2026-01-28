// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import heroPhoto from "../assets/images/hero_photo.png";

const Home = () => {
  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center g-4">
            {/* Image first on mobile */}
            <Col xs={12} md={6} className="text-center order-1 order-md-2">
              <img
                src={heroPhoto}
                alt="Perfume"
                className="img-fluid rounded-4 shadow-lg mb-3 mb-md-0"
                style={{
                  maxHeight: "360px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </Col>

            {/* Text */}
            <Col xs={12} md={6} className="order-2 order-md-1">
              <Badge bg="warning" text="dark" className="mb-3 px-3 py-2">
                🔥 Best Seller
              </Badge>

              <h1 className="fw-bold mb-3 fs-2 fs-md-1">
                Smell Like Luxury <br />
                <span className="text-warning">
                  Without Paying Luxury Price
                </span>
              </h1>

              <p className="text-light mb-4 fs-6 fs-md-5">
                Our perfumes are{" "}
                <strong>95% similar to authentic fragrances</strong>, last up to{" "}
                <strong>6–8 hours</strong>, and are
                <strong> affordable for everyone</strong>.
              </p>

              {/* Buttons */}
              <div className="d-grid gap-3 d-md-flex">
                <Link to="/products" className="w-100 w-md-auto">
                  <Button variant="warning" size="lg" className="w-100">
                    🛍 Shop Now
                  </Button>
                </Link>
                <Link to="/order" className="w-100 w-md-auto">
                  <Button variant="outline-light" size="lg" className="w-100">
                    📦 Order via Message
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ================= TRUST STATS ================= */}
      <Container className="py-5">
        <Row className="text-center g-4">
          <Col xs={12} md={4}>
            <h2 className="fw-bold text-primary mb-1">95%</h2>
            <p className="text-muted mb-0">
              Similar to Authentic <br /> Fragrances
            </p>
          </Col>

          <Col xs={12} md={4}>
            <h2 className="fw-bold text-primary mb-1">6–8 hrs</h2>
            <p className="text-muted mb-0">
              Long-Lasting <br /> Performance
            </p>
          </Col>

          <Col xs={12} md={4}>
            <h2 className="fw-bold text-primary mb-1">💸</h2>
            <p className="text-muted mb-0">
              Premium Smell <br /> Affordable Price
            </p>
          </Col>
        </Row>
      </Container>

      {/* ================= FEATURES ================= */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-4 fs-3 fs-md-2">
            Why Customers Love Our Perfumes
          </h2>

          <Row className="g-4">
            <Col xs={12} md={4}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body>
                  <div className="fs-1 mb-3">🧪</div>
                  <Card.Title className="fw-bold">
                    High-Quality Blend
                  </Card.Title>
                  <Card.Text className="text-muted">
                    Crafted to closely match authentic fragrances with smooth,
                    balanced notes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body>
                  <div className="fs-1 mb-3">⏱</div>
                  <Card.Title className="fw-bold">Long Lasting Wear</Card.Title>
                  <Card.Text className="text-muted">
                    Enjoy a confident scent that stays with you for
                    <strong> 6–8 hours</strong>.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4}>
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body>
                  <div className="fs-1 mb-3">🚚</div>
                  <Card.Title className="fw-bold">
                    Fast & Safe Delivery
                  </Card.Title>
                  <Card.Text className="text-muted">
                    Reliable delivery across Myanmar with secure packaging.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ================= CTA ================= */}
      <div className="py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="fw-bold mb-3 fs-3 fs-md-2">
            Smell Premium. Spend Smart.
          </h2>

          <p className="mb-4 fs-6 fs-md-5">
            Try our best-selling fragrances today and experience the difference.
          </p>

          <div className="d-grid gap-3 d-md-flex justify-content-center">
            <Link to="/products" className="w-100 w-md-auto">
              <Button variant="light" size="lg" className="w-100">
                Browse Collection
              </Button>
            </Link>
            <Link to="/order" className="w-100 w-md-auto">
              <Button variant="outline-light" size="lg" className="w-100">
                Order Now
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
