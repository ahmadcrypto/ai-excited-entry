// ai-excited-01 entry: "The Town on the Jellyfish"
// The image beside this file is the whole entry. This program copies it,
// byte for byte, to the grader's output directory as entry.png.
// It uses only the Node standard library and makes no network calls,
// so two runs always produce identical bytes.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const outPath = join(outDir, 'entry.png');

// Read the image we ship, and refuse to run on anything that is not
// a whole PNG or JPEG (checked by its magic bytes, never by its name).
const image = readFileSync(sourcePath);
const isPng = image[0] === 0x89 && image[1] === 0x50 && image[2] === 0x4e && image[3] === 0x47;
const isJpeg = image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG');
}
if (image.length > 1048576) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB gate`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, image);

// Prove the copy is exact: re-read what we wrote and compare it,
// byte for byte, with the image we ship. A silent partial write
// must fail the run instead of reaching the judge.
const written = readFileSync(outPath);
if (!written.equals(image)) {
  throw new Error('output entry.png does not match the shipped image');
}
console.log(`wrote ${outPath} (${written.length} bytes)`);
