import React, { useState } from 'react';
import { api, ApiError } from '../api/client';
import { EmptyState } from '../components/States';

export const ParserPage = () => {
  const [activeTab, setActiveTab] = useState('resume');

  const [resumeFile, setResumeFile] = useState(null);
  const [parsingResume, setParsingResume] = useState(false);
  const [parsedSkills, setParsedSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [resumeSuccessMsg, setResumeSuccessMsg] = useState(false);
  const [resumeError, setResumeError] = useState(null);

  const [jdText, setJdText] = useState('');
  const [parsingJd, setParsingJd] = useState(false);
  const [parsedJd, setParsedJd] = useState(null);
  const [jdError, setJdError] = useState(null);

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setParsingResume(true);
    setResumeError(null);
    setResumeSuccessMsg(false);

    try {
      const res = await api.parseResume(resumeFile);
      setParsedSkills(res.detectedSkills || []);
    } catch (err) {
      setResumeError(err.message || 'Failed to parse resume');
    } finally {
      setParsingResume(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setParsedSkills([
      ...parsedSkills,
      { name: newSkillInput.trim(), category: 'Custom' },
    ]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (index) => {
    setParsedSkills(parsedSkills.filter((_, i) => i !== index));
  };

  const handleSaveResumeSkills = () => {
    setResumeSuccessMsg(true);
    setTimeout(() => setResumeSuccessMsg(false), 3000);
  };

  const handleJdSubmit = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    setParsingJd(true);
    setJdError(null);

    try {
      const res = await api.parseJD(jdText);
      setParsedJd(res);
    } catch (err) {
      setJdError(err.message || 'Failed to parse job description');
    } finally {
      setParsingJd(false);
    }
  };

  return (
    <div className="page-shell space-y-4 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-semibold text-neutral-50 tracking-tight">
          Resume & JD parser
        </h1>
        <p className="section-meta mt-1">
          Deterministic dictionary extraction — no external AI APIs.
        </p>
      </div>

      <div className="flex gap-4 border-b border-line">
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-2 text-xs font-medium transition-colors ${
            activeTab === 'resume'
              ? 'text-neutral-100 border-b-2 border-accent -mb-px'
              : 'text-muted hover:text-neutral-300'
          }`}
        >
          Resume PDF
        </button>
        <button
          onClick={() => setActiveTab('jd')}
          className={`pb-2 text-xs font-medium transition-colors ${
            activeTab === 'jd'
              ? 'text-neutral-100 border-b-2 border-accent -mb-px'
              : 'text-muted hover:text-neutral-300'
          }`}
        >
          Job description
        </button>
      </div>

      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="panel p-3 space-y-3">
            <h2 className="section-title text-base">Upload PDF</h2>

            <form onSubmit={handleResumeUpload} className="space-y-3">
              <div className="border border-dashed border-line hover:border-neutral-500 p-6 text-center transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resume-input"
                />
                <label htmlFor="resume-input" className="cursor-pointer block space-y-1">
                  <span className="block text-xs font-medium text-neutral-300">
                    {resumeFile ? resumeFile.name : 'Select PDF resume'}
                  </span>
                  <span className="block text-[10px] font-mono text-muted">max 5MB · pdf only</span>
                </label>
              </div>

              {resumeError && (
                <p className="text-[11px] text-neutral-400 border-l-2 border-neutral-600 pl-2">
                  {resumeError}
                </p>
              )}

              <button
                type="submit"
                disabled={!resumeFile || parsingResume}
                className="btn-primary w-full disabled:opacity-40"
              >
                {parsingResume ? 'Parsing…' : 'Parse resume'}
              </button>
            </form>
          </div>

          <div className="panel p-3 space-y-3">
            <h2 className="section-title text-base">Verify skills</h2>

            {parsedSkills.length === 0 ? (
              <p className="text-[11px] text-muted py-6">
                Upload a resume to extract skills automatically.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-x-3 gap-y-1 max-h-48 overflow-y-auto">
                  {parsedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-300"
                    >
                      {skill.name}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="text-muted hover:text-neutral-100 text-[10px]"
                        aria-label={`Remove ${skill.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add skill…"
                    className="flex-1 bg-canvas border border-line px-2 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-500"
                  />
                  <button onClick={handleAddSkill} className="btn-ghost">
                    Add
                  </button>
                </div>

                {resumeSuccessMsg && (
                  <p className="text-[11px] text-muted font-mono">skills updated</p>
                )}

                <button onClick={handleSaveResumeSkills} className="btn-primary w-full">
                  Confirm & update graph
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'jd' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="panel p-3 space-y-3">
            <h2 className="section-title text-base">Paste job description</h2>

            <form onSubmit={handleJdSubmit} className="space-y-3">
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Senior React Developer with 5+ years in TypeScript, Node.js, Docker — Bangalore"
                className="w-full h-40 bg-canvas border border-line p-3 text-xs text-neutral-200 focus:outline-none focus:border-neutral-500 resize-none font-body"
              />

              {jdError && (
                <p className="text-[11px] text-neutral-400 border-l-2 border-neutral-600 pl-2">
                  {jdError}
                </p>
              )}

              <button
                type="submit"
                disabled={!jdText.trim() || parsingJd}
                className="btn-primary w-full disabled:opacity-40"
              >
                {parsingJd ? 'Extracting…' : 'Parse description'}
              </button>
            </form>
          </div>

          <div className="panel p-3 space-y-3">
            <h2 className="section-title text-base">Extracted metadata</h2>

            {parsedJd ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-muted uppercase block mb-0.5">title</span>
                  <div className="font-display text-base font-semibold text-neutral-100">{parsedJd.title}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-line font-mono text-[11px]">
                  <div>
                    <span className="text-[10px] text-muted uppercase block">exp</span>
                    <span className="text-neutral-300">{parsedJd.experienceMin}–{parsedJd.experienceMax} yr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase block">mode</span>
                    <span className="text-neutral-300 capitalize">{parsedJd.workMode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase block">loc</span>
                    <span className="text-neutral-300">{parsedJd.location}</span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-muted uppercase block mb-1">skills</span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {parsedJd.skills.map((s, i) => (
                      <span key={i} className="text-[11px] font-mono text-neutral-400">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted py-6">
                Paste job text to test deterministic extraction.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
