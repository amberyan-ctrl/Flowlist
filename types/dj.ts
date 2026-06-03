export type Track = {
  id: number;
  title: string;
  artist: string;
  bpm: number | null;
  key: string | null;
  genre: string | null;
  energy: number | null;
  tags: string[];
  notes: string | null;
};

export type SetTrackItem = {
  trackId: number;
  transitionNotes: string;
};

export type TrackFilters = {
  search: string;
  bpmMin: string;
  bpmMax: string;
  key: string;
  energyMin: string;
  tag: string;
};

export const emptyFilters: TrackFilters = {
  search: "",
  bpmMin: "",
  bpmMax: "",
  key: "",
  energyMin: "",
  tag: "",
};

export function filterTracks(tracks: Track[], filters: TrackFilters): Track[] {
  const search = filters.search.trim().toLowerCase();
  const bpmMin = filters.bpmMin ? Number(filters.bpmMin) : null;
  const bpmMax = filters.bpmMax ? Number(filters.bpmMax) : null;
  const energyMin = filters.energyMin ? Number(filters.energyMin) : null;
  const tag = filters.tag.trim().toLowerCase();

  return tracks.filter((track) => {
    if (search) {
      const haystack = [
        track.title,
        track.artist,
        track.genre ?? "",
        track.notes ?? "",
        ...track.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (bpmMin !== null && !Number.isNaN(bpmMin)) {
      if (track.bpm === null || track.bpm < bpmMin) return false;
    }

    if (bpmMax !== null && !Number.isNaN(bpmMax)) {
      if (track.bpm === null || track.bpm > bpmMax) return false;
    }

    if (filters.key && track.key !== filters.key) return false;

    if (energyMin !== null && !Number.isNaN(energyMin)) {
      if (track.energy === null || track.energy < energyMin) return false;
    }

    if (tag) {
      const hasTag = track.tags.some((t) => t.toLowerCase().includes(tag));
      if (!hasTag) return false;
    }

    return true;
  });
}

export function exportSetAsMarkdown(
  setName: string,
  items: { track: Track; transitionNotes: string }[],
): string {
  const lines = [`# ${setName}`, "", `Tracks: ${items.length}`, ""];

  items.forEach((item, index) => {
    const { track, transitionNotes } = item;
    const meta = [
      track.bpm !== null ? `${track.bpm} BPM` : null,
      track.key,
      track.energy !== null ? `Energy ${track.energy}/10` : null,
      track.genre,
    ]
      .filter(Boolean)
      .join(" · ");

    lines.push(`## ${index + 1}. ${track.title} — ${track.artist}`);
    if (meta) lines.push(meta);
    if (track.tags.length > 0) lines.push(`Tags: ${track.tags.join(", ")}`);
    if (transitionNotes.trim()) {
      lines.push("", `**Transition:** ${transitionNotes.trim()}`);
    }
    lines.push("");
  });

  return lines.join("\n").trimEnd() + "\n";
}
