import React, { useState } from 'react';
import { AppTopbar } from './app.topbar.root';
import { ResumeBlockEditor } from '../editor/resume.block.editor';
import { ResumePreviewPanel } from '../preview/resume.preview.panel';

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  return (
    <div className="app-container">
      <AppTopbar />
      
      <div className="mobile-tabs">
        <button 
          className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button 
          className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      <div className="main-content">
        <div className={`editor-panel ${activeTab === 'editor' ? 'active' : 'hidden'}`}>
          <ResumeBlockEditor />
        </div>
        <div className={`preview-panel ${activeTab === 'preview' ? 'active' : 'hidden'}`}>
          <ResumePreviewPanel />
        </div>
      </div>
    </div>
  );
};

