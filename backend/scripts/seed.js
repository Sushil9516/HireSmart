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
var import_neo4j_driver = __toESM(require("neo4j-driver"));
var import_env = require("../src/config/env");
async function seed() {
  console.log("\u{1F331} Starting HireGraph Database Seeding...");
  console.log(`Connecting to CognoDB at: ${import_env.env.COGNODB_URI}`);
  const driver = import_neo4j_driver.default.driver(
    import_env.env.COGNODB_URI,
    import_neo4j_driver.default.auth.basic(import_env.env.COGNODB_USERNAME, import_env.env.COGNODB_PASSWORD)
  );
  const session = driver.session();
  try {
    let ping;
    try {
      ping = await session.run("RETURN 1 AS ping");
    } catch (pingErr) {
      console.error("\u274C CognoDB Session Run Error:", pingErr.message);
      throw pingErr;
    }
    const rawPing = ping.records[0]?.get("ping");
    const pingVal = typeof rawPing === "number" ? rawPing : rawPing && typeof rawPing.toNumber === "function" ? rawPing.toNumber() : 0;
    if (pingVal !== 1) {
      throw new Error(`Unexpected ping response: ${pingVal}`);
    }
    console.log("\u2705 Connected to CognoDB successfully.");
    if (import_env.env.SEED_RESET) {
      console.log("\u{1F9F9} SEED_RESET=true. Clearing existing data...");
      await session.run("MATCH (n) DETACH DELETE n");
      console.log("\u2705 Database cleared.");
    }
    const constraints = [
      "CREATE CONSTRAINT candidate_id_unique IF NOT EXISTS FOR (c:Candidate) REQUIRE c.id IS UNIQUE",
      "CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE",
      "CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE",
      "CREATE CONSTRAINT company_id_unique IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE",
      "CREATE CONSTRAINT job_id_unique IF NOT EXISTS FOR (j:Job) REQUIRE j.id IS UNIQUE",
      "CREATE CONSTRAINT location_id_unique IF NOT EXISTS FOR (l:Location) REQUIRE l.id IS UNIQUE"
    ];
    for (const c of constraints) {
      try {
        await session.run(c);
      } catch (err) {
        console.log(`\u26A0\uFE0F Constraint note (${c.split(" ")[2]}):`, err.message);
      }
    }
    const locations = [
      { id: "loc-1", name: "Bangalore", country: "India" },
      { id: "loc-2", name: "San Francisco", country: "USA" },
      { id: "loc-3", name: "Mumbai", country: "India" },
      { id: "loc-4", name: "Hyderabad", country: "India" },
      { id: "loc-5", name: "Remote", country: "Global" }
    ];
    await session.run(
      `UNWIND $rows AS row
       MERGE (l:Location {id: row.id})
       SET l.name = row.name, l.country = row.country`,
      { rows: locations }
    );
    const skills = [
      { id: "skill-1", name: "React", normalizedName: "react", category: "Frontend" },
      { id: "skill-2", name: "TypeScript", normalizedName: "typescript", category: "Frontend" },
      { id: "skill-3", name: "Node.js", normalizedName: "node.js", category: "Backend" },
      { id: "skill-4", name: "Python", normalizedName: "python", category: "Backend" },
      { id: "skill-5", name: "Docker", normalizedName: "docker", category: "DevOps" },
      { id: "skill-6", name: "PostgreSQL", normalizedName: "postgresql", category: "Database" },
      { id: "skill-7", name: "Neo4j", normalizedName: "neo4j", category: "Database" },
      { id: "skill-8", name: "CognoDB", normalizedName: "cognodb", category: "Database" },
      { id: "skill-9", name: "AWS", normalizedName: "aws", category: "Cloud" },
      { id: "skill-10", name: "Kubernetes", normalizedName: "kubernetes", category: "DevOps" },
      { id: "skill-11", name: "GraphQL", normalizedName: "graphql", category: "Backend" },
      { id: "skill-12", name: "Tailwind CSS", normalizedName: "tailwind css", category: "Frontend" },
      { id: "skill-13", name: "Next.js", normalizedName: "next.js", category: "Frontend" },
      { id: "skill-14", name: "Go", normalizedName: "go", category: "Backend" },
      { id: "skill-15", name: "Redis", normalizedName: "redis", category: "Database" },
      { id: "skill-16", name: "FastAPI", normalizedName: "fastapi", category: "Backend" },
      { id: "skill-17", name: "Java", normalizedName: "java", category: "Backend" },
      { id: "skill-18", name: "Spring Boot", normalizedName: "spring boot", category: "Backend" }
    ];
    await session.run(
      `UNWIND $rows AS row
       MERGE (s:Skill {id: row.id})
       SET s.name = row.name, s.normalizedName = row.normalizedName, s.category = row.category`,
      { rows: skills }
    );
    const candidates = [
      {
        id: "cand-1",
        name: "Sushil Kumar",
        email: "sushil.kumar@example.com",
        title: "Full Stack Graph Engineer",
        experienceYears: 5,
        location: "Bangalore",
        resumeText: "Full Stack Developer with 5 years experience in React, TypeScript, Node.js, PostgreSQL, and Neo4j graph databases.",
        createdAt: "2026-01-15T10:00:00Z"
      },
      {
        id: "cand-2",
        name: "Ananya Sharma",
        email: "ananya.s@example.com",
        title: "Backend & Cloud Engineer",
        experienceYears: 4,
        location: "Hyderabad",
        resumeText: "Backend Developer proficient in Python, FastAPI, Docker, AWS, PostgreSQL, and Redis.",
        createdAt: "2026-02-01T09:00:00Z"
      },
      {
        id: "cand-3",
        name: "Rohan Mehta",
        email: "rohan.m@example.com",
        title: "Frontend Specialist",
        experienceYears: 3,
        location: "Mumbai",
        resumeText: "Frontend Engineer focused on React, Next.js, TypeScript, Tailwind CSS, and GraphQL.",
        createdAt: "2026-02-05T14:30:00Z"
      },
      {
        id: "cand-4",
        name: "Priya Nair",
        email: "priya.nair@example.com",
        title: "DevOps & Systems Engineer",
        experienceYears: 6,
        location: "Bangalore",
        resumeText: "DevOps Engineer expert in Kubernetes, Docker, AWS, Go, and Infrastructure as Code.",
        createdAt: "2026-02-10T11:15:00Z"
      },
      {
        id: "cand-5",
        name: "Vikram Patel",
        email: "vikram.p@example.com",
        title: "Java Backend Developer",
        experienceYears: 7,
        location: "Remote",
        resumeText: "Senior Backend Engineer experienced in Java, Spring Boot, Microservices, and MySQL/PostgreSQL.",
        createdAt: "2026-02-11T16:00:00Z"
      }
    ];
    await session.run(
      `UNWIND $rows AS row
       MERGE (c:Candidate {id: row.id})
       SET c.name = row.name, c.email = row.email, c.title = row.title,
           c.experienceYears = row.experienceYears, c.location = row.location,
           c.resumeText = row.resumeText, c.createdAt = row.createdAt`,
      { rows: candidates }
    );
    const companies = [
      { id: "comp-1", name: "NovaTech Solutions", industry: "Enterprise Software", size: "500-1000", location: "Bangalore", logoUrl: "" },
      { id: "comp-2", name: "GraphDynamics", industry: "Graph AI & Database", size: "50-200", location: "San Francisco", logoUrl: "" },
      { id: "comp-3", name: "CloudScale Inc", industry: "Cloud Infrastructure", size: "1000+", location: "Hyderabad", logoUrl: "" },
      { id: "comp-4", name: "FinFlow Pay", industry: "Fintech", size: "200-500", location: "Mumbai", logoUrl: "" },
      { id: "comp-5", name: "DataPulse AI", industry: "Analytics & Data", size: "100-250", location: "Bangalore", logoUrl: "" },
      { id: "comp-6", name: "Apex Systems", industry: "IT Services", size: "5000+", location: "Remote", logoUrl: "" }
    ];
    await session.run(
      `UNWIND $rows AS row
       MERGE (co:Company {id: row.id})
       SET co.name = row.name, co.industry = row.industry, co.size = row.size,
           co.location = row.location, co.logoUrl = row.logoUrl`,
      { rows: companies }
    );
    const people = [
      { id: "person-1", name: "Rahul Verma", title: "Engineering Manager", email: "rahul.v@novatech.com", location: "Bangalore" },
      // Works at NovaTech
      { id: "person-2", name: "Sneha Rao", title: "Lead Architect", email: "sneha.r@graphdynamics.com", location: "San Francisco" },
      // Works at GraphDynamics
      { id: "person-3", name: "Amitabh Joshi", title: "Senior Staff Engineer", email: "amit.j@cloudscale.com", location: "Hyderabad" },
      // Works at CloudScale
      { id: "person-4", name: "Kavita Singh", title: "Principal Engineer", email: "kavita.s@finflow.com", location: "Mumbai" },
      // Works at FinFlow
      { id: "person-5", name: "Devendra Dave", title: "VP Engineering", email: "dev.d@datapulse.ai", location: "Bangalore" },
      // Works at DataPulse
      { id: "person-6", name: "Neha Gupta", title: "Senior Recruiter", email: "neha.g@apex.com", location: "Remote" },
      // Works at Apex
      { id: "person-7", name: "Tarun Saxena", title: "DevOps Specialist", email: "tarun.s@example.com", location: "Bangalore" },
      { id: "person-8", name: "Meera Iyer", title: "Frontend Lead", email: "meera.i@example.com", location: "Bangalore" },
      { id: "person-9", name: "Siddharth Roy", title: "Database Admin", email: "sidd.r@example.com", location: "Hyderabad" },
      { id: "person-10", name: "Pooja Bhatt", title: "Product Manager", email: "pooja.b@novatech.com", location: "Bangalore" },
      { id: "person-11", name: "Karan Shah", title: "Cloud Architect", email: "karan.s@cloudscale.com", location: "Hyderabad" },
      { id: "person-12", name: "Ritu Kapoor", title: "Full Stack Engineer", email: "ritu.k@graphdynamics.com", location: "San Francisco" },
      { id: "person-13", name: "Manish Pandey", title: "Security Engineer", email: "manish.p@finflow.com", location: "Mumbai" },
      { id: "person-14", name: "Deepak Chawla", title: "Tech Lead", email: "deepak.c@apex.com", location: "Remote" },
      { id: "person-15", name: "Swati Deshmukh", title: "Engineering Director", email: "swati.d@novatech.com", location: "Bangalore" }
    ];
    await session.run(
      `UNWIND $rows AS row
       MERGE (p:Person {id: row.id})
       SET p.name = row.name, p.title = row.title, p.email = row.email, p.location = row.location`,
      { rows: people }
    );
    const jobs = [
      {
        id: "job-1",
        title: "Senior Full Stack Engineer",
        description: "Build core application workflows using React, TypeScript, Node.js, PostgreSQL, Neo4j, and containerized Docker services.",
        experienceMin: 4,
        experienceMax: 8,
        location: "Bangalore",
        workMode: "hybrid",
        salaryMin: 28e5,
        salaryMax: 42e5,
        postedAt: "2026-02-01T10:00:00Z",
        status: "active"
      },
      {
        id: "job-2",
        title: "Graph Database Architect",
        description: "Design and optimize large-scale graph databases using Neo4j, CognoDB, Python, and Go.",
        experienceMin: 5,
        experienceMax: 10,
        location: "San Francisco",
        workMode: "remote",
        salaryMin: 14e4,
        salaryMax: 19e4,
        postedAt: "2026-02-03T11:00:00Z",
        status: "active"
      },
      {
        id: "job-3",
        title: "Enterprise Java Developer",
        description: "Maintain legacy banking microservices using Java, Spring Boot, and enterprise SQL databases.",
        experienceMin: 5,
        experienceMax: 8,
        location: "Remote",
        workMode: "remote",
        salaryMin: 2e6,
        salaryMax: 3e6,
        postedAt: "2026-02-05T09:00:00Z",
        status: "active"
      },
      {
        id: "job-4",
        title: "Cloud DevOps Specialist",
        description: "Automate deployment pipelines and manage Kubernetes clusters on AWS.",
        experienceMin: 3,
        experienceMax: 7,
        location: "Hyderabad",
        workMode: "onsite",
        salaryMin: 22e5,
        salaryMax: 35e5,
        postedAt: "2026-02-06T14:00:00Z",
        status: "active"
      },
      {
        id: "job-5",
        title: "Lead Frontend Architect",
        description: "Drive frontend platform engineering with React, Next.js, TypeScript, and Tailwind CSS.",
        experienceMin: 6,
        experienceMax: 12,
        location: "Mumbai",
        workMode: "hybrid",
        salaryMin: 35e5,
        salaryMax: 5e6,
        postedAt: "2026-02-07T12:00:00Z",
        status: "active"
      },
      {
        id: "job-6",
        title: "AI & Data Infrastructure Engineer",
        description: "Scale vector & graph indexing systems using Python, FastAPI, Redis, and CognoDB.",
        experienceMin: 4,
        experienceMax: 7,
        location: "Bangalore",
        workMode: "hybrid",
        salaryMin: 25e5,
        salaryMax: 38e5,
        postedAt: "2026-02-08T15:30:00Z",
        status: "active"
      },
      { id: "job-7", title: "Backend Systems Engineer", description: "High throughput Go services with Redis and PostgreSQL.", experienceMin: 3, experienceMax: 6, location: "Bangalore", workMode: "remote", salaryMin: 24e5, salaryMax: 36e5, postedAt: "2026-02-09T08:00:00Z", status: "active" },
      { id: "job-8", title: "Site Reliability Engineer", description: "Monitor and scale Kubernetes, AWS, Terraform, and Docker infra.", experienceMin: 4, experienceMax: 8, location: "Hyderabad", workMode: "onsite", salaryMin: 26e5, salaryMax: 4e6, postedAt: "2026-02-10T10:00:00Z", status: "active" },
      { id: "job-9", title: "Graph Application Developer", description: "Build interactive user applications over graph APIs using React & Neo4j.", experienceMin: 2, experienceMax: 5, location: "Bangalore", workMode: "hybrid", salaryMin: 18e5, salaryMax: 28e5, postedAt: "2026-02-10T14:00:00Z", status: "active" },
      { id: "job-10", title: "Fintech Backend Lead", description: "Secure payment APIs using Node.js, PostgreSQL, Redis, and GraphQL.", experienceMin: 6, experienceMax: 10, location: "Mumbai", workMode: "onsite", salaryMin: 32e5, salaryMax: 48e5, postedAt: "2026-02-11T11:00:00Z", status: "active" },
      { id: "job-11", title: "Junior Frontend Developer", description: "Build responsive components with React, HTML, CSS, and JavaScript.", experienceMin: 1, experienceMax: 3, location: "Remote", workMode: "remote", salaryMin: 1e6, salaryMax: 16e5, postedAt: "2026-02-11T13:00:00Z", status: "active" },
      { id: "job-12", title: "Staff Platform Engineer", description: "Architect multi-region cloud backends using AWS, Go, Kubernetes, and PostgreSQL.", experienceMin: 8, experienceMax: 15, location: "Bangalore", workMode: "hybrid", salaryMin: 5e6, salaryMax: 75e5, postedAt: "2026-02-12T09:00:00Z", status: "active" }
    ];
    await session.run(
      `UNWIND $rows AS row
       MERGE (j:Job {id: row.id})
       SET j.title = row.title, j.description = row.description,
           j.experienceMin = row.experienceMin, j.experienceMax = row.experienceMax,
           j.location = row.location, j.workMode = row.workMode,
           j.salaryMin = row.salaryMin, j.salaryMax = row.salaryMax,
           j.postedAt = row.postedAt, j.status = row.status`,
      { rows: jobs }
    );
    await session.run(`
      MATCH (c:Candidate {id: 'cand-1'}), (l:Location {id: 'loc-1'}) MERGE (c)-[:LOCATED_IN]->(l)
    `);
    await session.run(`
      MATCH (c:Candidate {id: 'cand-2'}), (l:Location {id: 'loc-4'}) MERGE (c)-[:LOCATED_IN]->(l)
    `);
    await session.run(`
      MATCH (c:Candidate {id: 'cand-3'}), (l:Location {id: 'loc-3'}) MERGE (c)-[:LOCATED_IN]->(l)
    `);
    await session.run(`
      MATCH (c:Candidate {id: 'cand-4'}), (l:Location {id: 'loc-1'}) MERGE (c)-[:LOCATED_IN]->(l)
    `);
    await session.run(`
      MATCH (c:Candidate {id: 'cand-5'}), (l:Location {id: 'loc-5'}) MERGE (c)-[:LOCATED_IN]->(l)
    `);
    const candidateSkills = [
      { cid: "cand-1", sids: ["skill-1", "skill-2", "skill-3", "skill-6", "skill-7", "skill-12"] },
      { cid: "cand-2", sids: ["skill-4", "skill-5", "skill-6", "skill-9", "skill-15", "skill-16"] },
      { cid: "cand-3", sids: ["skill-1", "skill-2", "skill-11", "skill-12", "skill-13"] },
      { cid: "cand-4", sids: ["skill-5", "skill-9", "skill-10", "skill-14"] },
      { cid: "cand-5", sids: ["skill-6", "skill-17", "skill-18"] }
    ];
    for (const cs of candidateSkills) {
      await session.run(
        `MATCH (c:Candidate {id: $cid})
         UNWIND $sids AS sid
         MATCH (s:Skill {id: sid})
         MERGE (c)-[:HAS_SKILL]->(s)`,
        { cid: cs.cid, sids: cs.sids }
      );
    }
    const personSkills = [
      { pid: "person-1", sids: ["skill-3", "skill-5", "skill-9", "skill-6"] },
      // Docker!
      { pid: "person-2", sids: ["skill-7", "skill-8", "skill-4", "skill-14"] },
      { pid: "person-3", sids: ["skill-9", "skill-10", "skill-5", "skill-14"] },
      { pid: "person-4", sids: ["skill-3", "skill-6", "skill-11", "skill-15"] },
      { pid: "person-5", sids: ["skill-4", "skill-8", "skill-16", "skill-15"] },
      { pid: "person-7", sids: ["skill-5", "skill-10", "skill-9"] },
      { pid: "person-8", sids: ["skill-1", "skill-2", "skill-13"] }
    ];
    for (const ps of personSkills) {
      await session.run(
        `MATCH (p:Person {id: $pid})
         UNWIND $sids AS sid
         MATCH (s:Skill {id: sid})
         MERGE (p)-[:HAS_SKILL]->(s)`,
        { pid: ps.pid, sids: ps.sids }
      );
    }
    const companyJobs = [
      { compId: "comp-1", jobIds: ["job-1", "job-6", "job-9"] },
      // NovaTech
      { compId: "comp-2", jobIds: ["job-2"] },
      // GraphDynamics
      { compId: "comp-6", jobIds: ["job-3", "job-11"] },
      // Apex
      { compId: "comp-3", jobIds: ["job-4", "job-8", "job-12"] },
      // CloudScale
      { compId: "comp-4", jobIds: ["job-5", "job-10"] },
      // FinFlow
      { compId: "comp-5", jobIds: ["job-7"] }
      // DataPulse
    ];
    for (const cj of companyJobs) {
      await session.run(
        `MATCH (co:Company {id: $compId})
         UNWIND $jobIds AS jid
         MATCH (j:Job {id: jid})
         MERGE (co)-[:OFFERS]->(j)`,
        { compId: cj.compId, jobIds: cj.jobIds }
      );
    }
    const worksAt = [
      { pid: "person-1", compId: "comp-1", role: "Engineering Manager" },
      // Rahul at NovaTech
      { pid: "person-10", compId: "comp-1", role: "Product Manager" },
      { pid: "person-15", compId: "comp-1", role: "Engineering Director" },
      { pid: "person-2", compId: "comp-2", role: "Lead Architect" },
      // Sneha at GraphDynamics
      { pid: "person-12", compId: "comp-2", role: "Full Stack Engineer" },
      { pid: "person-3", compId: "comp-3", role: "Senior Staff Engineer" },
      // Amitabh at CloudScale
      { pid: "person-11", compId: "comp-3", role: "Cloud Architect" },
      { pid: "person-4", compId: "comp-4", role: "Principal Engineer" },
      // Kavita at FinFlow
      { pid: "person-13", compId: "comp-4", role: "Security Engineer" },
      { pid: "person-5", compId: "comp-5", role: "VP Engineering" },
      // Devendra at DataPulse
      { pid: "person-6", compId: "comp-6", role: "Senior Recruiter" },
      // Neha at Apex
      { pid: "person-14", compId: "comp-6", role: "Tech Lead" }
    ];
    for (const wa of worksAt) {
      await session.run(
        `MATCH (p:Person {id: $pid}), (co:Company {id: $compId})
         MERGE (p)-[r:WORKS_AT]->(co)
         SET r.role = $role`,
        { pid: wa.pid, compId: wa.compId, role: wa.role }
      );
    }
    const jobRequires = [
      // Job 1 (NovaTech Senior Full Stack): React, TS, Node, Postgres, Neo4j, Docker (6 skills) -> Sushil has 5, missing Docker
      { jid: "job-1", sids: ["skill-1", "skill-2", "skill-3", "skill-6", "skill-7", "skill-5"] },
      // Job 2 (GraphDynamics Architect): Neo4j, CognoDB, Python, Go (4 skills) -> Sushil has 1 (Neo4j) = 25% MEDIUM/LOW
      { jid: "job-2", sids: ["skill-7", "skill-8", "skill-4", "skill-14"] },
      // Job 3 (Apex Java): Java, Spring Boot (2 skills) -> Sushil has 0 = 0% LOW
      { jid: "job-3", sids: ["skill-17", "skill-18"] },
      // Job 4: Cloud DevOps: AWS, Kubernetes, Docker, Go
      { jid: "job-4", sids: ["skill-9", "skill-10", "skill-5", "skill-14"] },
      // Job 5: Lead Frontend: React, Next.js, TypeScript, Tailwind CSS
      { jid: "job-5", sids: ["skill-1", "skill-13", "skill-2", "skill-12"] },
      // Job 6: AI Data Infra: Python, FastAPI, Redis, CognoDB
      { jid: "job-6", sids: ["skill-4", "skill-16", "skill-15", "skill-8"] },
      // Job 7: Go backend: Go, Redis, PostgreSQL
      { jid: "job-7", sids: ["skill-14", "skill-15", "skill-6"] },
      // Job 8: SRE: Kubernetes, AWS, Docker
      { jid: "job-8", sids: ["skill-10", "skill-9", "skill-5"] },
      // Job 9: Graph App Dev: React, Neo4j, TypeScript
      { jid: "job-9", sids: ["skill-1", "skill-7", "skill-2"] },
      // Job 10: Fintech Lead: Node.js, PostgreSQL, Redis, GraphQL
      { jid: "job-10", sids: ["skill-3", "skill-6", "skill-15", "skill-11"] },
      // Job 11: Junior Frontend: React, JavaScript
      { jid: "job-11", sids: ["skill-1", "skill-2"] },
      // Job 12: Staff Platform: AWS, Go, Kubernetes, PostgreSQL
      { jid: "job-12", sids: ["skill-9", "skill-14", "skill-10", "skill-6"] }
    ];
    for (const jr of jobRequires) {
      await session.run(
        `MATCH (j:Job {id: $jid})
         UNWIND $sids AS sid
         MATCH (s:Skill {id: sid})
         MERGE (j)-[:REQUIRES {importance: 'required'}]->(s)`,
        { jid: jr.jid, sids: jr.sids }
      );
    }
    const jobPrefers = [
      { jid: "job-1", sids: ["skill-13", "skill-12"] },
      // Next.js, Tailwind
      { jid: "job-2", sids: ["skill-5", "skill-9"] },
      // Docker, AWS
      { jid: "job-3", sids: ["skill-6", "skill-15"] }
      // Postgres, Redis
    ];
    for (const jp of jobPrefers) {
      await session.run(
        `MATCH (j:Job {id: $jid})
         UNWIND $sids AS sid
         MATCH (s:Skill {id: sid})
         MERGE (j)-[:PREFERS {importance: 'preferred'}]->(s)`,
        { jid: jp.jid, sids: jp.sids }
      );
    }
    const candidateConnections = [
      { cid: "cand-1", pid: "person-1", since: 2023 },
      // Rahul (at NovaTech)
      { cid: "cand-1", pid: "person-7", since: 2024 },
      // Tarun
      { cid: "cand-1", pid: "person-8", since: 2022 },
      // Meera
      { cid: "cand-2", pid: "person-3", since: 2021 },
      // Ananya -> Amitabh
      { cid: "cand-3", pid: "person-8", since: 2023 },
      // Rohan -> Meera
      { cid: "cand-4", pid: "person-7", since: 2022 }
      // Priya -> Tarun
    ];
    for (const cc of candidateConnections) {
      await session.run(
        `MATCH (c:Candidate {id: $cid}), (p:Person {id: $pid})
         MERGE (c)-[r:CONNECTED_TO]->(p)
         SET r.since = $since`,
        { cid: cc.cid, pid: cc.pid, since: cc.since }
      );
    }
    const personConnections = [
      { p1: "person-1", p2: "person-2", since: 2022 },
      // Rahul -> Sneha
      { p1: "person-1", p2: "person-3", since: 2021 },
      // Rahul -> Amitabh
      { p1: "person-1", p2: "person-4", since: 2023 },
      // Rahul -> Kavita
      { p1: "person-1", p2: "person-10", since: 2020 },
      // Rahul -> Pooja
      { p1: "person-2", p2: "person-6", since: 2020 },
      // Sneha -> Neha (3-hop connection!)
      { p1: "person-2", p2: "person-12", since: 2023 },
      { p1: "person-3", p2: "person-11", since: 2022 },
      { p1: "person-4", p2: "person-13", since: 2021 },
      { p1: "person-5", p2: "person-1", since: 2019 },
      { p1: "person-7", p2: "person-9", since: 2022 },
      { p1: "person-8", p2: "person-10", since: 2023 },
      { p1: "person-9", p2: "person-3", since: 2021 },
      { p1: "person-10", p2: "person-15", since: 2024 }
    ];
    for (const pc of personConnections) {
      await session.run(
        `MATCH (p1:Person {id: $p1}), (p2:Person {id: $p2})
         MERGE (p1)-[r:CONNECTED_TO]->(p2)
         SET r.since = $since`,
        { p1: pc.p1, p2: pc.p2, since: pc.since }
      );
    }
    await session.run(`MATCH (co:Company {id: 'comp-1'}), (l:Location {id: 'loc-1'}) MERGE (co)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (co:Company {id: 'comp-2'}), (l:Location {id: 'loc-2'}) MERGE (co)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (co:Company {id: 'comp-3'}), (l:Location {id: 'loc-4'}) MERGE (co)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (co:Company {id: 'comp-4'}), (l:Location {id: 'loc-3'}) MERGE (co)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (co:Company {id: 'comp-5'}), (l:Location {id: 'loc-1'}) MERGE (co)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (co:Company {id: 'comp-6'}), (l:Location {id: 'loc-5'}) MERGE (co)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (j:Job {id: 'job-1'}), (l:Location {id: 'loc-1'}) MERGE (j)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (j:Job {id: 'job-2'}), (l:Location {id: 'loc-2'}) MERGE (j)-[:LOCATED_IN]->(l)`);
    await session.run(`MATCH (j:Job {id: 'job-3'}), (l:Location {id: 'loc-5'}) MERGE (j)-[:LOCATED_IN]->(l)`);
    const skillRelations = [
      { s1: "skill-1", s2: "skill-2" },
      // React -> TypeScript
      { s1: "skill-1", s2: "skill-13" },
      // React -> Next.js
      { s1: "skill-1", s2: "skill-12" },
      // React -> Tailwind
      { s1: "skill-3", s2: "skill-2" },
      // Node.js -> TypeScript
      { s1: "skill-7", s2: "skill-8" },
      // Neo4j -> CognoDB
      { s1: "skill-5", s2: "skill-10" },
      // Docker -> Kubernetes
      { s1: "skill-9", s2: "skill-10" },
      // AWS -> Kubernetes
      { s1: "skill-4", s2: "skill-16" }
      // Python -> FastAPI
    ];
    for (const sr of skillRelations) {
      await session.run(
        `MATCH (s1:Skill {id: $s1}), (s2:Skill {id: $s2})
         MERGE (s1)-[:RELATED_TO]->(s2)`,
        { s1: sr.s1, s2: sr.s2 }
      );
    }
    await session.run(`MATCH (c:Candidate {id: 'cand-1'}), (j:Job {id: 'job-9'}) MERGE (c)-[:APPLIED_TO]->(j)`);
    console.log("\n================ SEED SUMMARY ================");
    const counts = await session.run(`
      MATCH (c:Candidate) WITH count(c) AS candidates
      MATCH (p:Person) WITH candidates, count(p) AS people
      MATCH (co:Company) WITH candidates, people, count(co) AS companies
      MATCH (j:Job) WITH candidates, people, companies, count(j) AS jobs
      MATCH (s:Skill) WITH candidates, people, companies, jobs, count(s) AS skills
      MATCH (l:Location) WITH candidates, people, companies, jobs, skills, count(l) AS locations
      MATCH ()-[r]->() WITH candidates, people, companies, jobs, skills, locations, count(r) AS rels
      RETURN candidates, people, companies, jobs, skills, locations, rels
    `);
    const r = counts.records[0];
    console.log(`Candidates:    ${r.get("candidates")}`);
    console.log(`People:        ${r.get("people")}`);
    console.log(`Companies:     ${r.get("companies")}`);
    console.log(`Jobs:          ${r.get("jobs")}`);
    console.log(`Skills:        ${r.get("skills")}`);
    console.log(`Locations:     ${r.get("locations")}`);
    console.log(`Relationships: ${r.get("rels")}`);
    console.log("==============================================\n");
    console.log("\u{1F389} Seed completed successfully!");
  } catch (err) {
    console.error("\u274C Seeding failed with error:");
    console.error(err);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}
seed();
