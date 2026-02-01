import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PiggyBank,
  User,
  PlusCircle,
  MoreVertical,
  TrendingUp,
  Plus,
  X,
} from "lucide-react";
import "../style/parentDashboard.css";
import TaskPiggy from "../components/taskPiggy.jsx";

import axios from "axios";

import AddTaskPopup from "../components/AddTaskPopup.jsx";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balance, setBalance] = useState(50);
  const [editExpense, setEditExpense] = useState(null);

  const [newTask, setNewTask] = useState(null);

  const [menuOpen, setMenuOpen] = useState(null);
  const [editTask, setEditTask] = useState(null); // task being edited

  // Inside ParentDashboard component, after your states:
  const [summary, setSummary] = useState([]); // Daily summary logs

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      if (Array.isArray(res.data)) setTasks(res.data);
      else setTasks([]);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const createExpense = async (expense) => {
    try {
      const res = await axios.post("http://localhost:5000/expenses", {
        category: expense.name,
        price: expense.amount,
        date: new Date().toISOString(),
      });

      // Re-fetch expenses so UI matches DB
      await fetchExpenses();

      // Update balance
      setBalance((prev) => prev - expense.amount);

      console.log("Expense created:", res.data);
    } catch (err) {
      console.error("Failed to create expense:", err);
    }
  };

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

  useEffect(() => {
    fetchTasks();
    fetchExpenses();
  }, []);

  // Helper: format today's date
  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  //   // Whenever a task is confirmed (done)
  //   const confirmTask = (taskId) => {
  //     setTasks((prev) =>
  //       prev.map((task) => {
  //         if (task.id === taskId) {
  //           const updatedTask = {
  //             ...task,
  //             status: "confirmed",
  //             completedAt: new Date().toISOString(),
  //           };

  //           // Add to daily summary log
  //           setSummary((prevSummary) => [
  //             ...prevSummary,
  //             {
  //               type: "task",
  //               title: updatedTask.title,
  //               amount: updatedTask.amount,
  //               createdAt: updatedTask.completedAt,
  //             },
  //           ]);

  //           return updatedTask;
  //         }
  //         return task;
  //       }),
  //     );
  //   };

  // When adding a new expense
  const saveExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
    setBalance((prev) => prev - expense.amount);

    // Add to daily summary log
    setSummary((prevSummary) => [
      ...prevSummary,
      {
        type: "expense",
        title: expense.category,
        amount: expense.amount,
        createdAt: expense.createdAt,
      },
    ]);
  };

  const saveTask = (id, newTitle, newAmount) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title: newTitle, amount: Number(newAmount) } : t,
      ),
    );
    setEditTask(null);
  };

  // -----------------------------
  // Remove task locally and in DB only (no history)
  // -----------------------------
  const removeTaskNoHistory = async (taskId) => {
    try {
      // 1️⃣ Delete from current tasks in DB
      await axios.delete(`http://localhost:5000/tasks/${taskId}/delete`);

      // 2️⃣ Update frontend state
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setMenuOpen(null);

      console.log(`Task ${taskId} removed successfully.`);
    } catch (err) {
      console.error("Failed to remove task:", err);
    }
  };

  const removeTask = async (task) => {
    try {
      // 1️⃣ Remove from current tasks
      await axios.delete(`http://localhost:5000/tasks/${task.id}/delete`);

      // 2️⃣ Add to historical tasks
      // Replace "697e484fca16bfae68aef31c" with your actual historicaltasks docId
      const historicalDocId = "697e484fca16bfae68aef31c";

      await axios.post(
        `http://localhost:5000/historicaltasks/${historicalDocId}/add`,
        {
          price: task.amount,
          desc: task.title,
          childid: task.childid || 1, // provide childid if available
        },
      );

      // 3️⃣ Update frontend state
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setMenuOpen(null);

      console.log(`Task "${task.title}" moved to history successfully.`);
    } catch (err) {
      console.error("Failed to remove task:", err);
    }
  };

  return (
    <div className="parent-container">
      {/* Header */}
      {/* Header */}
      <header className="parent-header">
        {/* LEFT */}
        <div className="header-left">
          <div className="balance-card">
            {/* Move the profile button inside here */}
            <button onClick={() => navigate("/")} className="profile-btn">
              <User size={20} />
            </button>

            <div className="balance-info">
              <span className="balance-label">TOTAL BALANCE</span>
              <span className="balance-amount">${balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <h2 className="header-title">Parent Dashboard</h2>

        {/* RIGHT */}
        {/* <div className="header-right">
          <TaskPiggy tasks={tasks} />
        </div> */}
      </header>

      <main className="parent-main">
        {/* Balance */}

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
          <div
            className="tasks-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Active Tasks</h3>
            <button
              className="statement-btn"
              onClick={() => setNewTask({ title: "", amount: "" })}
            >
              <Plus size={16} /> Add Task
            </button>
          </div>

          <div className="task-notes">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`task-note ${task.completed ? "completed" : ""}`}
              >
                <div className="thumbtack"></div>

                {/* 3-dot menu */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setMenuOpen(menuOpen === task.id ? null : task.id)
                  }
                >
                  <MoreVertical size={16} />
                </div>

                {/* Dropdown menu */}
                {menuOpen === task.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 30,
                      right: 8,
                      background: "white",
                      borderRadius: 10,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                      padding: 8,
                      zIndex: 5,
                    }}
                  >
                    {task.completed === false && (
                      <>
                        <div
                          className="menu-item"
                          onClick={() => setEditTask(task)}
                        >
                          Modify
                        </div>
                        <div
                          className="menu-item"
                          onClick={() => removeTaskNoHistory(task.id)}
                        >
                          Remove
                        </div>
                      </>
                    )}
                    {task.completed === true && (
                      <>
                        {/* <div
                          className="menu-item"
                          onClick={() => confirmTask(task.id)}
                        >
                          Confirm
                        </div> */}
                        <div
                          className="menu-item"
                          onClick={() => removeTask(task)}
                        >
                          Confirm Payment & Remove Task
                        </div>
                        <div
                          className="menu-item"
                          onClick={() => navigate("/tasks/history")}
                        >
                          Go to History
                        </div>
                      </>
                    )}
                  </div>
                )}

                <h4>{task.title}</h4>
                <span>${task.amount}</span>
              </div>
            ))}
          </div>

          {/* See More Button */}
          {tasks.length > 4 && (
            <button
              className="see-more-btn"
              onClick={() => navigate("/parent-tasks", { state: { tasks } })}
            >
              See More Tasks
            </button>
          )}

          {/* Edit Task Popup */}
          {editTask && (
            <div className="popup-overlay">
              <div className="popup-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>Edit Task</h3>
                  <X
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditTask(null)}
                  />
                </div>

                <div className="proof-row">
                  <label>Task Title</label>
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) =>
                      setEditTask({ ...editTask, title: e.target.value })
                    }
                  />
                </div>

                <div className="proof-row">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    value={editTask.amount}
                    onChange={(e) =>
                      setEditTask({ ...editTask, amount: e.target.value })
                    }
                  />
                </div>

                <div className="popup-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setEditTask(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="upload-btn"
                    onClick={() =>
                      saveTask(editTask.id, editTask.title, editTask.amount)
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Expenses */}
        {/* Expenses Section */}
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
            <button
              className="expense-btn"
              onClick={() => setEditExpense({ name: "", amount: 0 })}
            >
              <Plus size={16} /> Add Expense
            </button>
          </div>

          {/* Expense sticky notes */}
          <div className="expenses-list">
            {expenses.map((exp) => (
              <div key={exp.id} className="expense-item">
                <span>{exp.category}</span>
                <span className="expense-amount">${exp.amount.toFixed(2)}</span>

                {/* 3-dot menu for Modify / Remove */}
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setMenuOpen(
                      menuOpen === `exp-${exp.id}` ? null : `exp-${exp.id}`,
                    )
                  }
                >
                  <MoreVertical size={16} />
                </div>

                {menuOpen === `exp-${exp.id}` && (
                  <div
                    style={{
                      position: "absolute",
                      background: "white",
                      borderRadius: 10,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                      padding: 8,
                      zIndex: 5,
                      right: 10,
                      top: 40,
                    }}
                  >
                    <div
                      className="menu-item"
                      onClick={
                        () => setEditExpense({ ...exp, id: exp.id }) // load expense into popup
                      }
                    >
                      Modify
                    </div>
                    <div
                      className="menu-item"
                      onClick={() =>
                        setExpenses((prev) =>
                          prev.filter((e) => e.id !== exp.id),
                        )
                      }
                    >
                      Remove
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add / Edit Expense Popup */}
          {editExpense && (
            <div className="popup-overlay">
              <div className="popup-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>{editExpense.id ? "Edit Expense" : "Add Expense"}</h3>
                  <X
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditExpense(null)}
                  />
                </div>

                <div className="proof-row">
                  <label>Expense Name</label>
                  <input
                    type="text"
                    value={editExpense.name}
                    onChange={(e) =>
                      setEditExpense({ ...editExpense, name: e.target.value })
                    }
                  />
                </div>

                <div className="proof-row">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    value={editExpense.amount}
                    onChange={(e) =>
                      setEditExpense({
                        ...editExpense,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="popup-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setEditExpense(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="upload-btn"
                    onClick={async () => {
                      if (editExpense.id) {
                        // (Optional) You can later wire PUT /expenses/:id here
                        console.warn("Edit expense not wired to API yet");
                      } else {
                        await createExpense(editExpense);
                      }

                      setEditExpense(null);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
        {/* <section className="daily-summary">
          <h3>Today's Summary</h3>
          <ul>
            {summary
              .filter((item) => isToday(item.createdAt))
              .map((item, i) => (
                <li key={i}>
                  {item.type === "task"
                    ? `Anna earned $${item.amount} from "${item.title}"`
                    : `Anna spent $${item.amount} on "${item.title}"`}
                </li>
              ))}
          </ul>
        </section>

        {/* Monthly Statement Button */}
        <button 
          onClick={() => navigate("/parent-monthly-statement")} 
          className="monthly-statement-btn"
        >
          Monthly Statement
        </button>
      </main>
      <AddTaskPopup
        newTask={newTask}
        setNewTask={setNewTask}
        onTaskAdded={() => fetchTasks()}
      />
    </div>
  );
}
