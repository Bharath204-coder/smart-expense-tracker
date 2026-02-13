import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { email, password });
      alert("Registered successfully");
      navigate("/");
    } catch {
      alert("User already exists");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>

        <input placeholder="Email"
          onChange={e => setEmail(e.target.value)} />

        <input type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)} />

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}
