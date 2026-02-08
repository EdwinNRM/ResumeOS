import React from 'react';
import { AppTopbar } from './app.topbar.root';
import { ResumeBlockEditor } from '../editor/resume.block.editor';
import { ResumePreviewPanel } from '../preview/resume.preview.panel';

export const AppLayout: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#0d1117', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: 'Inter, sans-serif',
      color: '#e6edf3'
    }}>
      <AppTopbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
          <ResumeBlockEditor />
        </div>
        <div style={{ 
          width: '50%', 
          maxWidth: '600px',
          borderLeft: '1px solid #30363d',
          backgroundColor: '#161b22',
          overflow: 'hidden' 
        }}>
          <ResumePreviewPanel />
        </div>
      </div>
    </div>
  );
};
