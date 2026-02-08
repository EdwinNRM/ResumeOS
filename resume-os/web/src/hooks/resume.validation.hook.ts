import { useCallback } from 'react';
import { ResumeSchema } from '../../../shared/validation/resume.validation.schema';
import { useResumeStore } from '../store/resume.editor.store';

export const useResumeValidation = () => {
  const blocks = useResumeStore((state) => state.resume.blocks);

  const validateResume = useCallback(() => {
    const result = ResumeSchema.safeParse(blocks);
    
    if (!result.success) {
      const errors = result.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
      return {
        isValid: false,
        errors
      };
    }

    return {
      isValid: true,
      errors: []
    };
  }, [blocks]);

  return { validateResume };
};
