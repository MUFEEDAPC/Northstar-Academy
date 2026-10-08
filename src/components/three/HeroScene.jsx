import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';

const HeroExperience = lazy(() => import('./HeroExperience.jsx'));
const topics = [
  { label: 'Web Development', glyph: '⌘' },
  { label: 'Artificial Intelligence', glyph: '✳' },
  { label: 'Career Skills', glyph: '↗' },
  { label: 'Design & Creativity', glyph: '◈' },
  { label: 'Data & Analytics', glyph: '⌁' },
];

function TopicButtons({ onActiveChange = () => {} }) {
  return <div className="scene-topic-list" role="group" aria-label="Learning topics">
    {topics.map((topic, index) => <button
      className={`scene-topic-button topic-${index + 1}`}
      type="button"
      key={topic.label}
      aria-label={topic.label}
      title={topic.label}
      onPointerEnter={() => onActiveChange(index)}
      onPointerLeave={() => onActiveChange(null)}
      onFocus={() => onActiveChange(index)}
      onBlur={() => onActiveChange(null)}
    ><span aria-hidden="true">{topic.glyph}</span><small>{topic.label}</small></button>)}
  </div>;
}

function SceneFallback() {
  return <div className="scene-fallback-art" aria-hidden="true"><span className="fallback-orbit"></span><span className="fallback-core">✳</span><span className="fallback-node fallback-node-a">⌘</span><span className="fallback-node fallback-node-b">◈</span><span className="fallback-node fallback-node-c">↗</span></div>;
}

class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { this.props.onFailure?.(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroScene() {
  const [mode, setMode] = useState('pending');
  const [activeTopic, setActiveTopic] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compactQuery = window.matchMedia('(max-width: 640px), (pointer: coarse)');
    const updateMode = () => {
      setSceneReady(false);
      setSceneFailed(false);
      setMode(reducedQuery.matches || compactQuery.matches ? 'fallback' : 'full');
    };
    updateMode();
    reducedQuery.addEventListener?.('change', updateMode);
    compactQuery.addEventListener?.('change', updateMode);
    return () => {
      reducedQuery.removeEventListener?.('change', updateMode);
      compactQuery.removeEventListener?.('change', updateMode);
    };
  }, []);

  useEffect(() => {
    const visual = document.querySelector('.hero-visual');
    visual?.classList.toggle('has-ready-scene', sceneReady && !sceneFailed);
    return () => visual?.classList.remove('has-ready-scene');
  }, [sceneReady, sceneFailed]);

  const handleSceneReady = useCallback(() => { setSceneReady(true); setSceneFailed(false); }, []);
  const handleSceneFailure = useCallback(() => { setSceneReady(false); setSceneFailed(true); }, []);

  return <div className={`hero-canvas ${mode !== 'full' || sceneFailed ? 'is-fallback' : ''} ${sceneReady && !sceneFailed ? 'has-ready-scene' : ''}`} role="group" aria-label="Learning topics connected around a knowledge sphere">
    <div className="scene-stack">
      <SceneFallback />
      {mode === 'full' && !sceneFailed && <div className={`scene-layer ${sceneReady ? 'is-ready' : ''}`}>
        <SceneBoundary onFailure={handleSceneFailure}>
          <Suspense fallback={null}><HeroExperience activeTopic={activeTopic} onReady={handleSceneReady} onFailure={handleSceneFailure} /></Suspense>
        </SceneBoundary>
        {!sceneReady && <div className="scene-loading" role="status"><span className="caption-pulse" />Preparing your learning space…</div>}
      </div>}
    </div>
    <TopicButtons onActiveChange={setActiveTopic} />
    <div className="scene-caption"><span className="caption-pulse" />A world of skills, connected</div>
  </div>;
}
