import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PiggyBank,
  User,
  PlusCircle,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import "../style/parentDashboard.css";
import TaskPiggy from "../components/taskPiggy.jsx";

const INITIAL_TASKS = [
  { id: 1, title: "Clean the Room", amount: 5, status: "pending" },
  { id: 2, title: "Wash the Dishes", amount: 3, status: "completed" },
  { id: 3, title: "Feed the Dog", amount: 2, status: "pending" },
];

const INITIAL_EXPENSES = [
  { id: 1, category: "Toys", amount: 15 },
  { id: 2, category: "Candy", amount: 2 },
  { id: 3, category: "Snack", amount: 5 },
];

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [balance, setBalance] = useState(50);

  const confirmTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "confirmed" } : task,
      ),
    );
  };

  const handleAddExpense = (category, amount) => {
    setExpenses((prev) => [...prev, { id: Date.now(), category, amount }]);
    setBalance((prev) => prev - amount);
  };

  return (
    <div className="parent-container">
      {/* Header */}
      <header className="parent-header">
        <button onClick={() => navigate("/")} className="profile-btn">
          <User size={20} />
        </button>
        <h2 className="header-title">Parent Dashboard</h2>
        {/* <div className="kids-avatar"></div> */}
        <TaskPiggy tasks={tasks} />
      </header>

      <main className="parent-main">
        {/* Balance */}
        <section className="balance-card">
          <p className="balance-label">Total Balance</p>
          <h2 className="balance-amount">${balance.toFixed(2)}</h2>
          <PiggyBank size={120} className="balance-bg-icon" />
        </section>

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

        {/* Tasks */}
        <section className="tasks-section">
          <h3 className="section-title">Active Tasks</h3>
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <p className="task-title">{task.title}</p>
                  <MoreVertical size={16} />
                </div>
                <div className="task-footer">
                  <span className="task-amount">${task.amount}</span>
                  {task.status === "completed" && (
                    <button
                      className="confirm-btn"
                      onClick={() => confirmTask(task.id)}
                    >
                      CONFIRM
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Expenses */}
        <section className="expenses-section">
          <h3 className="section-title">Deduct Expenses</h3>
          <div className="expense-btns">
            {["Toys", "Candy", "Snack"].map((cat) => (
              <button
                key={cat}
                className="expense-btn"
                onClick={() => handleAddExpense(cat, 5)}
              >
                <PlusCircle size={14} />
                {cat}
              </button>
            ))}
          </div>
          <div className="expenses-list">
            {expenses.map((exp) => (
              <div key={exp.id} className="expense-item">
                <span>{exp.category}</span>
                <span className="expense-amount">
                  -${exp.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
