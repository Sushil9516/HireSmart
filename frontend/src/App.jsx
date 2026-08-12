import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { JobDetails } from './pages/JobDetails';
import { NetworkPage } from './pages/Network';
import { GraphExplorer } from './pages/GraphExplorer';
import { ParserPage } from './pages/Parser';
import { api } from './api/client';

export function App() {
  const [currentCandidateId, setCurrentCandidateId] = useState('cand-1');
  const [isDbDown, setIsDbDown] = useState(false);

  const checkHealth = () => {
    api.getHealth()
      .then((res) => {
        setIsDbDown(res.database !== 'connected');
      })
      .catch(() => {
        setIsDbDown(true);
      });
  };

  useEffect(() => {
    checkHealth();
    // Poll health status every 15s
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-canvas text-neutral-200 flex flex-col font-body">
        <Navbar
          currentCandidateId={currentCandidateId}
          onSelectCandidate={setCurrentCandidateId}
          isDbDown={isDbDown}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  candidateId={currentCandidateId}
                  isDbDown={isDbDown}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <JobDetails
                  isDbDown={isDbDown}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/network"
              element={
                <NetworkPage
                  candidateId={currentCandidateId}
                  isDbDown={isDbDown}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/graph"
              element={
                <GraphExplorer
                  candidateId={currentCandidateId}
                  isDbDown={isDbDown}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route path="/parser" element={<ParserPage />} />
          </Routes>
        </main>

        <footer className="border-t border-line py-3 text-[10px] text-muted font-mono">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>HireGraph · CognoDB graph engine</p>
            <p>openCypher · Bolt</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
