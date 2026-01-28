// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
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

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">User Profile</Card.Title>

          <div className="text-center mb-4">
            <div className="display-4 mb-3">👤</div>
            <h3>{user?.email}</h3>
            <span
              className={`badge ${user?.is_admin ? "bg-danger" : "bg-primary"}`}
            >
              {user?.is_admin ? "Administrator" : "Customer"}
            </span>
          </div>

          <div className="mb-4">
            <h5>Account Information</h5>
            <div className="list-group">
              <div className="list-group-item d-flex justify-content-between">
                <span>Email:</span>
                <span className="text-muted">{user?.email}</span>
              </div>
              <div className="list-group-item d-flex justify-content-between">
                <span>Account Type:</span>
                <span className="text-muted">
                  {user?.is_admin ? "Admin" : "Regular User"}
                </span>
              </div>
              <div className="list-group-item d-flex justify-content-between">
                <span>Member Since:</span>
                <span className="text-muted">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
