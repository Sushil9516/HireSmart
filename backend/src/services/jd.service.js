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
var jd_service_exports = {};
__export(jd_service_exports, {
  parseJobDescription: () => parseJobDescription
});
module.exports = __toCommonJS(jd_service_exports);
var import_skills = require("../utils/skills.dictionary");
const TITLE_PATTERNS = [
  /^(?:job title|position|role)[:\s]+(.+)/im,
  /^#+\s*(.+)/m,
  /^(.{5,60})$/m
];
const LOCATION_PATTERNS = [
  /location[:\s]+([A-Za-z ,]+)/i,
  /based in ([A-Za-z ,]+)/i,
  /\b(Bangalore|Mumbai|Delhi|Hyderabad|Chennai|Pune|Noida|Gurugram|Kolkata|Remote|San Francisco|New York|London|Berlin|Singapore)\b/i
];
function extractTitle(text) {
  for (const p of TITLE_PATTERNS) {
    const m = text.match(p);
    if (m) return m[1].trim().slice(0, 100);
  }
  return "Software Engineer";
}
function extractLocation(text) {
  for (const p of LOCATION_PATTERNS) {
    const m = text.match(p);
    if (m) return (m[1] ?? m[0]).trim();
  }
  return "Remote";
}
function parseJobDescription(text) {
  const skillNames = (0, import_skills.extractSkillsFromText)(text);
  const skills = skillNames.map((name) => ({ name, category: (0, import_skills.getSkillCategory)(name) }));
  const { min, max } = (0, import_skills.extractExperience)(text);
  return {
    title: extractTitle(text),
    skills,
    experienceMin: min,
    experienceMax: max,
    workMode: (0, import_skills.extractWorkMode)(text),
    location: extractLocation(text)
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseJobDescription
});
