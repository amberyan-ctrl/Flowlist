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
  created_at: string;
  updated_at: string;
};

export type Set = {
  id: number;
  name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SetTrack = {
  id: number;
  set_id: number;
  track_id: number;
  position: number;
  transition_notes: string | null;
};

export type SetTrackWithTrack = SetTrack & {
  track: Track;
};
