import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  Sparkles,
  GitFork,
  ArrowLeft,
  DollarSign,
  Clock,
  Layers,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { api, ApiError } from '../api/client';
import { DbErrorState, SkeletonCard, EmptyState } from '../components/States';

export const JobDetails = ({ isDbDown, onRefreshHealth }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const candidateId = searchParams.get('candidateId') || 'cand-1';

  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || isDbDown) return;
    setLoading(true);
    setError(null);

    Promise.all([
      api.getJobMatch(candidateId, id),
      api.getJobGraph(id),
    ])
      .then(([matchData]) => {
        setMatch(matchData);
        if (matchData.companyId) {
          api.getOpportunityPath(candidateId, matchData.companyId)
            .then(setPath)
            .catch(() => setPath(null));
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === 'DATABASE_UNAVAILABLE') {
          onRefreshHealth();
        } else {
          setError(err.message || 'Failed to load job details');
        }
      })
      .finally(() => setLoading(false));
  }, [id, candidateId, isDbDown]);

  if (isDbDown) return <DbErrorState onRetry={onRefreshHealth} />;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EmptyState title="Job details unavailable" description={error || 'Job not found'} />
      </div>
    );
  }

  const matchColor =
    match.tier === 'HIGH'
      ? 'from-emerald-500 to-teal-500 text-emerald-400'
      : match.tier === 'MEDIUM'
      ? 'from-amber-500 to-yellow-500 text-amber-400'
      : 'from-rose-500 to-red-500 text-rose-400';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Main Header & Match Gauge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-3 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>{match.companyName || 'Target Organization'}</span>
              <span>•</span>
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{match.locationName || 'Remote'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">{match.jobTitle}</h1>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span className="capitalize">{match.workMode || 'Full-time'}</span>
              </span>
              {match.salaryMin && match.salaryMax && (
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>₹{(match.salaryMin / 100000).toFixed(1)}L - ₹{(match.salaryMax / 100000).toFixed(1)}L PA</span>
                </span>
              )}
            </div>
          </div>

          {/* Visual Match Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[240px] text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
              Graph Match Meter
            </span>

            {/* Gauge Circle */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={match.tier === 'HIGH' ? 'text-emerald-500' : match.tier === 'MEDIUM' ? 'text-amber-500' : 'text-rose-500'}
                  strokeDasharray={`${match.matchPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{match.matchPercentage}%</span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">{match.tier}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              {match.totalMatched} of {match.totalRequired} required skills matched
            </p>
          </div>
        </div>
      </div>

      {/* Network Path Reachability Section */}
      {path && path.pathNodes.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-sm">
            <GitFork className="w-4 h-4 text-indigo-400" />
            <span>Network Referral Path Found ({path.hops} Hop Traversal)</span>
          </div>

          {/* Visual Path Chain */}
          <div className="flex items-center flex-wrap gap-2 pt-2">
            {path.pathNodes.map((node, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>{node.name}</span>
                  {node.title && <span className="text-slate-400 font-normal">({node.title})</span>}
                </div>
                {i < path.pathNodes.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            💡 You have a direct or warm connection path leading to this company. Connect with{' '}
            <strong className="text-indigo-300">{path.pathNodes[1]?.name}</strong> for a warm intro or referral.
          </p>
        </div>
      )}

      {/* "Why this job?" Graph Explanation Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Why This Match? (Graph Query Insights)
        </h3>

        <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
          <p>
            Your candidate graph shares <strong>{match.totalMatched} required skills</strong> with this job node:{' '}
            <span className="text-emerald-400 font-medium">
              {match.matchedSkills.map((s) => s.name).join(', ')}
            </span>.
          </p>

          {match.missingSkills.length > 0 ? (
            <p>
              The primary skill gap identified by the graph query is:{' '}
              <span className="text-rose-400 font-medium">
                {match.missingSkills.map((s) => s.name).join(', ')}
              </span>.
            </p>
          ) : (
            <p className="text-emerald-400 font-medium">
              You possess 100% of the required skills for this position!
            </p>
          )}

          {path && (
            <p className="text-indigo-300">
              Traversing <code>(:Candidate)-[:CONNECTED_TO*1..3]-&gt;(:Person)-[:WORKS_AT]-&gt;(:Company)</code> confirms an explicit graph path to {match.companyName}.
            </p>
          )}
        </div>
      </div>

      {/* Skills Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Matched Skills ({match.matchedSkills.length})</span>
          </h3>

          <div className="space-y-2">
            {match.matchedSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs"
              >
                <span className="font-semibold text-emerald-300">{skill.name}</span>
                <span className="text-emerald-500/80 font-mono text-[10px] uppercase">{skill.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span>Skill Gaps to Bridge ({match.missingSkills.length})</span>
          </h3>

          {match.missingSkills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No missing required skills!</p>
          ) : (
            <div className="space-y-2">
              {match.missingSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs"
                >
                  <span className="font-semibold text-rose-300">{skill.name}</span>
                  <span className="text-rose-400/80 font-mono text-[10px] uppercase">{skill.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA to Graph Explorer */}
      <div className="flex justify-end pt-4">
        <Link
          to={`/graph?jobId=${match.jobId}`}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/20 transition-all"
        >
          <GitFork className="w-4 h-4" />
          <span>Explore Subgraph for {match.jobTitle}</span>
        </Link>
      </div>
    </div>
  );
};
