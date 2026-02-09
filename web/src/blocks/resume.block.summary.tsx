import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../store/resume.editor.store';

interface SummaryBlockProps {
  id: string;
  initialContent: string;
}

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ id, initialContent }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== initialContent) {
       if (document.activeElement !== ref.current) {
         ref.current.innerText = initialContent;
       }
    }
  }, [initialContent]);

  const handleInput = () => {
    if (ref.current) {
      updateBlock(id, { content: ref.current.innerText });
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ 
        fontSize: '0.9rem', 
        textTransform: 'uppercase', 
        color: '#8b949e', 
        marginBottom: '0.5rem',
        userSelect: 'none' 
      }}>
        Summary
      </h3>
      <p
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#e6edf3',
          outline: 'none',
          minHeight: '3em',
        }}
      />
    </div>
  );
};
