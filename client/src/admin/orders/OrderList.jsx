import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="container mt-4">

      {/* HEADER WITH BACK BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">All Orders</h3>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Tailor</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{new Date(order.delivery_date).toDateString()}</td>
              <td>{order.status}</td>
              <td>{order.tailor_names || "Not Assigned"}</td>

              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
