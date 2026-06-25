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
  const [agentInput, setAgentInput] = useState("");
  const [agentResult, setAgentResult] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  async function captureSetIdea() {
    const cleanInput = agentInput.trim();

    if (!cleanInput) return;

    setIsCapturing(true);
    setAgentResult(null);

    try {
      const response = await fetch("/api/agents/capture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: cleanInput,
          context: {
            setName,
            currentTrackCount: setTracks.length,
            availableTrackCount: MOCK_TRACKS.length,
          },
        }),
      });

      const data = await response.json();

      const firstTask = data.tasks?.[0];

      setAgentResult(firstTask?.title ?? cleanInput);
    } catch {
      setAgentResult(cleanInput);
    } finally {
      setIsCapturing(false);
    }
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

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-medium">Capture set idea</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Describe a messy DJ set idea and the agent will turn it into a draft.
            </p>
          </div>

          <textarea
            value={agentInput}
            onChange={(event) => setAgentInput(event.target.value)}
            placeholder="Example: Start with warm amapiano, move into afro house around 122 BPM, then end with something high energy."
            className="min-h-24 w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />

          <button
            type="button"
            onClick={captureSetIdea}
            disabled={isCapturing || !agentInput.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"
          >
            {isCapturing ? "Capturing..." : "Capture with Agent"}
          </button>

          {agentResult ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="font-medium">Captured draft</p>
              <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                {agentResult}
              </p>
            </div>
          ) : null}
        </div>
      </section>

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
}
