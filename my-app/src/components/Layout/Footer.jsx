// src/components/Layout/Footer.jsx
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 pt-4 pb-3">
      <Container>
        <Row className="g-4 text-center text-md-start">
          {/* BRAND */}
          <Col xs={12} md={4}>
            <h5 className="fw-bold">My Soul Perfume</h5>
            <p className="small mb-0">
              Premium inspired fragrances with long-lasting performance and
              affordable prices.
            </p>
          </Col>

          {/* LINKS */}
          <Col xs={12} md={4}>
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="/products" className="text-white text-decoration-none">
                  Browse Products
                </a>
              </li>
              <li className="mb-2">
                <a href="/checkout" className="text-white text-decoration-none">
                  View Cart / Checkout
                </a>
              </li>
            </ul>
          </Col>

          {/* CONTACT */}
          <Col xs={12} md={4}>
            <h6 className="fw-bold">Contact</h6>
            <p className="small mb-1">
              📧{" "}
              <a
                href="mailto:contact@perfumestore.com"
                className="text-white text-decoration-none"
              >
                contact@perfumestore.com
              </a>
            </p>
            <p className="small mb-1">
              📞{" "}
              <a
                href="tel:+959123456789"
                className="text-white text-decoration-none"
              >
                +95 9 123 456 789
              </a>
            </p>
            <p className="small mb-0">🏢 Yangon, Myanmar</p>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        {/* COPYRIGHT */}
        <p className="text-center small mb-0">
          &copy; {new Date().getFullYear()} My Soul Perfume. All rights
          reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
