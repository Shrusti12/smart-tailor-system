import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateOrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [tailors, setTailors] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/orders/${id}`)
      .then(res => res.json())
      .then(setOrder);

    fetch("http://localhost:5001/users?role=tailor")
      .then(res => res.json())
      .then(setTailors);
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5001/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="container col-md-6 mt-4">
      <div className="card p-4 shadow">

        {/* HEADER WITH BACK BUTTON */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Update Order Status</h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <label>Status</label>
        <select
          className="form-control mb-2"
          value={order.status || ""}
          onChange={(e) =>
            setOrder({ ...order, status: e.target.value })
          }
        >
          <option value="received">Received</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delivered">Delivered</option>
        </select>

        <label>Assign Tailor</label>
        <select
          className="form-control mb-2"
          value={order.tailor_id || ""}
          onChange={(e) =>
            setOrder({ ...order, tailor_id: e.target.value })
          }
        >
          <option value="">Select Tailor</option>
          {tailors.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button
          className="btn btn-success mt-2"
          onClick={handleUpdate}
        >
          Update Order
        </button>

      </div>
    </div>
  );
}
