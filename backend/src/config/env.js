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
var env_exports = {};
__export(env_exports, {
  env: () => env
});
module.exports = __toCommonJS(env_exports);
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
import_dotenv.default.config({ path: import_path.default.resolve(__dirname, "../../../.env") });
import_dotenv.default.config({ path: import_path.default.resolve(__dirname, "../../.env") });
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), ".env") });
import_dotenv.default.config({ path: import_path.default.resolve(process.cwd(), "../.env") });
function getEnv(key, fallback = "") {
  return process.env[key] || fallback;
}
function parseAllowedOrigins(raw) {
  return (raw || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
const env = {
  COGNODB_URI: getEnv("COGNODB_URI"),
  COGNODB_USERNAME: getEnv("COGNODB_USERNAME"),
  COGNODB_PASSWORD: getEnv("COGNODB_PASSWORD"),
  PORT: parseInt(process.env.PORT || "4000", 10),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  ALLOWED_ORIGINS: parseAllowedOrigins(process.env.CLIENT_URL),
  NODE_ENV: process.env.NODE_ENV || "development",
  SEED_RESET: process.env.SEED_RESET === "true"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env
});
