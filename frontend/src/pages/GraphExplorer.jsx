import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ForceGraph2D from 'react-force-graph-2d';
import { api, ApiError } from '../api/client';
import { DbErrorState, EmptyState } from '../components/States';

const NODE_COLORS = {
  Candidate: '#0d9488',
  Person: '#737373',
  Company: '#525252',
  Job: '#a3a3a3',
  Skill: '#404040',
  Location: '#666666',
};

export const GraphExplorer = ({
  candidateId,
  isDbDown,
  onRefreshHealth,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetJobId = searchParams.get('jobId');

  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(targetJobId ? 'job' : 'candidate');

  const fgRef = useRef(null);

  const fetchGraph = useCallback(() => {
    if (isDbDown) return;
    setLoading(true);
    setError(null);

    const promise =
      viewMode === 'job' && targetJobId
        ? api.getJobGraph(targetJobId)
        : api.getCandidateGraph(candidateId);

    promise
      .then((data) => {
        setGraphData(data);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === 'DATABASE_UNAVAILABLE') {
          onRefreshHealth();
        } else {
          setError(err.message || 'Failed to load graph data');
        }
      })
      .finally(() => setLoading(false));
  }, [candidateId, targetJobId, viewMode, isDbDown]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2.5, 1000);
    }
  };

  const handleResetZoom = () => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(1000, 50);
    }
  };

  if (isDbDown) return <DbErrorState onRetry={onRefreshHealth} />;

  return (
    <div className="page-shell space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-neutral-50 tracking-tight">
            Graph explorer
          </h1>
          <p className="section-meta mt-1">
            Live openCypher subgraph · force-directed layout
          </p>
        </div>

        <div className="flex items-center gap-px border border-line bg-line">
          <button
            onClick={() => {
              setViewMode('candidate');
              setSearchParams({});
            }}
            className={`px-3 py-1.5 text-[11px] font-mono transition-colors ${
              viewMode === 'candidate'
                ? 'bg-surface text-neutral-100'
                : 'bg-canvas text-muted hover:text-neutral-300'
            }`}
          >
            candidate
          </button>
          {targetJobId && (
            <button
              onClick={() => setViewMode('job')}
              className={`px-3 py-1.5 text-[11px] font-mono transition-colors ${
                viewMode === 'job'
                  ? 'bg-surface text-neutral-100'
                  : 'bg-canvas text-muted hover:text-neutral-300'
              }`}
            >
              job · {targetJobId}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="lg:col-span-3 panel relative min-h-[520px] flex items-center justify-center bg-canvas">
          <div className="absolute top-2 right-2 z-10 flex flex-col border border-line bg-surface text-[10px] font-mono">
            <button
              onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.3, 400)}
              className="px-2 py-1 text-muted hover:text-neutral-200 hover:bg-surface-raised border-b border-line"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.3, 400)}
              className="px-2 py-1 text-muted hover:text-neutral-200 hover:bg-surface-raised border-b border-line"
              title="Zoom out"
            >
              −
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-muted hover:text-neutral-200 hover:bg-surface-raised"
              title="Fit view"
            >
              fit
            </button>
          </div>

          <div className="absolute bottom-2 left-2 z-10 panel px-2 py-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono">
            {Object.entries(NODE_COLORS).map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
                <span className="text-muted">{label}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-muted flex flex-col items-center gap-2">
              <div className="w-4 h-4 border border-line border-t-neutral-400 animate-spin" />
              <span className="text-[10px] font-mono">loading graph…</span>
            </div>
          ) : error ? (
            <EmptyState title="Graph Load Error" description={error} />
          ) : graphData && graphData.nodes.length > 0 ? (
            <ForceGraph2D
              ref={fgRef}
              width={800}
              height={520}
              graphData={{
                nodes: graphData.nodes.map((n) => ({ ...n })),
                links: graphData.edges.map((e) => ({ ...e })),
              }}
              nodeLabel={(n) => `${n.label}: ${n.name}`}
              nodeColor={(n) => NODE_COLORS[n.label] || '#525252'}
              nodeRelSize={6}
              linkLabel={(e) => e.type}
              linkColor={() => '#333333'}
              linkDirectionalArrowLength={3}
              linkDirectionalArrowRelPos={1}
              onNodeClick={handleNodeClick}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name || node.id;
                const fontSize = 11 / globalScale;
                ctx.font = `${fontSize}px "IBM Plex Sans", sans-serif`;

                const radius = 5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = NODE_COLORS[node.label] || '#525252';
                ctx.fill();
                ctx.lineWidth = 1 / globalScale;
                ctx.strokeStyle = '#0a0a0a';
                ctx.stroke();

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#d4d4d4';
                ctx.fillText(label, node.x, node.y + radius + fontSize * 0.85);
              }}
            />
          ) : (
            <EmptyState title="Empty Graph" description="No nodes returned for this graph query." />
          )}
        </div>

        <div className="panel p-3 flex flex-col justify-between min-h-[200px] lg:min-h-[520px]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              node inspector
            </p>

            {selectedNode ? (
              <div className="space-y-3 border-t border-line pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 shrink-0"
                    style={{ backgroundColor: NODE_COLORS[selectedNode.label] || '#525252' }}
                  />
                  <span className="font-mono text-[10px] text-muted uppercase">
                    {selectedNode.label}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-base font-semibold text-neutral-100">
                    {selectedNode.name}
                  </h4>
                  <p className="text-[10px] font-mono text-muted mt-0.5">{selectedNode.id}</p>
                </div>

                {selectedNode.props && Object.keys(selectedNode.props).length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-line">
                    {Object.entries(selectedNode.props).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px] gap-2">
                        <span className="text-muted font-mono">{k}</span>
                        <span className="text-neutral-300 text-right">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-muted leading-relaxed pt-2">
                Click a node on the canvas to inspect properties.
              </p>
            )}
          </div>

          <p className="text-[10px] text-muted leading-relaxed border-t border-line pt-2 mt-4">
            Graph queries preserve relationship structure across candidates, skills, and referral chains — unlike flat relational joins.
          </p>
        </div>
      </div>
    </div>
  );
};
