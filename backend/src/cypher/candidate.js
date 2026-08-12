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
var candidate_exports = {};
__export(candidate_exports, {
  CANDIDATE_QUERIES: () => CANDIDATE_QUERIES
});
module.exports = __toCommonJS(candidate_exports);
const CANDIDATE_QUERIES = {
  // 6.1 — Candidate skills, 1-hop, ordered by name
  GET_CANDIDATE_SKILLS: `
    MATCH (c:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
    RETURN s.id AS id, s.name AS name, s.normalizedName AS normalizedName, s.category AS category
    ORDER BY s.name
  `,
  GET_CANDIDATE_BY_ID: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:LOCATED_IN]->(loc:Location)
    RETURN c.id AS id,
           c.name AS name,
           c.email AS email,
           c.title AS title,
           c.experienceYears AS experienceYears,
           c.location AS location,
           c.resumeText AS resumeText,
           c.createdAt AS createdAt,
           loc.name AS locationName,
           loc.country AS locationCountry
  `,
  GET_ALL_CANDIDATES: `
    MATCH (c:Candidate)
    RETURN c.id AS id, c.name AS name, c.email AS email,
           c.title AS title, c.experienceYears AS experienceYears,
           c.location AS location
    ORDER BY c.name
  `,
  ADD_SKILL_TO_CANDIDATE: `
    MATCH (c:Candidate {id: $candidateId})
    MATCH (s:Skill {id: $skillId})
    MERGE (c)-[:HAS_SKILL]->(s)
    RETURN s.id AS id, s.name AS name
  `,
  REMOVE_SKILL_FROM_CANDIDATE: `
    MATCH (c:Candidate {id: $candidateId})-[r:HAS_SKILL]->(s:Skill {id: $skillId})
    DELETE r
    RETURN count(r) AS removed
  `
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CANDIDATE_QUERIES
});
