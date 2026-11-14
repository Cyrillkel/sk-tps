import { readdir, rm, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Photos sent by the client: portfolio-sources/<project-slug>/*.jpg → public WebP + manifest.
// Next.js already installs sharp; resolve it from Next's own dependencies.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");

const sourcesDirectory = new URL("../portfolio-sources/", import.meta.url);
const outputDirectory = new URL("../public/images/portfolio/", import.meta.url);
const manifestFile = new URL("../src/entities/project/model/portfolio-photos.json", import.meta.url);
const sourceExtensions = /\.(jpe?g|png|webp)$/i;
const fullSize = 2200;
const previewSize = 640;

const manifest = {};
const slugs = (await readdir(sourcesDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

await rm(outputDirectory, { recursive: true, force: true });

for (const slug of slugs) {
  if (!/^[a-z0-9_-]+$/.test(slug)) throw new Error(`Use latin letters, digits, "-" or "_" in folder names: ${slug}`);
  const files = (await readdir(new URL(`${slug}/`, sourcesDirectory))).filter((name) => sourceExtensions.test(name)).sort();
  if (!files.length) throw new Error(`No photos in portfolio-sources/${slug}`);
  await mkdir(new URL(`${slug}/`, outputDirectory), { recursive: true });

  manifest[slug] = [];
  for (const [index, file] of files.entries()) {
    const source = fileURLToPath(new URL(`${slug}/${file}`, sourcesDirectory));
    const name = String(index + 1).padStart(2, "0");
    // rotate() applies EXIF orientation; sharp drops EXIF (including GPS) from the output.
    const full = await sharp(source).rotate().resize({ width: fullSize, height: fullSize, fit: "inside", withoutEnlargement: true }).webp({ quality: 80, effort: 6 })
      .toFile(fileURLToPath(new URL(`${slug}/${name}.webp`, outputDirectory)));
    const preview = await sharp(source).rotate().resize({ width: previewSize, height: previewSize, fit: "inside", withoutEnlargement: true }).webp({ quality: 76, effort: 6 })
      .toFile(fileURLToPath(new URL(`${slug}/${name}-preview.webp`, outputDirectory)));
    manifest[slug].push({
      file,
      src: `/images/portfolio/${slug}/${name}.webp`,
      preview: `/images/portfolio/${slug}/${name}-preview.webp`,
      width: full.width,
      height: full.height,
      previewWidth: preview.width,
      previewHeight: preview.height,
    });
    process.stdout.write(`${slug}/${file} → ${name}.webp ${full.width}×${full.height}, ${Math.round(full.size / 1024)} KiB; preview ${Math.round(preview.size / 1024)} KiB\n`);
  }
}

await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
