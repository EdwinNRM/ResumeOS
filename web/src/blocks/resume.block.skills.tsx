import React from 'react';
import { useResumeStore } from '../store/resume.editor.store';
import { ResumeBlock } from '../../../shared/schema/resume.block.schema';

interface SkillsBlockProps {
  id: string;
  list: Extract<ResumeBlock, { type: 'skills' }>['list'];
}

export const SkillsBlock: React.FC<SkillsBlockProps> = ({ id, list }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const [inputValue, setInputValue] = React.useState('');

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      updateBlock(id, { list: [...list, inputValue.trim()] });
      setInputValue('');
    }
  };

  const removeSkill = (index: number) => {
    const newList = list.filter((_, i) => i !== index);
    updateBlock(id, { list: newList });
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
        Skills
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {list.map((skill, idx) => (
          <span 
            key={idx} 
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Delete') {
                removeSkill(idx);
              }
            }}
            style={{ 
            backgroundColor: 'rgba(56, 139, 253, 0.15)', 
            color: '#58a6ff', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            outline: 'none',
            border: '1px solid transparent',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            {skill}
            <button 
              onClick={() => removeSkill(idx)}
              style={{
                border: 'none',
                background: 'none',
                color: '#58a6ff',
                cursor: 'pointer',
                padding: 0,
                fontSize: '1rem',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={addSkill}
        placeholder="Type skill and press Enter..."
        style={{
          background: 'transparent',
          border: '1px solid #30363d',
          borderRadius: '4px',
          color: '#e6edf3',
          padding: '4px 8px',
          fontSize: '0.9rem',
          width: '100%',
          maxWidth: '300px'
        }}
      />
    </div>
  );
};
