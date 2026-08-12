import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../api/client';
import { DbErrorState, SkeletonCard, EmptyState } from '../components/States';

export const NetworkPage = ({
  candidateId,
  isDbDown,
  onRefreshHealth,
}) => {
  const [direct, setDirect] = useState([]);
  const [reachableCompanies, setReachableCompanies] = useState([]);
  const [secondDegree, setSecondDegree] = useState([]);
  const [networkSkills, setNetworkSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState(null);

  useEffect(() => {
    if (isDbDown) return;
    setLoading(true);
    setError(null);

    Promise.all([
      api.getNetwork(candidateId),
      api.getSecondDegree(candidateId),
      api.getNetworkSkills(candidateId),
    ])
      .then(([net, secDeg, netSkills]) => {
        setDirect(net.direct);
        setReachableCompanies(net.reachableCompanies ?? []);
        setSecondDegree(secDeg);
        setNetworkSkills(netSkills);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === 'DATABASE_UNAVAILABLE') {
          onRefreshHealth();
        } else {
          setError(err.message || 'Failed to load network data');
        }
      })
      .finally(() => setLoading(false));
  }, [candidateId, isDbDown]);

  if (isDbDown) return <DbErrorState onRetry={onRefreshHealth} />;

  if (loading) {
    return (
      <div className="page-shell space-y-3">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <EmptyState title="Network Error" description={error} />
      </div>
    );
  }

  const filteredNetworkSkills = selectedSkillFilter
    ? networkSkills.filter((s) => s.skillName === selectedSkillFilter)
    : networkSkills;

  return (
    <div className="page-shell space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-neutral-50 tracking-tight">
          Network
        </h1>
        <p className="section-meta mt-1">
          1st & 2nd degree connections, referral pathways, and skill discovery.
        </p>
      </div>

      {/* Network skill discovery */}
      <section className="space-y-3">
        <div className="border-b border-line pb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-0.5">
            cypher 6.6 · network skill discovery
          </p>
          <h2 className="section-title">Skills your network has — you don't</h2>
        </div>

        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedSkillFilter(null)}
            className={`px-2 py-1 text-[11px] font-mono transition-colors ${
              selectedSkillFilter === null
                ? 'text-neutral-100 border-b border-accent'
                : 'text-muted hover:text-neutral-300'
            }`}
          >
            all ({networkSkills.length})
          </button>
          {networkSkills.map((s) => (
            <button
              key={s.skillId}
              onClick={() => setSelectedSkillFilter(s.skillName)}
              className={`px-2 py-1 text-[11px] font-mono transition-colors ${
                selectedSkillFilter === s.skillName
                  ? 'text-neutral-100 border-b border-accent'
                  : 'text-muted hover:text-neutral-300'
              }`}
            >
              {s.skillName} ({s.holders.length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredNetworkSkills.map((skill) => (
            <div key={skill.skillId} className="panel p-3 space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm font-medium text-neutral-100">{skill.skillName}</span>
                <span className="text-[10px] font-mono text-muted">{skill.skillCategory}</span>
              </div>

              <div className="space-y-1 pt-1 border-t border-line">
                <span className="text-[10px] font-mono uppercase text-muted block">holders</span>
                {skill.holders.map((holder) => (
                  <div key={holder.id} className="flex items-baseline gap-2 text-xs py-0.5">
                    <span className="font-medium text-neutral-300 w-4 shrink-0 font-mono text-[10px]">
                      {holder.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <span className="text-neutral-200">{holder.name}</span>
                      <span className="text-muted ml-1.5 text-[11px]">{holder.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reachable companies */}
      <section className="space-y-2">
        <h2 className="section-title">Reachable companies ({reachableCompanies.length})</h2>
        <p className="section-meta">1–3 hop CONNECTED_TO → WORKS_AT traversals.</p>

        {reachableCompanies.length === 0 ? (
          <EmptyState
            title="No reachable companies yet"
            description="Add more connections to discover referral paths to companies offering active roles."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {reachableCompanies.map((company) => (
              <div key={company.companyId} className="panel p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-sm font-medium text-neutral-100">{company.companyName}</h3>
                  <span className="font-mono text-[10px] text-muted tabular-nums">
                    {company.minHops ?? '?'}h
                  </span>
                </div>
                <p className="text-[11px] text-muted mt-0.5">{company.companyIndustry || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Direct connections */}
      <section className="space-y-2">
        <h2 className="section-title">Direct connections ({direct.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {direct.map((person) => (
            <div key={person.id} className="panel p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-medium text-neutral-100">{person.name}</h3>
                  <p className="text-[11px] text-muted">{person.title}</p>
                </div>
                <span className="font-mono text-[10px] text-muted">1°</span>
              </div>

              <div className="text-[11px] text-muted font-mono pt-1 border-t border-line flex justify-between">
                <span>{person.companyName || 'Independent'}</span>
                <span>{person.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Second degree */}
      <section className="space-y-2">
        <div>
          <h2 className="section-title">2nd degree ({secondDegree.length})</h2>
          <p className="section-meta">Extended graph via your direct contacts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {secondDegree.map((person) => (
            <div key={person.id} className="panel p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-medium text-neutral-100">{person.name}</h3>
                  <p className="text-[11px] text-muted">{person.title}</p>
                </div>
                <span className="font-mono text-[10px] text-muted">2°</span>
              </div>

              <p className="text-[11px] text-muted border-l border-line pl-2">
                via {person.viaNames.join(', ')}
              </p>

              <div className="text-[11px] text-muted font-mono pt-1 border-t border-line flex justify-between">
                <span>{person.companyName || 'Independent'}</span>
                <span>{person.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
