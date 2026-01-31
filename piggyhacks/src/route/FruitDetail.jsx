import React, { useState } from "react";
import "../style/FarmersMarket.css"; // Reuse styles
import "../style/kidsTaskPage.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const FruitDetail = () => {
  // Grab passed state from navigation
  const location = useLocation();
  const { fruitName, fruitData } = location.state;

  const [timeRange, setTimeRange] = useState("all");

  const getFilteredData = () => {
    let days = fruitData.length;

    switch (timeRange) {
      case "week":
        days = 7;
        break;
      case "month":
        days = 30;
        break;
      case "year":
        days = 365;
        break;
      default:
        days = fruitData.length;
    }

    return fruitData.slice(-days);
  };

  const mostRecentPrice =
    fruitData.length > 0
      ? fruitData[fruitData.length - 1].price.toFixed(2)
      : "-";

  // Assume total # fruits is the number of days (for simplicity)
  const totalFruits = fruitData.length;
  const totalValue = (fruitData.reduce((acc, cur) => acc + cur.price, 0)).toFixed(2);
  const profitLoss = (fruitData[fruitData.length - 1].price * totalFruits - totalValue).toFixed(2);

  return (
    <div className="tasks-page">
      <div className="tasks-card">
        {/* Header */}
        <div className="tasks-header">
            <div className="flex-left-align">
            <div className="back-btn">  <Link to="/stock-farm">⬅️ Farm Market</Link></div>
            </div>
          <div className="pig-icon">🍎</div>
          <h2>{fruitName}</h2>
        </div>

        {/* Line Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={getFilteredData()}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Time Range Buttons */}
        <div className="time-range-buttons">
          {["week", "month", "year", "all"].map((range) => (
            <button
              key={range}
              className={`complete-btn ${timeRange === range ? "active" : ""}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Current price */}
        <div className="total-box">
          Current {fruitName} price: ${mostRecentPrice}
        </div>

        {/* Info box */}
        <div className="task-note" style={{ transform: "rotate(0deg)" }}>
          <h4>{fruitName} Info</h4>
          <span>Total #{fruitName}: {totalFruits}</span>
          <span>Total value of {fruitName}: ${totalValue}</span>
          <span>
            Profit/Loss from {fruitName}: {profitLoss >= 0 ? "+" : "-"}$
            {Math.abs(profitLoss)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FruitDetail;