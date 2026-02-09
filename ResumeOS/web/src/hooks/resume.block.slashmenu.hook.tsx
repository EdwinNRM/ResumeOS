import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../store/resume.editor.store';

interface SlashMenuProps {
  onSelect: (type: string) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

export const SlashMenu: React.FC<SlashMenuProps> = ({ onSelect, onClose, position }) => {
  const options = [
    { label: 'Name', type: 'name', icon: '👤' },
    { label: 'Headline', type: 'headline', icon: '📰' },
    { label: 'Summary', type: 'summary', icon: '📝' },
    { label: 'Experience', type: 'experience', icon: '💼' },
    { label: 'Project', type: 'project', icon: '🚀' },
    { label: 'Education', type: 'education', icon: '🎓' },
    { label: 'Skills', type: 'skills', icon: '🛠️' },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % options.length);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + options.length) % options.length);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        onSelect(options[selectedIndex].type);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: position.top,
      left: position.left,
      backgroundColor: '#161b22',
      border: '1px solid #30363d',
      borderRadius: '6px',
      boxShadow: '0 8px 24px rgba(1, 4, 9, 0.4)',
      width: '200px',
      zIndex: 1000,
      padding: '4px'
    }}>
      {options.map((option, idx) => (
        <div
          key={option.type}
          onClick={() => onSelect(option.type)}
          onMouseEnter={() => setSelectedIndex(idx)}
          style={{
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            backgroundColor: idx === selectedIndex ? '#1f6feb' : 'transparent',
            color: '#c9d1d9',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <span>{option.icon}</span>
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
};

export const useSlashMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const addBlock = useResumeStore((state) => state.addBlock);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const selectOption = (type: any) => {
    addBlock(type);
    closeMenu();
    // In a real editor, we'd also remove the '/' character
  };

  return {
    isOpen,
    position,
    closeMenu,
    selectOption,
    SlashMenuComponent: isOpen ? <SlashMenu onSelect={selectOption} onClose={closeMenu} position={position} /> : null
  };
};
