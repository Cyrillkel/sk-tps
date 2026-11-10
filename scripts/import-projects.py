"""Normalize the verified source inventory into the site's project data."""

import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
manifest_path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / ".local/migration/projects-manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
if manifest["status"] != "complete" or manifest.get("failures"):
    raise ValueError("Complete the photo migration before importing project data")

service_links = {
    "rekonstrukciya_naruzhnoj_kanalizacii": ["promyshlennye-sistemy", "kanalizaciya"],
    "rekonstrukciya_pozharnogo_i_bytovogo_vodoprovoda": ["promyshlennye-sistemy", "vodosnabzhenie"],
    "stroitelstvo_naruzhnogo_vodoprovoda": ["promyshlennye-sistemy", "vodosnabzhenie"],
    "montazh_teplovoj_seti": ["promyshlennye-sistemy", "otoplenie"],
    "rekonstrukciya_paroprovoda": ["tekhnologicheskie-truboprovody", "paroprovody"],
}
titles = {
    "izgotovlenie_i_montazh_lestnicy": "Изготовление и монтаж лестницы в помещении",
    "izgotovlenie_i_montazh_lestnica": "Изготовление и монтаж наружной лестницы",
    "rekonstruciya_abk": "Реконструкция АБК «Префаб технологии»",
}

projects = []
seen_urls = set()
for source in manifest["projects"]:
    slug = source["sourceSlug"] if "." not in source["sourceSlug"] else source["slug"]
    title = titles.get(source["sourceSlug"], source["title"])
    photos = []
    for photo in source["photos"]:
        for field, sha_field in (("src", "fullSha256"), ("preview", "previewSha256")):
            path = ROOT / "frontend/public" / photo[field].lstrip("/")
            if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != photo[sha_field]:
                raise ValueError(f"Missing or modified photo: {path}")
        seen_urls.add(photo["originalUrl"])
        photos.append({key: photo[key] for key in ("src", "preview", "alt", "width", "height", "previewWidth", "previewHeight", "originalUrl", "isGalleryPhoto", "isListingCover")})
    cover = next((photo["src"] for photo in photos if photo["isListingCover"]), photos[0]["src"])
    projects.append({
        "slug": slug,
        "title": title,
        "sourceTitle": source["title"],
        "sourceUrl": source["sourceUrl"],
        "category": source["category"],
        "description": source["description"],
        "paragraphs": source["paragraphs"],
        "serviceSlugs": service_links.get(source["sourceSlug"], []),
        "citySlug": "maloyaroslavets" if source["sourceSlug"] == "ustrojstvo_fasada" else None,
        "coverSrc": cover,
        "photos": photos,
    })

if len(seen_urls) != manifest["counts"]["sourceOriginalUrls"]:
    raise ValueError("Some source photographs were omitted")

output = ROOT / "frontend/src/entities/project/model/projects.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(projects, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
audit = ROOT / "docs/project-photo-manifest.json"
audit.parent.mkdir(parents=True, exist_ok=True)
audit.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Imported {len(projects)} projects and {len(seen_urls)} source photographs")
