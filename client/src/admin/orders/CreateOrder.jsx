import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateOrder() {
  const [customers, setCustomers] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  const [form, setForm] = useState({
    customer_id: "",
    measurement_id: "",
    delivery_date: "",
    total_amount: "",
    advance_amount: "",
    balance_amount: ""
  });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // ----------------------------------
  // 1. Load customers on page load
  // ----------------------------------
  useEffect(() => {
    fetch("http://localhost:5001/customers")
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.log(err));
  }, []);

  // ----------------------------------
  // 2. When customer changes → load measurements
  // ----------------------------------
  const loadMeasurements = (customerId) => {
    fetch(`http://localhost:5001/measurements/by-customer/${customerId}`)
      .then(res => res.json())
      .then(data => setMeasurements(data))
      .catch(err => console.log(err));
  };

  // ----------------------------------
  // 3. Auto-calc balance amount
  // ----------------------------------
  useEffect(() => {
    const total = parseFloat(form.total_amount) || 0;
    const advance = parseFloat(form.advance_amount) || 0;
    setForm((f) => ({
      ...f,
      balance_amount: (total - advance).toFixed(2)
    }));
  }, [form.total_amount, form.advance_amount]);

  // ----------------------------------
  // 4. Submit Order
  // ----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/orders", {
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
          <h4 className="mb-0">Create Order</h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={handleBack}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* CUSTOMER DROPDOWN */}
          <label className="fw-bold">Select Customer</label>
          <select
            className="form-control mb-3"
            value={form.customer_id}
            onChange={(e) => {
              const id = e.target.value;
              setForm({ ...form, customer_id: id, measurement_id: "" });
              loadMeasurements(id);
            }}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.mobile})
              </option>
            ))}
          </select>

          {/* MEASUREMENT DROPDOWN */}
          <label className="fw-bold">Select Measurement</label>
          <select
            className="form-control mb-3"
            value={form.measurement_id}
            onChange={(e) =>
              setForm({ ...form, measurement_id: e.target.value })
            }
            disabled={!form.customer_id}
          >
            <option value="">-- Select Measurement --</option>
            {measurements.map((m) => (
              <option key={m.id} value={m.id}>
                Measurement #{m.id} (Chest: {m.chest}, Waist: {m.waist})
              </option>
            ))}
          </select>

          {/* DELIVERY DATE */}
          <label className="fw-bold">Delivery Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={form.delivery_date}
            onChange={(e) =>
              setForm({ ...form, delivery_date: e.target.value })
            }
          />

          {/* AMOUNTS */}
          <div className="row">
            <div className="col-md-4">
              <label className="fw-bold">Total Amount</label>
              <input
                type="number"
                className="form-control mb-3"
                value={form.total_amount}
                onChange={(e) =>
                  setForm({ ...form, total_amount: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="fw-bold">Advance Amount</label>
              <input
                type="number"
                className="form-control mb-3"
                value={form.advance_amount}
                onChange={(e) =>
                  setForm({ ...form, advance_amount: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <label className="fw-bold">Balance Amount</label>
              <input
                type="number"
                className="form-control mb-3"
                value={form.balance_amount}
                readOnly
              />
            </div>
          </div>

          <button className="btn btn-primary mt-2">
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
}
