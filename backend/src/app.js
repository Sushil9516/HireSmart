var express = require("express");
var cors = require("cors");
var envModule = require("./config/env");
var errorMiddleware = require("./middleware/error.middleware");
var healthRoutes = require("./routes/health.routes");
var candidateRoutes = require("./routes/candidate.routes");
var jobRoutes = require("./routes/job.routes");
var graphRoutes = require("./routes/graph.routes");
var resumeRoutes = require("./routes/resume.routes");

var env = envModule.env;
var app = express();

function useRouter(path, mod) {
  app.use(path, mod.default || mod);
}

// CORS — production Vercel origin is always in ALLOWED_ORIGINS (see env.js)
app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Root + health for Render uptime checks
app.get("/", function (_req, res) {
  res.json({ success: true, service: "HireGraph API", health: "/api/health" });
});

useRouter("/api/health", healthRoutes);
useRouter("/api/candidates", candidateRoutes);
useRouter("/api/jobs", jobRoutes);
useRouter("/api/graph", graphRoutes);
useRouter("/api/resume", resumeRoutes);

app.use(function (_req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

app.use(errorMiddleware.errorMiddleware);

module.exports = app;
