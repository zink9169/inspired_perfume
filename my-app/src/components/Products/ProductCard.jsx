import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState("10ml");

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product, selectedSize, 1);
      toast.success(`${product.name} (${selectedSize}) added to cart!`, {
        icon: "🛒",
        position: "top-right",
      });
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const getSelectedPrice = () =>
    selectedSize === "10ml" ? product.price_10ml : product.price_35ml;

  return (
    <Card className="h-100 border-0 shadow-lg rounded-4 overflow-hidden hover-scale">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={
            product.image_url
              ? `https://ucqmnvvtdmzgepkekbjs.supabase.co/storage/v1/object/public/my_soul/${product.image_url}`
              : "../../assets/images/burberry_her.jpg"
          }
          alt={product.name}
          className="rounded-top"
          style={{
            height: "220px",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
        />
        <div
          className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill text-white fw-bold"
          style={{ background: "rgba(0, 123, 255, 0.85)", fontSize: "0.8rem" }}
        >
          Premium
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="h6 fw-semibold">{product.name}</Card.Title>
        <Card.Text className="text-muted small mb-3 flex-grow-1">
          {product.description?.substring(0, 90)}...
        </Card.Text>

        {/* Size & Price */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-medium text-muted">Size:</span>
            <Form.Select
              size="sm"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border-0 shadow-sm rounded-pill"
              style={{ minWidth: "90px" }}
            >
              <option value="10ml">10ml</option>
              <option value="35ml">35ml</option>
            </Form.Select>
          </div>

          <div className="text-end">
            <span className="h6 fw-bold text-primary">
              {getSelectedPrice()?.toLocaleString()} MMK
            </span>
            <div className="text-muted small">{selectedSize}</div>
          </div>
        </div>

        {/* Price Reference */}
        <div className="d-flex justify-content-between small text-muted mb-3 flex-wrap gap-2">
          <span>10ml: {product.price_10ml?.toLocaleString()} MMK</span>
          <span>35ml: {product.price_35ml?.toLocaleString()} MMK</span>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2 mt-auto">
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="fw-semibold py-2 rounded-pill shadow-sm"
          >
            {addingToCart ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Adding...
              </>
            ) : (
              <>
                <span className="me-2">🛒</span>
                Add to Cart
              </>
            )}
          </Button>

          <Link to={`/products/${product.id}`} className="text-decoration-none">
            <Button
              variant="outline-primary"
              className="w-100 fw-semibold py-2 rounded-pill"
            >
              👁️ View Details
            </Button>
          </Link>
        </div>
      </Card.Body>

      {/* Hover Effect */}
      <style>
        {`
          .hover-scale:hover img {
            transform: scale(1.05);
          }
          .hover-scale:hover {
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </Card>
  );
};

export default ProductCard;
