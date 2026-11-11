"""Check the migrated photo inventory and, optionally, the static export.

Run from any directory: python3 scripts/verify-content.py [--build]
Only Python's standard library is required.
"""

import argparse
from collections import Counter
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE_URL = "https://sk-tps.ru"


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.h1_count = 0
        self.h1_text = ""
        self.in_h1 = False
        self.images = []
        self.links = []
        self.canonicals = []
        self.descriptions = []
        self.ids = []
        self.section_ids = []
        self.image_sources = []
        self.aria_references = []
        self.title = ""
        self.in_title = False
        self.feed(source)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
            if tag == "section":
                self.section_ids.append(attrs["id"])
        for attribute in ("aria-labelledby", "aria-describedby", "aria-controls"):
            self.aria_references.extend(attrs.get(attribute, "").split())
        if tag == "h1":
            self.h1_count += 1
            self.in_h1 = True
        elif tag == "img":
            self.images.append(attrs.get("src", ""))
            if attrs.get("srcset"):
                self.image_sources.extend(item.strip().split()[0] for item in attrs["srcset"].split(","))
        elif tag == "source" and attrs.get("srcset"):
            self.image_sources.extend(item.strip().split()[0] for item in attrs["srcset"].split(","))
        elif tag == "a":
            self.links.append(attrs.get("href", ""))
        elif tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs.get("href"))
        elif tag == "meta" and attrs.get("name") == "description":
            self.descriptions.append(attrs.get("content", ""))
        elif tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_h1:
            self.h1_text += data
        if self.in_title:
            self.title += data


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify_inventory():
    audit = json.loads((ROOT / "docs/project-photo-manifest.json").read_text())
    projects = json.loads((ROOT / "frontend/src/entities/project/model/projects.json").read_text())
    services_source = (ROOT / "frontend/src/entities/service/model/services.ts").read_text()
    service_slugs = re.findall(r'slug: "([^"]+)"', services_source)
    require(audit["status"] == "complete" and not audit["failures"], "Incomplete source inventory")
    require(len(projects) == audit["counts"]["projects"] == 23, "Missing source projects")
    require(len({project["slug"] for project in projects}) == len(projects), "Duplicate project paths")
    require(len({project["title"] for project in projects}) == len(projects), "Duplicate project titles")

    source_by_url = {project["sourceUrl"]: project for project in audit["projects"]}
    all_originals = set()
    files = set()
    for project in projects:
        source = source_by_url[project["sourceUrl"]]
        require(source["complete"] and not source["missingGalleryOriginalUrls"], f"Incomplete source: {project['slug']}")
        source_photos = {photo["originalUrl"]: photo for photo in source["photos"]}
        require({photo["originalUrl"] for photo in project["photos"]} == set(source_photos), f"Omitted photos: {project['slug']}")
        require(set(source["galleryOriginalUrls"]) <= set(source_photos), f"Missing gallery: {project['slug']}")
        require(source["coverOriginalUrl"] in source_photos or not source["coverOriginalUrl"], f"Missing cover: {project['slug']}")
        require(project["coverSrc"] in {photo["src"] for photo in project["photos"]}, f"Invalid cover: {project['slug']}")
        require(set(project["serviceSlugs"]) <= set(service_slugs), f"Unknown service: {project['slug']}")
        old_path = urlparse(project["sourceUrl"]).path.strip("/")
        if not old_path.endswith(".html"):
            require(project["slug"] == old_path, f"Legacy project path changed: {old_path}")

        for photo in project["photos"]:
            original = source_photos[photo["originalUrl"]]
            all_originals.add(photo["originalUrl"])
            for field, hash_field in (("src", "fullSha256"), ("preview", "previewSha256")):
                relative = photo[field]
                require(relative == original[field], f"Changed photo reference: {relative}")
                path = ROOT / "frontend/public" / relative.lstrip("/")
                data = path.read_bytes()
                require(data[:4] == b"RIFF" and data[8:12] == b"WEBP", f"Invalid WebP file: {path}")
                require(hashlib.sha256(data).hexdigest() == original[hash_field], f"Photo checksum mismatch: {path}")
                files.add(relative)
            for dimension in ("width", "height", "previewWidth", "previewHeight"):
                require(photo[dimension] == original[dimension] > 0, f"Incorrect image size: {photo['src']}")

    require(len(all_originals) == audit["counts"]["sourceOriginalUrls"] == 205, "Missing source image URLs")
    require(len(files) == audit["counts"]["webpFiles"] == 410, "Missing WebP variants")
    actual_files = {"/" + str(path.relative_to(ROOT / "frontend/public")) for path in (ROOT / "frontend/public/images/projects").glob("*.webp")}
    require(files == actual_files, "Unexpected or missing WebP files")
    print(f"PASS: {len(projects)} projects, {len(all_originals)} source photographs, {len(files)} verified WebP files")
    return projects, service_slugs


def verify_build(projects, service_slugs):
    output = ROOT / "frontend/out"
    geography_source = (ROOT / "frontend/src/entities/geography/model/geography.ts").read_text()
    listed_cities = re.findall(r'\{ slug: "([^"]+)", name: "[^"]+", inCity:', geography_source)
    city_records = []
    for source in sorted((ROOT / "frontend/src/entities/geography/model").glob("city-content-*.ts")):
        city_records.extend(re.findall(r'citySlug: "([^"]+)",\s*status: "(published|draft)"', source.read_text()))
    require(len(city_records) == len(listed_cities) == 28, "Missing city content")
    require(len({slug for slug, _ in city_records}) == len(city_records), "Duplicate city content")
    require({slug for slug, _ in city_records} == set(listed_cities), "City content differs from work geography")
    city_slugs = [slug for slug, status in city_records if status == "published"]
    city_paths = [f"/goroda/{slug}/" for slug in city_slugs]
    paths = ["/", "/seti/", "/proekty/", "/contacts/", "/soglasie/"]
    paths += [f"/{slug}/" for slug in service_slugs]
    paths += [f"/{project['slug']}/" for project in projects]
    paths += city_paths
    pages = {}
    titles = []
    for path in paths:
        html = output / path.lstrip("/") / "index.html"
        page = Page(html.read_text())
        require(page.h1_count == 1, f"Expected one h1: {path}")
        duplicate_ids = [identifier for identifier, count in Counter(page.ids).items() if count > 1]
        require(not duplicate_ids, f"Duplicate HTML IDs on {path}: {duplicate_ids}")
        require(set(page.aria_references) <= set(page.ids), f"Broken ARIA references: {path}")
        require(page.canonicals == [SITE_URL + path], f"Incorrect canonical: {path}")
        require(len(page.descriptions) == 1 and bool(page.descriptions[0].strip()), f"Missing description: {path}")
        for image in page.images + page.image_sources:
            require(image.startswith("/"), f"Remote runtime image: {image}")
            require((output / urlparse(image).path.lstrip("/")).is_file(), f"Missing exported image: {image}")
        pages[path] = page
        titles.append(page.title)
    require(all(title.strip() for title in titles), "Missing page title")
    require(not [title for title, count in Counter(titles).items() if count > 1], "Duplicate page titles")

    require("about" in pages["/"].section_ids, "Missing homepage company section")
    shared_sections = [section for section in pages["/"].section_ids if section not in {"projects", "about"}]
    detail_paths = [f"/{slug}/" for slug in service_slugs] + [f"/{project['slug']}/" for project in projects]
    for path in detail_paths:
        page = pages[path]
        require("about" not in page.ids, f"Company section must not appear on detail pages: {path}")
        require([section for section in page.section_ids if section in shared_sections] == shared_sections, f"Homepage sections missing, duplicated or out of order: {path}")
        for link in page.links:
            if link.startswith("#"):
                require(link[1:] in page.ids, f"Broken page anchor {link}: {path}")
    print(f"PASS: {len(detail_paths)} detail pages include shared sections once and in order, without the company section, with valid local anchors")

    for project in projects:
        page = pages[f"/{project['slug']}/"]
        require({photo["preview"] for photo in project["photos"]} <= set(page.images), f"Gallery photos omitted from HTML: {project['slug']}")
    require(all(f"/{project['slug']}/" in pages["/proekty/"].links or f"/{project['slug']}" in pages["/proekty/"].links for project in projects), "Project missing from portfolio")

    home_source = (output / "index.html").read_text()
    geography = re.search(r'<section[^>]+id="geography".*?</section>', home_source, re.DOTALL)
    require(geography is not None, "Missing homepage geography")
    require(geography[0].count('class="geography-region"') == 3, "Missing work regions")
    require(len(re.findall(r'<li\b', geography[0])) == 28, "Missing city names")
    require(set(re.findall(r'href="(/goroda/[^\"]+/)"', geography[0])) == set(city_paths), "Geography must link to every published city")
    city_descriptions = []
    city_sections = [section for section in pages["/"].section_ids if section != "projects"]
    for path in city_paths:
        page = pages[path]
        require([section for section in page.section_ids if section in city_sections] == city_sections, f"Missing or repeated company sections on city page: {path}")
        require("city-conditions" in page.ids and "city-questions" in page.ids, f"Missing city-specific content: {path}")
        require('"@type":"City"' in (output / path.lstrip("/") / "index.html").read_text(), f"Missing service area markup: {path}")
        for link in page.links:
            if link.startswith("#"):
                require(link[1:] in page.ids, f"Broken city page anchor {link}: {path}")
        city_descriptions.extend(page.descriptions)
    require(len(set(city_descriptions)) == len(city_descriptions), "Duplicate city descriptions")
    require(len({pages[path].h1_text for path in city_paths}) == len(city_paths), "Duplicate city H1 headings")
    actual_city_slugs = {path.name for path in (output / "goroda").iterdir() if path.is_dir()}
    require(actual_city_slugs == set(city_slugs), "Unexpected city routes were exported")
    print(f"PASS: {len(city_paths)} city pages with unique metadata, complete sections, local anchors and links from geography")
    require(not (output / "prochistka-kanalizacii").exists(), "Removed standalone sewer maintenance route was exported")

    sitemap = ET.parse(output / "sitemap.xml")
    urls = [element.text for element in sitemap.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    require(set(urls) == {SITE_URL + path for path in paths} and len(urls) == len(paths), "Sitemap differs from published pages")
    print(f"PASS: {len(paths)} static pages, unique titles, self canonicals, complete galleries and sitemap")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--build", action="store_true", help="also check frontend/out after pnpm build:static")
    args = parser.parse_args()
    data, slugs = verify_inventory()
    if args.build:
        verify_build(data, slugs)
