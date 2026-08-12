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
var matching_service_exports = {};
__export(matching_service_exports, {
  computeMatchPercentage: () => computeMatchPercentage,
  computeTier: () => computeTier,
  getAllJobMatches: () => getAllJobMatches,
  getJobMatch: () => getJobMatch,
  getSkillDemand: () => getSkillDemand,
  getSkillGap: () => getSkillGap
});
module.exports = __toCommonJS(matching_service_exports);
var import_cognodb = require("../config/cognodb");
var import_matching = require("../cypher/matching");
function toInt(val) {
  if (val && typeof val === "object" && "toNumber" in val && typeof val.toNumber === "function") {
    return val.toNumber();
  }
  return typeof val === "number" ? val : 0;
}
function computeTier(pct) {
  if (pct >= 70) return "HIGH";
  if (pct >= 40) return "MEDIUM";
  return "LOW";
}
function computeMatchPercentage(matched, total) {
  if (total === 0) return 0;
  return Math.round(matched / total * 100);
}
async function getJobMatch(candidateId, jobId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_matching.MATCHING_QUERIES.GET_JOB_MATCH, { candidateId, jobId });
    if (result.records.length === 0) return null;
    const r = result.records[0];
    const requiredSkills = r.get("requiredSkills") ?? [];
    const matchedSkills = r.get("matchedSkills") ?? [];
    const preferredSkills = r.get("preferredSkills") ?? [];
    const matchedIds = new Set(matchedSkills.map((s) => s.id));
    const missingSkills = requiredSkills.filter((s) => !matchedIds.has(s.id));
    const totalRequired = toInt(r.get("totalRequired"));
    const totalMatched = toInt(r.get("totalMatched"));
    const matchPercentage = computeMatchPercentage(totalMatched, totalRequired);
    return {
      jobId: r.get("jobId"),
      jobTitle: r.get("jobTitle"),
      requiredSkills,
      matchedSkills,
      missingSkills,
      preferredSkills,
      totalRequired,
      totalMatched,
      matchPercentage,
      tier: computeTier(matchPercentage),
      companyId: r.get("companyId"),
      companyName: r.get("companyName"),
      companyIndustry: r.get("companyIndustry"),
      locationName: r.get("locationName"),
      workMode: r.get("workMode"),
      salaryMin: toInt(r.get("salaryMin")),
      salaryMax: toInt(r.get("salaryMax"))
    };
  } finally {
    await session.close();
  }
}
async function getAllJobMatches(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_matching.MATCHING_QUERIES.GET_ALL_JOB_MATCHES, { candidateId });
    return result.records.map((r) => {
      const requiredSkills = r.get("requiredSkills") ?? [];
      const matchedSkills = r.get("matchedSkills") ?? [];
      const matchedIds = new Set(matchedSkills.map((s) => s.id));
      const missingSkills = requiredSkills.filter((s) => !matchedIds.has(s.id));
      const totalRequired = toInt(r.get("totalRequired"));
      const totalMatched = toInt(r.get("totalMatched"));
      const matchPercentage = computeMatchPercentage(totalMatched, totalRequired);
      return {
        jobId: r.get("jobId"),
        jobTitle: r.get("jobTitle"),
        requiredSkills,
        matchedSkills,
        missingSkills,
        preferredSkills: [],
        totalRequired,
        totalMatched,
        matchPercentage,
        tier: computeTier(matchPercentage),
        companyId: r.get("companyId"),
        companyName: r.get("companyName"),
        companyIndustry: r.get("industry"),
        locationName: r.get("locationName"),
        workMode: r.get("workMode"),
        salaryMin: toInt(r.get("salaryMin")),
        salaryMax: toInt(r.get("salaryMax"))
      };
    });
  } finally {
    await session.close();
  }
}
async function getSkillGap(candidateId, jobId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_matching.MATCHING_QUERIES.GET_SKILL_GAP, { candidateId, jobId });
    return result.records.map((r) => ({
      id: r.get("id"),
      name: r.get("name"),
      normalizedName: r.get("normalizedName"),
      category: r.get("category")
    }));
  } finally {
    await session.close();
  }
}
async function getSkillDemand() {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_matching.MATCHING_QUERIES.GET_SKILL_DEMAND);
    return result.records.map((r) => ({
      id: r.get("id"),
      name: r.get("name"),
      category: r.get("category"),
      demandCount: toInt(r.get("demandCount"))
    }));
  } finally {
    await session.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  computeMatchPercentage,
  computeTier,
  getAllJobMatches,
  getJobMatch,
  getSkillDemand,
  getSkillGap
});
