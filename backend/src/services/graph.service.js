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
var graph_service_exports = {};
__export(graph_service_exports, {
  getCandidateGraph: () => getCandidateGraph,
  getJobGraph: () => getJobGraph
});
module.exports = __toCommonJS(graph_service_exports);
var import_cognodb = require("../config/cognodb");
var import_graph = require("../cypher/graph");
function dedupeNodes(nodes) {
  const seen = /* @__PURE__ */ new Set();
  return nodes.filter((n) => {
    if (!n || !n.id) return false;
    const key = `${n.label}:${n.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
async function getJobGraph(jobId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_graph.GRAPH_QUERIES.GET_JOB_GRAPH_FLAT, { jobId });
    if (result.records.length === 0) return { nodes: [], edges: [] };
    const r = result.records[0];
    const jobNodes = r.get("jobNodes") ?? [];
    const companyNodes = r.get("companyNodes") ?? [];
    const reqSkillNodes = r.get("reqSkillNodes") ?? [];
    const prefSkillNodes = r.get("prefSkillNodes") ?? [];
    const locationNodes = r.get("locationNodes") ?? [];
    const allNodes = dedupeNodes([
      ...jobNodes,
      ...companyNodes,
      ...reqSkillNodes.filter((n) => n),
      ...prefSkillNodes.filter((n) => n),
      ...locationNodes.filter((n) => n)
    ]);
    const jobId_ = jobNodes[0]?.id;
    const companyId = companyNodes[0]?.id;
    const locId = locationNodes[0]?.id;
    const edges = [];
    if (companyId && jobId_) edges.push({ source: companyId, target: jobId_, type: "OFFERS" });
    for (const s of reqSkillNodes.filter((n) => n?.id)) edges.push({ source: jobId_, target: s.id, type: "REQUIRES", props: { importance: "required" } });
    for (const s of prefSkillNodes.filter((n) => n?.id)) edges.push({ source: jobId_, target: s.id, type: "PREFERS", props: { importance: "preferred" } });
    if (locId && jobId_) edges.push({ source: jobId_, target: locId, type: "LOCATED_IN" });
    return { nodes: allNodes, edges };
  } finally {
    await session.close();
  }
}
async function getCandidateGraph(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_graph.GRAPH_QUERIES.GET_CANDIDATE_GRAPH_FLAT, { candidateId });
    if (result.records.length === 0) return { nodes: [], edges: [] };
    const r = result.records[0];
    const candidateNode = r.get("candidateNode");
    const skillNodes = r.get("skillNodes") ?? [];
    const personNodes = r.get("personNodes") ?? [];
    const companyNodes = r.get("companyNodes") ?? [];
    const jobNodes = r.get("jobNodes") ?? [];
    const allNodes = dedupeNodes([
      candidateNode,
      ...skillNodes.filter((n) => n),
      ...personNodes.filter((n) => n),
      ...companyNodes.filter((n) => n),
      ...jobNodes.filter((n) => n)
    ]);
    const edges = [];
    for (const s of skillNodes.filter((n) => n?.id)) edges.push({ source: candidateId, target: s.id, type: "HAS_SKILL" });
    for (const p of personNodes.filter((n) => n?.id)) edges.push({ source: candidateId, target: p.id, type: "CONNECTED_TO" });
    const session2 = (0, import_cognodb.getSession)();
    try {
      const r2 = await session2.run(`
        MATCH (c:Candidate {id: $candidateId})-[:CONNECTED_TO]->(p:Person)-[:WORKS_AT]->(comp:Company)
        RETURN p.id AS personId, comp.id AS companyId
      `, { candidateId });
      for (const rec of r2.records) {
        const pid = rec.get("personId");
        const cid = rec.get("companyId");
        if (pid && cid) edges.push({ source: pid, target: cid, type: "WORKS_AT" });
      }
      const r3 = await session2.run(`
        MATCH (comp:Company)-[:OFFERS]->(j:Job)
        WHERE comp.id IN $companyIds AND j.status = 'active'
        RETURN comp.id AS companyId, j.id AS jobId
        LIMIT 20
      `, { companyIds: companyNodes.filter((n) => n?.id).map((n) => n.id) });
      for (const rec of r3.records) {
        const cid = rec.get("companyId");
        const jid = rec.get("jobId");
        if (cid && jid) edges.push({ source: cid, target: jid, type: "OFFERS" });
      }
    } finally {
      await session2.close();
    }
    return { nodes: allNodes, edges };
  } finally {
    await session.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCandidateGraph,
  getJobGraph
});
