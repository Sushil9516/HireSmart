var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var resume_controller_exports = {};
__export(resume_controller_exports, {
  parseJD: () => parseJD,
  parseResume: () => parseResume
});
module.exports = __toCommonJS(resume_controller_exports);
var import_pdf_parse = __toESM(require("pdf-parse"));
var import_resume = require("../services/resume.service");
var import_jd = require("../services/jd.service");
var import_error = require("../middleware/error.middleware");
async function parseResume(req, res, next) {
  try {
    const file = req.file;
    if (!file) throw new import_error.AppError(400, "VALIDATION_ERROR", "No PDF file uploaded");
    if (file.mimetype !== "application/pdf") throw new import_error.AppError(400, "VALIDATION_ERROR", "Only PDF files are accepted");
    if (file.size > 5 * 1024 * 1024) throw new import_error.AppError(400, "VALIDATION_ERROR", "File size must be under 5MB");
    let parsed;
    try {
      parsed = await (0, import_pdf_parse.default)(file.buffer);
    } catch (pdfErr) {
      const rawText = file.buffer.toString("latin1");
      const textMatch = rawText.match(/\(([^)]+)\)\s*Tj/g);
      const extracted = textMatch ? textMatch.map((m) => m.replace(/^\(/, "").replace(/\)\s*Tj$/, "")).join(" ") : rawText;
      parsed = { text: extracted };
    }
    const result = (0, import_resume.parseResumeText)(parsed.text);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
async function parseJD(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || text.trim().length < 20) {
      throw new import_error.AppError(400, "VALIDATION_ERROR", "Please provide at least 20 characters of job description text");
    }
    const result = (0, import_jd.parseJobDescription)(text);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseJD,
  parseResume
});
