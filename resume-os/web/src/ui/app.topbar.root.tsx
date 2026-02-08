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
    <div style={{
      height: '60px',
      backgroundColor: '#161b22',
      borderBottom: '1px solid #30363d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#e6edf3' }}>
        ResumeOS
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: '#0d1117',
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid #30363d',
              cursor: 'help'
            }}>
              <span style={{ color: '#8b949e', fontSize: '0.9rem' }}>ATS Score</span>
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
                width: '300px',
                boxShadow: '0 8px 24px rgba(1, 4, 9, 0.4)',
                zIndex: 1000
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#e6edf3' }}>ATS Feedback</div>
                {atsFeedback.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: '#c9d1d9' }}>
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
          style={{
            backgroundColor: isExporting ? '#238636aa' : '#238636',
            color: '#ffffff',
            border: '1px solid rgba(240, 246, 252, 0.1)',
            borderRadius: '6px',
            padding: '6px 16px',
            fontWeight: 600,
            cursor: isExporting ? 'wait' : 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
        >
          {isExporting ? 'Preparing...' : 'Export PDF'}
        </button>
      </div>
    </div>
  );
};
