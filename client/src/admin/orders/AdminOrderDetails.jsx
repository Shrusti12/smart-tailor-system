import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminOrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Load order summary
  // -------------------------------
  useEffect(() => {
    fetch(`http://localhost:5001/orders`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(o => o.id === Number(orderId));
        setOrder(found);
      });
  }, [orderId]);

  // -------------------------------
  // Load order items
  // -------------------------------
  useEffect(() => {
    fetch(`http://localhost:5001/orders/${orderId}/items`)
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!order) return <p className="text-center mt-4">Order not found</p>;

  return (
    <div className="container mt-4">

      {/* ORDER HEADER */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h4 className="mb-3">Order #{order.id}</h4>

          <div className="row">
            <div className="col-md-4">
              <p><b>Customer:</b> {order.customer_name}</p>
            </div>
            <div className="col-md-4">
              <p><b>Delivery Date:</b> {new Date(order.delivery_date).toDateString()}</p>
            </div>
            <div className="col-md-4">
              <p>
                <b>Status:</b>{" "}
                <span className="badge bg-info text-dark">
                  {order.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BILLING SECTION */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="mb-3">Billing</h5>

          <div className="row">
            <div className="col-md-4">
              <p><b>Total Amount:</b> ₹{order.total_amount}</p>
            </div>
            <div className="col-md-4">
              <p><b>Advance Paid:</b> ₹{order.advance_amount}</p>
            </div>
            <div className="col-md-4">
              <p>
                <b>Balance:</b>{" "}
                <span className={order.balance_amount > 0 ? "text-danger" : "text-success"}>
                  ₹{order.balance_amount}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="mb-3">Order Items</h5>

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Item</th>
                <th>Tailor</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No items found
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.order_item_id}>
                    <td>{item.item_type}</td>
                    <td>{item.tailor_name || "Not Assigned"}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {item.status}
                      </span>
                    </td>
                    <td>{item.instructions || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
