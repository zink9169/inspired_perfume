// src/components/Products/ProductList.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { productService } from "../../services/productService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts(page, 8); // better for mobile
      setProducts(data.products);
      setTotalPages(data.pagination.total_pages);
      setCurrentPage(data.pagination.current_page);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* LOADING STATE */
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="py-3">
      {/* PRODUCT GRID */}
      <Row className="g-3 g-md-4">
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <div className="overflow-auto">
            <Pagination className="mb-0 flex-nowrap">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => fetchProducts(currentPage - 1)}
              />

              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => fetchProducts(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => fetchProducts(currentPage + 1)}
              />
            </Pagination>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ProductList;
