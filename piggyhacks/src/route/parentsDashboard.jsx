import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiggyBank, User, PlusCircle, MoreVertical } from "lucide-react";
import "../style/parentDashboard.css";

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
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, status: "confirmed" } : task))
    );
  };

  const handleAddExpense = (category, amount) => {
    setExpenses(prev => [...prev, { id: Date.now(), category, amount }]);
    setBalance(prev => prev - amount);
  };

  return (
    <div className="parent-container">
      {/* Header */}
      <header className="parent-header">
        <div className="header-left">
          <User size={20} />
          <h1 className="header-title">Parent Hub</h1>
        </div>

        <button className="logout-btn" onClick={() => navigate("/")}>
          LOGOUT
        </button>
      </header>

      <main className="parent-main">
        {/* Balance */}
        <section className="balance-card">
          <p className="balance-label">Total Balance</p>
          <h2 className="balance-amount">${balance.toFixed(2)}</h2>
          <PiggyBank size={120} className="balance-bg-icon" />
        </section>

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
                    <button className="confirm-btn" onClick={() => confirmTask(task.id)}>
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
                <span className="expense-amount">-${exp.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
