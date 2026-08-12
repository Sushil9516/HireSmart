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
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_env = require("./config/env");
var import_error = require("./middleware/error.middleware");
var import_health = __toESM(require("./routes/health.routes"));
var import_candidate = __toESM(require("./routes/candidate.routes"));
var import_job = __toESM(require("./routes/job.routes"));
var import_graph = __toESM(require("./routes/graph.routes"));
var import_resume = __toESM(require("./routes/resume.routes"));
const app = (0, import_express.default)();
app.use((0, import_cors.default)({
  origin(origin, callback) {
    const allowed = import_env.env.ALLOWED_ORIGINS;
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true }));
app.use("/api/health", import_health.default);
app.use("/api/candidates", import_candidate.default);
app.use("/api/jobs", import_job.default);
app.use("/api/graph", import_graph.default);
app.use("/api/resume", import_resume.default);
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Route not found" } });
});
app.use(import_error.errorMiddleware);
var app_default = app;
