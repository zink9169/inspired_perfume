// src/services/adminService.js
import api from "./api";

export const adminService = {
  // Product Management
  async createProduct(productData) {
    const response = await api.post("/admin/products", productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Order Management
  async getAllOrders(page = 1, limit = 10, status = null) {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    const response = await api.get(`/admin/orders?${params}`);
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Dashboard
  async getDashboardStats() {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },
};
