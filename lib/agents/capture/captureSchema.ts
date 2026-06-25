export type CapturedTask = {
  title: string;
  dueDate: string | null;
  project: string | null;
  priority: "low" | "medium" | "high" | null;
  tags: string[];
  needsClarification: boolean;
  clarificationQuestion: string | null;
};

export type CaptureAgentResponse = {
  tasks: CapturedTask[];
  ignoredText: string[];
  overallConfidence: number;
};

export type CaptureContext = {
  today: string;
  timezone: string;
  existingProjects: string[];
  existingTags: string[];
};
