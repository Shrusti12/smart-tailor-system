import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddOrderItem() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [measurement, setMeasurement] = useState("");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_id: "",
    order_id: "",
    item_type: "",
    tailor_id: "",
    measurement_id: "",
    stitch_amount: "",
    notes: ""
  });

  // Load customers on page start
  useEffect(() => {
    fetch("http://localhost:5001/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  // Load orders when customer is selected
  const loadOrders = (customerId) => {
    fetch(`http://localhost:5001/orders/by-customer/${customerId}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  // Load measurement automatically when order selected
  const loadMeasurement = (orderId) => {
    fetch(`http://localhost:5001/orders/${orderId}`)
      .then(res => res.json())
      .then(order => {
        setMeasurement(order.measurement_id);
        setForm(f => ({ ...f, measurement_id: order.measurement_id }));
      });
  };

  // Load Tailors based on item type specialization
  const loadTailors = (itemType) => {
    fetch(`http://localhost:5001/tailors/by-specialization/${itemType}`)
      .then(res => res.json())
      .then(data => setTailors(data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/order-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="container mt-4 col-md-7">
      <div className="card p-4 shadow">

        {/* HEADER WITH BACK BUTTON */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Assign Tailor (Order Item)</h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Select Customer */}
          <label className="fw-bold">Select Customer</label>
          <select
            className="form-control mb-3"
            value={form.customer_id}
            onChange={(e) => {
              const id = e.target.value;
              setForm({ ...form, customer_id: id, order_id: "" });
              loadOrders(id);
            }}
          >
            <option value="">-- Select --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.mobile})
              </option>
            ))}
          </select>

          {/* Select Order */}
          <label className="fw-bold">Select Order</label>
          <select
            className="form-control mb-3"
            value={form.order_id}
            onChange={(e) => {
              const orderId = e.target.value;
              setForm({ ...form, order_id: orderId });
              loadMeasurement(orderId);
            }}
            disabled={!form.customer_id}
          >
            <option value="">-- Select Order --</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                Order #{o.id} (Delivery: {o.delivery_date})
              </option>
            ))}
          </select>

          {/* Measurement ID Auto Loaded */}
          <label className="fw-bold">Measurement ID</label>
          <input
            className="form-control mb-3"
            value={measurement}
            readOnly
          />

          {/* Item Type */}
          <label className="fw-bold">Item Type</label>
          <select
            className="form-control mb-3"
            value={form.item_type}
            onChange={(e) => {
              const item = e.target.value;
              setForm({ ...form, item_type: item, tailor_id: "" });
              loadTailors(item);
            }}
          >
            <option value="">-- Select Item --</option>
            <option value="Pant">Pant</option>
            <option value="Shirt">Shirt</option>
            <option value="Kurta">Kurta</option>
            <option value="Blouse">Blouse</option>
          </select>

          {/* Tailor Dropdown */}
          <label className="fw-bold">Select Tailor</label>
          <select
            className="form-control mb-3"
            value={form.tailor_id}
            onChange={(e) => setForm({ ...form, tailor_id: e.target.value })}
          >
            <option value="">-- Select Tailor --</option>
            {tailors.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.mobile})
              </option>
            ))}
          </select>

          {/* Stitch Amount */}
          <label className="fw-bold">Stitch Amount</label>
          <input
            className="form-control mb-3"
            value={form.stitch_amount}
            onChange={(e) =>
              setForm({ ...form, stitch_amount: e.target.value })
            }
          />

          {/* Notes */}
          <label className="fw-bold">Notes</label>
          <textarea
            className="form-control mb-3"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          ></textarea>

          <button className="btn btn-primary mt-2">
            Assign Tailor
          </button>
        </form>
      </div>
    </div>
  );
}
