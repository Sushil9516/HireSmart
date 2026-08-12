var neo4j = require("neo4j-driver");

var driver = null;
var isConnected = false;

function initDriver(uri, username, password) {
  if (!uri) {
    throw new Error("COGNODB_URI is not configured");
  }
  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username || "cognodb", password || ""),
    {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 30000,
      connectionTimeout: 30000,
      maxTransactionRetryTime: 30000,
    }
  );
}

async function verifyConnectivity() {
  if (!driver) throw new Error("Driver not initialized");
  var session = driver.session();
  try {
    var result = await session.run("RETURN 1 AS ping");
    var rawPing = result.records[0] && result.records[0].get("ping");
    var pingVal =
      typeof rawPing === "number"
        ? rawPing
        : rawPing && typeof rawPing.toNumber === "function"
          ? rawPing.toNumber()
          : 0;
    if (pingVal !== 1) throw new Error("Unexpected ping response");
    isConnected = true;
    console.log("✅ [CognoDB] Connected successfully");
  } catch (err) {
    isConnected = false;
    console.error("❌ [CognoDB] Connection failed:", err.message);
    throw err;
  } finally {
    await session.close();
  }
}

function getDriver() {
  if (!driver) throw new Error("Driver not initialized — call initDriver() first");
  return driver;
}

function getSession() {
  if (!driver) throw new Error("Driver not initialized");
  return driver.session();
}

function isDatabaseConnected() {
  return isConnected;
}

function setDatabaseConnected(value) {
  isConnected = value;
}

async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
    isConnected = false;
  }
}

module.exports = {
  initDriver,
  verifyConnectivity,
  getDriver,
  getSession,
  isDatabaseConnected,
  setDatabaseConnected,
  closeDriver,
};
