import React, { useState } from 'react';
import { useResumeStore } from '../store/resume.editor.store';

export const AppTopbar: React.FC = () => {
  const atsScore = useResumeStore((state) => state.resume.atsScore);
  const atsFeedback = useResumeStore((state) => state.resume.atsFeedback);
  const blocks = useResumeStore((state) => state.resume.blocks);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#2ea043';
    if (score >= 70) return '#e3b341';
    return '#f85149';
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('http://localhost:8000/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blocks }),
      });

      if (!response.ok) throw new Error('Export failed');

      // Create a blob from the HTML response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
          // Note: window.print() is called automatically by the backend template
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF. Ensure backend is running.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="topbar">
      <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: '#e6edf3' }}>
        ResumeOS
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="ats-badge">
              <span className="ats-label" style={{ color: '#8b949e', fontSize: '0.9rem' }}>ATS Score</span>
              <span style={{ 
                fontWeight: 'bold', 
                color: getScoreColor(atsScore)
              }}>
                {atsScore}
              </span>
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '10px',
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '6px',
                padding: '12px',
                width: 'min(300px, 80vw)',
                boxShadow: '0 8px 24px rgba(1, 4, 9, 0.4)',
                zIndex: 1000
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#e6edf3' }}>ATS Feedback</div>
                {atsFeedback.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#c9d1d9' }}>
                    {atsFeedback.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                         {tip.startsWith('PASS') ? '✅ ' : tip.startsWith('WARN') ? '⚠️ ' : 'ℹ️ '}
                         {tip.replace(/^(PASS|WARN|INFO):\s*/, '')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: '#8b949e', fontSize: '0.9rem' }}>Add content to see feedback</div>
                )}
              </div>
            )}
        </div>
        
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="export-btn"
          style={{
            backgroundColor: isExporting ? '#238636aa' : '#238636',
            cursor: isExporting ? 'wait' : 'pointer',
            padding: '6px 10px'
          }}
        >
          {isExporting ? '...' : (
            <>
              <span className="ats-label">Export PDF</span>
              <span className="mobile-only" style={{ display: 'none' }}>PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

