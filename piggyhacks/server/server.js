require('dotenv').config();
console.log("Users URI:", process.env.MONGO_USERS);
console.log("Stocks URI:", process.env.MONGO_STOCKS);

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Parse JSON body

// -----------------------------
// Connect to multiple databases
// -----------------------------
const usersConn = mongoose.createConnection(process.env.MONGO_USERS);

const stocksConn = mongoose.createConnection(process.env.MONGO_STOCKS);

// -----------------------------
// Create models on each connection
// -----------------------------
const kids = usersConn.model("kids_auth", new mongoose.Schema({}, { strict: false }));
const parent = usersConn.model("parent_auth", new mongoose.Schema({}, { strict: false }));
const historicaltasks = usersConn.model("historical_tasks", new mongoose.Schema({}, { strict: false }));
const family = usersConn.model("family_ids", new mongoose.Schema({}, { strict: false }));
const stocksperuser = usersConn.model("stocks_per_user", new mongoose.Schema({}, { strict: false }));
const tasks = usersConn.model("tasks", new mongoose.Schema({}, { strict: false }));

const apple = stocksConn.model("apple", new mongoose.Schema({}, { strict: false }));
const banana = stocksConn.model("banana", new mongoose.Schema({}, { strict: false }));
const orange = stocksConn.model("orange", new mongoose.Schema({}, { strict: false }));
const strawberry = stocksConn.model("strawberry", new mongoose.Schema({}, { strict: false }));


// -----------------------------
// Basic routes
// -----------------------------
// -----------------------------
// Users-related routes
// -----------------------------
app.get("/kids", async (req, res) => {
  try {
    const allKids = await kids.find();
    res.json(allKids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/parents", async (req, res) => {
  try {
    const allParents = await parent.find();
    res.json(allParents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/historicaltasks", async (req, res) => {
  try {
    const allHistoricalTasks = await historicaltasks.find();
    res.json(allHistoricalTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/families", async (req, res) => {
  try {
    const allFamilies = await family.find();
    res.json(allFamilies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocksperuser", async (req, res) => {
  try {
    const allStocks = await stocksperuser.find();
    res.json(allStocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await tasks.find();
    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Stocks-related routes
// -----------------------------
app.get("/stocks/apple", async (req, res) => {
  try {
    const data = await apple.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocks/banana", async (req, res) => {
  try {
    const data = await banana.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocks/orange", async (req, res) => {
  try {
    const data = await orange.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocks/strawberry", async (req, res) => {
  try {
    const data = await strawberry.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
