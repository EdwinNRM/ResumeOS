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
        // Subtract padding (2rem total)
        const availableWidth = containerWidth - 48; 
        const newScale = availableWidth / 794;
        
        // Clamp scale between 0.3 and 1.1
        setScale(Math.min(1.1, Math.max(0.3, newScale)));
      }
    };

    // Use ResizeObserver for more reliable detection in tabbed layouts
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);


  return (
    <div 
      ref={containerRef}
      style={{
        backgroundColor: '#21262d', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <div style={{
        marginBottom: '1rem',
        color: '#8b949e',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 600
      }}>
        Live Preview (A4)
      </div>
      
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '2rem'
      }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          backgroundColor: 'white',
          minHeight: '297mm', 
          width: '210mm',
          flexShrink: 0
        }}>
          <ResumePreviewRenderer blocks={blocks} />
        </div>
      </div>
    </div>
  );

};
