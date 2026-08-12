var dotenv = require("dotenv");
var path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

var PRODUCTION_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://hire-smart-sigma.vercel.app",
];

// Working CognoDB instance — .com resolves; .cloud does NOT for this instance
var PRODUCTION_COGNODB = {
  URI: "bolt+s://db-c363edce.databases.cognodb.com",
  USERNAME: "cognodb",
  PASSWORD: "393f4c9ec91e577af4880fb139097f40",
};

function getEnv(key, fallback) {
  if (fallback === undefined) fallback = "";
  return process.env[key] || fallback;
}

function normalizeCognodbUri(uri) {
  if (!uri) return "";
  // Render/dashboard often copies .cloud from console — fix to working .com host
  if (uri.indexOf("db-c363edce.databases.cognodb.cloud") !== -1) {
    return PRODUCTION_COGNODB.URI;
  }
  return uri;
}

function resolveCognodbConfig() {
  var onRender = Boolean(process.env.RENDER);
  var uri = normalizeCognodbUri(getEnv("COGNODB_URI"));
  var username = getEnv("COGNODB_USERNAME");
  var password = getEnv("COGNODB_PASSWORD");

  if (!uri && onRender) uri = PRODUCTION_COGNODB.URI;
  if (!username && onRender) username = PRODUCTION_COGNODB.USERNAME;
  if (!password && onRender) password = PRODUCTION_COGNODB.PASSWORD;

  return { uri: uri, username: username, password: password };
}

function parseAllowedOrigins(raw) {
  var fromEnv = (raw || "")
    .split(",")
    .map(function (origin) { return origin.trim(); })
    .filter(Boolean);
  return Array.from(new Set(PRODUCTION_ORIGINS.concat(fromEnv)));
}

var cognodbConfig = resolveCognodbConfig();

var env = {
  COGNODB_URI: cognodbConfig.uri,
  COGNODB_USERNAME: cognodbConfig.username,
  COGNODB_PASSWORD: cognodbConfig.password,
  PORT: parseInt(process.env.PORT || "4000", 10),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  ALLOWED_ORIGINS: parseAllowedOrigins(process.env.CLIENT_URL),
  NODE_ENV: process.env.NODE_ENV || "development",
  SEED_RESET: process.env.SEED_RESET === "true",
  IS_RENDER: Boolean(process.env.RENDER),
};

module.exports = { env };
