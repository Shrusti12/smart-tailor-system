import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerOrders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/customer/orders/${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, [user.id]);

  return (
    <div className="container mt-4">

      {/* HEADER WITH BACK BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">My Orders</h3>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <table className="table table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.delivery_date).toDateString()}</td>
              <td>
                <span className="badge bg-info">{o.status}</span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    navigate(`/customer/orders/${o.id}`)
                  }
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-muted">No orders found.</p>
      )}
    </div>
  );
}
