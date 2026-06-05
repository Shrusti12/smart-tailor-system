import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AddTailorSpecialization() {
  const navigate = useNavigate();
  const [tailors, setTailors] = useState([]);
  const [tailorId, setTailorId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all tailors
  const getTailors = async () => {
    try {
      const res = await axios.get("http://localhost:5001/tailors");
      setTailors(res.data.tailors);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getTailors();
  }, []);

  // Submit specialization
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tailorId || !specialization) {
      setMessage("Please select tailor and enter specialization");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/tailor/specialization", {
        tailor_id: tailorId,
        specialization
      });

      if (res.status === 201) {
        setMessage("Specialization added successfully!");
        setTailorId("");
        setSpecialization("");
      }
    } catch (err) {
      setMessage("Error while saving!");
    }
  };

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

      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", margin: "auto" }}
      >
        <h4 className="text-center mb-3">Add Tailor Specialization</h4>

        {message && (
          <div className="alert alert-info text-center py-2">{message}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Tailor dropdown */}
          <div className="mb-3">
            <label className="form-label">Select Tailor</label>
            <select
              className="form-select"
              value={tailorId}
              onChange={(e) => setTailorId(e.target.value)}
            >
              <option value="">Choose...</option>
              {tailors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Specialization input */}
          <div className="mb-3">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Pant Stitching, Shirt Stitching"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100">Save</button>
        </form>
      </div>
    </div>
  );
}

export default AddTailorSpecialization;
