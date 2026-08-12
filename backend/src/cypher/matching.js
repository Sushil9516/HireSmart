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
var matching_exports = {};
__export(matching_exports, {
  MATCHING_QUERIES: () => MATCHING_QUERIES
});
module.exports = __toCommonJS(matching_exports);
const MATCHING_QUERIES = {
  // 6.2 — Job matching: candidate's skills vs job required skills
  GET_JOB_MATCH: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (comp:Company)-[:OFFERS]->(j)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
    MATCH (j)-[:REQUIRES]->(req:Skill)
    WITH j, comp, loc, collect(req) AS requiredSkills
    OPTIONAL MATCH (c:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
    WHERE s IN requiredSkills
    WITH j, comp, loc, requiredSkills, collect(s) AS matchedSkills
    OPTIONAL MATCH (j)-[:PREFERS]->(pref:Skill)
    OPTIONAL MATCH (c2:Candidate {id: $candidateId})-[:HAS_SKILL]->(ps:Skill)
    WHERE ps.id = pref.id
    RETURN j.id AS jobId,
           j.title AS jobTitle,
           j.workMode AS workMode,
           j.salaryMin AS salaryMin,
           j.salaryMax AS salaryMax,
           loc.name AS locationName,
           comp.id AS companyId,
           comp.name AS companyName,
           comp.industry AS companyIndustry,
           [s IN requiredSkills | {id: s.id, name: s.name, category: s.category}] AS requiredSkills,
           [s IN matchedSkills  | {id: s.id, name: s.name, category: s.category}] AS matchedSkills,
           size(requiredSkills) AS totalRequired,
           size(matchedSkills) AS totalMatched,
           collect(DISTINCT {id: pref.id, name: pref.name, matched: ps IS NOT NULL}) AS preferredSkills
  `,
  // 6.3 — Skill gap: required skills the candidate doesn't have
  GET_SKILL_GAP: `
    MATCH (c:Candidate {id: $candidateId})
    MATCH (j:Job {id: $jobId})-[:REQUIRES]->(s:Skill)
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(owned:Skill)
    WITH j, s, collect(DISTINCT owned.id) AS ownedSkillIds
    WHERE NOT s.id IN ownedSkillIds
    RETURN s.id AS id, s.name AS name, s.normalizedName AS normalizedName, s.category AS category
    ORDER BY s.name
  `,
  // All jobs with match scores for a candidate
  GET_ALL_JOB_MATCHES: `
    MATCH (j:Job)
    OPTIONAL MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (j)-[:REQUIRES]->(req:Skill)
    WITH j, c, collect(DISTINCT req) AS requiredSkills
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    WHERE s IN requiredSkills
    WITH j, requiredSkills, collect(DISTINCT s) AS matchedSkills
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
    OPTIONAL MATCH (comp:Company)-[:OFFERS]->(j)
    RETURN j.id AS jobId,
           j.title AS jobTitle,
           j.workMode AS workMode,
           j.salaryMin AS salaryMin,
           j.salaryMax AS salaryMax,
           j.status AS status,
           j.experienceMin AS experienceMin,
           j.experienceMax AS experienceMax,
           loc.name AS locationName,
           comp.id AS companyId,
           comp.name AS companyName,
           comp.industry AS industry,
           [s IN requiredSkills | {id: s.id, name: s.name, category: s.category}] AS requiredSkills,
           [s IN matchedSkills  | {id: s.id, name: s.name, category: s.category}] AS matchedSkills,
           size(requiredSkills) AS totalRequired,
           size(matchedSkills)  AS totalMatched
    ORDER BY j.title
  `,
  // 6.8 — Skill demand aggregation
  GET_SKILL_DEMAND: `
    MATCH (:Job)-[:REQUIRES]->(s:Skill)
    RETURN s.id AS id, s.name AS name, s.category AS category, count(*) AS demandCount
    ORDER BY demandCount DESC
  `
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MATCHING_QUERIES
});
