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
var network_service_exports = {};
__export(network_service_exports, {
  getDirectConnections: () => getDirectConnections,
  getNetworkOpportunities: () => getNetworkOpportunities,
  getNetworkSkills: () => getNetworkSkills,
  getOpportunityPath: () => getOpportunityPath,
  getReachableCompanies: () => getReachableCompanies,
  getSecondDegreeConnections: () => getSecondDegreeConnections
});
module.exports = __toCommonJS(network_service_exports);
var import_cognodb = require("../config/cognodb");
var import_network = require("../cypher/network");
function toInt(val) {
  if (val && typeof val === "object" && "toNumber" in val && typeof val.toNumber === "function") {
    return val.toNumber();
  }
  return typeof val === "number" ? val : 0;
}
async function getDirectConnections(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_network.NETWORK_QUERIES.GET_DIRECT_CONNECTIONS, { candidateId });
    return result.records.map((r) => ({
      id: r.get("id"),
      name: r.get("name"),
      title: r.get("title"),
      email: r.get("email"),
      location: r.get("location"),
      connectedSince: toInt(r.get("connectedSince")),
      companyId: r.get("companyId"),
      companyName: r.get("companyName"),
      companyIndustry: r.get("companyIndustry")
    }));
  } finally {
    await session.close();
  }
}
async function getSecondDegreeConnections(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_network.NETWORK_QUERIES.GET_SECOND_DEGREE, { candidateId });
    return result.records.map((r) => ({
      id: r.get("id"),
      name: r.get("name"),
      title: r.get("title"),
      location: r.get("location"),
      viaNames: r.get("viaNames") ?? [],
      companyId: r.get("companyId"),
      companyName: r.get("companyName")
    }));
  } finally {
    await session.close();
  }
}
async function getNetworkSkills(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_network.NETWORK_QUERIES.GET_NETWORK_SKILLS, { candidateId });
    return result.records.map((r) => ({
      skillId: r.get("skillId"),
      skillName: r.get("skillName"),
      skillCategory: r.get("skillCategory"),
      holders: r.get("holders") ?? []
    }));
  } finally {
    await session.close();
  }
}
async function getOpportunityPath(candidateId, companyId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_network.NETWORK_QUERIES.GET_OPPORTUNITY_PATH, { candidateId, companyId });
    if (result.records.length === 0) return null;
    const r = result.records[0];
    return {
      pathNodes: r.get("pathNodes"),
      hops: toInt(r.get("hops"))
    };
  } finally {
    await session.close();
  }
}
async function getNetworkOpportunities(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_network.NETWORK_QUERIES.GET_NETWORK_OPPORTUNITIES, { candidateId });
    return result.records.map((r) => {
      const totalRequired = toInt(r.get("totalRequired"));
      const totalMatched = toInt(r.get("totalMatched"));
      const matchPercentage = totalRequired > 0 ? Math.round(totalMatched / totalRequired * 100) : 0;
      return {
        jobId: r.get("jobId"),
        jobTitle: r.get("jobTitle"),
        workMode: r.get("workMode"),
        salaryMin: toInt(r.get("salaryMin")),
        salaryMax: toInt(r.get("salaryMax")),
        companyId: r.get("companyId"),
        companyName: r.get("companyName"),
        companyIndustry: r.get("companyIndustry"),
        locationName: r.get("locationName"),
        connectorId: r.get("connectorId"),
        connectorName: r.get("connectorName"),
        connectorTitle: r.get("connectorTitle"),
        requiredSkills: r.get("requiredSkills") ?? [],
        matchedSkills: r.get("matchedSkills") ?? [],
        totalRequired,
        totalMatched,
        matchPercentage
      };
    });
  } finally {
    await session.close();
  }
}
async function getReachableCompanies(candidateId) {
  const session = (0, import_cognodb.getSession)();
  try {
    const result = await session.run(import_network.NETWORK_QUERIES.GET_REACHABLE_COMPANIES, { candidateId });
    return result.records.map((r) => ({
      companyId: r.get("companyId"),
      companyName: r.get("companyName"),
      companyIndustry: r.get("companyIndustry"),
      companySize: r.get("companySize"),
      minHops: toInt(r.get("minHops"))
    }));
  } finally {
    await session.close();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDirectConnections,
  getNetworkOpportunities,
  getNetworkSkills,
  getOpportunityPath,
  getReachableCompanies,
  getSecondDegreeConnections
});
