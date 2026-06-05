import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddMeasurement() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    length: "",
    waist: "",
    hip: "",
    chest: "",
    shoulder: "",
    sleeve: "",
    neck: "",
    instructions: ""
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.status === 201) {
      setMsg("Measurement saved!");
      setForm({
        customer_id: "",
        length: "",
        waist: "",
        hip: "",
        chest: "",
        shoulder: "",
        sleeve: "",
        neck: "",
        instructions: ""
      });
    } else {
      setMsg(data.error);
    }
  };
  const navigate = useNavigate();
  // 🔙 BACK BUTTON HANDLER
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4">
      {/* 🔙 Bootstrap Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <button
            type="button"
            className="btn btn-dark btn-sm"
            onClick={handleBack}
          >
            &laquo; Back
          </button>
        </div>

      <div className="card p-4 shadow mx-auto" style={{ width: "600px" }}>
        <h4 className="text-center text-primary mb-3">Add Measurement</h4>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-bold">Select Customer</label>
          <select
            name="customer_id"
            className="form-control mb-3"
            value={form.customer_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose Customer</option>
            {customers.map(c => (
              <option value={c.id} key={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="row">
            {["length","waist","hip","chest","shoulder","sleeve","neck"].map((m) => (
              <div className="col-md-4 mb-3" key={m}>
                <label className="form-label text-capitalize">{m}</label>
                <input
                  type="number"
                  step="0.1"
                  name={m}
                  value={form[m]}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            ))}
          </div>

          <label className="form-label fw-bold">Instructions</label>
          <textarea
            className="form-control mb-3"
            name="instructions"
            rows="3"
            value={form.instructions}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-100">Save Measurement</button>
        </form>
      </div>
    </div>
  );
}

export default AddMeasurement;
