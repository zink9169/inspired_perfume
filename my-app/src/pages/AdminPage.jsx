// src/pages/AdminPage.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import PrivateRoute from "../components/Layout/privateRoute";
import Container from "react-bootstrap/Container";

const AdminPage = () => {
  return (
    <PrivateRoute adminOnly={true}>
      <Container fluid>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          {/* Add more admin routes here */}
        </Routes>
      </Container>
    </PrivateRoute>
  );
};

export default AdminPage;
