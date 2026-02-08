import { ResumeBlock } from '../schema/resume.block.schema';

export interface AtsRule {
  id: string;
  category: 'content' | 'formatting' | 'readability';
  severity: 'info' | 'warning' | 'error';
  message: string;
  check: (blocks: ResumeBlock[]) => boolean;
}

export const atsRules: AtsRule[] = [
  {
    id: 'bullet-points-detected',
    category: 'formatting',
    severity: 'info',
    message: 'Bullet points detected in experience section',
    check: (blocks) => {
      const exp = blocks.find(b => b.type === 'experience');
      if (exp && 'items' in exp) {
        return exp.items.some(item => item.bullets.length > 0);
      }
      return false;
    }
  },
  {
    id: 'long-sentences',
    category: 'readability',
    severity: 'warning',
    message: 'Some sentences might be too long (> 25 words)',
    check: (blocks) => {
      // simplified check
      const textBlocks = blocks.filter(b => ['summary', 'experience', 'project'].includes(b.type));
      for (const block of textBlocks) {
        if ('content' in block && block.content.split(' ').length > 25) return true;
        if ('items' in block) {
          // Check items logic for deep nested structures
          // simplified for this example
        }
      }
      return false; 
    }
  },
  {
    id: 'readable-structure',
    category: 'readability',
    severity: 'info',
    message: 'Good structure detected (sections present)',
    check: (blocks) => {
      const types = blocks.map(b => b.type);
      return types.includes('experience') && types.includes('education') && types.includes('skills');
    }
  }
];
