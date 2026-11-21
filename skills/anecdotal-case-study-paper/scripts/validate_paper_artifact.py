#!/usr/bin/env python3
"""Validate a generated paper PDF and optionally render page previews."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


def extract_text(pdf: Path) -> tuple[int, str]:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise RuntimeError("pypdf is required: pip install pypdf") from exc
    reader = PdfReader(str(pdf))
    pages = len(reader.pages)
    text = "\n".join((page.extract_text() or "") for page in reader.pages)
    return pages, text


def numbered_labels(text: str, prefix: str) -> list[int]:
    values = sorted({int(m.group(1)) for m in re.finditer(rf"{prefix}\s*(\d+)", text)})
    return values


def missing_sequence(values: list[int]) -> list[int]:
    if not values:
        return []
    return [n for n in range(1, max(values) + 1) if n not in values]


def render(pdf: Path, output_dir: Path, dpi: int, executable: str | None) -> list[str]:
    exe = executable or shutil.which("pdftoppm")
    if not exe:
        return ["pdftoppm not found; visual render skipped"]
    output_dir.mkdir(parents=True, exist_ok=True)
    prefix = output_dir / "page"
    command = [exe, "-png", "-r", str(dpi), str(pdf), str(prefix)]
    completed = subprocess.run(command, capture_output=True, text=True)
    if completed.returncode != 0:
        detail = completed.stderr.strip() or completed.stdout.strip()
        return [f"pdftoppm failed: {detail}"]
    files = sorted(output_dir.glob("page-*.png"))
    return [f"rendered {len(files)} page image(s) to {output_dir}"]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--render-dir", type=Path)
    parser.add_argument("--dpi", type=int, default=140)
    parser.add_argument("--pdftoppm", help="Optional explicit path to pdftoppm")
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args()

    pdf = args.pdf.resolve()
    if not pdf.is_file():
        parser.error(f"PDF not found: {pdf}")

    pages, text = extract_text(pdf)
    figures = numbered_labels(text, "图")
    tables = numbered_labels(text, "表")
    missing_figures = missing_sequence(figures)
    missing_tables = missing_sequence(tables)
    placeholders = [p for p in ["[TODO", "TODO:", "TBD", "PLACEHOLDER"] if p in text]
    warnings: list[str] = []
    if pages == 0:
        warnings.append("PDF has zero pages")
    if len(text.strip()) < 200:
        warnings.append("Extracted text is very short; fonts may not be selectable")
    if missing_figures:
        warnings.append(f"Missing figure numbers: {missing_figures}")
    if missing_tables:
        warnings.append(f"Missing table numbers: {missing_tables}")
    if placeholders:
        warnings.append(f"Placeholder strings found: {placeholders}")
    if args.render_dir:
        warnings.extend(render(pdf, args.render_dir.resolve(), args.dpi, args.pdftoppm))

    result = {
        "pdf": str(pdf),
        "pages": pages,
        "text_chars": len(text),
        "figures": figures,
        "tables": tables,
        "missing_figures": missing_figures,
        "missing_tables": missing_tables,
        "placeholders": placeholders,
        "warnings": warnings,
    }

    if args.as_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"PDF: {pdf}")
        print(f"Pages: {pages}")
        print(f"Text characters: {len(text)}")
        print(f"Figure labels: {figures or 'none'}")
        print(f"Table labels: {tables or 'none'}")
        if warnings:
            print("Warnings:")
            for warning in warnings:
                print(f"- {warning}")
        else:
            print("No structural warnings.")
        print("Remember: automated checks do not replace page-by-page visual inspection.")

    hard_error = pages == 0 or len(text.strip()) < 200
    return 1 if hard_error else 0


if __name__ == "__main__":
    sys.exit(main())
