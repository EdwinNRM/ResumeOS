import React, { useCallback } from 'react';
import { useResumeStore } from '../store/resume.editor.store';
import { ResumeBlock } from '../../../shared/schema/resume.block.schema';

interface ProjectBlockProps {
  id: string;
  items: Extract<ResumeBlock, { type: 'project' }>['items'];
}

export const ProjectBlock: React.FC<ProjectBlockProps> = ({ id, items }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);

  const updateItem = useCallback((index: number, field: string, value: any) => {
    const newItems = [...items];
    if (field === 'title') newItems[index].title = value;
    if (field === 'bullets') newItems[index].bullets = value;
    updateBlock(id, { items: newItems });
  }, [id, items, updateBlock]);

  const addItem = () => {
    updateBlock(id, { 
      items: [...items, { title: 'New Project', bullets: ['Description'] }] 
    });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateBlock(id, { items: newItems });
  };

  const updateBullet = (itemIndex: number, bulletIndex: number, value: string) => {
    const newItems = [...items];
    newItems[itemIndex].bullets[bulletIndex] = value;
    updateBlock(id, { items: newItems });
  };

  const addBullet = (itemIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].bullets.push('New detail');
    updateBlock(id, { items: newItems });
  };
  
  const removeBullet = (itemIndex: number, bulletIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].bullets = newItems[itemIndex].bullets.filter((_, i) => i !== bulletIndex);
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
        Projects
      </h3>
      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem', borderLeft: '2px solid #a371f7' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input 
              value={item.title} 
              onChange={(e) => updateItem(idx, 'title', e.target.value)}
              style={{ 
                background: 'transparent', color: '#e6edf3', border: 'none', borderBottom: '1px solid #30363d', 
                fontWeight: 'bold', fontSize: '1rem', flex: 1 
              }} 
            />
             <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f85149' }}>×</button>
          </div>
          <ul style={{ paddingLeft: '1.2rem', color: '#e6edf3' }}>
            {item.bullets.map((bullet, bIdx) => (
              <li key={bIdx} style={{ marginBottom: '0.25rem' }}>
                <input 
                  value={bullet} 
                  onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                  style={{ 
                    background: 'transparent', color: '#c9d1d9', border: 'none', borderBottom: '1px solid #30363d', 
                    width: '90%', fontSize: '0.9rem' 
                  }} 
                />
                 <button onClick={() => removeBullet(idx, bIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', marginLeft: '0.5rem' }}>×</button>
              </li>
            ))}
            <li style={{ listStyle: 'none', marginTop: '0.5rem' }}>
              <button onClick={() => addBullet(idx)} style={{ 
                background: 'none', border: '1px dashed #30363d', color: '#8b949e', 
                padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' 
              }}>+ Add Detail</button>
            </li>
          </ul>
        </div>
      ))}
      <button onClick={addItem} style={{ 
        background: '#238636', color: 'white', border: 'none', 
        padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
      }}>
        + Add Project
      </button>
    </div>
  );
};
