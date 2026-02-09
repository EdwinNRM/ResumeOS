/**
 * Basic sanitization utility to prevent XSS and ensure safe content.
 * Since we don't render HTML directly from user input (per rules),
 * this is mostly for data cleaning before processing or storage if needed.
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const validateContentSafety = (input: string): boolean => {
  // Reject simple script tags or suspicious patterns if any
  const suspicious = /<script|javascript:|data:/i;
  return !suspicious.test(input);
};
