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
var skills_dictionary_exports = {};
__export(skills_dictionary_exports, {
  EXPERIENCE_PATTERNS: () => EXPERIENCE_PATTERNS,
  SKILLS_CATEGORIES: () => SKILLS_CATEGORIES,
  SKILLS_NORMALIZATION_MAP: () => SKILLS_NORMALIZATION_MAP,
  WORK_MODE_PATTERNS: () => WORK_MODE_PATTERNS,
  extractExperience: () => extractExperience,
  extractSkillsFromText: () => extractSkillsFromText,
  extractWorkMode: () => extractWorkMode,
  getSkillCategory: () => getSkillCategory,
  normalizeSkill: () => normalizeSkill
});
module.exports = __toCommonJS(skills_dictionary_exports);
const SKILLS_NORMALIZATION_MAP = {
  // JavaScript ecosystem
  "javascript": "JavaScript",
  "js": "JavaScript",
  "es6": "JavaScript",
  "es2015": "JavaScript",
  "ecmascript": "JavaScript",
  "typescript": "TypeScript",
  "ts": "TypeScript",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "node js": "Node.js",
  "react": "React",
  "reactjs": "React",
  "react.js": "React",
  "react js": "React",
  "next": "Next.js",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "vue": "Vue.js",
  "vuejs": "Vue.js",
  "vue.js": "Vue.js",
  "angular": "Angular",
  "angularjs": "Angular",
  // Python
  "python": "Python",
  "python3": "Python",
  "django": "Django",
  "flask": "Flask",
  "fastapi": "FastAPI",
  "fast api": "FastAPI",
  // JVM
  "java": "Java",
  "spring": "Spring Boot",
  "spring boot": "Spring Boot",
  "springboot": "Spring Boot",
  "kotlin": "Kotlin",
  "scala": "Scala",
  // Go / Rust
  "golang": "Go",
  "go": "Go",
  "rust": "Rust",
  // Databases
  "postgresql": "PostgreSQL",
  "postgres": "PostgreSQL",
  "mysql": "MySQL",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "redis": "Redis",
  "elasticsearch": "Elasticsearch",
  "elastic search": "Elasticsearch",
  "neo4j": "Neo4j",
  "cognodb": "CognoDB",
  // Cloud & DevOps
  "aws": "AWS",
  "amazon web services": "AWS",
  "gcp": "GCP",
  "google cloud": "GCP",
  "azure": "Azure",
  "microsoft azure": "Azure",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "terraform": "Terraform",
  "ansible": "Ansible",
  "jenkins": "Jenkins",
  "ci/cd": "CI/CD",
  "cicd": "CI/CD",
  // Data
  "machine learning": "Machine Learning",
  "ml": "Machine Learning",
  "deep learning": "Deep Learning",
  "pytorch": "PyTorch",
  "tensorflow": "TensorFlow",
  "tf": "TensorFlow",
  "pandas": "Pandas",
  "numpy": "NumPy",
  "spark": "Apache Spark",
  "apache spark": "Apache Spark",
  // Other
  "graphql": "GraphQL",
  "rest": "REST API",
  "rest api": "REST API",
  "restful": "REST API",
  "grpc": "gRPC",
  "kafka": "Apache Kafka",
  "apache kafka": "Apache Kafka",
  "git": "Git",
  "linux": "Linux",
  "bash": "Bash",
  "shell": "Bash",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "css": "CSS",
  "html": "HTML",
  "sql": "SQL",
  "nosql": "NoSQL"
};
const SKILLS_CATEGORIES = {
  "JavaScript": "Frontend",
  "TypeScript": "Frontend",
  "React": "Frontend",
  "Next.js": "Frontend",
  "Vue.js": "Frontend",
  "Angular": "Frontend",
  "Tailwind CSS": "Frontend",
  "CSS": "Frontend",
  "HTML": "Frontend",
  "Node.js": "Backend",
  "Python": "Backend",
  "Django": "Backend",
  "Flask": "Backend",
  "FastAPI": "Backend",
  "Java": "Backend",
  "Spring Boot": "Backend",
  "Kotlin": "Backend",
  "Scala": "Backend",
  "Go": "Backend",
  "Rust": "Backend",
  "GraphQL": "Backend",
  "REST API": "Backend",
  "gRPC": "Backend",
  "PostgreSQL": "Database",
  "MySQL": "Database",
  "MongoDB": "Database",
  "Redis": "Database",
  "Elasticsearch": "Database",
  "Neo4j": "Database",
  "CognoDB": "Database",
  "SQL": "Database",
  "NoSQL": "Database",
  "AWS": "Cloud",
  "GCP": "Cloud",
  "Azure": "Cloud",
  "Docker": "DevOps",
  "Kubernetes": "DevOps",
  "Terraform": "DevOps",
  "Ansible": "DevOps",
  "Jenkins": "DevOps",
  "CI/CD": "DevOps",
  "Git": "DevOps",
  "Linux": "DevOps",
  "Bash": "DevOps",
  "Machine Learning": "Data Science",
  "Deep Learning": "Data Science",
  "PyTorch": "Data Science",
  "TensorFlow": "Data Science",
  "Pandas": "Data Science",
  "NumPy": "Data Science",
  "Apache Spark": "Data Science",
  "Apache Kafka": "Infrastructure"
};
function normalizeSkill(raw) {
  const key = raw.toLowerCase().trim().replace(/[^a-z0-9./\s]/g, "");
  return SKILLS_NORMALIZATION_MAP[key] ?? null;
}
function extractSkillsFromText(text) {
  const normalized = text.toLowerCase();
  const found = /* @__PURE__ */ new Set();
  const entries = Object.entries(SKILLS_NORMALIZATION_MAP).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [variant, canonical] of entries) {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalized)) {
      found.add(canonical);
    }
  }
  return Array.from(found).sort();
}
function getSkillCategory(canonicalName) {
  return SKILLS_CATEGORIES[canonicalName] ?? "Other";
}
const EXPERIENCE_PATTERNS = [
  /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
  /(\d+)-(\d+)\s*years?\s+(?:of\s+)?experience/i,
  /experience\s+of\s+(\d+)\+?\s*years?/i,
  /minimum\s+(\d+)\s*years?/i
];
const WORK_MODE_PATTERNS = {
  remote: ["remote", "work from home", "wfh", "fully remote"],
  hybrid: ["hybrid", "partially remote", "flexible"],
  onsite: ["onsite", "on-site", "in-office", "office only", "on site"]
};
function extractWorkMode(text) {
  const lower = text.toLowerCase();
  for (const [mode, keywords] of Object.entries(WORK_MODE_PATTERNS)) {
    if (keywords.some((kw) => lower.includes(kw))) return mode;
  }
  return "onsite";
}
function extractExperience(text) {
  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const min = parseInt(match[1], 10);
      const max = match[2] ? parseInt(match[2], 10) : min + 2;
      return { min, max };
    }
  }
  return { min: 0, max: 0 };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EXPERIENCE_PATTERNS,
  SKILLS_CATEGORIES,
  SKILLS_NORMALIZATION_MAP,
  WORK_MODE_PATTERNS,
  extractExperience,
  extractSkillsFromText,
  extractWorkMode,
  getSkillCategory,
  normalizeSkill
});
