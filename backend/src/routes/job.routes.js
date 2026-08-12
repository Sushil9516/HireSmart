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
var job_routes_exports = {};
__export(job_routes_exports, {
  default: () => job_routes_default
});
module.exports = __toCommonJS(job_routes_exports);
var import_express = require("express");
var import_job = require("../controllers/job.controller");
var import_error = require("../middleware/error.middleware");
var import_resume = require("../controllers/resume.controller");
const router = (0, import_express.Router)();
router.post("/parse-jd", import_resume.parseJD);
router.use(import_error.dbGuard);
router.get("/", import_job.getAllJobs);
router.get("/:id", import_job.getJobById);
var job_routes_default = router;
