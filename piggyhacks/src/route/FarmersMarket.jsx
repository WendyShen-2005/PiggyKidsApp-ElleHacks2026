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

const FarmersMarket = () => {
  const navigate = useNavigate();

  const handleFruitClick = (fruitName, fruitData) => {
    navigate("/fruit-detail", { state: { fruitName, fruitData } });
  };

  const [balance, setBalance] = useState(110.5);

  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("all"); // week/month/year/all

  const [apple, setApple] = useState([]);
  const [banana, setBanana] = useState([]);
  const [orange, setOrange] = useState([]);
  const [strawberry, setStrawberry] = useState([]);

  useEffect(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);

    const generateData = () => {
      let portfolio = [];
      let apples = [];
      let bananas = [];
      let oranges = [];
      let strawberries = [];

      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const isoDate = date.toISOString().split("T")[0];

        const dataPoint = {
          date: isoDate,
          data: balance + i * Math.random() * 5, // simulate portfolio growth
        };

        portfolio.push(dataPoint);

        apples.push({ date: isoDate, price: 140 + Math.random() * 20 });
        bananas.push({ date: isoDate, price: 50 + Math.random() * 5 });
        oranges.push({ date: isoDate, price: 30 + Math.random() * 5 });
        strawberries.push({ date: isoDate, price: 20 + Math.random() * 5 });
      }

      setPortfolioHistory(portfolio);
      setApple(apples);
      setBanana(bananas);
      setOrange(oranges);
      setStrawberry(strawberries);
    };

    generateData();
  }, [balance]);

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

  const latestPrice = (arr) =>
    arr.length ? arr[arr.length - 1].price.toFixed(2) : "-";

  const percentChange = (arr) => {
    if (arr.length < 2) return 0;
    const prev = arr[arr.length - 2].price;
    const latest = arr[arr.length - 1].price;
    return (((latest - prev) / prev) * 100).toFixed(2);
  };

  const fruits = [
    { name: "Apple Tree", ticker: "AAPL", data: apple },
    { name: "Banana Grove", ticker: "BNNA", data: banana },
    { name: "Orange Orchard", ticker: "ORNG", data: orange },
    { name: "Strawberry Patch", ticker: "STRB", data: strawberry },
  ];

  return (
    <div className="tasks-page">
      <div className="tasks-card">
        <div className="flex-center-align">
          <div className="flex-center-align">
            <Link to="/kids-dashboard" className="kids-title">
              My Piggy Dashboard
            </Link>
          </div>
            {/* <div className="back-btn">  <Link to="/kids-dashboard">⬅️ Dashboard</Link></div> */} 
        </div>
        {/* Available to invest */}
        <div className="available-card piggy-card">
          <p className="available-label">🐷 Available to Invest</p>
          <h3 className="available-amount">${balance.toFixed(2)}</h3>
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
          <div
            className="time-range-buttons"
            style={{ display: "flex", gap: "8px", marginTop: "10px" }}
          >
            {["week", "month", "year", "all"].map((range) => (
              <button
                key={range}
                className={`complete-btn piggy-btn ${timeRange === range ? "active" : ""}`}
                style={{ flex: 1 }}
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
          {fruits.map((fruit) => {
            const change = percentChange(fruit.data);
            return (
              <div key={fruit.name} className="fruit-stock-card">
                <div className="fruit-info">
                  <p className="fruit-name">
                    {fruit.name}{" "}
                    <span className="ticker">({fruit.ticker})</span>
                  </p>
                  <p className="fruit-price">${latestPrice(fruit.data)}</p>
                </div>
                <div className="fruit-actions">
                  <p
                    className={`percent-change ${change >= 0 ? "up" : "down"}`}
                  >
                    {change >= 0 ? "▲" : "▼"} {Math.abs(change)}%
                  </p>
                  <button
                    className="invest-btn piggy-invest-btn"
                    onClick={() => handleFruitClick(fruit.name, fruit.data)}
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
