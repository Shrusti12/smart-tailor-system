import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";

function TailorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    role: "tailor",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain:\n• Uppercase letter\n• Lowercase letter\n• Number\n• Special character\n• Minimum 8 characters"
      );
      return;
    }

    try {
      await axios.post("http://localhost:5001/users", formData);
      alert("Tailor registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  const bgImage =
    "https://images.unsplash.com/photo-1593032457863-4b42231aa74d?auto=format&fit=crop&w=1470&q=80";

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "30px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
          transition: "transform 0.3s",
        }}
        className="shadow"
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>
          Tailor Registration
        </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label className="fw-semibold">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMobile">
            <Form.Label className="fw-semibold">Mobile</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2" controlId="formPassword">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Eg: Tailor@123"
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Show Password"
            className="mb-3"
            onChange={() => setShowPassword(!showPassword)}
          />

          <Form.Group className="mb-4" controlId="formAddress">
            <Form.Label className="fw-semibold">Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100 fw-bold"
            style={{
              padding: "10px",
              fontSize: "1.1rem",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default TailorRegister;
