import io
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

import receive


def build_archive(files: dict[str, bytes], symlink: str | None = None) -> io.BytesIO:
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w:gz") as archive:
        for name, contents in files.items():
            member = tarfile.TarInfo(name)
            member.size = len(contents)
            archive.addfile(member, io.BytesIO(contents))
        if symlink:
            member = tarfile.TarInfo(symlink)
            member.type = tarfile.SYMTYPE
            member.linkname = "../../outside"
            archive.addfile(member)
    stream.seek(0)
    return stream


class PublishTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / "releases").mkdir()
        (self.root / "shared").mkdir()
        self.first = "a" * 40 + "-1-1"
        self.second = "b" * 40 + "-2-1"
        self.files = {
            "index.html": b"<h1>Demo</h1>",
            "404.html": b"Not found",
            "_next/static/first.js": b"first",
        }
        receive.publish(build_archive(self.files), self.first, self.root)

    def assert_first_is_current(self) -> None:
        self.assertEqual((self.root / "current").resolve(), self.root / "releases" / self.first)

    def test_successful_release_keeps_previous_assets(self) -> None:
        files = {**self.files, "index.html": b"Second", "_next/static/second.js": b"second"}
        del files["_next/static/first.js"]
        receive.publish(build_archive(files), self.second, self.root)
        self.assertEqual((self.root / "current" / "index.html").read_bytes(), b"Second")
        self.assertTrue((self.root / "shared" / "_next/static/first.js").is_file())
        self.assertTrue((self.root / "shared" / "_next/static/second.js").is_file())

    def test_parent_path_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            receive.publish(build_archive({"../outside": b"bad"}), self.second, self.root)
        self.assertFalse((self.root / "releases" / "outside").exists())
        self.assert_first_is_current()

    def test_absolute_path_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            receive.publish(build_archive({"/outside": b"bad"}), self.second, self.root)
        self.assert_first_is_current()

    def test_symlink_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            receive.publish(build_archive(self.files, symlink="link"), self.second, self.root)
        self.assert_first_is_current()

    def test_missing_required_file_keeps_current_release(self) -> None:
        files = {name: value for name, value in self.files.items() if name != "index.html"}
        with self.assertRaises(ValueError):
            receive.publish(build_archive(files), self.second, self.root)
        self.assert_first_is_current()

    def test_invalid_release_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            receive.publish(build_archive(self.files), "../../outside", self.root)
        self.assert_first_is_current()

    def test_duplicate_release_does_not_replace_current(self) -> None:
        with self.assertRaises(FileExistsError):
            receive.publish(build_archive(self.files), self.first, self.root)
        self.assert_first_is_current()

    def test_size_limit_keeps_current_release(self) -> None:
        with patch.object(receive, "MAX_BYTES", 1), self.assertRaises(ValueError):
            receive.publish(build_archive(self.files), self.second, self.root)
        self.assert_first_is_current()

    def test_corrupt_archive_keeps_current_release(self) -> None:
        with self.assertRaises(tarfile.TarError):
            receive.publish(io.BytesIO(b"invalid archive"), self.second, self.root)
        self.assert_first_is_current()


if __name__ == "__main__":
    unittest.main()
