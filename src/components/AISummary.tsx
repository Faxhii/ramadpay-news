import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface AISummaryProps {
  points: string[];
  articleId: string;
  source: string;
}

export const AISummary: React.FC<AISummaryProps> = ({ points, articleId, source }) => {
  const [showMetadata, setShowMetadata] = useState(false);

  // Generate deterministic metadata for mock realism
  const originalWordsCount = 200 + (articleId.charCodeAt(0) * 3);
  const summarizedWordsCount = points.reduce((acc, p) => acc + p.split(' ').length, 0);
  const reductionPercent = Math.round(((originalWordsCount - summarizedWordsCount) / originalWordsCount) * 100);
  const latency = (0.8 + (articleId.charCodeAt(1) % 10) / 10).toFixed(2);

  return (
    <div className="ai-summary-container animate-fade-in">
      
      {/* Header Banner */}
      <div className="ai-summary-header">
        <div className="ai-summary-title">
          <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
          <span>DeepSeek Editorial Synthesis</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-accent" style={{ fontSize: '0.625rem', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></span>
            V3 Summary
          </span>
          <button 
            onClick={() => setShowMetadata(!showMetadata)}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '0.675rem', 
              color: 'var(--text-muted)',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {showMetadata ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Logs
          </button>
        </div>
      </div>

      {/* Statistics Block */}
      {showMetadata && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          marginBottom: 'var(--space-md)',
          fontFamily: 'monospace',
          fontSize: '0.725rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }} className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>[system] processor_id:</span>
            <span>deepseek-v3-summarizer</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>[system] model_latency:</span>
            <span>{latency}s</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>[system] source_feed:</span>
            <span>{source}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>[system] text_compression:</span>
            <span>{originalWordsCount} words &rarr; {summarizedWordsCount} words (-{reductionPercent}%)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>[system] verification_hash:</span>
            <span>SHA256:dsk_hash_{articleId.replace('-', '_')}_ae7f3</span>
          </div>
        </div>
      )}

      {/* AI Bullet points */}
      <ul className="ai-summary-points">
        {points.map((point, index) => (
          <li key={index} style={{ lineHeight: 1.5 }}>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
};
