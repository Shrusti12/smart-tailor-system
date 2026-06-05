import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/login", { mobile, password });
      if (res.data.success) {
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") navigate("/admin/home");
        else if (user.role === "customer") navigate("/customer/home");
        else if (user.role === "tailor") navigate("/tailor/home");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Invalid login details");
    }
  };

  const handleBack = () => navigate(-1);

  // 🔹 Use same background image as Landing page
  const bgImage =
    "https://images.unsplash.com/photo-1593032457863-4b42231aa74d?auto=format&fit=crop&w=1470&q=80";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Back Button */}
      <div
        style={{ position: "absolute", top: "20px", left: "20px" }}
        className="text-center mb-3"
      >
        <button type="button" className="btn btn-dark btn-sm" onClick={handleBack}>
          &laquo; Back
        </button>
      </div>

      {/* Login Card */}
      <div
        className="card p-4 shadow"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.15)", // semi-transparent card
          backdropFilter: "blur(10px)", // glassmorphism effect
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          transition: "transform 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#fff" }}>
          Login
        </h3>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#fff" }}>
              Mobile Number
            </label>
            <input
              type="text"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ color: "#fff" }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="btn w-100 fw-bold"
            style={{
              background: "#80deea", // soft pastel button
              color: "#000",
              padding: "10px",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "8px",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
