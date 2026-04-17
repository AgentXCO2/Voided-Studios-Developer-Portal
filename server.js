const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

// Load data
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all devs
app.get("/api/devs", (req, res) => {
  res.json(loadData());
});

// ADD dev (admin only)
app.post("/api/devs", (req, res) => {
  const { password, name, role, description } = req.body;

  if (password !== "VoidedStudios.Agent") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!name || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const data = loadData();

  const newDev = {
    id: Date.now(),
    name,
    role,
    description: description || "No description"
  };

  data.push(newDev);
  saveData(data);

  res.json({ success: true, dev: newDev });
});

// DELETE dev (admin only)
app.delete("/api/devs/:id", (req, res) => {
  const { password } = req.body;

  if (password !== "VoidedStudios.Agent") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let data = loadData();
  data = data.filter(d => d.id != req.params.id);

  saveData(data);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Void Studios running on http://localhost:${PORT}`);
});
