import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../store/resume.editor.store';
import { ResumeBlock } from '../../../shared/schema/resume.block.schema';
import { useBlockNavigation } from '../hooks/resume.block.navigation.hook';

interface BlockWrapperProps {
  block: ResumeBlock;
  children: React.ReactNode;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const focusedBlockId = useResumeStore((state) => state.focusedBlockId);
  const setFocusedBlock = useResumeStore((state) => state.setFocusedBlock);
  const addBlock = useResumeStore((state) => state.addBlock);
  const removeBlock = useResumeStore((state) => state.removeBlock);
  const reorderBlocks = useResumeStore((state) => state.reorderBlocks);
  const blocks = useResumeStore((state) => state.resume.blocks);
  const { navigate } = useBlockNavigation();

  const isActive = focusedBlockId === block.id;

  useEffect(() => {
    if (isActive && wrapperRef.current) {
      // Don't forcefully focus if user is already interacting inside
      if (!wrapperRef.current.contains(document.activeElement)) {
          // wrapperRef.current.focus(); // Removed auto-focus on wrapper to prevent stealing from children
      }
    }
  }, [isActive]);

  const handleFocus = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent bubbling if nested
    setFocusedBlock(block.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'move';
    // Optional: set drag image
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === block.id) return;

    const fromIndex = blocks.findIndex(b => b.id === draggedId);
    const toIndex = blocks.findIndex(b => b.id === block.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      reorderBlocks(fromIndex, toIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('summary', block.id); // Default to summary block on enter
    }
    
    // Check if backspace on empty block
    // We check if the target (contenteditable) is empty, OR if the wrapper itself is focused and empty-ish
    // But wrapper is a container. The children are contenteditable.
    // Let's assume the child handles its own content. 
    // However, for BlockWrapper, if we catch Backspace here, it might be bubbling up.
    
    if (e.key === 'Backspace') {
       const target = e.target as HTMLElement;
       // Check if the target is indeed empty. Using innerText or textContent.
       // We need to be careful not to delete if cursor is just at start but content exists.
       // For this simplified version: only delete if truly empty.
       if (target.innerText.trim() === '') {
           e.preventDefault();
           // Don't delete the only block if it's the last one? Ideally keep one.
           removeBlock(block.id);
       }
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigate('up');
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigate('down');
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`resume-block-wrapper ${isActive ? 'focused' : ''}`}
      onClick={handleFocus}
      onKeyDown={handleKeyDown}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      // tabIndex={0} // Remove tabIndex from wrapper so focus goes to contentEditable child
      style={{
        outline: 'none',
        position: 'relative',
        padding: '0.5rem',
        borderRadius: '4px',
        border: isActive ? '1px solid rgba(46, 160, 67, 0.4)' : '1px solid transparent', // accent color
        backgroundColor: isActive ? 'rgba(13, 17, 23, 0.5)' : 'transparent',
        transition: 'border-color 0.2s, background-color 0.2s',
        cursor: 'grab'
      }}
    >
      <div className="block-handle" style={{
        position: 'absolute',
        left: '-1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: isActive ? 1 : 0,
        cursor: 'grab',
        color: '#8b949e',
        padding: '4px'
      }}>
        ⋮⋮
      </div>
      <div className="block-content">
        {children}
      </div>
      
      {/* Visual cue for block type on hover/focus could go here */}
      {isActive && (
        <div style={{
          position: 'absolute',
          right: '0.5rem',
          top: '0.5rem',
          fontSize: '0.7rem',
          color: '#8b949e', // muted
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          {block.type.toUpperCase()}
        </div>
      )}
    </div>
  );
};
