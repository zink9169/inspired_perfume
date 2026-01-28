// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllOrders(1, 5),
      ]);
      setStats(statsData.stats);
      setRecentOrders(ordersData.orders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      color: "primary",
      icon: "📦",
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders || 0,
      color: "warning",
      icon: "⏳",
    },
    {
      title: "Total Revenue",
      value: `${(stats?.total_revenue || 0).toLocaleString()} MMK`,
      color: "success",
      icon: "💰",
    },
    {
      title: "Total Products",
      value: stats?.total_products || 0,
      color: "info",
      icon: "🛍️",
    },
  ];

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col key={index} xs={12} sm={6} md={3}>
            <Card className={`border-${stat.color} shadow-sm`}>
              <Card.Body className="text-center">
                <div className="display-4 mb-2">{stat.icon}</div>
                <Card.Title className="text-muted">{stat.title}</Card.Title>
                <h2 className={`text-${stat.color}`}>{stat.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Orders</Card.Title>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.order_number}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.total_amount?.toLocaleString()} MMK</td>
                        <td>
                          <span
                            className={`badge bg-${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="text-center mt-3">
                <Link to="/admin/orders" className="btn btn-primary">
                  View All Orders
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="d-grid gap-2">
                <Link to="/admin/products/new" className="btn btn-success">
                  + Add New Product
                </Link>
                <Link to="/admin/products" className="btn btn-outline-primary">
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="btn btn-outline-primary">
                  Manage Orders
                </Link>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Order Status Overview</Card.Title>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <span className="badge bg-success me-2">
                    {stats?.approved_orders || 0}
                  </span>
                  Approved Orders
                </li>
                <li className="mb-2">
                  <span className="badge bg-warning me-2">
                    {stats?.pending_orders || 0}
                  </span>
                  Pending Orders
                </li>
                <li className="mb-2">
                  <span className="badge bg-danger me-2">
                    {stats?.cancelled_orders || 0}
                  </span>
                  Cancelled Orders
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "danger";
    case "shipped":
      return "info";
    case "delivered":
      return "success";
    default:
      return "secondary";
  }
};

export default AdminDashboard;
