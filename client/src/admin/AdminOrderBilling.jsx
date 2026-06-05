import React, { useState } from "react";

function AdminOrderBilling() {

  const [items, setItems] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    orderId: ""
  });

  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addItem = () => {
    if (!newItem || !newPrice) return;

    setItems([...items, { item: newItem, price: Number(newPrice) }]);
    setNewItem("");
    setNewPrice("");
  };

  const totalAmount = items.reduce((sum, i) => sum + i.price, 0);

  const handlePrint = () => {
    if (items.length === 0) {
      alert("Please add at least one item to generate bill");
      return;
    }
    window.print();
  };

  return (
    <div className="page-bg">

      {/* ---------- PRINT STYLES ---------- */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        `}
      </style>

      <div className="container">

        {/* ---------- PRINTABLE BILL ---------- */}
        <div id="print-area" className="content-card mb-4">
          <h3 className="text-center mb-4 page-title">
            <i className="fas fa-receipt me-2"></i>
            Smart Tailor Invoice
          </h3>

          <div className="row mb-3">
            <div className="col-md-4"><strong>Customer:</strong> {customer.name}</div>
            <div className="col-md-4"><strong>Mobile:</strong> {customer.mobile}</div>
            <div className="col-md-4"><strong>Order ID:</strong> {customer.orderId}</div>
          </div>

          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>

          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Item</th>
                <th className="text-end">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No items added</td>
                </tr>
              ) : (
                items.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.item}</td>
                    <td className="text-end">{row.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h5 className="text-end mt-3">
            Total Amount:
            <span className="text-success ms-2">₹ {totalAmount}</span>
          </h5>

          <p className="text-center mt-4">
            🙏 Thank you for choosing <strong>Smart Tailor</strong> ✨
          </p>
        </div>

        {/* ---------- INPUT SECTION ---------- */}
        <div className="content-card no-print">
          <h5 className="page-title mb-3">
            <i className="fas fa-user me-2"></i>
            Customer Details
          </h5>

          <div className="row mb-4">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Customer Name"
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Mobile"
                onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Order ID"
                onChange={(e) => setCustomer({ ...customer, orderId: e.target.value })}
              />
            </div>
          </div>

          <h5 className="page-title mb-3">
            <i className="fas fa-scissors me-2"></i>
            Add Item
          </h5>

          <div className="row mb-4">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Item Name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" onClick={addItem}>
                <i className="fas fa-plus me-1"></i> Add
              </button>
            </div>
          </div>

          <div className="text-end">
            <button className="btn btn-success" onClick={handlePrint}>
              <i className="fas fa-print me-2"></i>
              Generate & Print Bill
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminOrderBilling;
