import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddCustomer() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    mobile: "",
    address: ""
  });
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/users/customers")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.status === 201) {
      setMsg("Customer added successfully!");
      setForm({ user_id: "", mobile: "", address: "" });
    } else {
      setMsg(data.error);
    }
  };

  // 🔙 BACK BUTTON HANDLER
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ width: "450px" }}>

        {/* Header with Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary mb-0">Add Customer</h4>

          <button
            type="button"
            className="btn btn-dark btn-sm"
            onClick={handleBack}
          >
            &laquo; Back
          </button>
        </div>

        {msg && <div className="alert alert-info p-1 text-center">{msg}</div>}

        <form onSubmit={handleSubmit}>
          
          <label className="form-label">Select User</label>
          <select
            name="user_id"
            className="form-control mb-3"
            value={form.user_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.mobile})
              </option>
            ))}
          </select>

          <label className="form-label">Alternate Mobile</label>
          <input
            type="text"
            className="form-control mb-3"
            name="mobile"
            maxLength={10}
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <label className="form-label">Address</label>
          <textarea
            className="form-control mb-3"
            name="address"
            rows="3"
            value={form.address}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-100">
            Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
