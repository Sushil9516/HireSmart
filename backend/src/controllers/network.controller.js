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
var network_controller_exports = {};
__export(network_controller_exports, {
  getNetwork: () => getNetwork,
  getNetworkSkills: () => getNetworkSkills,
  getOpportunities: () => getOpportunities,
  getOpportunityPath: () => getOpportunityPath,
  getSecondDegree: () => getSecondDegree
});
module.exports = __toCommonJS(network_controller_exports);
var networkService = __toESM(require("../services/network.service"));
async function getNetwork(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const [direct, reachableCompanies] = await Promise.all([
      networkService.getDirectConnections(candidateId),
      networkService.getReachableCompanies(candidateId)
    ]);
    res.json({ success: true, data: { direct, reachableCompanies } });
  } catch (err) {
    next(err);
  }
}
async function getSecondDegree(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const connections = await networkService.getSecondDegreeConnections(candidateId);
    res.json({ success: true, data: connections });
  } catch (err) {
    next(err);
  }
}
async function getNetworkSkills(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const skills = await networkService.getNetworkSkills(candidateId);
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
}
async function getOpportunities(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const opportunities = await networkService.getNetworkOpportunities(candidateId);
    res.json({ success: true, data: opportunities });
  } catch (err) {
    next(err);
  }
}
async function getOpportunityPath(req, res, next) {
  try {
    const candidateId = Array.isArray(req.params.candidateId) ? req.params.candidateId[0] : req.params.candidateId;
    const companyId = Array.isArray(req.params.companyId) ? req.params.companyId[0] : req.params.companyId;
    const path = await networkService.getOpportunityPath(candidateId, companyId);
    res.json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getNetwork,
  getNetworkSkills,
  getOpportunities,
  getOpportunityPath,
  getSecondDegree
});
