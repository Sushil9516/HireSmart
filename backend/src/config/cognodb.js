var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cognodb_exports = {};
__export(cognodb_exports, {
  closeDriver: () => closeDriver,
  getDriver: () => getDriver,
  getSession: () => getSession,
  initDriver: () => initDriver,
  isDatabaseConnected: () => isDatabaseConnected,
  setDatabaseConnected: () => setDatabaseConnected,
  verifyConnectivity: () => verifyConnectivity
});
module.exports = __toCommonJS(cognodb_exports);
var import_neo4j_driver = __toESM(require("neo4j-driver"));
let driver = null;
let isConnected = false;
function initDriver(uri, username, password) {
  driver = import_neo4j_driver.default.driver(uri, import_neo4j_driver.default.auth.basic(username, password), {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 1e4,
    connectionTimeout: 5e3
  });
}
async function verifyConnectivity() {
  if (!driver) throw new Error("Driver not initialized");
  const session = driver.session();
  try {
    const result = await session.run("RETURN 1 AS ping");
    const rawPing = result.records[0]?.get("ping");
    const pingVal = typeof rawPing === "number" ? rawPing : rawPing && typeof rawPing.toNumber === "function" ? rawPing.toNumber() : 0;
    if (pingVal !== 1) throw new Error("Unexpected ping response");
    isConnected = true;
    console.log("\u2705 [CognoDB] Connected successfully");
  } catch (err) {
    isConnected = false;
    console.error("\u274C [CognoDB] Connection failed:", err.message);
    throw err;
  } finally {
    await session.close();
  }
}
function getDriver() {
  if (!driver) throw new Error("Driver not initialized \u2014 call initDriver() first");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeDriver,
  getDriver,
  getSession,
  initDriver,
  isDatabaseConnected,
  setDatabaseConnected,
  verifyConnectivity
});
