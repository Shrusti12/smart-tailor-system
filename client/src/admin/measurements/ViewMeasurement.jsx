import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewMeasurement() {
  const { id } = useParams();
  const [m, setM] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/measurements/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setM(data[0]);
        else setM(data);
      });
  }, [id]);

  if (!m) return <h4 className="text-center mt-4">Loading...</h4>;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-primary">
            {m.customer_name} — Measurement Details
          </h4>

          <button
            className="btn btn-dark btn-sm"
            onClick={() => navigate(-1)}
          >
            &laquo; Back
          </button>
        </div>

        <table className="table table-bordered">
          <tbody>
            {Object.entries(m).map(([key, val]) =>
              key !== "id" && key !== "customer_name" && (
                <tr key={key}>
                  <th className="text-capitalize">
                    {key.replace("_", " ")}
                  </th>
                  <td>{val || "-"}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default ViewMeasurement;
