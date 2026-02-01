import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PiggyBank,
  User,
  TrendingUp,
  CheckSquare,
  Wheat,
  X,
  Send,
  Sparkles,
  Volume2,
} from "lucide-react";
import "../style/kidsDashboard.css";
import TaskPiggy from "../components/taskPiggy.jsx";
import axios from "axios";

export default function KidsDashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(125.5);
  const [showPigChat, setShowPigChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "pig",
      text: "Oink! I am your smart piggy bank. How can I help you save today?",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Clean the Room", status: "completed" },
    { id: 2, title: "Wash the Dishes", status: "pending" },
    { id: 3, title: "Feed the Dog", status: "pending" },
  ]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expenses");

      if (Array.isArray(res.data)) {
        const mapped = res.data.map((e) => ({
          id: e._id, // Mongo _id → id
          category: e.category,
          amount: e.price, // price → amount
          date: e.date,
        }));

        setExpenses(mapped);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };
  const handleChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsgs = [...messages, { role: "user", text: chatInput }];
    setMessages(newMsgs);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "pig",
          text: "That sounds like a great plan! Remember to save your money wisely!",
        },
      ]);
    }, 1000);
  };
  useEffect(() => {
    fetchExpenses();
  }, []);

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
        <h2 className="kids-title">My TeddyBank Dashboard</h2>
        {/* <div className="kids-avatar"></div> */}
        {/* <TaskPiggy tasks={tasks} /> */}
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
        <section className="expenses-section">
          <div
            className="tasks-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Expenses</h3>
          </div>

          <div className="expenses-list">
            {expenses.map((exp) => (
              <div key={exp.id} className="expense-item">
                <span>{exp.category}</span>
                <span className="expense-amount">${exp.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Statement Button */}
        <button 
          onClick={() => navigate("/kids-monthly-statement")} 
          className="monthly-statement-btn"
        >
          Monthly Statement
        </button>
      </main>
    </div>
  );
}
