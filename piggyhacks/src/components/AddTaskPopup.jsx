import React from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function AddTaskPopup({ newTask, setNewTask, onTaskAdded }) {
  if (!newTask) return null;

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/tasks/697e4715ca16bfae68aef315/add",
        {
          title: newTask.title,
          amount: Number(newTask.amount),
          completed: false,
          childid: null
        }
      );

      // let parent refresh tasks
      if (onTaskAdded) onTaskAdded();

      setNewTask(null);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Add Task</h3>
          <X
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setNewTask(null)}
          />
        </div>

        <div className="proof-row">
          <label>Task Description</label>
          <input
            type="text"
            placeholder="e.g. Clean your room"
            value={newTask.title || ""}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />
        </div>

        <div className="proof-row">
          <label>Reward ($)</label>
          <input
            type="number"
            placeholder="5"
            value={newTask.amount || ""}
            onChange={(e) =>
              setNewTask({ ...newTask, amount: e.target.value })
            }
          />
        </div>

        <div className="popup-buttons">
          <button
            className="cancel-btn"
            onClick={() => setNewTask(null)}
          >
            Cancel
          </button>
          <button
            className="upload-btn"
            onClick={handleSubmit}
            disabled={!newTask.title || !newTask.amount}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
