import React from "react";
import { PiggyBank, Smile, Frown } from "lucide-react";
import "../style/taskPiggy.css";

export default function TaskPiggy({ tasks }) {
  // Calculate completed percentage
  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status === "completed" || t.status === "confirmed",
  ).length;
  const percentage = total > 0 ? completed / total : 0;

  const isHappy = percentage >= 0.5;

  return (
    <div className="task-piggy">
      <PiggyBank size={80} className="piggy-icon" />
      <div className={`piggy-face ${isHappy ? "happy" : "sad"}`}>
        {isHappy ? <Smile size={32} /> : <Frown size={32} />}
      </div>
    </div>
  );
}
