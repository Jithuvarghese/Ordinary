#!/usr/bin/env node
// Verifies every entry in data/songs.json still resolves through YouTube oEmbed.
// Exits non-zero when any real entry is broken or embed-blocked.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const songs = JSON.parse(await fs.readFile(path.join(root, "data", "songs.json"), "utf8"));

let failures = 0;
let skipped = 0;

for (const song of songs) {
  if (song.id.startsWith("REPLACE_ME")) {
    console.warn(`WARN  ${song.id}: placeholder entry, skipped`);
    skipped++;
    continue;
  }

  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${song.id}`,
  )}&format=json`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      console.log(`OK    ${song.id}  ${song.title}`);
    } else {
      failures++;
      const reason =
        res.status === 401 ? "embedding disabled" : res.status === 404 ? "not found or private" : `HTTP ${res.status}`;
      console.error(`FAIL  ${song.id}  ${song.title} (${reason})`);
    }
  } catch (err) {
    failures++;
    console.error(`FAIL  ${song.id}  ${song.title} (${err.message})`);
  }
}

console.log(`\n${songs.length - failures - skipped} ok, ${failures} failed, ${skipped} skipped`);
process.exit(failures > 0 ? 1 : 0);
