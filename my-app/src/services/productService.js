// src/services/productService.js
import api from "./api";

export const productService = {
  async getAllProducts(page = 1, limit = 10) {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async calculatePrice(id, size, quantity = 1) {
    const response = await api.post(`/products/${id}/calculate-price`, {
      size,
      quantity,
    });
    return response.data;
  },
};
