import React from 'react';
import { useResumeStore } from '../store/resume.editor.store';
import { BlockWrapper } from './resume.block.wrapper';
import { NameBlock } from '../blocks/resume.block.name';
import { HeadlineBlock } from '../blocks/resume.block.headline';
import { SummaryBlock } from '../blocks/resume.block.summary';
import { ExperienceBlock } from '../blocks/resume.block.experience';
import { ProjectBlock } from '../blocks/resume.block.project';
import { EducationBlock } from '../blocks/resume.block.education';
import { SkillsBlock } from '../blocks/resume.block.skills';
import { useSlashMenu } from '../hooks/resume.block.slashmenu.hook';

export const ResumeBlockEditor: React.FC = () => {
  const blocks = useResumeStore((state) => state.resume.blocks);
  const { SlashMenuComponent } = useSlashMenu();

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'name': return <NameBlock id={block.id} initialContent={block.content} />;
      case 'headline': return <HeadlineBlock id={block.id} initialContent={block.content} />;
      case 'summary': return <SummaryBlock id={block.id} initialContent={block.content} />;
      case 'experience': return <ExperienceBlock id={block.id} items={block.items} />;
      case 'project': return <ProjectBlock id={block.id} items={block.items} />;
      case 'education': return <EducationBlock id={block.id} items={block.items} />;
      case 'skills': return <SkillsBlock id={block.id} list={block.list} />;
      default: return <div>Unknown block type</div>;
    }
  };

  return (
    <div className="resume-editor" style={{
      color: '#c9d1d9',
      minHeight: '100vh',
    }}>
      {blocks.map((block) => (
        <BlockWrapper key={block.id} block={block}>
          {renderBlock(block)}
        </BlockWrapper>
      ))}
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        borderTop: '1px solid #30363d',
        color: '#8b949e',
        fontSize: '0.9rem',
        textAlign: 'center'
      }}>
        Press <span style={{ background: '#30363d', padding: '2px 4px', borderRadius: '3px' }}>/</span> to insert blocks
      </div>

      {SlashMenuComponent}
    </div>
  );
};
