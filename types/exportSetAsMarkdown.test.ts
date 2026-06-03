import { describe, expect, it } from "vitest";

import { exportSetAsMarkdown, type Track } from "./dj";

const baseTrack: Track = {
  id: 0,
  title: "",
  artist: "",
  bpm: null,
  key: null,
  genre: null,
  energy: null,
  tags: [],
  notes: null,
};

function track(overrides: Partial<Track>): Track {
  return { ...baseTrack, ...overrides };
}

describe("exportSetAsMarkdown", () => {
  it("renders an empty set with header and zero count", () => {
    const out = exportSetAsMarkdown("Empty Set", []);
    expect(out).toBe("# Empty Set\n\nTracks: 0\n");
  });

  it("renders title, artist, and full meta line for a fully-populated track", () => {
    const out = exportSetAsMarkdown("Mix", [
      {
        track: track({
          title: "Strobe",
          artist: "Deadmau5",
          bpm: 128,
          key: "5A",
          energy: 7,
          genre: "Progressive",
        }),
        transitionNotes: "",
      },
    ]);

    expect(out).toContain("## 1. Strobe — Deadmau5");
    expect(out).toContain("128 BPM · 5A · Energy 7/10 · Progressive");
  });

  it("omits null fields from the meta line", () => {
    const out = exportSetAsMarkdown("Mix", [
      {
        track: track({ title: "Mystery", artist: "Unknown" }),
        transitionNotes: "",
      },
    ]);

    expect(out).toContain("## 1. Mystery — Unknown");
    expect(out).not.toMatch(/BPM/);
    expect(out).not.toMatch(/Energy/);
  });

  it("omits the tags line when there are no tags", () => {
    const out = exportSetAsMarkdown("Mix", [
      { track: track({ title: "T", artist: "A" }), transitionNotes: "" },
    ]);
    expect(out).not.toMatch(/Tags:/);
  });

  it("renders tags joined by comma when present", () => {
    const out = exportSetAsMarkdown("Mix", [
      {
        track: track({ title: "T", artist: "A", tags: ["peak", "melodic"] }),
        transitionNotes: "",
      },
    ]);
    expect(out).toContain("Tags: peak, melodic");
  });

  it("omits the transition line when notes are empty or whitespace", () => {
    const out = exportSetAsMarkdown("Mix", [
      {
        track: track({ title: "T", artist: "A" }),
        transitionNotes: "   ",
      },
    ]);
    expect(out).not.toMatch(/\*\*Transition:\*\*/);
  });

  it("renders a trimmed transition line when notes are non-empty", () => {
    const out = exportSetAsMarkdown("Mix", [
      {
        track: track({ title: "T", artist: "A" }),
        transitionNotes: "  blend over 32 bars  ",
      },
    ]);
    expect(out).toContain("**Transition:** blend over 32 bars");
  });

  it("numbers tracks starting at 1", () => {
    const out = exportSetAsMarkdown("Mix", [
      { track: track({ title: "First", artist: "A" }), transitionNotes: "" },
      { track: track({ title: "Second", artist: "B" }), transitionNotes: "" },
      { track: track({ title: "Third", artist: "C" }), transitionNotes: "" },
    ]);
    expect(out).toContain("## 1. First — A");
    expect(out).toContain("## 2. Second — B");
    expect(out).toContain("## 3. Third — C");
  });

  it("ends with exactly one trailing newline", () => {
    const out = exportSetAsMarkdown("Mix", [
      { track: track({ title: "T", artist: "A" }), transitionNotes: "" },
    ]);
    expect(out.endsWith("\n")).toBe(true);
    expect(out.endsWith("\n\n")).toBe(false);
  });
});
