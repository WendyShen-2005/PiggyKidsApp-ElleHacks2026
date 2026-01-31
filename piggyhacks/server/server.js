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
usersConn.on("connected", () => console.log("✅ Users DB connected"));
usersConn.on("error", err => console.error("❌ Users DB connection error:", err));

const stocksConn = mongoose.createConnection(process.env.MONGO_STOCKS);
stocksConn.on("connected", () => console.log("✅ Stocks DB connected"));
stocksConn.on("error", err => console.error("❌ Stocks DB connection error:", err));

Promise.all([
  new Promise((resolve, reject) => {
    usersConn.once("open", resolve);
    usersConn.once("error", reject);
  }),
  new Promise((resolve, reject) => {
    stocksConn.once("open", resolve);
    stocksConn.once("error", reject);
  })
])
.then(() => {
  console.log("Both DBs connected — starting server");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error("Failed to connect to DBs:", err);
  process.exit(1);
});

// -----------------------------
// Create models on each connection
// -----------------------------
const kids = usersConn.model("KidsAuth", new mongoose.Schema({}, { strict: false }), "kids_auth");
const parent = usersConn.model("ParentAuth", new mongoose.Schema({}, { strict: false }), "parent_auth");
const historicaltasks = usersConn.model("HistoricalTasks", new mongoose.Schema({}, { strict: false }), "historical_tasks");
const family = usersConn.model("FamilyIds", new mongoose.Schema({}, { strict: false }), "family_ids");
const stocksperuser = usersConn.model("StocksPerUser", new mongoose.Schema({}, { strict: false }), "stocks_per_user");
const tasks = usersConn.model("Tasks", new mongoose.Schema({}, { strict: false }), "tasks");

const apple = stocksConn.model("Apple", new mongoose.Schema({}, { strict: false }), "apple");
const banana = stocksConn.model("Banana", new mongoose.Schema({}, { strict: false }), "banana");
const orange = stocksConn.model("Orange", new mongoose.Schema({}, { strict: false }), "orange");
const strawberry = stocksConn.model("Strawberry", new mongoose.Schema({}, { strict: false }), "strawberry");

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
    console.log("Apple data fetched:", data.length, "records");
    console.log(data[0])
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
