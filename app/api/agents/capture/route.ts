import { NextResponse } from "next/server";

function makeTaskTitle(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "");
}

export async function POST(request: Request) {
  const body = await request.json();
  const input = typeof body.input === "string" ? body.input : "";

  const cleanInput = input.trim();

  if (!cleanInput) {
    return NextResponse.json({
      tasks: [],
      ignoredText: [],
      overallConfidence: 1,
    });
  }

  return NextResponse.json({
    tasks: [
      {
        title: makeTaskTitle(cleanInput),
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
  });
}
