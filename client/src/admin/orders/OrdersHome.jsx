import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function OrdersHome() {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);   // go to previous page
  };

  return (
    <div className="container mt-4">

      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Order Management</h3>

        <button
          className="btn btn-dark btn-sm"
          onClick={handleBack}
        >
          &laquo; Back
        </button>
      </div>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card shadow p-3 text-center border-0">
            <h6>Create New Order</h6>
            <Link to="/admin/orders/create" className="btn btn-primary btn-sm mt-2">
              Open
            </Link>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3 text-center border-0">
            <h6>Add Order Item</h6>
            <Link to="/admin/orders/add-item" className="btn btn-primary btn-sm mt-2">
              Open
            </Link>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3 text-center border-0">
            <h6>View All Orders</h6>
            <Link to="/admin/orders/list" className="btn btn-primary btn-sm mt-2">
              Open
            </Link>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3 text-center border-0">
            <h6>Update Status</h6>
            <Link to="/admin/orders/update-status" className="btn btn-primary btn-sm mt-2">
              Open
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
