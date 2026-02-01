import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../style/MonthlyStatement.css";

export default function ParentMonthlyStatement() {
  const statementRef = useRef();
  const [expenses, setExpenses] = useState([]);
  const [tasks, setTasks] = useState([]);

  const balance = 50;
  const stocks = 20;
  const interest = 5;

  useEffect(() => {
    fetchExpenses();
    fetchHistoricalTasks();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/expenses");
    setExpenses(res.data);
  };

  const fetchHistoricalTasks = async () => {
    const res = await axios.get("http://localhost:5000/historicaltasks");
    setTasks(res.data);
  };

  const exportPDF = async () => {
    const element = statementRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "letter");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("my_monthly_statement.pdf");
  };

  return (
    <div className="statement-page">
      {/* Top */}
      <div className="flex-center-align">
        <Link to="/parent-dashboard" className="kids-title">
          Parent Dashboard
        </Link>
      </div>

      <button className="export-btn" onClick={exportPDF}>
        🐷 Export Statement as PDF
      </button>

      {/* PDF CONTENT */}
      <div ref={statementRef} className="statement-container">
        <h1 className="statement-title">🐷 MY MONTHLY STATEMENT 🐷</h1>
        <h2 className="balance-title">My balance: ${balance}</h2>

        <div className="three-col">
          {/* EXPENSES */}
          <div className="column">
            <h3>💸 EXPENSES</h3>
            {expenses.map((e) => (
              <div key={e._id} className="row">
                <span>{e.category}</span>
                <span>${e.price}</span>
                <span>{new Date(e.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          {/* TASKS */}
          <div className="column">
            <h3>🧹 TASKS</h3>
            {tasks.map((t) => (
              <div key={t.id} className="row">
                <span>{t.desc}</span>
                <span>${t.price}</span>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div className="column">
            <div className="box">
              <h4>📈 MY STOCKS</h4>
              <p>${stocks}</p>
            </div>

            <div className="box">
              <h4>🌱 INTEREST</h4>
              <p>${interest}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
