var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_http = __toESM(require("http"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
const PORT = process.env.PORT || 4e3;
const BASE_URL = `http://localhost:${PORT}`;
const MINIMAL_RESUME_PDF = import_fs.default.readFileSync(
  import_path.default.resolve(__dirname, "../tests/fixtures/sample-resume.pdf")
);
const endpoints = [
  { path: "/api/health", allowDegraded: true },
  { path: "/api/candidates/cand-1", allowDegraded: true },
  { path: "/api/candidates/cand-1/skills", allowDegraded: true },
  { path: "/api/jobs", allowDegraded: true },
  { path: "/api/jobs/job-1", allowDegraded: true },
  { path: "/api/candidates/cand-1/jobs/matches", allowDegraded: true },
  { path: "/api/candidates/cand-1/jobs/job-1/match", allowDegraded: true },
  { path: "/api/candidates/cand-1/network", allowDegraded: true },
  { path: "/api/candidates/cand-1/network/second-degree", allowDegraded: true },
  { path: "/api/candidates/cand-1/network/skills", allowDegraded: true },
  { path: "/api/candidates/cand-1/opportunities", allowDegraded: true },
  { path: "/api/candidates/cand-1/path/company/comp-1", allowDegraded: true },
  { path: "/api/graph/job/job-1", allowDegraded: true }
];
function fetchEndpoint(path2) {
  return new Promise((resolve, reject) => {
    import_http.default.get(`${BASE_URL}${path2}`, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode || 500, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode || 500, body: data });
        }
      });
    }).on("error", reject);
  });
}
function postJson(path2, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = import_http.default.request(`${BASE_URL}${path2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode || 500, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode || 500, body: data });
        }
      });
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}
function postResumeParse() {
  const boundary = "----HireGraphSmokeBoundary";
  const preamble = `--${boundary}\r
Content-Disposition: form-data; name="resume"; filename="resume.pdf"\r
Content-Type: application/pdf\r
\r
`;
  const closing = `\r
--${boundary}--\r
`;
  const body = Buffer.concat([Buffer.from(preamble), MINIMAL_RESUME_PDF, Buffer.from(closing)]);
  return new Promise((resolve, reject) => {
    const req = import_http.default.request(`${BASE_URL}/api/resume/parse`, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode || 500, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode || 500, body: data });
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
async function runSmokeTests() {
  console.log(`\u{1F525} Running API Smoke Tests against ${BASE_URL}...
`);
  let passed = 0;
  for (const item of endpoints) {
    try {
      const res = await fetchEndpoint(item.path);
      if (item.path === "/api/health") {
        if (res.status === 200 || res.status === 503) {
          console.log(`\u2705 [${res.status}] GET /api/health -> ${JSON.stringify(res.body.data)}`);
          passed++;
        } else {
          console.error(`\u274C [${res.status}] GET /api/health failed`);
        }
      } else {
        if (res.status === 200 && res.body.success) {
          console.log(`\u2705 [${res.status}] GET ${item.path} -> Data returned`);
          passed++;
        } else if (res.status === 503 && res.body.error?.code === "DATABASE_UNAVAILABLE") {
          console.log(`\u{1F6E1}\uFE0F  [503 Graceful Degraded] GET ${item.path} -> DATABASE_UNAVAILABLE JSON response`);
          passed++;
        } else {
          console.error(`\u274C [${res.status}] GET ${item.path} - Error:`, JSON.stringify(res.body));
        }
      }
    } catch (err) {
      console.error(`\u{1F4A5} [FAIL] GET ${item.path} - Connection error:`, err.message);
    }
  }
  try {
    const jdRes = await postJson("/api/jobs/parse-jd", {
      text: "Senior Full Stack Engineer with 5+ years experience in React, TypeScript, Node.js, and Docker in Bangalore"
    });
    if (jdRes.status === 200 && jdRes.body.success) {
      console.log(`\u2705 [200] POST /api/jobs/parse-jd -> Extracted skills:`, jdRes.body.data.skills.map((s) => s.name).join(", "));
      passed++;
    } else {
      console.error(`\u274C [${jdRes.status}] POST /api/jobs/parse-jd failed:`, JSON.stringify(jdRes.body));
    }
  } catch (err) {
    console.error(`\u{1F4A5} [FAIL] POST /api/jobs/parse-jd:`, err.message);
  }
  try {
    const resumeRes = await postResumeParse();
    if (resumeRes.status === 200 && resumeRes.body.success) {
      console.log(`\u2705 [200] POST /api/resume/parse -> Detected skills:`, resumeRes.body.data.detectedSkills?.map((s) => s.name).join(", ") || "none");
      passed++;
    } else {
      console.error(`\u274C [${resumeRes.status}] POST /api/resume/parse failed:`, JSON.stringify(resumeRes.body));
    }
  } catch (err) {
    console.error(`\u{1F4A5} [FAIL] POST /api/resume/parse:`, err.message);
  }
  const total = endpoints.length + 2;
  console.log(`
================ SMOKE TEST RESULTS ================`);
  console.log(`Verified Endpoints: ${passed} / ${total}`);
  console.log(`====================================================
`);
  if (passed < total) {
    process.exit(1);
  }
}
runSmokeTests();
