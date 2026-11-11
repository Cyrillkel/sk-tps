import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Next.js already installs sharp; resolve it from Next's own dependencies.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const imagesDirectory = new URL("../public/images/services/", import.meta.url);
const sources = ["industrial", "pipelines", "electrical", "insulation", "maintenance"];
const targetWidths = [480, 768, 1280];

for (const name of sources) {
  const source = fileURLToPath(new URL(`${name}.webp`, imagesDirectory));
  const metadata = await sharp(source).metadata();
  if (!metadata.width) throw new Error(`Missing source width: ${source}`);

  const widths = [...new Set(targetWidths.map((width) => Math.min(width, metadata.width)))];
  for (const width of widths) {
    const destination = fileURLToPath(new URL(`${name}-variants-${width}.webp`, imagesDirectory));
    const result = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(destination);
    process.stdout.write(`${name}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KiB\n`);
  }
}
