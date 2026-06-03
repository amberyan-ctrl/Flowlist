"use client";

import type { SetTrackItem, Track } from "@/types/dj";
import { exportSetAsMarkdown } from "@/types/dj";

import { SetTrackRow } from "./SetTrackRow";

type ResolvedItem = SetTrackItem & { track: Track };

type Props = {
  setName: string;
  items: ResolvedItem[];
  onSetNameChange: (name: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  onTransitionChange: (index: number, value: string) => void;
  onClear: () => void;
};

export function CurrentSet({
  setName,
  items,
  onSetNameChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onTransitionChange,
  onClear,
}: Props) {
  function handleExport() {
    const markdown = exportSetAsMarkdown(
      setName.trim() || "Untitled Set",
      items.map(({ track, transitionNotes }) => ({
        track,
        transitionNotes,
      })),
    );
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(setName.trim() || "set").replace(/\s+/g, "-").toLowerCase()}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-medium">Current Set</h2>
      </div>

      <div className="space-y-3 p-4">
        <label className="block text-xs text-zinc-500">
          Set name
          <input
            type="text"
            value={setName}
            onChange={(e) => onSetNameChange(e.target.value)}
            placeholder="Friday Warm-up"
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleExport}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Export Markdown
          </button>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={onClear}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-600"
          >
            Clear set
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="px-4 pb-8 text-center text-sm text-zinc-500">
          Add tracks from the library to build your set.
        </p>
      ) : (
        <ul className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
          {items.map((item, index) => (
            <SetTrackRow
              key={item.trackId}
              index={index}
              track={item.track}
              transitionNotes={item.transitionNotes}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onMoveUp={() => onMoveUp(index)}
              onMoveDown={() => onMoveDown(index)}
              onRemove={() => onRemove(index)}
              onTransitionChange={(value) =>
                onTransitionChange(index, value)
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
