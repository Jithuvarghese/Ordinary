#!/usr/bin/env node
// Adds a song to data/songs.json from a YouTube URL or video ID and downloads its cover.
// Usage: npm run song:add -- <youtube-url-or-id> [more urls or ids...]

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const songsFile = path.join(root, "data", "songs.json");
const coversDir = path.join(root, "public", "covers");

export function parseVideoId(input) {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1, 12) || null;
    if (url.hostname.endsWith("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // Not a URL.
  }
  return null;
}

async function readSongs() {
  return JSON.parse(await fs.readFile(songsFile, "utf8"));
}

async function addOne(input, songs) {
  const id = parseVideoId(input);
  if (!id) {
    console.error(`Skipped "${input}": not a YouTube URL or video ID.`);
    return false;
  }
  if (songs.some((s) => s.id === id)) {
    console.log(`Skipped ${id}: already in songs.json.`);
    return false;
  }

  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;
  const res = await fetch(oembed);
  if (!res.ok) {
    console.error(`Skipped ${id}: oEmbed returned ${res.status} (removed, private or embedding disabled).`);
    return false;
  }
  const { title, author_name: artist } = await res.json();

  await fs.mkdir(coversDir, { recursive: true });
  const cover = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  if (cover.ok) {
    await fs.writeFile(path.join(coversDir, `${id}.jpg`), Buffer.from(await cover.arrayBuffer()));
  } else {
    console.warn(`  Could not download a cover for ${id}; the fallback disc will be used.`);
  }

  songs.push({ id, title, artist, duration: 0 });
  console.log(`Added ${id}: ${title} - ${artist}`);
  return true;
}

const inputs = process.argv.slice(2).filter((a) => a !== "--");
if (inputs.length === 0) {
  console.error("Usage: npm run song:add -- <youtube-url-or-id> [...]");
  process.exit(1);
}

const songs = await readSongs();
// The first real song replaces the placeholders rather than sitting after them.
const hadPlaceholders = songs.some((s) => s.id.startsWith("REPLACE_ME"));
let added = 0;
for (const input of inputs) {
  if (await addOne(input, songs)) added++;
}

if (added > 0) {
  const final = hadPlaceholders ? songs.filter((s) => !s.id.startsWith("REPLACE_ME")) : songs;
  await fs.writeFile(songsFile, JSON.stringify(final, null, 2) + "\n");
  console.log(`\nsongs.json now has ${final.length} song(s).`);
  console.log("Tip: set each song's duration (seconds) if you plan to use radioMode.");
} else {
  process.exitCode = 1;
}
