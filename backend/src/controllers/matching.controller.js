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
var matching_controller_exports = {};
__export(matching_controller_exports, {
  getAllJobMatches: () => getAllJobMatches,
  getJobMatch: () => getJobMatch,
  getSkillDemand: () => getSkillDemand
});
module.exports = __toCommonJS(matching_controller_exports);
var matchingService = __toESM(require("../services/matching.service"));
var import_error = require("../middleware/error.middleware");
async function getJobMatch(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const match = await matchingService.getJobMatch(candidateId, jobId);
    if (!match) throw new import_error.AppError(404, "NOT_FOUND", "No match data found for this candidate/job pair");
    res.json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
}
async function getAllJobMatches(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const matches = await matchingService.getAllJobMatches(candidateId);
    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
}
async function getSkillDemand(req, res, next) {
  try {
    const demand = await matchingService.getSkillDemand();
    res.json({ success: true, data: demand });
  } catch (err) {
    next(err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllJobMatches,
  getJobMatch,
  getSkillDemand
});
