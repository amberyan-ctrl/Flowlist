import { describe, expect, it } from "vitest";

import { emptyFilters, filterTracks, type Track, type TrackFilters } from "./dj";

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

function filters(overrides: Partial<TrackFilters>): TrackFilters {
  return { ...emptyFilters, ...overrides };
}

const TRACKS: Track[] = [
  track({ id: 1, title: "Strobe", artist: "Deadmau5", bpm: 128, key: "5A", genre: "Progressive", energy: 7, tags: ["peak", "melodic"], notes: "long build" }),
  track({ id: 2, title: "Opus", artist: "Eric Prydz", bpm: 126, key: "8A", genre: "Progressive", energy: 8, tags: ["peak"] }),
  track({ id: 3, title: "Midnight Ride", artist: "Boards of Canada", bpm: 92, key: "3B", genre: "Ambient", energy: 3, tags: ["chill", "warmup"] }),
  track({ id: 4, title: "Untagged Mystery", artist: "Unknown", bpm: null, key: null, genre: null, energy: null, tags: [], notes: null }),
];

describe("filterTracks", () => {
  it("returns all tracks when filters are empty", () => {
    expect(filterTracks(TRACKS, emptyFilters)).toEqual(TRACKS);
  });

  describe("search", () => {
    it("matches title case-insensitively", () => {
      const result = filterTracks(TRACKS, filters({ search: "STROBE" }));
      expect(result.map((t) => t.id)).toEqual([1]);
    });

    it("matches artist", () => {
      const result = filterTracks(TRACKS, filters({ search: "prydz" }));
      expect(result.map((t) => t.id)).toEqual([2]);
    });

    it("matches genre", () => {
      const result = filterTracks(TRACKS, filters({ search: "ambient" }));
      expect(result.map((t) => t.id)).toEqual([3]);
    });

    it("matches notes", () => {
      const result = filterTracks(TRACKS, filters({ search: "long build" }));
      expect(result.map((t) => t.id)).toEqual([1]);
    });

    it("matches tags", () => {
      const result = filterTracks(TRACKS, filters({ search: "warmup" }));
      expect(result.map((t) => t.id)).toEqual([3]);
    });

    it("trims whitespace before matching", () => {
      const result = filterTracks(TRACKS, filters({ search: "   strobe   " }));
      expect(result.map((t) => t.id)).toEqual([1]);
    });

    it("does not crash on tracks with null genre or notes", () => {
      const result = filterTracks(TRACKS, filters({ search: "mystery" }));
      expect(result.map((t) => t.id)).toEqual([4]);
    });
  });

  describe("bpm bounds", () => {
    it("filters by bpmMin inclusive", () => {
      const result = filterTracks(TRACKS, filters({ bpmMin: "128" }));
      expect(result.map((t) => t.id)).toEqual([1]);
    });

    it("filters by bpmMax inclusive", () => {
      const result = filterTracks(TRACKS, filters({ bpmMax: "92" }));
      expect(result.map((t) => t.id)).toEqual([3]);
    });

    it("excludes tracks with null bpm when bpmMin is set", () => {
      const result = filterTracks(TRACKS, filters({ bpmMin: "1" }));
      expect(result.map((t) => t.id)).not.toContain(4);
    });

    it("excludes tracks with null bpm when bpmMax is set", () => {
      const result = filterTracks(TRACKS, filters({ bpmMax: "200" }));
      expect(result.map((t) => t.id)).not.toContain(4);
    });

    it("ignores non-numeric bpmMin instead of treating it as 0", () => {
      const result = filterTracks(TRACKS, filters({ bpmMin: "abc" }));
      expect(result).toEqual(TRACKS);
    });

    it("ignores non-numeric bpmMax", () => {
      const result = filterTracks(TRACKS, filters({ bpmMax: "abc" }));
      expect(result).toEqual(TRACKS);
    });
  });

  describe("key", () => {
    it("requires exact match (not substring)", () => {
      const result = filterTracks(TRACKS, filters({ key: "5A" }));
      expect(result.map((t) => t.id)).toEqual([1]);
    });

    it("excludes tracks with null key", () => {
      const result = filterTracks(TRACKS, filters({ key: "5A" }));
      expect(result.map((t) => t.id)).not.toContain(4);
    });

    it("partial key string does not match", () => {
      const result = filterTracks(TRACKS, filters({ key: "5" }));
      expect(result).toEqual([]);
    });
  });

  describe("energyMin", () => {
    it("filters inclusively", () => {
      const result = filterTracks(TRACKS, filters({ energyMin: "7" }));
      expect(result.map((t) => t.id).sort()).toEqual([1, 2]);
    });

    it("excludes tracks with null energy", () => {
      const result = filterTracks(TRACKS, filters({ energyMin: "1" }));
      expect(result.map((t) => t.id)).not.toContain(4);
    });
  });

  describe("tag", () => {
    it("matches a tag substring case-insensitively", () => {
      const result = filterTracks(TRACKS, filters({ tag: "PEAK" }));
      expect(result.map((t) => t.id).sort()).toEqual([1, 2]);
    });

    it("matches partial tag content", () => {
      const result = filterTracks(TRACKS, filters({ tag: "melo" }));
      expect(result.map((t) => t.id)).toEqual([1]);
    });

    it("returns empty when no tag matches", () => {
      const result = filterTracks(TRACKS, filters({ tag: "nope" }));
      expect(result).toEqual([]);
    });
  });

  it("combines filters with AND", () => {
    const result = filterTracks(
      TRACKS,
      filters({ bpmMin: "120", bpmMax: "130", tag: "peak", energyMin: "8" }),
    );
    expect(result.map((t) => t.id)).toEqual([2]);
  });
});
