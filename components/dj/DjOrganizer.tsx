"use client";

import { useMemo, useState } from "react";

import { MOCK_TRACKS } from "@/lib/mockTracks";
import {
  emptyFilters,
  filterTracks,
  type SetTrackItem,
  type TrackFilters,
} from "@/types/dj";

import { CurrentSet } from "./CurrentSet";
import { TrackFilters as TrackFiltersPanel } from "./TrackFilters";
import { TrackLibrary } from "./TrackLibrary";

const trackById = new Map(MOCK_TRACKS.map((t) => [t.id, t]));

export function DjOrganizer() {
  const [filters, setFilters] = useState<TrackFilters>(emptyFilters);
  const [setName, setSetName] = useState("My Set");
  const [setTracks, setSetTracks] = useState<SetTrackItem[]>([]);

  const filteredTracks = useMemo(
    () => filterTracks(MOCK_TRACKS, filters),
    [filters],
  );

  const setTrackIds = useMemo(
    () => new Set(setTracks.map((item) => item.trackId)),
    [setTracks],
  );

  const resolvedSetItems = useMemo(
    () =>
      setTracks.flatMap((item) => {
        const track = trackById.get(item.trackId);
        return track ? [{ ...item, track }] : [];
      }),
    [setTracks],
  );

  function addTrack(trackId: number) {
    if (setTrackIds.has(trackId)) return;
    setSetTracks((prev) => [
      ...prev,
      { trackId, transitionNotes: "" },
    ]);
  }

  function removeTrack(index: number) {
    setSetTracks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveTrack(index: number, direction: -1 | 1) {
    const target = index + direction;
    setSetTracks((prev) => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateTransition(index: number, value: string) {
    setSetTracks((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, transitionNotes: value } : item,
      ),
    );
  }

  function clearSet() {
    setSetTracks([]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          DJ Set List Organizer
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Filter the library, build your set, add transition notes, and export
          as Markdown.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <TrackFiltersPanel
            filters={filters}
            onChange={setFilters}
            resultCount={filteredTracks.length}
            totalCount={MOCK_TRACKS.length}
          />
          <TrackLibrary
            tracks={filteredTracks}
            setTrackIds={setTrackIds}
            onAdd={addTrack}
          />
        </div>

        <CurrentSet
          setName={setName}
          items={resolvedSetItems}
          onSetNameChange={setSetName}
          onMoveUp={(index) => moveTrack(index, -1)}
          onMoveDown={(index) => moveTrack(index, 1)}
          onRemove={removeTrack}
          onTransitionChange={updateTransition}
          onClear={clearSet}
        />
      </div>
    </div>
  );
`

git remote add origin https://github.com/amberyan-ctrl/Flowlist.git
git branch -M main
git push -u origin main