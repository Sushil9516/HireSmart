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
var graph_exports = {};
__export(graph_exports, {
  GRAPH_QUERIES: () => GRAPH_QUERIES
});
module.exports = __toCommonJS(graph_exports);
const GRAPH_QUERIES = {
  // Graph subgraph centered on a job — returns nodes + relationships
  GET_JOB_GRAPH: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (comp:Company)-[:OFFERS]->(j)
    OPTIONAL MATCH (j)-[:REQUIRES]->(req:Skill)
    OPTIONAL MATCH (j)-[:PREFERS]->(pref:Skill)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
    OPTIONAL MATCH (comp)-[:LOCATED_IN]->(cloc:Location)
    WITH j, comp, collect(DISTINCT req) AS reqSkills,
         collect(DISTINCT pref) AS prefSkills, loc, cloc
    RETURN j, comp, reqSkills, prefSkills, loc, cloc
  `,
  // Candidate-centered subgraph for graph explorer
  GET_CANDIDATE_GRAPH: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (c)-[:CONNECTED_TO]->(p:Person)
    OPTIONAL MATCH (p)-[:WORKS_AT]->(comp:Company)
    OPTIONAL MATCH (comp)-[:OFFERS]->(j:Job)
    OPTIONAL MATCH (j)-[:REQUIRES]->(req:Skill)
    WITH c,
         collect(DISTINCT s) AS candidateSkills,
         collect(DISTINCT p) AS connections,
         collect(DISTINCT comp) AS companies,
         collect(DISTINCT {job: j, req: req}) AS jobReqs
    RETURN c, candidateSkills, connections, companies, jobReqs
  `,
  // Flat nodes+rels for graph explorer (easier to process in frontend)
  GET_JOB_GRAPH_FLAT: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (comp:Company)-[:OFFERS]->(j)
    OPTIONAL MATCH (j)-[:REQUIRES]->(req:Skill)
    OPTIONAL MATCH (j)-[:PREFERS]->(pref:Skill)
    OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
    WITH j, comp, req, pref, loc
    RETURN
      collect(DISTINCT {id: j.id, label: 'Job', name: j.title, props: {workMode: j.workMode, status: j.status}}) AS jobNodes,
      collect(DISTINCT {id: comp.id, label: 'Company', name: comp.name, props: {industry: comp.industry}}) AS companyNodes,
      collect(DISTINCT {id: req.id, label: 'Skill', name: req.name, props: {category: req.category, importance: 'required'}}) AS reqSkillNodes,
      collect(DISTINCT {id: pref.id, label: 'Skill', name: pref.name, props: {category: pref.category, importance: 'preferred'}}) AS prefSkillNodes,
      collect(DISTINCT {id: loc.id, label: 'Location', name: loc.name, props: {country: loc.country}}) AS locationNodes
  `,
  GET_CANDIDATE_GRAPH_FLAT: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (c)-[:CONNECTED_TO]->(p:Person)
    OPTIONAL MATCH (p)-[:WORKS_AT]->(comp:Company)
    OPTIONAL MATCH (comp)-[:OFFERS]->(j:Job)
    WHERE j.status = 'active'
    RETURN
      {id: c.id, label: 'Candidate', name: c.name, props: {title: c.title, experienceYears: c.experienceYears}} AS candidateNode,
      collect(DISTINCT {id: s.id, label: 'Skill', name: s.name, props: {category: s.category}}) AS skillNodes,
      collect(DISTINCT {id: p.id, label: 'Person', name: p.name, props: {title: p.title}}) AS personNodes,
      collect(DISTINCT {id: comp.id, label: 'Company', name: comp.name, props: {industry: comp.industry}}) AS companyNodes,
      collect(DISTINCT {id: j.id, label: 'Job', name: j.title, props: {workMode: j.workMode}}) AS jobNodes
  `
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GRAPH_QUERIES
});
