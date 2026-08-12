import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api/client';

export const Navbar = ({
  currentCandidateId,
  onSelectCandidate,
  isDbDown,
}) => {
  const location = useLocation();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    if (!isDbDown) {
      api.getCandidates()
        .then(setCandidates)
        .catch(() => {});
    }
  }, [isDbDown]);

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/network', label: 'Network' },
    { path: '/graph', label: 'Graph Explorer' },
    { path: '/parser', label: 'Resume & JD' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 border-b border-line backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <div className="flex items-center justify-between h-11">
          <div className="flex items-center gap-8">
            <Link to="/" className="group shrink-0">
              <span className="font-display font-semibold text-base tracking-tight text-neutral-100 group-hover:text-white">
                HireGraph
              </span>
              <span className="block text-[10px] text-muted font-mono tracking-wide leading-none mt-0.5">
                cognodb / bolt
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`pb-3 pt-3 text-xs font-medium transition-colors ${
                      isActive ? 'nav-active' : 'nav-idle'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border ${
                isDbDown
                  ? 'border-neutral-600 text-neutral-400'
                  : 'border-line text-muted'
              }`}
            >
              {isDbDown ? 'db offline' : 'db connected'}
            </div>

            <div className="flex items-center gap-2 border border-line px-2 py-1 text-xs">
              <span className="text-muted hidden sm:inline font-mono text-[10px]">profile</span>
              <select
                value={currentCandidateId}
                onChange={(e) => onSelectCandidate(e.target.value)}
                disabled={isDbDown}
                className="bg-transparent font-medium text-neutral-200 text-xs focus:outline-none cursor-pointer disabled:opacity-40 max-w-[180px]"
              >
                {candidates.length > 0 ? (
                  candidates.map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface text-neutral-200">
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="cand-1" className="bg-surface text-neutral-200">
                    Sushil Kumar
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
