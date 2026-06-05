import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditCustomer() {
  const { id } = useParams();
  const [form, setForm] = useState({
    mobile: "",
    address: "",
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5001/customers/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          mobile: data.customer_mobile,
          address: data.address,
        });
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5001/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) setMsg("Customer updated!");
  };

  const navigate = useNavigate();

  // 🔙 BACK BUTTON HANDLER
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ width: "450px" }}>
        {/* Header with Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button 
            type="button"
            className="btn btn-dark btn-sm"
            onClick={handleBack}
          >
            &laquo; Back
          </button>
        </div>

        <h4 className="text-center text-warning mb-3">Edit Customer</h4>

        {msg && <div className="alert alert-success text-center">{msg}</div>}

        <form onSubmit={handleSubmit}>

          <label className="form-label">Mobile</label>
          <input
            type="text"
            className="form-control mb-3"
            name="mobile"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            required
          />

          <label className="form-label">Address</label>
          <textarea
            className="form-control mb-3"
            rows="3"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />

          <button className="btn btn-warning w-100">Update</button>
        </form>
      </div>
    </div>
  );
}

export default EditCustomer;
