#!/usr/bin/python3
"""Receive a static build over a restricted SSH connection."""

import fcntl
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
from typing import BinaryIO


SITE_ROOT = Path("/srv/sk-tps")
RELEASE_PATTERN = re.compile(r"[a-f0-9]{40}-[0-9]+-[0-9]+")
MAX_FILES = 30_000
MAX_BYTES = 512 * 1024 * 1024


def publish(stream: BinaryIO, release: str, root: Path = SITE_ROOT) -> None:
    if not RELEASE_PATTERN.fullmatch(release):
        raise ValueError("Invalid release ID")

    with (root / ".deploy.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        destination = root / "releases" / release
        destination.mkdir(mode=0o755)
        total_bytes = 0

        with tarfile.open(fileobj=stream, mode="r|gz") as archive:
            for count, member in enumerate(archive, start=1):
                name = PurePosixPath(member.name)
                if name.is_absolute() or ".." in name.parts:
                    raise ValueError("Archive path escapes release directory")
                if not (member.isfile() or member.isdir()):
                    raise ValueError("Only regular files and directories are allowed")

                total_bytes += member.size
                if member.size < 0 or count > MAX_FILES or total_bytes > MAX_BYTES:
                    raise ValueError("Build archive exceeds deployment limits")

                target = destination.joinpath(*name.parts)
                if member.isdir():
                    target.mkdir(parents=True, exist_ok=True, mode=0o755)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True, mode=0o755)
                    source = archive.extractfile(member)
                    if source is None:
                        raise ValueError("Archive member has no file data")
                    with source, target.open("xb") as output:
                        shutil.copyfileobj(source, output)
                    target.chmod(0o644)

        for required in ("index.html", "404.html"):
            if not (destination / required).is_file():
                raise ValueError(f"Missing {required}")

        static_assets = destination / "_next" / "static"
        if not static_assets.is_dir():
            raise ValueError("Missing Next.js static assets")

        # Keep hashed assets from earlier releases available to open browser tabs.
        shutil.copytree(static_assets, root / "shared" / "_next" / "static", dirs_exist_ok=True)
        (destination / "__deployment.json").write_text(
            json.dumps({"release": release}) + "\n", encoding="utf-8"
        )

        pending = root / f".current-{release}"
        pending.symlink_to(Path("releases") / release)
        pending.replace(root / "current")
        print(f"Published {release}", flush=True)


def main() -> None:
    os.umask(0o022)
    command = os.environ.get("SSH_ORIGINAL_COMMAND", "")
    if not command.startswith("publish "):
        raise ValueError("Only the publish command is allowed")
    publish(sys.stdin.buffer, command.removeprefix("publish "))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, tarfile.TarError) as error:
        print(f"Deployment failed: {error}", file=sys.stderr)
        sys.exit(1)
