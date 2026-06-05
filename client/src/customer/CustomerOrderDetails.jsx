import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data));

    fetch(`http://localhost:5001/orders/${orderId}/items`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [orderId]);

  if (!order) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">

      {/* HEADER WITH BACK BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Order #{order.id}</h3>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <p>
        <b>Delivery Date:</b>{" "}
        {new Date(order.delivery_date).toDateString()}
      </p>

      <hr />

      <h5>Billing</h5>
      <p>Total: ₹{order.total_amount}</p>
      <p>Advance Paid: ₹{order.advance_amount}</p>
      <p>
        <b>Balance:</b> ₹{order.balance_amount}
      </p>

      <hr />

      <h5>Order Items</h5>
      <table className="table table-bordered shadow-sm">
        <thead className="table-secondary">
          <tr>
            <th>Item</th>
            <th>Tailor</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {items.map(i => (
            <tr key={i.order_item_id}>
              <td>{i.item_type}</td>
              <td>{i.tailor_name}</td>
              <td>
                <span className="badge bg-success">
                  {i.status}
                </span>
              </td>
              <td>{i.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <p className="text-muted">No items yet.</p>
      )}
    </div>
  );
}
