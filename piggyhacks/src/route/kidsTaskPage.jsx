import React, { useState, useEffect } from "react"; 
import { PiggyBank } from "lucide-react";
import "../style/kidsTaskPage.css";
import { Link } from "react-router-dom";
import axios from "axios";

export default function KidsTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [proofDate, setProofDate] = useState("");
  const [proofFile, setProofFile] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          setTasks([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCompleteClick = (task) => {
    setActiveTask(task);
  };

  const handleProofSubmit = async () => {
    try {
      if (!activeTask) return;

      await axios.patch(`http://localhost:5000/tasks/${activeTask.id}/complete`);

      await axios.post("http://localhost:5000/logs", {
        text: `You earned $${activeTask.amount} from "${activeTask.title}"`,
        category: "earning"
      });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeTask.id ? { ...t, completed: true } : t
        )
      );

      setActiveTask(null);
      setProofDate("");
      setProofFile(null);

    } catch (err) {
      console.error("Failed to complete task or log it:", err);
      alert("Failed to complete task. Make sure the task ID exists in the DB.");
    }
  };

  // Map task titles to emojis
  // Map task titles to emojis
const taskEmojiMap = {
  "Clean dishes": "🍽️",
  "Change bedding": "🛏️",
  "Vacuum room": "🧹",
  "Take out trash": "🗑️",
  "Water plants": "🌱",
  "Feed pets": "🐶",
  "Laundry": "🧺",
  "Organize toys": "🧸",
  "Feed the dog": "🐕",
  "Water the plants": "💧🌿",
  "Sweep the floor": "🧹",
  "Put away toys": "🧸",
};


  return (
    <div className="tasks-page">
      <div className="tasks-card">
        {/* Header */}
        <div className="tasks-header">
          <div className="flex-center-align">
            <Link to="/kids-dashboard" className="kids-title">
              My TeddyBank Dashboard 🐷
            </Link>
          </div>
          <h2>📝 TASKS</h2>
          <div className="pig-icon">
            <PiggyBank size={28} />
          </div>
        </div>

        {/* Total box */}
        <div className="total-box">
          💰 TOTAL $
          {tasks
            .filter((t) => t.completed)
            .reduce((sum, t) => sum + t.amount, 0)}
        </div>

        {/* Tasks grid */}
        <div className="task-notes">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-note ${task.completed ? "completed" : ""}`}
            >
              <div className="thumbtack" />
              <h4>
                {taskEmojiMap[task.title] || "✅"} {task.title}
              </h4>
              {!task.completed && <span>💵 ${task.amount}</span>}
              {task.completed && (
                <span>
                  🎉 Payment confirmation of ${task.amount} pending!
                </span>
              )}
              {!task.completed && (
                <button
                  className="complete-btn"
                  onClick={() => handleCompleteClick(task)}
                >
                  ✅ Complete Task
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Proof popup */}
        {activeTask && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>📌 Complete "{activeTask.title}"</h3>
              <div className="proof-row">
                <label>📅 Date:</label>
                <input
                  type="date"
                  value={proofDate}
                  onChange={(e) => setProofDate(e.target.value)}
                />
              </div>
              <div className="proof-row">
                <label>📎 Upload Proof:</label>
                <input
                  type="file"
                  onChange={(e) => setProofFile(e.target.files[0])}
                />
              </div>
              <div className="popup-buttons">
                <button className="upload-btn" onClick={handleProofSubmit}>
                  ✅ Submit
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setActiveTask(null)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
