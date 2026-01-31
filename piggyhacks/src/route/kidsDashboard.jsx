import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiggyBank, User, TrendingUp, CheckSquare, Wheat, X, Send, Sparkles, Volume2 } from "lucide-react";
import "../style/kidsDashboard.css";

export default function KidsDashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(125.5);
  const [showPigChat, setShowPigChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "pig", text: "Oink! I am your smart piggy bank. How can I help you save today?" }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsgs = [...messages, { role: "user", text: chatInput }];
    setMessages(newMsgs);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "pig",
        text: "That sounds like a great plan! Remember to save your money wisely!"
      }]);
    }, 1000);
  };

  const playTTS = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="kids-container">
      {/* Header */}
      <header className="kids-header">
        <button onClick={() => navigate("/")} className="profile-btn">
          <User size={20} />
        </button>
        <h2 className="kids-title">My Piggy Dashboard</h2>
        <div className="kids-avatar"></div>
      </header>

      <main className="kids-main">
        {/* Balance Display */}
        <div className="balance-card">
          <p className="balance-label">Current Money</p>
          <h3 className="balance-amount">${balance.toFixed(2)}</h3>
          <PiggyBank size={120} className="balance-bg-icon" />
        </div>

        {/* Interest Graph */}
        <div className="interest-card">
          <div className="interest-header">
            <h3 className="interest-title">
              <TrendingUp size={16} /> My Interest Growth
            </h3>
            <span className="growth-percent">+4.2%</span>
          </div>
          <div className="graph">
            {[45, 65, 55, 85, 110, 130].map((h, i) => (
              <div key={i} className="bar-wrapper">
                <div className="bar" style={{ height: `${h}%` }}>
                  <div className="tooltip">
                    <p className="week">Week {i + 1}</p>
                    <p className="amount">+${(h * 0.1).toFixed(2)}</p>
                  </div>
                  <div className="bar-label">${(h * 0.1).toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="graph-labels">
            <span>Month 1</span>
            <span>Month 2</span>
            <span>Current</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="kids-buttons">
          <button onClick={() => navigate("/kids-tasks")} className="tasks-btn">
            <CheckSquare size={44} />
            <span>TASKS</span>
          </button>
          <button onClick={() => navigate("/stock-farm")} className="farm-btn">
            <Wheat size={44} />
            <span>Stock Farm</span>
          </button>
        </div>
      </main>

      {/* Floating AI Pig */}
      <button
        onClick={() => setShowPigChat(true)}
        className={`floating-pig ${isSpeaking ? "speaking" : "bouncing"}`}
      >
        <div className="floating-label">
          <Sparkles size={12} /> ASK ME!
        </div>
        <PiggyBank size={40} className="floating-icon" />
      </button>

      {/* AI Pig Chat Modal */}
      {showPigChat && (
        <div className="pig-chat-overlay">
          <div className="pig-chat-modal">
            <div className="pig-chat-header">
              <div className="pig-chat-title">
                <PiggyBank size={24} className="text-pink-500" />
                <span>Smart Piggy</span>
              </div>
              <button onClick={() => setShowPigChat(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="pig-chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`message-wrapper ${m.role === "user" ? "user" : "pig"}`}>
                  <div className={`message-box ${m.role === "user" ? "user-msg" : "pig-msg"}`}>
                    {m.text}
                    {m.role === "pig" && (
                      <button onClick={() => playTTS(m.text)} className="tts-btn" disabled={isSpeaking}>
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && <div className="loader">Loading...</div>}
            </div>
            <form onSubmit={handleChat} className="pig-chat-input">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Talk to your pig..."
              />
              <button type="submit">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
