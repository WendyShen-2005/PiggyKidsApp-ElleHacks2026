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


  // Grab passed state from navigation
  const location = useLocation();
  const { fruitName, fruitData } = location.state;

  const actualFruitName = fruitName.toLowerCase().includes("apple")
    ? "apple"
    : fruitName.toLowerCase().includes("banana")
    ? "banana"
    : fruitName.toLowerCase().includes("orange")
    ? "orange"
    : fruitName.toLowerCase().includes("strawberry")
    ? "strawberry"
    : null;


   useEffect(() => {
    axios.get(`http://localhost:5000/stocks/${actualFruitName}`)
      .then(res => setFruitsData(res.data))
      .catch(err => console.error(err));
  }, []);

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
        <div className="tasks-header piggy-header">
          <div className="flex-center-align">
            <Link to="/stock-farm" className="kids-title">
              🐷 My Stock Farm
            </Link>
          </div>

          <div className="fruit-hero">
            <span className="fruit-emoji">{fruitName === "apple" ? "🍎" : fruitName === "banana" ? "🍌" : fruitName === "orange" ? "🍊" : fruitName === "strawberry" ? "🍓" : ""}</span>
            <h2 className="fruit-title">{fruitName}</h2>
          </div>
        </div>


        {/* Line Chart */}
        <div className="piggy-card chart-card">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={getFilteredData()}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ff69b4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>


        {/* Time Range Buttons */}
        <div className="time-range-buttons">
          {["week", "month", "year", "all"].map((range) => (
            <button
              key={range}
              className={`complete-btn piggy-btn ${
                timeRange === range ? "active" : ""
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range === "week" && "📅 Week"}
              {range === "month" && "🗓️ Month"}
              {range === "year" && "📆 Year"}
              {range === "all" && "🌈 All"}
            </button>
          ))}
        </div>

        {/* Current price */}
        <div className="piggy-card price-card">
          🪙 Current {fruitName} Price
          <h3>${mostRecentPrice}</h3>
        </div>


        {/* Info box */}
        <div className="piggy-card info-card">
          <h4>🌱 {fruitName} Farm Stats</h4>

          <p>🍎 Total {fruitName}: <strong>{totalFruits}</strong></p>

          <p>💰 Total Value: <strong>${totalValue}</strong></p>

          <p
            className={`profit ${
              profitLoss >= 0 ? "profit-up" : "profit-down"
            }`}
          >
            📈 Profit / Loss: {profitLoss >= 0 ? "+" : "-"}$
            {Math.abs(profitLoss)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default FruitDetail;