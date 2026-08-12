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
var candidate_service_exports = {};
__export(candidate_service_exports, {
  getAllCandidates: () => getAllCandidates,
  getCandidateById: () => getCandidateById,
  getCandidateSkills: () => getCandidateSkills
});
module.exports = __toCommonJS(candidate_service_exports);
var import_cognodb = require("../config/cognodb");
var import_candidate = require("../cypher/candidate");
function toInt(val) {
  if (val && typeof val === "object" && "toNumber" in val && typeof val.toNumber === "function") {
    return val.toNumber();
  }
  return typeof val === "number" ? val : 0;
}
async function getCandidateById(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_candidate.CANDIDATE_QUERIES.GET_CANDIDATE_BY_ID, { candidateId });
    if (result.records.length === 0) return null;
    const r = result.records[0];
    return {
      id: r.get("id"),
      name: r.get("name"),
      email: r.get("email"),
      title: r.get("title"),
      experienceYears: toInt(r.get("experienceYears")),
      location: r.get("location"),
      resumeText: r.get("resumeText") ?? "",
      createdAt: r.get("createdAt") ?? "",
      locationName: r.get("locationName"),
      locationCountry: r.get("locationCountry")
    };
  } finally {
    await session.close();
  }
}
async function getCandidateSkills(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_candidate.CANDIDATE_QUERIES.GET_CANDIDATE_SKILLS, { candidateId });
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
async function getAllCandidates() {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_candidate.CANDIDATE_QUERIES.GET_ALL_CANDIDATES);
    return result.records.map((r) => ({
      id: r.get("id"),
      name: r.get("name"),
      email: r.get("email"),
      title: r.get("title"),
      experienceYears: toInt(r.get("experienceYears")),
      location: r.get("location"),
      resumeText: "",
      createdAt: ""
    }));
  } finally {
    await session.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllCandidates,
  getCandidateById,
  getCandidateSkills
});
