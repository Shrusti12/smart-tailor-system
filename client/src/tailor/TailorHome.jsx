import React, { useEffect, useState } from "react";

export default function TailorHome() {
  const tailor = JSON.parse(localStorage.getItem("user"));
  const tailorId = tailor.id;

  const [items, setItems] = useState([]);

  // Load assigned work
  useEffect(() => {
    fetch(`http://localhost:5001/tailor/orders/${tailorId}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [tailorId]);

  // Update status function
  const updateStatus = async (orderItemId, newStatus) => {
    if (!newStatus) return;

    const res = await fetch("http://localhost:5001/order-items/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_item_id: orderItemId,
        status: newStatus,
        updated_by: tailorId
      })
    });

    const data = await res.json();
    alert(data.message || data.error);

    // Refresh list after update
    fetch(`http://localhost:5001/tailor/orders/${tailorId}`)
      .then(res => res.json())
      .then(data => setItems(data));
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Assigned Stitching Work</h3>

      <div className="row">
        {items.map(item => (
          <div className="col-md-6" key={item.order_item_id}>
            <div className="card shadow mb-4 border-0">
              <div className="card-body">

                <h5 className="card-title text-primary">
                  {item.item_type}
                </h5>

                <p><b>Customer:</b> {item.customer_name}</p>
                <p><b>Delivery Date:</b> {new Date(item.delivery_date).toDateString()}</p>

                <p>
                  <b>Current Status:</b>{" "}
                  <span className="badge bg-secondary">
                    {item.status}
                  </span>
                </p>

                <hr />

                <h6>Measurements</h6>
                <small>
                  Length: {item.length}, Waist: {item.waist}, Hip: {item.hip}<br/>
                  Chest: {item.chest}, Sleeve: {item.sleeve}, Neck: {item.neck}
                </small>

                {item.instructions && (
                  <p className="mt-2">
                    <b>Instructions:</b> {item.instructions}
                  </p>
                )}

                <hr />

                {/* STATUS UPDATE UI */}
                <label className="form-label">Update Status</label>
                <select
                  className="form-select"
                  defaultValue=""
                  onChange={(e) =>
                    updateStatus(item.order_item_id, e.target.value)
                  }
                >
                  <option value="">-- Select Status --</option>
                  <option value="cutting">Cutting</option>
                  <option value="stitching">Stitching</option>
                  <option value="trial">Trial</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                </select>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
