#!/usr/bin/env node
// Converts a source illustration into the desktop and mobile background files.
// Usage: node scripts/prepare-bg.mjs <source-image> [focusX=0.49]
//   focusX is the horizontal centre of the mobile crop, from 0 (left) to 1 (right).

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [source, focusArg] = process.argv.slice(2);

if (!source) {
  console.error("Usage: node scripts/prepare-bg.mjs <source-image> [focusX]");
  process.exit(1);
}

const focusX = Math.min(1, Math.max(0, Number(focusArg ?? 0.49)));
const outDir = path.join(root, "public", "bg");
const image = sharp(source);
const { width, height } = await image.metadata();

await sharp(source)
  .resize({ width: Math.min(width, 2560), withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(path.join(outDir, "bus-interior.webp"));

// Portrait crop (roughly 10:16) for phones.
const cropWidth = Math.min(width, Math.round(height * 0.625));
const left = Math.round(
  Math.min(width - cropWidth, Math.max(0, width * focusX - cropWidth / 2)),
);

await sharp(source)
  .extract({ left, top: 0, width: cropWidth, height })
  .webp({ quality: 82 })
  .toFile(path.join(outDir, "bus-interior-mobile.webp"));

console.log(
  `Wrote bus-interior.webp (${Math.min(width, 2560)}px wide) and bus-interior-mobile.webp (${cropWidth}x${height}, left ${left})`,
);
