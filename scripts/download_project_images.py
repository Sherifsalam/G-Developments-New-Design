#!/usr/bin/env python3
"""
Download the renders and masterplans listed in projects-images-masterplans.json for the
communities that had no photography, straight into src/assets/media/projects/<id>/.

    python scripts/download_project_images.py

These are listing-site copies (Property Finder, Nawy, realestate.eg, elbayt) and brochure pages,
used as placeholders so the pages are not showing brand plate art. Replace them with the original
renders from the G Developments marketing team before launch — see README, "Before launch".

Only uses the Python standard library. Files already present are skipped, so re-running is cheap.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request
from urllib.parse import unquote, urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MEDIA = os.path.join(ROOT, "src", "assets", "media", "projects")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*",
}

EXT_BY_TYPE = {
    "image/webp": ".webp", "image/jpeg": ".jpg", "image/jpg": ".jpg",
    "image/png": ".png", "image/avif": ".avif",
}


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def fetch(url, dest_no_ext):
    """Save the URL, choosing the extension from the response type. Returns the path or None."""
    for existing in (dest_no_ext + e for e in (".webp", ".jpg", ".png", ".avif")):
        if os.path.exists(existing):
            return existing
    try:
        req = urllib.request.Request(url, headers={**HEADERS, "Referer": "https://" + urlparse(url).netloc + "/"})
        with urllib.request.urlopen(req, timeout=90) as r:
            ctype = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
            body = r.read()
    except (urllib.error.URLError, urllib.error.HTTPError, OSError) as exc:
        print("  FAIL %s\n       %s" % (exc, url))
        return None
    if not ctype.startswith("image/"):
        print("  SKIP not an image (%s)\n       %s" % (ctype or "unknown", url))
        return None
    ext = EXT_BY_TYPE.get(ctype) or os.path.splitext(unquote(urlparse(url).path))[1] or ".img"
    path = dest_no_ext + ext
    with open(path, "wb") as out:
        out.write(body)
    print("  ok   %s  (%.0f KB)" % (os.path.relpath(path, ROOT), len(body) / 1024))
    return path


def main():
    with open(os.path.join(HERE, "projects-images-masterplans.json"), encoding="utf-8") as f:
        data = json.load(f)

    manifest = []
    for project in data["projects"]:
        pid = project.get("id") or slug(project["name"])
        shots = project.get("photos") or []
        plans = project.get("masterplan") or []
        if not shots and not plans:
            print("%s: nothing listed (%s)" % (project["name"], project.get("status", "no assets")))
            continue

        folder = os.path.join(MEDIA, pid)
        os.makedirs(folder, exist_ok=True)
        print("%s -> projects/%s/" % (project["name"], pid))

        for i, item in enumerate(plans, 1):
            name = "masterplan" if len(plans) == 1 else "masterplan-%d" % i
            got = fetch(item["url"], os.path.join(folder, name))
            if got:
                manifest.append({"project": pid, "kind": "masterplan", "file": os.path.relpath(got, ROOT),
                                 "source": item["source"], "caption": item["caption"], "url": item["url"]})
        for i, item in enumerate(shots, 1):
            got = fetch(item["url"], os.path.join(folder, "%02d" % i))
            if got:
                manifest.append({"project": pid, "kind": "photo", "file": os.path.relpath(got, ROOT),
                                 "source": item["source"], "caption": item["caption"], "url": item["url"]})

    out = os.path.join(HERE, "project-images-manifest.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"note": data["note"], "files": manifest}, f, indent=2, ensure_ascii=False)
    print("\n%d files saved. Manifest: %s" % (len(manifest), os.path.relpath(out, ROOT)))
    return 0 if manifest else 1


if __name__ == "__main__":
    sys.exit(main())
