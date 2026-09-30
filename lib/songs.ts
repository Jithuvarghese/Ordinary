import rawSongs from "@/data/songs.json";

export type Song = {
  /** YouTube video ID. */
  id: string;
  title: string;
  artist: string;
  /** Length in seconds, 0 when unknown. */
  duration: number;
};

export const songs: Song[] = rawSongs;

export function isPlaceholder(song: Pick<Song, "id">): boolean {
  return song.id.startsWith("REPLACE_ME");
}

export function coverSrc(song: Pick<Song, "id">): string | null {
  return isPlaceholder(song) ? null : `/covers/${song.id}.jpg`;
}
