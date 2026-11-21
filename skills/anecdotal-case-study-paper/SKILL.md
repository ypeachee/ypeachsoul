---
name: anecdotal-case-study-paper
description: Turn personal observations, chat testimony, and unverified anecdotes into a formal, evidence-bounded humorous case-study paper with numbered sections, figures, tables, and a verified PDF. Use for Chinese or bilingual mock-academic case reports, preprint-style writeups, and serious-humor research reports. Do not use to fabricate data, diagnose real people, or expose private material without permission.
metadata:
  short-description: Formal humorous case-study papers
---

# Anecdotal Case Study Paper

Create a paper that is funny because the form is serious, not because the facts are invented. Preserve the user's lived details, but make the evidence chain, inference limits, and privacy boundaries explicit.

## Core outcomes

Produce one or more of:

- a Markdown or DOCX manuscript;
- a polished A4 PDF, usually a one-column preprint;
- numbered figures and three-line tables;
- an evidence ledger and observation log;
- an English abstract when the paper is primarily Chinese.

The default voice is restrained academic Chinese. Put the absurd premise in a subtitle, hypothesis, metaphor, or discussion, not in the title's factual claim.

## Intake

Collect or infer:

1. The observation list, exact quotes, dates, and who reported each item.
2. Which statements are direct observation, second-hand testimony, transcription, memory, or public cultural reference.
3. The desired tone, language, length, and output format.
4. Names, schools, locations, and other privacy constraints.
5. Any explicit exclusions, such as "do not include the audio-transcript screenshot".
6. Whether the user wants a private draft, public artifact, or both.

Do not request private chat logs or screenshots unless they are necessary. Prefer prose, short quotations, or an evidence table over reproducing a private screenshot.

## Evidence discipline

Read `references/evidence-and-ethics.md` before drafting claims about a real person.

At minimum:

- maintain an evidence ledger with source, external time, reported time, evidence grade, and confounders;
- never invent a measurement, quotation, outcome, or citation;
- state assumptions behind every ratio or bound;
- keep null, ambiguous, and contradictory evidence in the paper;
- separate observation, interpretation, and metaphor;
- write "untested" or "unverified" rather than filling gaps with a stronger story;
- do not diagnose a medical or psychological condition;
- do not present a joke as a superpower assessment, athletic certification, or factual accusation;
- anonymize by default when the artifact may become public.

Suggested evidence grades:

- `A`: instrumented or independently verifiable measurement.
- `B+`: repeated direct observation with a usable record.
- `B`: single direct observation with a usable record.
- `C`: second-hand testimony, ambiguous wording, memory-only reconstruction, or missing measurement.

## Paper architecture

Read `references/paper-architecture.md` when drafting the manuscript. Use the full structure when the user asks for a formal paper; compress it only when the requested output is a short note.

Default structure:

1. Title, subtitle, author, affiliation, abstract, keywords.
2. Introduction: phenomenon, research questions, contribution, scope.
3. Literature and analytical framework: real time-perception literature plus the cultural metaphor.
4. Methods: case description, observation design, coding rules, evidence grading, ethics.
5. Results: case-by-case findings with figures and explicit inference limits.
6. Model and hypothesis testing: descriptive model, rival explanations, robustness, falsification tests.
7. Discussion: explanatory boundary and practical implications.
8. Limitations: construct validity, sampling, memory, observer bias, ethics.
9. Conclusion.
10. English abstract when appropriate.
11. References and declarations.
12. Appendices: replication protocol and coding sheet.

Use a serious main title with a separate subtitle for the humorous hypothesis. Example pattern:

> A Single-Case Study of [observable behavior]: On the Explanatory Boundaries of the "[absurd hypothesis]" Hypothesis

Avoid titles such as "My Friend Is [Fictional Character]" unless the user explicitly wants a magazine-style artifact.

## Figure and table rules

Read `references/visual-language.md` before designing figures.

- Prefer one idea per figure.
- Use timelines for disputed durations, log axes for extreme ratios, concept diagrams for metaphors, radar charts for subjective evidence profiles, and hypothesis maps for competing explanations.
- Label conceptual diagrams as metaphors, not physical mechanisms.
- Put data source and inference limits in every caption.
- Never draw a precise-looking chart from invented numbers.
- Do not include a transcript screenshot by default. Convert it to prose, a quotation, or a text-only evidence table.
- Use three-line tables for formal papers; put table captions above and figure captions below.
- Renumber all figures and tables after deletion or insertion.

## Production workflow

1. Run `scripts/init_case_study.py` to create an evidence ledger and outline.
2. Fill the ledger before drafting. Mark missing fields instead of guessing.
3. Draft the paper section by section in the selected language.
4. Build figures from the ledger or from explicitly labeled conceptual metaphors.
5. Generate the PDF with a deterministic layout script when available. Keep body text selectable and fonts embedded.
6. Render every page to PNG and inspect it visually.
7. Run `scripts/validate_paper_artifact.py` on the PDF.
8. Fix pagination, clipped figures, split tables, inconsistent numbering, duplicate captions, and unexplained blank pages.
9. Report the final artifact and the verification evidence. Do not claim success from a successful file write alone.

## Quality gates

Read `references/quality-gates.md`. At minimum require:

- all figure and table references resolve;
- captions and numbering are sequential;
- no promise or observation is converted into an invented quantity;
- the abstract, results, and conclusion agree about uncertainty;
- the paper distinguishes the literal claim from the narrative metaphor;
- privacy and consent constraints are respected;
- every rendered page has been inspected;
- the final PDF opens and has no clipped text or missing glyphs.

## Scripts

- `scripts/init_case_study.py`: scaffold a neutral evidence ledger and paper outline.
- `scripts/validate_paper_artifact.py`: inspect a PDF's page count, text density, figure/table labels, placeholder strings, and optional rendered previews.

Use the scripts as starting points, not as a substitute for reading the evidence or visually reviewing the output.
