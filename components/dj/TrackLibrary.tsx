"use client";

import type { Track } from "@/types/dj";

type Props = {
  tracks: Track[];
  setTrackIds: Set<number>;
  onAdd: (trackId: number) => void;
};

export function TrackLibrary({ tracks, setTrackIds, onAdd }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-medium">Track Library</h2>
      </div>

      {tracks.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-zinc-500">
          No tracks match your filters.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {tracks.map((track) => {
            const inSet = setTrackIds.has(track.id);
            return (
              <li
                key={track.id}
                className="flex items-start justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{track.title}</p>
                  <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                    {track.artist}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {[track.bpm && `${track.bpm} BPM`, track.key, track.genre]
                      .filter(Boolean)
                      .join(" · ")}
                    {track.energy !== null && ` · E${track.energy}`}
                  </p>
                  {track.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {track.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  disabled={inSet}
                  onClick={() => onAdd(track.id)}
                  className="shrink-0 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {inSet ? "In set" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
