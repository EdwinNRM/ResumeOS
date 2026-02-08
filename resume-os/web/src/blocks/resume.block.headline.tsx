import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../store/resume.editor.store';

interface HeadlineBlockProps {
  id: string;
  initialContent: string;
}

export const HeadlineBlock: React.FC<HeadlineBlockProps> = ({ id, initialContent }) => {
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
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      style={{
        fontSize: '1.2rem',
        color: '#8b949e', // muted
        marginBottom: '1rem',
        outline: 'none',
        minHeight: '1.5em',
      }}
    />
  );
};
