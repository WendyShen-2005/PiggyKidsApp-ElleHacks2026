import React, { useState, useEffect } from "react";
import { MoreVertical, Plus, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/kidsTaskPage.css";
import AddTaskPopup from "../components/AddTaskPopup.jsx";

import axios from "axios";

export default function ParentTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([
    { id: 1, title: "Clean the Room", amount: 5, status: "pending" },
    { id: 2, title: "Wash the Dishes", amount: 3, status: "completed" },
  ]);

  // Load tasks from navigation state if available
  useEffect(() => {
    if (location.state?.tasks) {
      setTasks(location.state.tasks);
    }
  }, [location.state?.tasks]);

  const [menuOpen, setMenuOpen] = useState(null);
  const [editTask, setEditTask] = useState(null); // task being edited
  const [newTask, setNewTask] = useState(null);

  // Open Add Task popup
  const addTask = () => {
    setNewTask({ title: "", amount: "" });
  };

 // -----------------------------
// Remove task and move to history
// -----------------------------

// -----------------------------
// Remove task locally and in DB only (no history)
// -----------------------------
const removeTaskNoHistory = async (taskId) => {
  try {
    // 1️⃣ Delete from current tasks in DB
    // Suppose you have the docId stored somewhere (maybe passed from parent)
    const docId = "697e4715ca16bfae68aef315";

    console.log(typeof taskId, taskId); // should be "number"
    await axios.delete(`http://localhost:5000/tasks/${docId}/${taskId}/delete`);


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
    // 1️⃣ Delete from current tasks in DB
        const docId = "697e4715ca16bfae68aef315";

    console.log(typeof task.id, task.id); // should be "number"
    await axios.delete(`http://localhost:5000/tasks/${docId}/${task.id}/delete`);


    // 2️⃣ Add to historical tasks
    // Replace with your actual historicaltasks docId
    const historicalDocId = "697e484fca16bfae68aef31c";

    await axios.post(
      `http://localhost:5000/historicaltasks/${historicalDocId}/add`,
      {
        price: task.amount,
        desc: task.title,
        childid: task.childid || 1, // adjust if your tasks have childid
      }
    );

    // 3️⃣ Update frontend state
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setMenuOpen(null);

    console.log(`Task "${task.title}" moved to history successfully.`);
  } catch (err) {
    console.error("Failed to remove task:", err);
  }
};


  // Confirm completed task
  const confirmTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "confirmed" } : t)),
    );
    setMenuOpen(null);
  };

  // Save modifications
  const saveTask = (id, newTitle, newAmount) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, title: newTitle, amount: Number(newAmount) } : t,
      ),
    );
    setEditTask(null);
  };

  return (
    <div className="tasks-page">
      <div className="tasks-card">
        <div className="tasks-header">
          <h2>Task Board</h2>
          <button className="statement-btn" onClick={addTask}>
            <Plus size={16} />
            Add Task
          </button>
        </div>

        {/* Sticky Notes */}
        <div className="task-notes">
          {tasks.map((task) => (
            <div key={task.id} className={`task-note ${task.status}`}>
              <div className="thumbtack"></div>

              {/* 3 dots menu */}
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
                        onClick={() => {
                          setEditTask(task);
                          setMenuOpen(null);
                        }}
                      >
                        Modify
                      </div>

                       <div className="menu-item" onClick={() => removeTaskNoHistory(task.id)}>
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
                        onClick={() => removeTask(task)} // pass full task instead of just id
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

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

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

        {newTask && (
          <AddTaskPopup
            newTask={newTask}
            setNewTask={setNewTask}
            onTaskAdded={(res) => {
              if (res && res.task) {
                setTasks((prev) => [...prev, res.task]);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
