export type ResumeBlock =
  | { id: string; type: "name"; content: string }
  | { id: string; type: "headline"; content: string }
  | { id: string; type: "summary"; content: string }
  | { id: string; type: "experience"; items: { role: string; company: string; bullets: string[] }[] }
  | { id: string; type: "project"; items: { title: string; bullets: string[] }[] }
  | { id: string; type: "education"; items: { degree: string; institution: string }[] }
  | { id: string; type: "skills"; list: string[] };

export type ResumeBlockType = ResumeBlock['type'];
