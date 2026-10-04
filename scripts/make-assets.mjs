#!/usr/bin/env node
// Generates the placeholder social card (public/opengraph.jpg) and PNG app icons.
// Replace opengraph.jpg with final artwork when it is ready.

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (...p) => path.join(root, "public", ...p);

const title = "ഓർഡിനറി";
const card = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a140e" stop-opacity=".55"/>
      <stop offset=".5" stop-color="#2a140e" stop-opacity=".1"/>
      <stop offset="1" stop-color="#2a140e" stop-opacity=".8"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#shade)"/>
  <text x="600" y="172" text-anchor="middle" font-family="Nirmala UI, Noto Sans Malayalam, sans-serif"
        font-weight="800" font-size="82" fill="#fff3e0">${title}</text>
  <text x="600" y="630" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif"
        font-size="40" letter-spacing="8" fill="#fff3e0" fill-opacity=".85">ORDINARY</text>
</svg>`);

await sharp(pub("bg", "bus-interior.webp"))
  .resize(1200, 675, { fit: "cover", position: "centre" })
  .composite([{ input: card }])
  // JPEG keeps it small enough for WhatsApp and other link previews.
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub("opengraph.jpg"));

const icon = (size, pad) =>
  Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 72 72">
  <rect width="72" height="72" fill="#d9251c"/>
  <g transform="translate(${pad} ${pad}) scale(${(72 - pad * 2) / 72})" fill="none" stroke="#fff3e0" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <rect x="18" y="13" width="36" height="38" rx="6"/>
    <path d="M18 34h36M23 20h26v10H23z"/>
    <path d="M24 51v5M48 51v5"/>
  </g>
  <circle cx="26" cy="41" r="2" fill="#fff3e0"/><circle cx="46" cy="41" r="2" fill="#fff3e0"/>
</svg>`);

await sharp(icon(512, 0)).png().toFile(pub("icon-512.png"));
await sharp(icon(512, 0)).resize(192, 192).png().toFile(pub("icon-192.png"));
await sharp(icon(512, 0)).resize(180, 180).png().toFile(path.join(root, "app", "apple-icon.png"));
await sharp(icon(512, 0)).resize(32, 32).png().toFile(path.join(root, "app", "icon.png"));
console.log("Wrote opengraph.jpg and icons");
