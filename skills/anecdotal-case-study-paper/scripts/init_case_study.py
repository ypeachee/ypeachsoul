#!/usr/bin/env python3
"""Scaffold an evidence ledger and a formal case-study outline."""

from __future__ import annotations

import argparse
from pathlib import Path


LEDGER = """# Evidence ledger

## Case metadata

- Working title: {title}
- Subject or pseudonym: {subject}
- Language: {language}
- Privacy/consent decision:
- Requested exclusions:

## Observation table

| Event ID | Exact claim | Reported duration | External duration | Source | Grade | Confounders | Supported claim | Unsupported claim |
|---|---|---|---|---|---|---|---|---|
| E1 |  |  |  |  |  |  |  |  |
| E2 |  |  |  |  |  |  |  |  |

## Data-source notes

- Direct observation:
- Chat or transcript:
- Third-party testimony:
- Memory-only reconstruction:
- Public or cultural reference:

## Missing data

- None recorded.

## Assumptions used in calculations

- None recorded.

## Privacy and ethics notes

- None recorded.
"""


OUTLINE = """# {title}

## 1 Introduction

- Phenomenon:
- Preliminary hypothesis:
- Research questions:
- Contribution:
- Scope boundary:

## 2 Literature and analytical framework

- Relevant research cluster 1:
- Relevant research cluster 2:
- Cultural or fictional reference:
- Framework levels:

## 3 Methods

- Case:
- Design:
- Coding fields:
- Evidence grading:
- Missing-data policy:
- Ethics:

## 4 Results

### 4.1 Case one

- Observation:
- Calculation or comparison:
- Supported inference:
- Unsupported inference:
- Figure/table:

### 4.2 Case two

- Observation:
- Calculation or comparison:
- Supported inference:
- Unsupported inference:
- Figure/table:

## 5 Model and hypothesis testing

- Descriptive model:
- Rival explanations:
- Robustness checks:
- Falsification predictions:

## 6 Discussion

- Explanatory boundary:
- Practical implications:
- What would change the conclusion:

## 7 Limitations

- Sample:
- Measurement:
- Construct validity:
- Memory and observer bias:
- Privacy:

## 8 Conclusion

- Strongest defensible claim:
- Final humorous but bounded sentence:

## References

- [Add verified reference]

## Appendices

- Replication protocol:
- Coding sheet:
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="Directory for the new case-study workspace")
    parser.add_argument("--title", default="[Working title]")
    parser.add_argument("--subject", default="[Participant or pseudonym]")
    parser.add_argument("--language", default="zh-CN")
    args = parser.parse_args()

    out = args.output.resolve()
    if out.exists() and any(out.iterdir()):
        parser.error(f"Output directory is not empty: {out}")
    out.mkdir(parents=True, exist_ok=True)

    values = {"title": args.title, "subject": args.subject, "language": args.language}
    ledger = out / "evidence-ledger.md"
    outline = out / "paper-outline.md"
    ledger.write_text(LEDGER.format(**values), encoding="utf-8")
    outline.write_text(OUTLINE.format(**values), encoding="utf-8")

    print(ledger)
    print(outline)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
