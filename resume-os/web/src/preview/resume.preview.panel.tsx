import React, { useRef, useState, useEffect } from 'react';
import { useResumeStore } from '../store/resume.editor.store';
import { ResumePreviewRenderer } from './resume.preview.renderer';

export const ResumePreviewPanel: React.FC = () => {
  const blocks = useResumeStore((state) => state.resume.blocks);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    // Auto-scale to fit width
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // A4 width in pixels at 96 DPI is approx 794px
        // Add padding: 2rem * 16 = 32px * 2 = 64px
        const newScale = Math.min(1, (containerWidth - 40) / 794);
        setScale(Math.max(0.4, newScale));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        backgroundColor: '#21262d', // slightly lighter than layout bg
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      <div style={{
        marginBottom: '1rem',
        color: '#8b949e',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Live Preview (A4)
      </div>
      
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        backgroundColor: 'white',
        minHeight: '297mm', // A4 height
        width: '210mm', // A4 width
      }}>
        <ResumePreviewRenderer blocks={blocks} />
      </div>
    </div>
  );
};
