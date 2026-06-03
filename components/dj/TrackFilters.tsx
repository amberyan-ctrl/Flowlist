"use client";

import { ALL_KEYS, ALL_TAGS } from "@/lib/mockTracks";
import type { TrackFilters as TrackFiltersState } from "@/types/dj";

type Props = {
  filters: TrackFiltersState;
  onChange: (filters: TrackFiltersState) => void;
  resultCount: number;
  totalCount: number;
};

export function TrackFilters({
  filters,
  onChange,
  resultCount,
  totalCount,
}: Props) {
  function update(partial: Partial<TrackFiltersState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Filters</h2>
        <span className="text-xs text-zinc-500">
          {resultCount} of {totalCount} tracks
        </span>
      </div>

      <input
        type="search"
        placeholder="Search title, artist, tags…"
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
      />

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-zinc-500">
          BPM min
          <input
            type="number"
            min={0}
            placeholder="e.g. 120"
            value={filters.bpmMin}
            onChange={(e) => update({ bpmMin: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
        <label className="text-xs text-zinc-500">
          BPM max
          <input
            type="number"
            min={0}
            placeholder="e.g. 130"
            value={filters.bpmMax}
            onChange={(e) => update({ bpmMax: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-zinc-500">
          Key
          <select
            value={filters.key}
            onChange={(e) => update({ key: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="">Any</option>
            {ALL_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-zinc-500">
          Min energy
          <input
            type="number"
            min={1}
            max={10}
            placeholder="1–10"
            value={filters.energyMin}
            onChange={(e) => update({ energyMin: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          />
        </label>
      </div>

      <label className="text-xs text-zinc-500">
        Tag
        <select
          value={filters.tag}
          onChange={(e) => update({ tag: e.target.value })}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Any</option>
          {ALL_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() =>
          onChange({
            search: "",
            bpmMin: "",
            bpmMax: "",
            key: "",
            energyMin: "",
            tag: "",
          })
        }
        className="text-sm text-zinc-600 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        Clear filters
      </button>
    </div>
  );
}
