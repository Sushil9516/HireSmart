import { createRequire } from 'module';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import neo4j from 'neo4j-driver';

const require = createRequire(import.meta.url);
const { env } = require('../src/config/env');
const { getNetworkOpportunities } = require('../src/services/network.service');
const { initDriver, closeDriver, verifyConnectivity } = require('../src/config/cognodb');

const hasDbCredentials = Boolean(env.COGNODB_URI && env.COGNODB_PASSWORD);

describe.skipIf(!hasDbCredentials)('Multi-hop opportunity discovery (integration)', () => {
  beforeAll(async () => {
    initDriver(env.COGNODB_URI, env.COGNODB_USERNAME, env.COGNODB_PASSWORD);
    await verifyConnectivity();
  });

  afterAll(async () => {
    await closeDriver();
  });

  it('returns network opportunities for the primary demo candidate', async () => {
    const opportunities = await getNetworkOpportunities('cand-1');

    expect(Array.isArray(opportunities)).toBe(true);
    expect(opportunities.length).toBeGreaterThan(0);

    const novaTechJob = opportunities.find(
      (o) => o.companyName === 'NovaTech Solutions' && o.jobTitle === 'Senior Full Stack Engineer'
    );
    expect(novaTechJob).toBeDefined();
    expect(novaTechJob.connectorName).toBe('Rahul Verma');
    expect(novaTechJob.matchPercentage).toBeGreaterThanOrEqual(70);
  });

  it('uses parameterized Cypher against live CognoDB', async () => {
    const driver = neo4j.driver(
      env.COGNODB_URI,
      neo4j.auth.basic(env.COGNODB_USERNAME, env.COGNODB_PASSWORD)
    );
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (c:Candidate {id: $candidateId})-[:CONNECTED_TO]->(p:Person)-[:WORKS_AT]->(comp:Company)
         RETURN count(DISTINCT comp) AS companyCount`,
        { candidateId: 'cand-1' }
      );
      const count = result.records[0]?.get('companyCount');
      const companyCount =
        count && typeof count.toNumber === 'function' ? count.toNumber() : Number(count);
      expect(companyCount).toBeGreaterThan(0);
    } finally {
      await session.close();
      await driver.close();
    }
  });
});
