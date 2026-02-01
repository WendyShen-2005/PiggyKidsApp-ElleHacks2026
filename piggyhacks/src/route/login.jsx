import React, { useState } from "react";
import { PiggyBank, User, Baby, ArrowRight } from "lucide-react";
import "../style/login.css";
import { useNavigate } from "react-router-dom";
import piggyImage from "../components/teddybank.png"
export default function LoginPage() {
  const [loginType, setLoginType] = useState("parent");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to parent or kids dashboard
    navigate(loginType === "parent" ? "/parent-dashboard" : "/kids-dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="pig-icon-wrapper">
            <img src={piggyImage} alt="Piggy Bank" className="pig-icon" />
          </div>
          <h1>TeddyBank</h1>
        </div>

        <div className="login-toggle">
          <button
            onClick={() => setLoginType("parent")}
            className={`toggle-btn ${loginType === "parent" ? "active-parent" : ""}`}
          >
            <User size={18} />
            Parent
          </button>

          <button
            onClick={() => setLoginType("kids")}
            className={`toggle-btn ${loginType === "kids" ? "active-kids" : ""}`}
          >
            <Baby size={18} />
            Kids
          </button>
        </div>

        <div className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username..." />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button onClick={handleLogin} className="login-button">
            LOGIN <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
