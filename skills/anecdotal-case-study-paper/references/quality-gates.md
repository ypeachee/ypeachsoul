# Quality gates

## Evidence gates

- Every quantitative claim has a source and a stated assumption.
- Every ambiguous phrase is either bounded or excluded from calculation.
- No invented quotation, outcome, citation, or measurement.
- Competing explanations and negative evidence are visible.
- The conclusion is no stronger than the evidence.

## Manuscript gates

- Main title is formal and bounded.
- Abstract, results, and conclusion agree on uncertainty.
- Section numbering is sequential.
- Figure and table references all resolve.
- Captions are sequential and contain the source.
- Real names and identifying details follow the user's privacy instruction.
- The paper distinguishes literal observation from metaphor.

## PDF gates

- A4 layout, consistent margins, embedded fonts.
- Body text is selectable.
- No clipped text, missing glyph boxes, or overlapping labels.
- No figure is cropped.
- No table splits awkwardly unless a repeated header is deliberate.
- Figure and table captions stay with their object.
- Page numbers and running heads are consistent.
- No unexplained blank page.
- The file opens with a standard PDF reader.

## Visual inspection

Render the PDF to PNGs at roughly 120-150 dpi and inspect every page. A successful compile is not a visual QA pass.

Typical commands:

```powershell
pdftoppm -png -r 140 input.pdf preview/page
```

If Poppler is not available, use an installed PDF renderer and state the limitation. Do not claim visual verification without inspecting the rendered pages.

## Automated checks

Run:

```powershell
python scripts/validate_paper_artifact.py input.pdf --render-dir preview
```

The script checks page count, extracted text density, figure/table label continuity, placeholder strings, and optional rendering. It does not replace the visual review.

## Final report

Report:

- artifact path;
- page count;
- figure/table count;
- whether visual inspection was completed;
- remaining limitations or user decisions.
