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
var candidate_controller_exports = {};
__export(candidate_controller_exports, {
  getAllCandidates: () => getAllCandidates,
  getCandidateById: () => getCandidateById,
  getCandidateSkills: () => getCandidateSkills
});
module.exports = __toCommonJS(candidate_controller_exports);
var candidateService = __toESM(require("../services/candidate.service"));
var import_error = require("../middleware/error.middleware");
async function getCandidateById(req, res, next) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const candidate = await candidateService.getCandidateById(id);
    if (!candidate) throw new import_error.AppError(404, "NOT_FOUND", `Candidate ${id} not found`);
    res.json({ success: true, data: candidate });
  } catch (err) {
    next(err);
  }
}
async function getCandidateSkills(req, res, next) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const skills = await candidateService.getCandidateSkills(id);
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
}
async function getAllCandidates(req, res, next) {
  try {
    const candidates = await candidateService.getAllCandidates();
    res.json({ success: true, data: candidates });
  } catch (err) {
    next(err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllCandidates,
  getCandidateById,
  getCandidateSkills
});
