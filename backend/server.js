const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

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

// Mock Users Database
const users = [
  { email: "admin@dhl.my", password: "admin123", role: "admin" },
  { email: "user@dhl.my", password: "user123", role: "user" }
];

// AUTH ENDPOINTS
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = Buffer.from(`${email}:${user.role}:${Date.now()}`).toString('base64');
    res.json({ token, user: { email: user.email, role: user.role } });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [email, role] = decoded.split(':');
    res.json({ user: { email, role } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// GET KB
app.get("/kb", (req, res) => {
  res.json(knowledgeBase);
});
app.get("/api/articles", (req, res) => {
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
app.get("/api/articles/:id", (req, res) => {
  const item = knowledgeBase.find(k => k.id == req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Article not found" });
  }
  res.json(item);
});

// ADD KB draft
const createArticle = (req) => ({
  id: Date.now(),
  title: req.body.title,
  summary: req.body.summary,
  steps: req.body.steps,
  tags: req.body.tags,
  status: req.body.status || "draft",
  createdAt: req.body.createdAt || new Date().toISOString(),
});

app.post("/kb", (req, res) => {
  const item = createArticle(req);
  knowledgeBase.push(item);
  writeDb(knowledgeBase);
  res.status(201).json(item);
});
app.post("/api/articles", (req, res) => {
  const item = createArticle(req);
  knowledgeBase.push(item);
  writeDb(knowledgeBase);
  res.status(201).json(item);
});

// UPDATE status (Draft → Reviewed → Published)
const updateArticle = (req) => ({
  ...req.body,
  status: req.body.status,
});

app.put("/kb/:id", (req, res) => {
  const item = knowledgeBase.find(k => k.id == req.params.id);
  if (item) {
    Object.assign(item, updateArticle(req));
    writeDb(knowledgeBase);
    return res.json(item);
  }
  res.status(404).json({ message: "Article not found" });
});
app.put("/api/articles/:id", (req, res) => {
  const item = knowledgeBase.find(k => k.id == req.params.id);
  if (item) {
    Object.assign(item, updateArticle(req));
    writeDb(knowledgeBase);
    return res.json(item);
  }
  res.status(404).json({ message: "Article not found" });
});

// DELETE ALL
app.delete("/kb", (req, res) => {
  knowledgeBase = [];
  writeDb(knowledgeBase);
  res.json({ message: "All articles deleted" });
});
app.delete("/api/articles", (req, res) => {
  knowledgeBase = [];
  writeDb(knowledgeBase);
  res.json({ message: "All articles deleted" });
});

// DELETE
app.delete("/kb/:id", (req, res) => {
  knowledgeBase = knowledgeBase.filter(k => k.id != req.params.id);
  writeDb(knowledgeBase);
  res.json({ message: "Deleted" });
});
app.delete("/api/articles/:id", (req, res) => {
  knowledgeBase = knowledgeBase.filter(k => k.id != req.params.id);
  writeDb(knowledgeBase);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`KB System running on http://localhost:${PORT}`);
});