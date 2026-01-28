// src/pages/ProductsPage.jsx
import React from "react";
import ProductList from "../components/Products/ProductList";
import Container from "react-bootstrap/Container";

const ProductsPage = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Our Perfume Collection</h1>
      <p className="lead mb-5">
        Discover our exclusive collection of premium fragrances. Each perfume is
        carefully selected for quality and uniqueness.
      </p>
      <ProductList />
    </Container>
  );
};

export default ProductsPage;
