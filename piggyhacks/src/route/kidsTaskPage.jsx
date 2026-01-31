import React, { useState } from "react";
import { PiggyBank, Upload, FileText } from "lucide-react";
import "../style/kidsTaskPage.css";
import { Link } from "react-router-dom";


export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Clean your room", amount: 5, completed: false },
    { id: 2, title: "Feed the dog", amount: 3, completed: true },
    { id: 3, title: "Do homework", amount: 4, completed: false },
  ]);

  const [activeTask, setActiveTask] = useState(null);
  const [proofDate, setProofDate] = useState("");
  const [proofFile, setProofFile] = useState(null);

  const handleCompleteClick = (task) => {
    setActiveTask(task);
  };

  const handleProofSubmit = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeTask.id ? { ...t, completed: true } : t
      )
    );
    setActiveTask(null);
    setProofDate("");
    setProofFile(null);
  };

  return (
    <div className="tasks-page">
      <div className="tasks-card">
        {/* Header */}
        <div className="tasks-header">
            <div className="flex-left-align">
            <div className="back-btn">  <Link to="/kids-dashboard">⬅️ Dashboard</Link></div>
            </div>
          <h2>TASKS</h2>
          <div className="pig-icon">
            <PiggyBank size={28} />
          </div>
        </div>

        {/* Total box */}
        <div className="total-box">
          TOTAL $
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
              <h4>{task.title}</h4>
              {!task.completed && <span>${task.amount}</span>}
              {task.completed && <span>Payment confirmation of ${task.amount} pending! Congratulations!</span>}
              {!task.completed && (
                <button
                  className="complete-btn"
                  onClick={() => handleCompleteClick(task)}
                >
                  Complete Task
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Proof popup */}
        {activeTask && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Complete "{activeTask.title}"</h3>
              <div className="proof-row">
                <label>Date:</label>
                <input
                  type="date"
                  value={proofDate}
                  onChange={(e) => setProofDate(e.target.value)}
                />
              </div>
              <div className="proof-row">
                <label>Upload Proof:</label>
                <input
                  type="file"
                  onChange={(e) => setProofFile(e.target.files[0])}
                />
              </div>
              <div className="popup-buttons">
                <button className="upload-btn" onClick={handleProofSubmit}>
                  Submit
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setActiveTask(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Statement */}
        <button className="statement-btn">
          <FileText size={18} />
          Monthly Statement
        </button>
      </div>
    </div>
  );
}
