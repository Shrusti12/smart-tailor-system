import React from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="container mt-4">

      {/* HEADER WITH BACK BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="mb-0">Welcome, {user?.name} 👋</h3>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <p className="text-muted">
        Track your orders, delivery date and payment details
      </p>

      <div className="card shadow-sm p-4 mt-4 col-md-5">
        <h5>My Orders</h5>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/customer/orders")}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
