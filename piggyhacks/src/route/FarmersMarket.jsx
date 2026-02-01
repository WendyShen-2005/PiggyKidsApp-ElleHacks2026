import React, { useState, useEffect } from "react";
import "../style/FarmersMarket.css";
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const FarmersMarket = () => {
  const navigate = useNavigate();

  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("all");

  const [fruitData, setFruitData] = useState({
    apple: [],
    banana: [],
    orange: [],
    strawberry: [],
  });

  const [latestPrices, setLatestPrices] = useState({
    apple: 0,
    banana: 0,
    orange: 0,
    strawberry: 0,
  });

  // Fetch latest stock prices
  const fetchFruitPrices = async () => {
    try {
      const fruits = ["apple", "banana", "orange", "strawberry"];
      const prices = {};

      for (let fruit of fruits) {
        const res = await axios.get(`http://localhost:5000/stocks/${fruit}`);
        prices[fruit] = res.data.length
          ? res.data[res.data.length - 1].price
          : 0;
      }

      setLatestPrices(prices);
    } catch (err) {
      console.error("Error fetching fruit prices:", err);
    }
  };

  // Fetch user portfolio per fruit
  const fetchPortfolioPerUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/stocksperuser");
      const data = res.data;

      // Save each fruit's data
      setFruitData(data);

      // Compute daily total balance
      const dates = data.apple.map((d) => d.date);
      const dailyTotal = dates.map((date, i) => {
        let sum = 0;
        for (let fruit of ["apple", "banana", "orange", "strawberry"]) {
          if (data[fruit][i]) sum += data[fruit][i].bal;
        }
        return { date, data: sum };
      });

      setPortfolioHistory(dailyTotal);
    } catch (err) {
      console.error("Error fetching user portfolio:", err);
    }
  };

  useEffect(() => {
    fetchPortfolioPerUser();
    fetchFruitPrices();
  const fruits = ["apple", "banana", "orange", "strawberry"];
  
  fruits.forEach(async (fruit) => {
    try {
      const res = await axios.get(`http://localhost:5000/stocks/${fruit}`);
      setFruitPrices(prev => ({ ...prev, [fruit]: res.data }));
    } catch (err) {
      console.error(`Failed to fetch ${fruit} prices`, err);
    }
  });
}, []);


  const getFilteredPortfolio = () => {
    let days = portfolioHistory.length;
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
        days = portfolioHistory.length;
    }
    return portfolioHistory.slice(-days);
  };

const latestPrice = (fruit) => {
  const arr = fruitPrices[fruit];
  return arr.length ? arr[arr.length - 1].price.toFixed(2) : "-";
};

  const [fruitPrices, setFruitPrices] = useState({
  apple: [],
  banana: [],
  orange: [],
  strawberry: [],
});


 const percentChange = (fruit) => {
  const arr = fruitPrices[fruit];
  if (!arr || arr.length < 2) return 0;

  const prevPrice = arr[arr.length - 2]?.price;
  const latestPrice = arr[arr.length - 1]?.price;

  if (!prevPrice) return 0; // avoid division by zero
  return (((latestPrice - prevPrice) / prevPrice) * 100).toFixed(2);
};



  const handleFruitClick = (fruitName, data) => {
    navigate("/fruit-detail", { state: { fruitName, fruitData: data } });
  };

const fruits = [
  { name: "Apple Tree", key: "apple" },
  { name: "Banana Grove", key: "banana" },
  { name: "Orange Orchard", key: "orange" },
  { name: "Strawberry Patch", key: "strawberry" },
];


  return (
    <div className="tasks-page">
      <div className="tasks-card">
        <div className="flex-center-align">
          <Link to="/kids-dashboard" className="kids-title">
            My TeddyBank Dashboard
          </Link>
        </div>

        {/* Portfolio balance chart */}
        <div className="tasks-chart" style={{ marginBottom: "20px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={getFilteredPortfolio()}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="data"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Time range buttons */}
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
        </div>

        {/* Fruits / Stocks list */}
        <div className="fruit-stock-list">
          <h3 className="market-title">🌽 Farmer’s Market Stocks</h3>
          {fruits.map(fruit => {
  const change = percentChange(fruit.key);
  return (
    <div key={fruit.name} className="fruit-stock-card">
      <div className="fruit-info">
        <p className="fruit-name">{fruit.name}</p>
        <p className="fruit-price">${latestPrice(fruit.key)}</p>
      </div>
      <div className="fruit-actions">
        <p className={`percent-change ${change >= 0 ? "up" : "down"}`}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change)}%
        </p>
        <button
          className="invest-btn piggy-invest-btn"
          onClick={() => handleFruitClick(fruit.name, fruitPrices[fruit.key])}
        >
          🪙 INVEST
        </button>
      </div>
    </div>
  );
})}

        </div>
      </div>
    </div>
  );
};

export default FarmersMarket;
