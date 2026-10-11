const express = require("express");

const PYTHON_URL = process.env.PYTHON_SERVICE_URL || "http://python-service:5000";

const app = express();

app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) =>
  res.json({ service: "node-service", message: "Hello from Node.js!" })
);

// Calls the Python service over the cluster network
app.get("/api/greet", async (_req, res) => {
  try {
    const r = await fetch(`${PYTHON_URL}/greet`);
    const data = await r.json();
    res.json({ from: "node-service", python_says: data });
  } catch (err) {
    res.status(502).json({ error: "python-service unreachable", detail: err.message });
  }
});

module.exports = app;
