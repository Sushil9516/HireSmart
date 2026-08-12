var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var error_middleware_exports = {};
__export(error_middleware_exports, {
  AppError: () => AppError,
  dbGuard: () => dbGuard,
  errorMiddleware: () => errorMiddleware
});
module.exports = __toCommonJS(error_middleware_exports);
var import_cognodb = require("../config/cognodb");
class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "AppError";
  }
  statusCode;
  code;
}
function dbGuard(_req, res, next) {
  if (!(0, import_cognodb.isDatabaseConnected)()) {
    res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Graph database unavailable \u2014 please check the connection and try again."
      }
    });
    return;
  }
  next();
}
function errorMiddleware(err, _req, res, _next) {
  console.error("[Error]", err.message);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message }
    });
    return;
  }
  const msg = err.message ?? "";
  if (msg.includes("ServiceUnavailable") || msg.includes("ECONNREFUSED") || msg.includes("WebSocket") || msg.includes("connection") || msg.includes("Bolt")) {
    res.status(503).json({
      success: false,
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Graph database unavailable \u2014 please check the connection and try again."
      }
    });
    return;
  }
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred."
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppError,
  dbGuard,
  errorMiddleware
});
