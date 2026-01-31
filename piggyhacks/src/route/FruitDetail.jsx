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

import { useEffect } from "react";
import axios from "axios";

const FruitDetail = () => {

  const [fruitsData, setFruitsData] = useState([]);

   useEffect(() => {
    axios.get(`http://localhost:5000/stocks/${fruitName}`)
      .then(res => setFruitsData(res.data))
      .catch(err => console.error(err));
  }, []);

  // Grab passed state from navigation
  const location = useLocation();
  const { fruitName, fruitData } = location.state;

  const [timeRange, setTimeRange] = useState("all");

  const getFilteredData = () => {
    let days = fruitsData.length;

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
        days = fruitsData.length;
    }

    return fruitsData.slice(-days);
  };

const mostRecentPrice =
  fruitsData.length > 0
    ? fruitsData[fruitsData.length - 1].price.toFixed(2)
    : "-"; // fallback if no data


  // Assume total # fruits is the number of days (for simplicity)
  const totalFruits = fruitsData.length;
  const totalValue = fruitsData.length > 0
  ? fruitsData.reduce((acc, cur) => acc + cur.price, 0).toFixed(2)
  : 0;

const profitLoss = fruitsData.length > 0
  ? (fruitsData[fruitsData.length - 1].price * fruitsData.length - totalValue).toFixed(2)
  : 0;

  return (
    <div className="tasks-page">
      <div className="tasks-card">
        {/* Header */}
        <div className="tasks-header">
          <div className="flex-center-align">
            <Link to="/stock-farm" className="kids-title">
              My Stock Farm
            </Link>
            {/* <div className="back-btn">  <Link to="/stock-farm">⬅️ Farm Market</Link></div> */}
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