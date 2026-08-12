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
var health_controller_exports = {};
__export(health_controller_exports, {
  healthCheck: () => healthCheck
});
module.exports = __toCommonJS(health_controller_exports);
var import_cognodb = require("../config/cognodb");
async function healthCheck(_req, res, _next) {
  const dbConnected = (0, import_cognodb.isDatabaseConnected)();
  const status = dbConnected ? "ok" : "degraded";
  const httpStatus = dbConnected ? 200 : 503;
  res.status(httpStatus).json({
    success: true,
    data: {
      status,
      database: dbConnected ? "connected" : "disconnected",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0",
      service: "HireGraph API"
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  healthCheck
});
