import React, { useCallback } from 'react';
import { useResumeStore } from '../store/resume.editor.store';
import { ResumeBlock } from '../../../shared/schema/resume.block.schema';

interface EducationBlockProps {
  id: string;
  items: Extract<ResumeBlock, { type: 'education' }>['items'];
}

export const EducationBlock: React.FC<EducationBlockProps> = ({ id, items }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);

  const updateItem = useCallback((index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'institution') newItems[index].institution = value;
    if (field === 'degree') newItems[index].degree = value;
    updateBlock(id, { items: newItems });
  }, [id, items, updateBlock]);

  const addItem = () => {
    updateBlock(id, { 
      items: [...items, { institution: 'University', degree: 'Degree' }] 
    });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateBlock(id, { items: newItems });
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
        Education
      </h3>
      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '1rem', paddingLeft: '0.5rem', borderLeft: '2px solid #e3b341' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  value={item.institution} 
                  onChange={(e) => updateItem(idx, 'institution', e.target.value)}
                  style={{ 
                    background: 'transparent', color: '#e6edf3', border: 'none', borderBottom: '1px solid #30363d', 
                    fontWeight: 'bold', fontSize: '1rem', flex: 1 
                  }} 
                  placeholder="Institution"
                />
                <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f85149' }}>×</button>
             </div>
             <input 
                value={item.degree} 
                onChange={(e) => updateItem(idx, 'degree', e.target.value)}
                style={{ 
                  background: 'transparent', color: '#8b949e', border: 'none', borderBottom: '1px solid #30363d', 
                  fontSize: '0.9rem', width: '100%' 
                }} 
                placeholder="Degree"
              />
          </div>
        </div>
      ))}
      <button onClick={addItem} style={{ 
        background: '#238636', color: 'white', border: 'none', 
        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
      }}>
        + Add Education
      </button>
    </div>
  );
};
