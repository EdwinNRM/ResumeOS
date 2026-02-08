import React from 'react';
import { ResumeBlock } from '../../../shared/schema/resume.block.schema';

interface ResumePreviewProps {
  blocks: ResumeBlock[];
  scale?: number;
}

const styles = {
  page: {
    fontFamily: 'Inter, sans-serif',
    color: '#000000', // ATS typically prefers black on white, but screen is dark mode. 
    // However, "Preview" usually implies what the PDF will look like.
    // If the app is dark mode, the preview (paper) should likely be white for standard resumes.
    // Let's stick to standard resume formatting (white paper, black text) for the preview/export
    // OR follow the design system if it's a digital resume.
    // "ATS-first" implies standard formatting. I will use white background for the preview container strictly.
    backgroundColor: '#ffffff',
    padding: '2rem',
    maxWidth: '210mm', // A4 width
    minHeight: '297mm', // A4 height
    margin: '0 auto',
    boxSizing: 'border-box' as const,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: '1.5rem',
  },
  header: {
    borderBottom: '1px solid #000',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  name: {
    fontSize: '24pt',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'uppercase' as const,
  },
  headline: {
    fontSize: '14pt',
    color: '#444',
    margin: '0.25rem 0 0 0',
  },
  summary: {
    fontSize: '10pt',
    textAlign: 'justify' as const,
  },
  sectionTitle: {
    fontSize: '12pt',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #ccc',
    marginBottom: '0.5rem',
    marginTop: 0,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: '10pt',
    margin: 0,
  },
  itemSubtitle: {
    fontStyle: 'italic',
    fontSize: '10pt',
    marginBottom: '0.25rem',
  },
  list: {
    margin: '0.25rem 0',
    paddingLeft: '1.2rem',
    fontSize: '10pt',
  },
  skillList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    fontSize: '10pt',
  }
};

export const ResumePreviewRenderer: React.FC<ResumePreviewProps> = ({ blocks }) => {
  return (
    <div id="resume-preview" style={styles.page}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'name':
            return (
              <header key={block.id} style={styles.section}>
                <h1 style={styles.name}>{block.content}</h1>
              </header>
            );
          case 'headline':
             return (
              <div key={block.id} style={styles.section}>
                 <p style={styles.headline}>{block.content}</p>
              </div>
             );
          case 'summary':
            return (
              <section key={block.id} style={styles.section}>
                <h2 style={styles.sectionTitle}>Summary</h2>
                <p style={styles.summary}>{block.content}</p>
              </section>
            );
          case 'experience':
            return (
              <section key={block.id} style={styles.section}>
                <h2 style={styles.sectionTitle}>Experience</h2>
                {block.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={styles.itemTitle}>{item.role}</h3>
                    </div>
                    <div style={styles.itemSubtitle}>{item.company}</div>
                    <ul style={styles.list}>
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          case 'project':
            return (
              <section key={block.id} style={styles.section}>
                <h2 style={styles.sectionTitle}>Projects</h2>
                {block.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '1rem' }}>
                    <h3 style={styles.itemTitle}>{item.title}</h3>
                    <ul style={styles.list}>
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            );
          case 'education':
            return (
              <section key={block.id} style={styles.section}>
                <h2 style={styles.sectionTitle}>Education</h2>
                {block.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '0.5rem' }}>
                    <h3 style={styles.itemTitle}>{item.institution}</h3>
                    <div style={styles.itemSubtitle}>{item.degree}</div>
                  </div>
                ))}
              </section>
            );
          case 'skills':
            return (
              <section key={block.id} style={styles.section}>
                <h2 style={styles.sectionTitle}>Skills</h2>
                <div style={styles.skillList}>
                  {block.list.map((skill, idx) => (
                    <span key={idx} style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
