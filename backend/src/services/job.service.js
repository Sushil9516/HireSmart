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
var job_service_exports = {};
__export(job_service_exports, {
  getAllJobs: () => getAllJobs,
  getJobById: () => getJobById
});
module.exports = __toCommonJS(job_service_exports);
var import_cognodb = require("../config/cognodb");
function toInt(val) {
  if (val && typeof val === "object" && "toNumber" in val && typeof val.toNumber === "function") {
    return val.toNumber();
  }
  return typeof val === "number" ? val : 0;
}
async function getAllJobs() {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(`
      MATCH (j:Job)
      OPTIONAL MATCH (comp:Company)-[:OFFERS]->(j)
      OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
      RETURN j.id AS id, j.title AS title, j.description AS description,
             j.experienceMin AS experienceMin, j.experienceMax AS experienceMax,
             j.location AS location, j.workMode AS workMode,
             j.salaryMin AS salaryMin, j.salaryMax AS salaryMax,
             j.postedAt AS postedAt, j.status AS status,
             comp.id AS companyId, comp.name AS companyName, comp.industry AS companyIndustry,
             loc.name AS locationName
      ORDER BY j.postedAt DESC
    `);
    return result.records.map((r) => ({
      id: r.get("id"),
      title: r.get("title"),
      description: r.get("description") ?? "",
      experienceMin: toInt(r.get("experienceMin")),
      experienceMax: toInt(r.get("experienceMax")),
      location: r.get("location") ?? "",
      workMode: r.get("workMode") ?? "onsite",
      salaryMin: toInt(r.get("salaryMin")),
      salaryMax: toInt(r.get("salaryMax")),
      postedAt: r.get("postedAt") ?? "",
      status: r.get("status") ?? "active",
      companyId: r.get("companyId"),
      companyName: r.get("companyName"),
      companyIndustry: r.get("companyIndustry"),
      locationName: r.get("locationName")
    }));
  } finally {
    await session.close();
  }
}
async function getJobById(jobId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(`
      MATCH (j:Job {id: $jobId})
      OPTIONAL MATCH (comp:Company)-[:OFFERS]->(j)
      OPTIONAL MATCH (j)-[:LOCATED_IN]->(loc:Location)
      RETURN j.id AS id, j.title AS title, j.description AS description,
             j.experienceMin AS experienceMin, j.experienceMax AS experienceMax,
             j.location AS location, j.workMode AS workMode,
             j.salaryMin AS salaryMin, j.salaryMax AS salaryMax,
             j.postedAt AS postedAt, j.status AS status,
             comp.id AS companyId, comp.name AS companyName,
             comp.industry AS companyIndustry, comp.size AS companySize,
             loc.name AS locationName
    `, { jobId });
    if (result.records.length === 0) return null;
    const r = result.records[0];
    return {
      id: r.get("id"),
      title: r.get("title"),
      description: r.get("description") ?? "",
      experienceMin: toInt(r.get("experienceMin")),
      experienceMax: toInt(r.get("experienceMax")),
      location: r.get("location") ?? "",
      workMode: r.get("workMode") ?? "onsite",
      salaryMin: toInt(r.get("salaryMin")),
      salaryMax: toInt(r.get("salaryMax")),
      postedAt: r.get("postedAt") ?? "",
      status: r.get("status") ?? "active",
      companyId: r.get("companyId"),
      companyName: r.get("companyName"),
      companyIndustry: r.get("companyIndustry"),
      locationName: r.get("locationName")
    };
  } finally {
    await session.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllJobs,
  getJobById
});
