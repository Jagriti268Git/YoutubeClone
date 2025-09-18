import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../signin.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
export default function SignIn({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage("");
  };

  const handleChange = (e) => {
    const { type, value } = e.target;
    const key = type === "text" ? "name" : type;
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignUp
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed: " + response.statusText);
      const data = await response.json();

      if (isSignUp) {
        toast.success(" Account created! Please sign in.");
        setIsSignUp(false);
      } else {
        const { token, user } = data;

        // Saved token
        sessionStorage.setItem("token", token);

        // Saved user in localStorage too
        localStorage.setItem("user", JSON.stringify(user));

        // Updated state in App immediately
        setUser(user);

        toast.success(" Signed in successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error(" Server Error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };


  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>{isSignUp ? "Create your Account" : "Sign in"}</h2>

        {message && <p className="success-msg">{message}</p>}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          )}
          <input type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <button type="submit" className="signin-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="toggle-text">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span onClick={toggleForm}>{isSignUp ? " Sign in" : " Sign up"}</span>
        </p>
      </div>
    </div>
  );
}
