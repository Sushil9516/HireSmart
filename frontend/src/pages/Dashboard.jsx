import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { DbErrorState, SkeletonCard, EmptyState } from '../components/States';
import { MatchRing } from '../components/ui/MatchRing';
import { StatMark } from '../components/ui/StatMark';

export const Dashboard = ({
  candidateId,
  isDbDown,
  onRefreshHealth,
}) => {
  const [candidate, setCandidate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [networkInfo, setNetworkInfo] = useState({ directCount: 0, reachableCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isDbDown) return;
    setLoading(true);
    setError(null);

    Promise.all([
      api.getCandidate(candidateId),
      api.getJobMatches(candidateId),
      api.getOpportunities(candidateId),
      api.getNetwork(candidateId),
    ])
      .then(([cand, jobMatches, opps, net]) => {
        setCandidate(cand);
        setMatches(jobMatches);
        setOpportunities(opps);
        setNetworkInfo({
          directCount: net.direct.length,
          reachableCount: net.reachableCompanies.length,
        });
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === 'DATABASE_UNAVAILABLE') {
          onRefreshHealth();
        } else {
          setError(err.message || 'Failed to load dashboard data');
        }
      })
      .finally(() => setLoading(false));
  }, [candidateId, isDbDown]);

  if (isDbDown) {
    return <DbErrorState onRetry={onRefreshHealth} />;
  }

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <div className="h-16 bg-surface border border-line animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-surface border border-line animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <EmptyState title="Error Loading Dashboard" description={error} />
      </div>
    );
  }

  const highMatches = matches.filter((m) => m.tier === 'HIGH');
  const medMatches = matches.filter((m) => m.tier === 'MEDIUM');

  return (
    <div className="page-shell space-y-5">
      {/* Profile header — flat, typographic */}
      <div className="panel p-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">
            {candidate?.location} · demo profile
          </p>
          <h1 className="font-display text-2xl font-semibold text-neutral-50 tracking-tight">
            {candidate?.name}
          </h1>
          <p className="text-xs text-muted mt-0.5">
            {candidate?.title} · {candidate?.experienceYears} yrs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/network" className="btn-ghost">
            Network ({networkInfo.directCount})
          </Link>
          <Link to="/graph" className="btn-primary">
            Open graph
          </Link>
        </div>
      </div>

      {/* Stats — typography + minimal marks, no icon cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
        <div className="bg-surface p-3">
          <div className="flex items-start justify-between mb-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted">High match</p>
            <StatMark variant="high" />
          </div>
          <p className="font-display text-2xl font-semibold tabular-nums text-neutral-100">{highMatches.length}</p>
          <p className="text-[10px] text-muted mt-0.5">≥70% skill overlap</p>
        </div>

        <div className="bg-surface p-3">
          <div className="flex items-start justify-between mb-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Medium</p>
            <StatMark variant="medium" />
          </div>
          <p className="font-display text-2xl font-semibold tabular-nums text-neutral-100">{medMatches.length}</p>
          <p className="text-[10px] text-muted mt-0.5">40–69% overlap</p>
        </div>

        <div className="bg-surface p-3">
          <div className="flex items-start justify-between mb-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Reach</p>
            <StatMark variant="reach" />
          </div>
          <p className="font-display text-2xl font-semibold tabular-nums text-neutral-100">{networkInfo.reachableCount}</p>
          <p className="text-[10px] text-muted mt-0.5">companies via network</p>
        </div>

        <div className="bg-surface p-3">
          <div className="flex items-start justify-between mb-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Paths</p>
            <StatMark variant="paths" />
          </div>
          <p className="font-display text-2xl font-semibold tabular-nums text-neutral-100">{opportunities.length}</p>
          <p className="text-[10px] text-muted mt-0.5">multi-hop openings</p>
        </div>
      </div>

      {/* Network opportunities */}
      <div className="space-y-2">
        <div>
          <h2 className="section-title">Network opportunities</h2>
          <p className="section-meta">
            Jobs at companies where your connections work — multi-hop Cypher traversal.
          </p>
        </div>

        {opportunities.length === 0 ? (
          <EmptyState
            title="No network paths found yet"
            description="Add more connections to discover referral paths to companies offering active roles."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {opportunities.map((opp) => (
              <div
                key={opp.jobId}
                className="panel p-3 flex flex-col justify-between hover:bg-surface-raised transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-muted uppercase tracking-wide truncate">
                        {opp.companyName}
                      </p>
                      <h3 className="font-display text-sm font-semibold text-neutral-100 mt-0.5 leading-snug">
                        {opp.jobTitle}
                      </h3>
                    </div>
                    <MatchRing percentage={opp.matchPercentage} size={24} />
                  </div>

                  <p className="text-[11px] text-muted mb-3 leading-relaxed border-l border-line pl-2">
                    <span className="text-neutral-400">{opp.connectorName}</span>
                    <span className="text-muted"> · {opp.connectorTitle} @ {opp.companyName}</span>
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                    {opp.matchedSkills.map((s) => (
                      <span key={s.id} className="skill-tag skill-tag-match">
                        {s.name}
                      </span>
                    ))}
                    {opp.requiredSkills
                      .filter((req) => !opp.matchedSkills.some((m) => m.id === req.id))
                      .map((s) => (
                        <span key={s.id} className="skill-tag skill-tag-gap">
                          {s.name}
                        </span>
                      ))}
                  </div>
                </div>

                <Link
                  to={`/jobs/${opp.jobId}?candidateId=${candidateId}`}
                  className="btn-ghost w-full mt-1 text-center"
                >
                  View match →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All job matches — dense table */}
      <div className="space-y-2">
        <h2 className="section-title">All openings ({matches.length})</h2>

        <div className="panel divide-y divide-line">
          {matches.map((job) => (
            <div
              key={job.jobId}
              className="px-3 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-raised transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-display text-sm font-medium text-neutral-100">{job.jobTitle}</h4>
                  <MatchRing percentage={job.matchPercentage} size={20} />
                  <span className="font-mono text-[10px] text-muted uppercase">{job.tier}</span>
                </div>
                <p className="text-[11px] text-muted mt-0.5 font-mono">
                  {job.companyName || '—'} · {job.locationName || 'Remote'} · {job.workMode}
                </p>
              </div>

              <Link
                to={`/jobs/${job.jobId}?candidateId=${candidateId}`}
                className="btn-ghost shrink-0 self-start sm:self-center"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
