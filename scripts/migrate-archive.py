#!/usr/bin/env python3
"""One-time script to migrate the archive from a single JSON blob + flat image
pool into the same per-project markdown + per-project image folder pattern
used by case studies and side quests.

Reads js/data/archive.js (the old JSON array), moves each project's images
into images/archive/<slug>/<base>-<n>.<ext>, and prints a manifest (slug,
image count, base word, thumbnail index) that is used to hand-write the
markdown files. Does not touch content/archive/*.md — those are written
separately since they need real editorial judgement.
"""

import json
import re
import shutil
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OLD_DATA = ROOT / "js" / "data" / "archive.js"
IMAGES_ROOT = ROOT / "images" / "archive"

# base descriptive word used for that project's image filenames, chosen by
# eye after reviewing each project's thumbnail
BASE_WORDS = {
    "Chlöe Swarbrick for Auckland Central 2020": "poster",
    "Fuck Racism": "poster",
    "LAWA: Land Air Water Aotearoa": "screen",
    "Poetry New Zealand Yearbook": "spread",
    "Stroma: Soundbytes": "poster",
    "Gore® Fabrics": "system",
    "Open Lab": "mark",
    "Yield": "installation",
    "Kakapo: The Evolution Story": "poster",
    "Kakapo: Strigops Habroptilus": "spread",
    "Blood and Bone": "screen",
    "Dialogues with Tomorrow 2010": "spread",
    "Old School New School Timeline": "installation",
    "The Storied Landscape": "render",
    "Votelocal": "screen",
    "Miscellaneous brandmarks": "mark",
    "Opening Night": "poster",
    "Die Zusammenarbeiter": "screen",
    "Eight Point Icons": "icon",
    "The Gutters are Filled with Gold": "infographic",
    "Park am Gleisdreieck": "map",
    "Studentendorf Adlershof Pictograms": "icon",
    "Großer Tiergarten Berlin Faltplan": "map",
    "Großer Tiergarten Berlin": "sign",
    "Technische Hochschule Wildau": "sign",
    "Te Awahou Nieuwe Stroom": "mark",
    "Flagpost": "photo",
    "Our Data, Our Way": "screen",
    "Life Infographics": "poster",
    "DesignCo.": "screen",
    "I do it": "poster",
    "Street Chinese": "spread",
}

# explicit slug overrides where the auto-slugified title would be awkward
SLUG_OVERRIDES = {
    "Chlöe Swarbrick for Auckland Central 2020": "chloe-swarbrick-2020",
    "Gore® Fabrics": "gore-fabrics",
    "Großer Tiergarten Berlin Faltplan": "grosser-tiergarten-berlin-faltplan",
    "Großer Tiergarten Berlin": "grosser-tiergarten-berlin",
    "DesignCo.": "designco",
}


def slugify(title: str) -> str:
    if title in SLUG_OVERRIDES:
        return SLUG_OVERRIDES[title]
    normalized = unicodedata.normalize("NFKD", title)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_text).strip("-").lower()
    return slug


def main() -> None:
    raw = OLD_DATA.read_text(encoding="utf-8")
    json_text = raw.split("=", 1)[1].strip()
    if json_text.endswith(";"):
        json_text = json_text[:-1]
    projects = json.loads(json_text)

    manifest = []

    for project in projects:
        title = project["title"]
        slug = slugify(title)
        base = BASE_WORDS[title]
        images = project.get("images") or []
        thumbnail = project.get("thumbnail")

        dest_dir = IMAGES_ROOT / slug
        dest_dir.mkdir(parents=True, exist_ok=True)

        new_names = []
        thumb_index = 0
        for i, filename in enumerate(images, start=1):
            src = IMAGES_ROOT / filename
            ext = Path(filename).suffix
            new_name = f"{base}-{i}{ext}"
            dest = dest_dir / new_name
            if src.exists():
                shutil.move(str(src), str(dest))
            else:
                print(f"WARNING: missing source image {src}")
            new_names.append(new_name)
            if filename == thumbnail:
                thumb_index = i

        manifest.append(
            {
                "title": title,
                "slug": slug,
                "year": project.get("year", ""),
                "base": base,
                "count": len(images),
                "thumb_index": thumb_index,
                "new_names": new_names,
            }
        )

    manifest_path = ROOT / "scripts" / "archive-migration-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote manifest to {manifest_path}")
    print(f"Migrated {len(manifest)} projects")


if __name__ == "__main__":
    main()
