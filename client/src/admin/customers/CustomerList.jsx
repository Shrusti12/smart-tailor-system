import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const load = () => {
    fetch("http://localhost:5001/customers")
      .then(res => res.json())
      .then(data => setCustomers(data));
  };

  useEffect(() => {
    load();
  }, []);

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    await fetch(`http://localhost:5001/customers/${id}`, {
      method: "DELETE",
    });

    load();
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

      <div className="d-flex justify-content-between mb-3">
        <h3>Customers</h3>
        <Link to="/admin/add-customer" className="btn btn-primary">
          + Add Customer
        </Link>
      </div>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>User Mobile</th>
            <th>Alternate-Mobile</th>
            <th>Address</th>
            <th style={{ width: "140px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.user_mobile}</td>
              <td>{c.customer_mobile}</td>
              <td>{c.address}</td>

              <td>
                <Link
                  className="btn btn-sm btn-warning me-2"
                  to={`/admin/edit-customer/${c.id}`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCustomer(c.id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;
