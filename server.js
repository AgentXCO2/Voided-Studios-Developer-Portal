const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

// ensure file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET devs
app.get("/api/devs", (req, res) => {
  res.json(loadData());
});

// ADD dev
app.post("/api/devs", (req, res) => {
  try {
    const { password, name, role, description } = req.body;

    if (password !== "VoidedStudios.Agent") {
      return res.status(401).json({ error: "Wrong password" });
    }

    if (!name || !role) {
      return res.status(400).json({ error: "Missing name or role" });
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

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Voided Studios running: http://localhost:${PORT}`);
});
