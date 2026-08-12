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
var resume_service_exports = {};
__export(resume_service_exports, {
  parseResumeText: () => parseResumeText
});
module.exports = __toCommonJS(resume_service_exports);
var import_skills = require("../utils/skills.dictionary");
function parseResumeText(text) {
  const detectedNames = (0, import_skills.extractSkillsFromText)(text);
  const detectedSkills = detectedNames.map((name) => ({
    name,
    normalized: (0, import_skills.normalizeSkill)(name.toLowerCase()) ?? name,
    category: (0, import_skills.getSkillCategory)(name)
  }));
  return { rawText: text, detectedSkills };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseResumeText
});
