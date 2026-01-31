import React, { useState } from 'react';
import {
  PiggyBank,
  User,
  Baby,
  ArrowRight
} from 'lucide-react';
import '../style/login.css';

export default function LoginPage() {
  const [view, setView] = useState('login');
  const [loginType, setLoginType] = useState('parent');

  const handleLogin = () => {
    console.log("Logged in as:", loginType);
  };

  if (view === 'login') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="pig-icon-wrapper">
              <PiggyBank size={40} className="pig-icon" />
            </div>
            <h1>Piggy Finance</h1>
          </div>

          <div className="login-toggle">
            <button
              onClick={() => setLoginType('parent')}
              className={`toggle-btn ${loginType === 'parent' ? 'active-parent' : ''}`}
            >
              <User size={18} />
              Parent
            </button>

            <button
              onClick={() => setLoginType('kids')}
              className={`toggle-btn ${loginType === 'kids' ? 'active-kids' : ''}`}
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
}
