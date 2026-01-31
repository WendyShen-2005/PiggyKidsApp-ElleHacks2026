import React, { useState } from 'react';
import {
  PiggyBank,
  User,
  PlusCircle,
  MoreVertical
} from 'lucide-react';
import '../style/parentDashboard.css';

// --- Initial Data ---
const INITIAL_TASKS = [
  { id: 1, title: 'Clean the Room', amount: 5, status: 'pending' },
  { id: 2, title: 'Wash the Dishes', amount: 3, status: 'completed' },
  { id: 3, title: 'Feed the Dog', amount: 2, status: 'pending' },
];

const INITIAL_EXPENSES = [
  { id: 1, category: 'Toys', amount: 15 },
  { id: 2, category: 'Candy', amount: 2 },
  { id: 3, category: 'Snack', amount: 5 },
];

const ParentDashboard = ({ setView }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [balance, setBalance] = useState(50);

  const confirmTask = (taskId) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: 'confirmed' } : task
      )
    );
  };

  const handleAddExpense = (category, amount) => {
    setExpenses(prev => [
      ...prev,
      { id: Date.now(), category, amount }
    ]);
    setBalance(prev => prev - amount);
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="header-icon">
            <User size={20} />
          </div>
          <h1 className="header-title">Parent Hub</h1>
        </div>

        <button
          onClick={() => setView?.('login')}
          className="logout-btn"
        >
          LOGOUT
        </button>
      </header>

      <main className="main">
        {/* Balance */}
        <section>
          <div className="balance-card">
            <p className="balance-label">Total Family Assets</p>
            <h2 className="balance-amount">
              ${balance.toFixed(2)}
            </h2>
            <div className="balance-icon">
              <PiggyBank size={120} />
            </div>
          </div>
        </section>

        {/* Tasks */}
        <section>
          <h3 className="section-title">Active Tasks</h3>

          <div className="tasks">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`task ${task.status}`}
              >
                <div className="task-header">
                  <p className="task-title">{task.title}</p>
                  <MoreVertical size={16} />
                </div>

                <div className="task-footer">
                  <span className="task-amount">
                    ${task.amount}
                  </span>

                  {task.status === 'completed' && (
                    <button
                      onClick={() => confirmTask(task.id)}
                      className="confirm-btn"
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
        <section className="expenses">
          <h3 className="section-title">Deduct Expenses</h3>

          <div className="expense-btns">
            {['Toys', 'Candy', 'Snack'].map(cat => (
              <button
                key={cat}
                onClick={() => handleAddExpense(cat, 5)}
                className="expense-btn"
              >
                <PlusCircle size={14} />
                {cat}
              </button>
            ))}
          </div>

          {expenses.map(exp => (
            <div key={exp.id} className="expense-item">
              <span>{exp.category}</span>
              <span className="expense-amount">
                -${exp.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ParentDashboard;
