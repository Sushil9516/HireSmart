const API_BASE = '/api';

export class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new ApiError(
      json.error?.code || 'UNKNOWN_ERROR',
      json.error?.message || 'An error occurred',
      res.status
    );
  }

  return json.data;
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Candidates
  getCandidates: () => request('/candidates'),
  getCandidate: (id) => request(`/candidates/${id}`),
  getCandidateSkills: (id) => request(`/candidates/${id}/skills`),

  // Matching
  getJobMatches: (candidateId) =>
    request(`/candidates/${candidateId}/jobs/matches`),
  getJobMatch: (candidateId, jobId) =>
    request(`/candidates/${candidateId}/jobs/${jobId}/match`),

  // Network
  getNetwork: (candidateId) =>
    request(`/candidates/${candidateId}/network`),
  getSecondDegree: (candidateId) =>
    request(`/candidates/${candidateId}/network/second-degree`),
  getNetworkSkills: (candidateId) =>
    request(`/candidates/${candidateId}/network/skills`),
  getOpportunities: (candidateId) =>
    request(`/candidates/${candidateId}/opportunities`),
  getOpportunityPath: (candidateId, companyId) =>
    request(`/candidates/${candidateId}/path/company/${companyId}`),

  // Graph
  getJobGraph: (jobId) => request(`/graph/job/${jobId}`),
  getCandidateGraph: (candidateId) =>
    request(`/graph/candidate/${candidateId}`),

  // Resume & JD Parsing
  parseJD: (text) =>
    request(
      '/jobs/parse-jd',
      { method: 'POST', body: JSON.stringify({ text }) }
    ),

  parseResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await fetch(`${API_BASE}/resume/parse`, { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new ApiError(json.error?.code || 'PARSER_ERROR', json.error?.message || 'Failed to parse resume', res.status);
    }
    return json.data;
  },
};
