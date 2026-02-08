import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../store/resume.editor.store';

interface NameBlockProps {
  id: string;
  initialContent: string;
}

export const NameBlock: React.FC<NameBlockProps> = ({ id, initialContent }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const ref = useRef<HTMLHeadingElement>(null);

  // Sync external changes to contentEditable
  useEffect(() => {
    if (ref.current && ref.current.innerText !== initialContent) {
       // Only update if NOT focused, to prevent cursor jumping while typing
       if (document.activeElement !== ref.current) {
          ref.current.innerText = initialContent;
       }
    }
  }, [initialContent]);

  const handleInput = () => {
    if (ref.current) {
      // We update the store, but we don't want the store update to re-render us 
      // and reset the cursor. The useEffect above handles external changes,
      // but standard React re-renders might still happen.
      // By using suppressContentEditableWarning and NOT passing children (managed by ref),
      // we avoid reconciliation issues.
      updateBlock(id, { content: ref.current.innerText });
    }
  };

  return (
    <h1
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#e6edf3', // text color
        border: 'none',
        outline: 'none',
        minHeight: '1.5em',
      }}
    />
  );
};
