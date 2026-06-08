#!/usr/bin/env python3
"""One-time script to parse archive HTML and extract images from zip."""

import html as html_module
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ZIP_PATH = Path("/Users/thomaslebas/Desktop/Visual communication — Archive of work by Thomas Le Bas.zip")
HTML_NAME = "VisualcommunicationArchiveofworkbyThomasLeBas.html"
IMAGES_OUT = ROOT / "images" / "archive"
DATA_OUT = ROOT / "js" / "data" / "archive.js"

ENTITIES = [
    ("&nbsp;", " "),
    ("&amp;", "&"),
    ("&larr;", "←"),
    ("&rsquo;", "'"),
    ("&lsquo;", "'"),
    ("&rdquo;", '"'),
    ("&ldquo;", '"'),
    ("&#39;", "'"),
    ("&ouml;", "ö"),
    ("&reg;", "®"),
    ("&szlig;", "ß"),
    ("&auml;", "ä"),
    ("&eacute;", "é"),
    ("&ndash;", "–"),
    ("&mdash;", "—"),
]


def clean(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    for ent, ch in ENTITIES:
        text = text.replace(ent, ch)
    return html_module.unescape(text).strip()


def parse_projects(html: str) -> list[dict]:
    anchors = [(m.group(1), m.start()) for m in re.finditer(r'id="(h\.[^"]+)"', html)]
    projects = []

    for i, (_aid, pos) in enumerate(anchors):
        if i == 0:
            continue

        end = anchors[i + 1][1] if i + 1 < len(anchors) else len(html)
        chunk = html[pos:end]

        paras = [clean(p) for p in re.findall(r"<p[^>]*>(.*?)</p>", chunk, re.I | re.S)]
        paras = [p for p in paras if p and p != "← Back"]

        imgs = re.findall(r'src="images/([^"]+)"', chunk)
        title = paras[0] if paras else ""
        year = next((p for p in reversed(paras) if re.match(r"^\d{4}", p)), "")
        credits = [
            p
            for p in paras
            if any(k in p for k in ["Designed", "collaboration", "In collaboration"])
        ]
        skip = {title, year, "PDF/JPG Download", "Feel free to use and share."} | set(credits)
        desc_parts = [p for p in paras[1:] if p not in skip]

        projects.append(
            {
                "title": title,
                "year": year,
                "description": " ".join(desc_parts),
                "credit": " ".join(credits),
                "images": imgs,
                "thumbnail": imgs[0] if imgs else None,
            }
        )

    return projects


def main() -> None:
    if not ZIP_PATH.exists():
        print(f"Zip not found: {ZIP_PATH}", file=sys.stderr)
        sys.exit(1)

    IMAGES_OUT.mkdir(parents=True, exist_ok=True)
    DATA_OUT.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(ZIP_PATH, "r") as zf:
        html = zf.read(HTML_NAME).decode("utf-8")
        projects = parse_projects(html)

        for name in zf.namelist():
            if name.startswith("images/") and not name.endswith("/"):
                filename = Path(name).name
                dest = IMAGES_OUT / filename
                dest.write_bytes(zf.read(name))

    js_content = "const archiveProjects = " + json.dumps(projects, indent=2, ensure_ascii=False) + ";\n"
    DATA_OUT.write_text(js_content, encoding="utf-8")

    print(f"Parsed {len(projects)} projects")
    print(f"Wrote {DATA_OUT}")
    print(f"Extracted images to {IMAGES_OUT}")


if __name__ == "__main__":
    main()
