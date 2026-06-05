import React from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();      // clear user session
    navigate("/");             // go to landing page
  };
  const handleBack = () => {
  navigate(-1);   // go to previous page
};

  return (
    <div className="d-flex">

      {/* ---------------------- SIDEBAR ---------------------- */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <h4 className="text-center mb-4">Tailor Admin</h4>

        <ul className="nav flex-column flex-grow-1">

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin">
              Dashboard
            </Link>
          </li>

         
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/add-specialization">
              Add Tailor Specialization
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/add-customer">
              Add Customer
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/customers">
              Customers
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/add-measurement">
              Add Measurements
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/measurements">
              View Measurements
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/orders">
              Order Management
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/order-billing">
                Orders & Billing
            </Link>
          </li>

        </ul>

        {/* 🔴 LOGOUT BUTTON */}
        <div className="mt-auto text-center">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ---------------------- MAIN CONTENT ---------------------- */}
      <div className="flex-grow-1">

        {/* Top Navbar */}
        <nav className="navbar navbar-light bg-light shadow-sm px-3">
          <span className="navbar-brand mb-0 h5">
            Welcome Admin: <strong>{user?.name}</strong>
          </span>

          {/* Right side Back Button */}
  <button
    className="btn btn-dark btn-sm"
    onClick={handleBack}
  >
    ← Back
  </button>

        </nav>


        {/* BODY CONTENT */}
        <div className="container mt-4">

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-3">
                <h5>Total Customers</h5>
                <h2 className="text-primary">32</h2>
                <p className="text-muted">Active Registered Customers</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-3">
                <h5>Total Tailors</h5>
                <h2 className="text-success">12</h2>
                <p className="text-muted">Stitching Specialists</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-3">
                <h5>Pending Orders</h5>
                <h2 className="text-danger">07</h2>
                <p className="text-muted">Need Immediate Attention</p>
              </div>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}

export default AdminHome;
