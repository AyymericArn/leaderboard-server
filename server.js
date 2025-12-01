const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const fs = require("fs");

const app = express();
const PORT = 3001;

// ========= CONFIG TOKEN =========
const API_TOKEN = "DEV_2025_SECRET";

const TOKENS = JSON.parse(fs.readFileSync("./tokens.json"));

function checkToken(req, res, next) {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    const valid = TOKENS.find(t => t.token === token);

    if (!valid) {
        return res.status(401).json({ error: "Invalid token" });
    }

    req.group = valid.name;
    next();
}

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 min
    max: 30, // 30 requêtes max par minute par token
    message: { error: "Too many requests" }
});

app.use(limiter);

// ========= MIDDLEWARE =========
app.use(cors());
app.use(express.json());

// Auth middleware
function checkToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token || token !== `Bearer ${API_TOKEN}`) {
        return res.status(401).json({ error: "Invalid or missing token" });
    }

    next();
}

// ========= DATABASE =========
const db = new sqlite3.Database("./leaderboard.db", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database.");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    game TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ALTER TABLE scores ADD COLUMN group_name TEXT;
`);

// ========= ROUTES =========

// Test route
app.get("/", (req, res) => {
    res.send("Leaderboard API is running...");
});

// Add score
app.post("/score", checkToken, (req, res) => {
    const { username, score, game } = req.body;

    if (!username || score === undefined || !game) {
        return res.status(400).json({ error: "Missing fields" });
    }

    if (
        typeof username !== "string" ||
        username.length > 30 ||
        typeof score !== "number" ||
        !["quiz", "2048"].includes(game)
    ) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const query = `
    INSERT INTO scores (username, score, game, group_name)
    VALUES (?, ?, ?, ?)
  `;

    db.run(query, [username, score, game, req.group], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Score saved",
            id: this.lastID,
        });
    });
});

// Get leaderboard
app.get("/leaderboard/:game", checkToken, (req, res) => {
    const { game } = req.params;

    const query = `
    SELECT username, score, created_at
    FROM scores
    WHERE game = ? AND group_name = ?
    ORDER BY score DESC
    LIMIT 10
  `;

    db.all(query, [game, req.group], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

app.get("/status", (req, res) => {
  res.json({ status: "Leaderboard API online" });
});

// ========= START =========
app.listen(PORT, () => {
    console.log(`Leaderboard server running on http://localhost:${PORT}`);
});
