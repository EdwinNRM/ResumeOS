import { useCallback } from 'react';
import { useResumeStore } from '../store/resume.editor.store';

export const useBlockNavigation = () => {
  const blocks = useResumeStore((state) => state.resume.blocks);
  const setFocusedBlock = useResumeStore((state) => state.setFocusedBlock);
  const focusedBlockId = useResumeStore((state) => state.focusedBlockId);

  const navigate = useCallback((direction: 'up' | 'down') => {
    if (!focusedBlockId) return;

    const currentIndex = blocks.findIndex(b => b.id === focusedBlockId);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < blocks.length - 1) {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex !== currentIndex) {
      setFocusedBlock(blocks[targetIndex].id);
    }
  }, [blocks, focusedBlockId, setFocusedBlock]);

  return { navigate };
};
