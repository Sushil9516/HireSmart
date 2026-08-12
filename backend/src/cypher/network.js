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
var network_exports = {};
__export(network_exports, {
  NETWORK_QUERIES: () => NETWORK_QUERIES
});
module.exports = __toCommonJS(network_exports);
const NETWORK_QUERIES = {
  // Direct connections
  GET_DIRECT_CONNECTIONS: `
    MATCH (c:Candidate {id: $candidateId})-[rel:CONNECTED_TO]->(p:Person)
    OPTIONAL MATCH (p)-[:WORKS_AT]->(comp:Company)
    RETURN p.id AS id,
           p.name AS name,
           p.title AS title,
           p.email AS email,
           p.location AS location,
           rel.since AS connectedSince,
           comp.id AS companyId,
           comp.name AS companyName,
           comp.industry AS companyIndustry
    ORDER BY p.name
  `,
  // 6.5 — Second-degree connections (2-hop, excluding direct)
  GET_SECOND_DEGREE: `
    MATCH (c:Candidate {id: $candidateId})-[:CONNECTED_TO]->(p1:Person)-[:CONNECTED_TO]->(p2:Person)
    WHERE p2.id <> $candidateId
      AND NOT (c)-[:CONNECTED_TO]->(p2)
    OPTIONAL MATCH (p2)-[:WORKS_AT]->(comp:Company)
    OPTIONAL MATCH (p1)-[:WORKS_AT]->(p1comp:Company)
    RETURN DISTINCT
           p2.id AS id,
           p2.name AS name,
           p2.title AS title,
           p2.location AS location,
           collect(DISTINCT p1.name) AS viaNames,
           comp.id AS companyId,
           comp.name AS companyName
    ORDER BY p2.name
  `,
  // 6.6 — Network skill discovery: skills in network the candidate lacks
  GET_NETWORK_SKILLS: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(owned:Skill)
    WITH c, collect(DISTINCT owned.id) AS ownedSkillIds
    MATCH (c)-[:CONNECTED_TO]->(p:Person)-[:HAS_SKILL]->(s:Skill)
    WHERE NOT s.id IN ownedSkillIds
    RETURN s.id AS skillId,
           s.name AS skillName,
           s.category AS skillCategory,
           collect(DISTINCT {id: p.id, name: p.name, title: p.title}) AS holders
    ORDER BY size(holders) DESC
  `,
  // Companies reachable within N hops (using variable-length, bounded at 3)
  GET_REACHABLE_COMPANIES: `
    MATCH path = (c:Candidate {id: $candidateId})-[:CONNECTED_TO*1..3]->(p:Person)-[:WORKS_AT]->(comp:Company)
    WITH comp, min(length(path) + 1) AS minHops
    RETURN DISTINCT
           comp.id AS companyId,
           comp.name AS companyName,
           comp.industry AS companyIndustry,
           comp.size AS companySize,
           minHops
    ORDER BY minHops, comp.name
  `,
  // 6.7 — Shortest opportunity path (bounded, no unbounded traversal)
  GET_OPPORTUNITY_PATH: `
    MATCH path = (c:Candidate {id: $candidateId})-[:CONNECTED_TO*1..4]->(p:Person)-[:WORKS_AT]->(comp:Company {id: $companyId})
    RETURN [node IN nodes(path) | {
      label: CASE
        WHEN node:Candidate THEN 'Candidate'
        WHEN node:Person     THEN 'Person'
        WHEN node:Company    THEN 'Company'
        ELSE 'Node'
      END,
      id:   CASE WHEN node:Candidate THEN node.id WHEN node:Person THEN node.id ELSE node.id END,
      name: CASE WHEN node:Candidate THEN node.name WHEN node:Person THEN node.name ELSE node.name END,
      title: CASE WHEN node:Person THEN node.title ELSE null END
    }] AS pathNodes,
    length(path) AS hops
    ORDER BY hops ASC
    LIMIT 1
  `,
  // 6.4 — Multi-hop opportunity discovery (THE centerpiece query)
  // Candidate -> Person (network) -> Company -> Job -> required Skills
  // cross-referenced with candidate's own skills for a computed match
  GET_NETWORK_OPPORTUNITIES: `
    MATCH (c:Candidate {id: $candidateId})-[:CONNECTED_TO]->(connector:Person)-[:WORKS_AT]->(comp:Company)-[:OFFERS]->(j:Job)
    WHERE j.status = 'active'
    MATCH (j)-[:REQUIRES]->(req:Skill)
    WITH c, connector, comp, j, collect(DISTINCT req) AS requiredSkills
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    WHERE s IN requiredSkills
    WITH c, connector, comp, j, requiredSkills, collect(DISTINCT s) AS matchedSkills
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
    RETURN j.id AS jobId,
           j.title AS jobTitle,
           j.workMode AS workMode,
           j.salaryMin AS salaryMin,
           j.salaryMax AS salaryMax,
           comp.id AS companyId,
           comp.name AS companyName,
           comp.industry AS companyIndustry,
           loc.name AS locationName,
           connector.id AS connectorId,
           connector.name AS connectorName,
           connector.title AS connectorTitle,
           [s IN requiredSkills | {id: s.id, name: s.name, category: s.category}] AS requiredSkills,
           [s IN matchedSkills  | {id: s.id, name: s.name, category: s.category}] AS matchedSkills,
           size(requiredSkills) AS totalRequired,
           size(matchedSkills)  AS totalMatched
    ORDER BY totalMatched DESC, j.title
  `
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NETWORK_QUERIES
});
