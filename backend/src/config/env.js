var import_dotenv = require("dotenv");
var import_path = require("path");

import_dotenv.config({ path: import_path.resolve(__dirname, "../../../.env") });
import_dotenv.config({ path: import_path.resolve(__dirname, "../../.env") });
import_dotenv.config({ path: import_path.resolve(process.cwd(), ".env") });
import_dotenv.config({ path: import_path.resolve(process.cwd(), "../.env") });

function getEnv(key, fallback) {
  if (fallback === undefined) fallback = "";
  return process.env[key] || fallback;
}

/** Always allow local dev + deployed Vercel frontend, plus anything in CLIENT_URL. */
var PRODUCTION_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://hire-smart-sigma.vercel.app",
];

function parseAllowedOrigins(raw) {
  var fromEnv = (raw || "")
    .split(",")
    .map(function (origin) { return origin.trim(); })
    .filter(Boolean);
  return Array.from(new Set(PRODUCTION_ORIGINS.concat(fromEnv)));
}

var env = {
  COGNODB_URI: getEnv("COGNODB_URI"),
  COGNODB_USERNAME: getEnv("COGNODB_USERNAME", "cognodb"),
  COGNODB_PASSWORD: getEnv("COGNODB_PASSWORD"),
  PORT: parseInt(process.env.PORT || "4000", 10),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  ALLOWED_ORIGINS: parseAllowedOrigins(process.env.CLIENT_URL),
  NODE_ENV: process.env.NODE_ENV || "development",
  SEED_RESET: process.env.SEED_RESET === "true",
};

module.exports = { env };
