const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

const readDb = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      fs.writeFileSync(DB_FILE, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const writeDb = (items) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2));
};

let knowledgeBase = readDb();

// GET KB
app.get("/kb", (req, res) => {
  res.json(knowledgeBase);
});

// GET single KB article
app.get("/kb/:id", (req, res) => {
  const item = knowledgeBase.find(k => k.id == req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.json(item);
});

// ADD KB draft
app.post("/kb", (req, res) => {
  const item = {
    id: Date.now(),
    title: req.body.title,
    summary: req.body.summary,
    steps: req.body.steps,
    tags: req.body.tags,
    status: req.body.status || "draft",
    createdAt: new Date(),
  };

  knowledgeBase.push(item);
  writeDb(knowledgeBase);
  res.json(item);
});

// UPDATE status (Draft → Reviewed → Published)
app.put("/kb/:id", (req, res) => {
  const item = knowledgeBase.find(k => k.id == req.params.id);
  if (item) {
    item.status = req.body.status;
    writeDb(knowledgeBase);
  }
  res.json(item);
});

// DELETE
app.delete("/kb/:id", (req, res) => {
  knowledgeBase = knowledgeBase.filter(k => k.id != req.params.id);
  writeDb(knowledgeBase);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`KB System running on http://localhost:${PORT}`);
});