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
var candidate_routes_exports = {};
__export(candidate_routes_exports, {
  default: () => candidate_routes_default
});
module.exports = __toCommonJS(candidate_routes_exports);
var import_express = require("express");
var import_candidate = require("../controllers/candidate.controller");
var import_matching = require("../controllers/matching.controller");
var import_network = require("../controllers/network.controller");
var import_error = require("../middleware/error.middleware");
const router = (0, import_express.Router)();
router.use(import_error.dbGuard);
router.get("/", import_candidate.getAllCandidates);
router.get("/:id", import_candidate.getCandidateById);
router.get("/:id/skills", import_candidate.getCandidateSkills);
router.get("/:candidateId/jobs/matches", import_matching.getAllJobMatches);
router.get("/:candidateId/jobs/:jobId/match", import_matching.getJobMatch);
router.get("/:candidateId/network", import_network.getNetwork);
router.get("/:candidateId/network/second-degree", import_network.getSecondDegree);
router.get("/:candidateId/network/skills", import_network.getNetworkSkills);
router.get("/:candidateId/opportunities", import_network.getOpportunities);
router.get("/:candidateId/path/company/:companyId", import_network.getOpportunityPath);
var candidate_routes_default = router;
