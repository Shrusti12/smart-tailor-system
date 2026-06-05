import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MeasurementList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/measurements")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
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
      
      <h3>Measurements</h3>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Chest</th>
            <th>Waist</th>
            <th>Hip</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.customer_name}</td>
              <td>{m.chest}</td>
              <td>{m.waist}</td>
              <td>{m.hip}</td>
              <td>
                <a href={`/admin/measurement/${m.id}`} className="btn btn-sm btn-info">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default MeasurementList;
