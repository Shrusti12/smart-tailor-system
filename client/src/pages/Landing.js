import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/">
            ✂️ Smart Tailor
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services">Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>

              <li className="nav-item ms-3">
                <Link to="/login" className="btn btn-outline-light px-4">
                  Login
                </Link>
              </li>

              <li className="nav-item ms-2">
                <Link to="/tailor-register" className="btn btn-success px-4">
                  Tailor Register
                </Link>
              </li>

              <li className="nav-item ms-2">
                <Link to="/register" className="btn btn-warning px-4 fw-bold">
                  Customer Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <div
        className="d-flex align-items-center text-white"
        style={{
          minHeight: "100vh",
          marginTop: "56px",
          background: "linear-gradient(135deg, #1f2933, #111827)",
        }}
      >
        <div className="container">
          <div
            className="p-5 rounded text-center mx-auto"
            style={{
              maxWidth: "700px",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            <h1 className="display-4 fw-bold mb-3">
              Smart Tailor System
            </h1>
            <p className="lead mb-4">
              Manage tailoring orders, measurements, and customers
              digitally with speed, accuracy, and style.
            </p>
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="container my-5" id="features">
        <h2 className="text-center fw-bold mb-5">✨ Key Features</h2>

        <div className="row g-4">
          {[
            {
              icon: "📐",
              title: "Measurement Management",
              desc: "Digitally store accurate customer measurements securely."
            },
            {
              icon: "📦",
              title: "Order Tracking",
              desc: "Track stitching progress and delivery status in real-time."
            },
            {
              icon: "✂️",
              title: "Tailor Assignment",
              desc: "Assign jobs to tailors and manage workload efficiently."
            }
          ].map((f, i) => (
            <div className="col-md-4" key={i}>
              <div
                className="card h-100 text-center border-0 shadow"
                style={{ transition: "transform 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div className="card-body p-4">
                  <h1>{f.icon}</h1>
                  <h5 className="fw-bold mt-3">{f.title}</h5>
                  <p className="text-muted">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <div className="bg-light py-5" id="services">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">🧵 Our Services</h2>

          <div className="row">
            <div className="col-md-6">
              <ul className="fs-5">
                <li>Online order booking</li>
                <li>Custom tailoring services</li>
                <li>Secure customer data storage</li>
              </ul>
            </div>

            <div className="col-md-6">
              <ul className="fs-5">
                <li>Admin dashboard</li>
                <li>Tailor workload management</li>
                <li>Payment & delivery tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer id="contact" className="bg-dark text-white text-center py-4">
        <p className="mb-1 fw-bold">© 2025 Smart Tailor System</p>
        <small>MCA Final Year Project</small>
      </footer>
    </>
  );
}

export default Landing;
