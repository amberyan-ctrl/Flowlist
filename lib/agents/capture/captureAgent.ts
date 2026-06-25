import { CAPTURE_AGENT_SYSTEM_PROMPT } from "./capturePrompt";
import type {
  CaptureAgentResponse,
  CaptureContext,
} from "./captureSchema";

function fallbackCapture(input: string): CaptureAgentResponse {
  return {
    tasks: [
      {
        title: input.trim(),
        dueDate: null,
        project: null,
        priority: "medium",
        tags: [],
        needsClarification: false,
        clarificationQuestion: null,
      },
    ],
    ignoredText: [],
    overallConfidence: 0.5,
  };
}

export async function captureTasks(
  input: string,
  context: CaptureContext
): Promise<CaptureAgentResponse> {
  const cleanInput = input.trim();

  if (!cleanInput) {
    return {
      tasks: [],
      ignoredText: [],
      overallConfidence: 1,
    };
  }

  try {
    const response = await fetch("/api/agents/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt: CAPTURE_AGENT_SYSTEM_PROMPT,
        input: cleanInput,
        context,
      }),
    });

    if (!response.ok) {
      return fallbackCapture(cleanInput);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.tasks)) {
      return fallbackCapture(cleanInput);
    }

    return data as CaptureAgentResponse;
  } catch {
    return fallbackCapture(cleanInput);
  }
}
