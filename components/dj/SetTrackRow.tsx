"use client";

import type { Track } from "@/types/dj";

type Props = {
  index: number;
  track: Track;
  transitionNotes: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onTransitionChange: (value: string) => void;
};

export function SetTrackRow({
  index,
  track,
  transitionNotes,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onTransitionChange,
}: Props) {
  return (
    <li className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-500">#{index + 1}</p>
          <p className="font-medium">{track.title}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {track.artist}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {[track.bpm && `${track.bpm} BPM`, track.key]
              .filter(Boolean)
              .join(" · ")}
            {track.energy !== null && ` · Energy ${track.energy}/10`}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            aria-label="Move up"
            className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-40 dark:border-zinc-600"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            aria-label="Move down"
            className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-40 dark:border-zinc-600"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 dark:border-red-800 dark:text-red-400"
          >
            Remove
          </button>
        </div>
      </div>
      <label className="mt-3 block text-xs text-zinc-500">
        Transition notes
        <textarea
          rows={2}
          value={transitionNotes}
          onChange={(e) => onTransitionChange(e.target.value)}
          placeholder="e.g. Blend 16 bars, echo out…"
          className="mt-1 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
    </li>
  );
}
