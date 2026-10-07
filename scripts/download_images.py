#!/usr/bin/env python3
"""
Download every image (and the brochure PDF) listed in playa-ghazala.json.

Usage (from anywhere):
    python scripts/download_images.py

Reads scripts/playa-ghazala.json, which sits beside this file.

Files are saved to ./images/ with names like 01-hero.webp, 05-masterplan-zone-01.webp.
Only uses the Python standard library.
"""
import json
import os
import urllib.request
from urllib.parse import unquote, urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "images")
os.makedirs(OUT, exist_ok=True)

with open(os.path.join(HERE, "playa-ghazala.json"), encoding="utf-8") as f:
    data = json.load(f)

items = [("hero", data["hero"]["image"]), ("about", data["about"]["image"])]
for o in data["offerings"]:
    items.append((o["id"], o["image"]))
for z in data["masterplan"]["zones"]:
    items.append(("masterplan-" + z["zone"].lower().replace(" ", "-"), z["image"]))
items.append(("architecture", data["architecture"]["image"]))
for p in data["related_projects"]["items"]:
    items.append(("related-" + p["name"].lower().replace(" ", "-"), p["image"]))

manifest = []
headers = {"User-Agent": "Mozilla/5.0 (asset export)"}

for i, (label, img) in enumerate(items, 1):
    ext = os.path.splitext(unquote(urlparse(img["url"]).path))[1] or ".webp"
    if ext == ".pdf":  # safety: some names end in .pdf.webp
        ext = ".webp"
    name = f"{i:02d}-{label}{ext}"
    dest = os.path.join(OUT, name)
    try:
        req = urllib.request.Request(img["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as out:
            out.write(r.read())
        print(f"ok   {name}")
        manifest.append({"file": name, "alt": img["alt"], "source_url": img["url"]})
    except Exception as e:
        print(f"FAIL {name}: {e}")

# Brochure PDF
try:
    req = urllib.request.Request(data["brochure"]["url"], headers=headers)
    with urllib.request.urlopen(req, timeout=120) as r, open(os.path.join(OUT, "playa-ghazala-brochure.pdf"), "wb") as out:
        out.write(r.read())
    print("ok   playa-ghazala-brochure.pdf")
except Exception as e:
    print(f"FAIL brochure: {e}")

with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print(f"\nDone. {len(manifest)} images saved to {OUT}")
