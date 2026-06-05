import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UpdateStatus() {
  const [form, setForm] = useState({
    order_item_id: "",
    status: "",
    updated_by: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/order-items/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="container mt-4 col-md-6">
      <div className="card p-4 shadow">

        {/* HEADER WITH BACK BUTTON */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Update Item Status</h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Order Item ID</label>
          <input
            className="form-control mb-2"
            value={form.order_item_id}
            onChange={(e) =>
              setForm({ ...form, order_item_id: e.target.value })
            }
          />

          <label>Status</label>
          <select
            className="form-control mb-2"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="">Select</option>
            <option>cutting</option>
            <option>stitching</option>
            <option>trial</option>
            <option>ready</option>
            <option>delivered</option>
          </select>

          <label>Updated By (User ID)</label>
          <input
            className="form-control mb-2"
            value={form.updated_by}
            onChange={(e) =>
              setForm({ ...form, updated_by: e.target.value })
            }
          />

          <button className="btn btn-primary mt-3">
            Update Status
          </button>
        </form>
      </div>
    </div>
  );
}
