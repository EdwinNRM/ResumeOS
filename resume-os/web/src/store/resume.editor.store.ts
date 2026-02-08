import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeBlock } from '../../../shared/schema/resume.block.schema';
import { atsRules } from '../../../shared/ats/resume.ats.rules';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is available or I need to implement a simple generator

// Simple ID generator if uuid is not available in environment, 
// strictly adhering to "no external libs unless necessary" but UUID is standard. 
// I will use a simple random string generator to avoid dependency issues in this generation 
// unless I check package.json. I'll stick to a simple utility here to be safe and self-contained.
const generateId = () => Math.random().toString(36).substring(2, 9);

interface ResumeState {
  resume: {
    blocks: ResumeBlock[];
    atsScore: number;
    atsFeedback: string[];
  };
  focusedBlockId: string | null;
  
  // Actions
  addBlock: (type: ResumeBlock['type'], afterId?: string) => void;
  updateBlock: (id: string, content: Partial<ResumeBlock>) => void;
  removeBlock: (id: string) => void;
  setFocusedBlock: (id: string | null) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  analyzeAts: () => void;
  resetResume: () => void;
}

const INITIAL_BLOCKS: ResumeBlock[] = [
  { id: 'default-name', type: 'name', content: 'Your Name' },
  { id: 'default-headline', type: 'headline', content: 'Software Engineer' },
  { id: 'default-summary', type: 'summary', content: 'Experienced developer...' },
  { id: 'default-exp', type: 'experience', items: [] },
  { id: 'default-edu', type: 'education', items: [] },
  { id: 'default-skills', type: 'skills', list: [] },
];

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resume: {
        blocks: INITIAL_BLOCKS,
        atsScore: 0,
        atsFeedback: [],
      },
      focusedBlockId: null,

      addBlock: (type, afterId) => {
        const newBlock: ResumeBlock = {
          id: generateId(),
          type,
          content: '',
          items: [], // Initialize based on type generally, simplified here
          list: []
        } as any; // Type casting for simplicity in initialization logic

        // Initialize specific structures
        if (type === 'experience') newBlock['items'] = [];
        if (type === 'project') newBlock['items'] = [];
        if (type === 'education') newBlock['items'] = [];
        if (type === 'skills') newBlock['list'] = [];
        if (type === 'name' || type === 'headline' || type === 'summary') newBlock['content'] = '';

        set((state) => {
          const blocks = [...state.resume.blocks];
          const index = afterId ? blocks.findIndex((b) => b.id === afterId) : blocks.length - 1;
          
          if (index !== -1) {
            blocks.splice(index + 1, 0, newBlock);
          } else {
            blocks.push(newBlock);
          }
          
          return {
            resume: { ...state.resume, blocks },
            focusedBlockId: newBlock.id
          };
        });
        get().analyzeAts();
      },

      updateBlock: (id, content) => {
        set((state) => ({
          resume: {
            ...state.resume,
            blocks: state.resume.blocks.map((b) => 
              b.id === id ? { ...b, ...content } as ResumeBlock : b
            ),
          },
        }));
        // Debounce ATS analysis in real app, call directly here
        get().analyzeAts();
      },

      removeBlock: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            blocks: state.resume.blocks.filter((b) => b.id !== id),
          },
          focusedBlockId: null, // Clear focus or move to prev/next logic
        }));
        get().analyzeAts();
      },

      setFocusedBlock: (id) => set({ focusedBlockId: id }),

      moveBlock: (id, direction) => {
        set((state) => {
          const blocks = [...state.resume.blocks];
          const index = blocks.findIndex((b) => b.id === id);
          if (index === -1) return state;

          if (direction === 'up' && index > 0) {
            [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
          } else if (direction === 'down' && index < blocks.length - 1) {
            [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
          }

          return { resume: { ...state.resume, blocks } };
        });
      },

      reorderBlocks: (startIndex, endIndex) => {
        set((state) => {
          const blocks = [...state.resume.blocks];
          const [removed] = blocks.splice(startIndex, 1);
          blocks.splice(endIndex, 0, removed);
          return { resume: { ...state.resume, blocks } };
        });
      },

      analyzeAts: () => {
        const { blocks } = get().resume;
        let score = 100;
        const feedback: string[] = [];

        atsRules.forEach(rule => {
          const passed = rule.check(blocks);
          if (!passed) {
             // Simple scoring deduction
             if (rule.severity === 'error') score -= 20;
             if (rule.severity === 'warning') score -= 10;
             if (rule.severity === 'info') score -= 0; // Info doesn't hurt score
             feedback.push(`${rule.severity.toUpperCase()}: ${rule.message}`);
          } else {
            // Positive reinforcement?
            if (rule.severity === 'info') feedback.push(`PASS: ${rule.message}`);
          }
        });

        set((state) => ({
          resume: {
            ...state.resume,
            atsScore: Math.max(0, score),
            atsFeedback: feedback
          }
        }));
      },

      resetResume: () => set({ 
        resume: { blocks: INITIAL_BLOCKS, atsScore: 0, atsFeedback: [] },
        focusedBlockId: null 
      }),
    }),
    {
      name: 'resume-os-storage', // unique name
      // partialize: (state) => ({ resume: state.resume }), // persist only resume data
    }
  )
);
