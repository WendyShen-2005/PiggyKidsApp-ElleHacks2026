require('dotenv').config();
console.log("Users URI:", process.env.MONGO_USERS);
console.log("Stocks URI:", process.env.MONGO_STOCKS);

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Parse JSON body

const cors = require("cors");
app.use(cors());

// -----------------------------
// Connect to multiple databases
// -----------------------------
const usersConn = mongoose.createConnection(process.env.MONGO_USERS);
usersConn.on("connected", () => console.log("✅ Users DB connected"));
usersConn.on("error", err => console.error("❌ Users DB connection error:", err));

const stocksConn = mongoose.createConnection(process.env.MONGO_STOCKS);
stocksConn.on("connected", () => console.log("✅ Stocks DB connected"));
stocksConn.on("error", err => console.error("❌ Stocks DB connection error:", err));

const logsConn = mongoose.createConnection(process.env.MONGO_LOGS);
logsConn.on("connected", () => console.log("✅ Logs DB connected"));
logsConn.on("error", err => console.error("❌ Logs DB connection error:", err));

Promise.all([
  new Promise((resolve, reject) => {
    usersConn.once("open", resolve);
    usersConn.once("error", reject);
  }),
  new Promise((resolve, reject) => {
    stocksConn.once("open", resolve);
    stocksConn.once("error", reject);
  }),
  new Promise((resolve, reject) => {
    logsConn.once("open", resolve);
    logsConn.once("error", reject);
  })
])
.then(() => {
  console.log("All DBs connected — starting server");
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
const expenses = usersConn.model("Expenses", new mongoose.Schema({}, { strict: false }), "expenses");

const apple = stocksConn.model("Apple", new mongoose.Schema({}, { strict: false }), "apple");
const banana = stocksConn.model("Banana", new mongoose.Schema({}, { strict: false }), "banana");
const orange = stocksConn.model("Orange", new mongoose.Schema({}, { strict: false }), "orange");
const strawberry = stocksConn.model("Strawberry", new mongoose.Schema({}, { strict: false }), "strawberry");

// -----------------------------
// Basic routes
// -----------------------------

const Log = logsConn.model("Log", new mongoose.Schema({}, { strict: false }),  "userLog");

// -----------------------------
// Logs API
// -----------------------------

// GET all logs
app.get("/logs", async (req, res) => {
  try {
    const allLogs = await Log.find().sort({ createdAt: -1 });
    res.json(allLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new log
app.post("/logs", async (req, res) => {
  try {
    const { text, category } = req.body;

    if (!text || !category) {
      return res.status(400).json({ error: "text and category are required" });
    }

    const newLog = new Log({ text, category });
    await newLog.save();

    res.json({ message: "Log created successfully", log: newLog });
  } catch (err) {
    console.error("Failed to create log:", err);
    res.status(500).json({ error: err.message });
  }
});


// -----------------------------
// Users-related routes
// -----------------------------
app.get("/kids", async (req, res) => {
  try {
    const allKids = await kids.find();
    res.json(allKids[0].kids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/parents", async (req, res) => {
  try {
    const allParents = await parent.find();
    res.json(allParents[0].parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/historicaltasks", async (req, res) => {
  try {
    const allHistoricalTasks = await historicaltasks.find();
    res.json(allHistoricalTasks[0].tasks_lists[0].tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/families", async (req, res) => {
  try {
    const allFamilies = await family.find();
    res.json(allFamilies[0].families);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocksperuser", async (req, res) => {
  try {
    const allStocks = await stocksperuser.find();
    res.json(allStocks[0].stocks[0].balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const allTasks = await tasks.find();
    res.json(allTasks[0].tasks_lists);
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
    // console.log("Apple data fetched:", data.length, "records");
    // console.log(data[0])
    // console.log(data[0].price)
    res.json(data[0].price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocks/banana", async (req, res) => {
  try {
    const data = await banana.find();
    res.json(data[0].price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocks/orange", async (req, res) => {
  try {
    const data = await orange.find();
    res.json(data[0].price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/stocks/strawberry", async (req, res) => {
  try {
    const data = await strawberry.find();
    res.json(data[0].price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET all expenses
app.get("/expenses", async (req, res) => {
  try {
    const allExpenses = await expenses.find({});
    console.log(allExpenses)
    res.status(200).json(allExpenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

app.post("/tasks/:docId/add", async (req, res) => {
  try {
    const { docId } = req.params;
    const newTask = req.body;

    console.log("Adding task to docId:", docId);
    console.log("New task data:", newTask);

    // Fetch the document to find the next ID
    const doc = await tasks.findById(new mongoose.Types.ObjectId(docId));
    console.log("Found document:", doc);

    let nextId = 0;
    
    if (doc && doc.tasks_lists && doc.tasks_lists.length > 0) {
      // Find the max ID and increment by 1
      const ids = doc.tasks_lists.map(t => t.id || 0);
      console.log("Existing IDs:", ids);
      const maxId = Math.max(...ids);
      console.log("Max ID:", maxId);
      nextId = maxId + 1;
    }

    console.log("Next ID to assign:", nextId);

    // Add the ID to the new task
    const taskWithId = { ...newTask, id: nextId };
    console.log("Task with ID:", taskWithId);

    const result = await tasks.updateOne(
      { _id: new mongoose.Types.ObjectId(docId) },
      {
        $push: {
          tasks_lists: taskWithId
        }
      }
    );

    console.log("Update result:", result);

    res.json({
      message: "Task added successfully",
      result,
      task: taskWithId
    });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /tasks/:taskId/complete
app.patch("/tasks/:taskId/complete", async (req, res) => {
  const taskId = Number(req.params.taskId); // Convert to number
  try {
    // Find the document that contains the task
    const result = await tasks.updateOne(
      { "tasks_lists.id": taskId }, // find the task by id in the array
      { $set: { "tasks_lists.$.completed": true } } // $ updates the matching array element
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: `Task ${taskId} marked as completed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/historicaltasks/:docId/add", async (req, res) => {
  try {
    const { docId } = req.params;
    const taskData = req.body;

    console.log("Adding historical task to docId:", docId);
    console.log("Incoming task data:", taskData);

    // Validate required fields
    if (!taskData || !taskData.price || !taskData.desc || !taskData.childid) {
      return res.status(400).json({ error: "price, desc, and childid are required" });
    }

    // Fetch document to determine next ID
    const doc = await historicaltasks.findById(docId);
    if (!doc) return res.status(404).json({ error: "Historical tasks document not found" });

    // Ensure tasks_lists[0].tasks exists
    if (!doc.tasks_lists || doc.tasks_lists.length === 0) {
      doc.tasks_lists = [{ id: 1, tasks: [] }];
    }
    if (!doc.tasks_lists[0].tasks) {
      doc.tasks_lists[0].tasks = [];
    }

    // Compute next ID
    const nextId =
      doc.tasks_lists[0].tasks.length > 0
        ? Math.max(...doc.tasks_lists[0].tasks.map(t => t.id || 0)) + 1
        : 1;

    const taskWithId = { ...taskData, id: nextId };

    // Push using updateOne (like the tasks API)
    const result = await historicaltasks.updateOne(
      { _id: new mongoose.Types.ObjectId(docId) },
      { $push: { "tasks_lists.0.tasks": taskWithId } } // push to tasks array in tasks_lists[0]
    );

    console.log("Update result:", result);

    res.json({ message: "Historical task added successfully", result, task: taskWithId });
  } catch (err) {
    console.error("Error adding historical task:", err);
    res.status(500).json({ error: err.message });
  }
});






// -----------------------------
// Delete a task by ID
// -----------------------------
app.delete("/tasks/:docId/:taskId/delete", async (req, res) => {
  try {
    const { docId, taskId } = req.params;
    const result = await tasks.updateOne(
      { _id: new mongoose.Types.ObjectId(docId) },
      { $pull: { tasks_lists: { id: Number(taskId) } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: `Task with id ${taskId} not found.` });
    }

    res.json({ message: `Task ${taskId} deleted successfully.` });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/expenses", async (req, res) => {
  try {
    const { category, price, date } = req.body;

    // Basic validation
    if (!category || price == null) {
      return res.status(400).json({
        message: "category and price are required",
      });
    }

    const newExpense = await expenses.create({
      category,
      price: Number(price),
      date: date || new Date().toLocaleDateString(),
    });

    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Failed to add expense:", err);
    res.status(500).json({ message: "Failed to add expense" });
  }
});