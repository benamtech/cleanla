---
title: One-Shot App Build Prompt — Template
tags: [playbook, llm-workflow, prompt-engineering]
created: 2026-05-24
updated: 2026-05-24
related:
  - ../concepts/llm-wiki-pattern.md
  - ../projects/cleanla-snap.md
---

A template for prompts that ask a single LLM session (Claude Code, Claude.ai, etc.) to scaffold an entire MVP in one response. Distilled from the [[../projects/cleanla-snap|CleanLA Snap one-shot prompt]] preserved in `raw/0001-cleanla-snap-build-prompt.md`.

The technique works when the project is small enough to fit in one model response, the stack is locked, and the requirements are specified at the level of files rather than features.

## The structure

```
ROLE
└── "You are an expert [stack] engineer. Build [name] — [one-sentence pitch]."

CONSTRAINTS (non-negotiable, named explicitly)
├── What the app must NOT do (legal, ethical, branding)
└── What the app must NOT use (rejected dependencies, with the alternative named)

LOCKED TECH STACK
└── Library name + version + a one-line "do not use X instead" where ambiguity exists

CRITICAL PATH FEATURES (the non-stub parts)
└── For each: behavior + UX copy + edge cases + failure mode + the user-visible message

CORE FEATURES (list)
└── Each: 1–2 sentences, no implementation detail

DATA MODEL
└── Exact schema, exact field names, exact types

VISUAL DESIGN
└── Palette, aesthetic reference, tone-of-voice rules

DELIVERABLES (numbered, file-by-file)
├── Setup commands
├── Config files (exact filenames)
├── Source files (exact paths)
├── Security rules
└── README

PHASE 2 (what NOT to build now, but mention so the model doesn't try)
```

## Why each section matters

- **ROLE** primes the model to write idiomatic, opinionated code for that stack instead of generic patterns.
- **CONSTRAINTS** are framed as hard nots, not soft preferences. Models reliably honor "do NOT use X" framings. They drift on "prefer Y."
- **LOCKED TECH STACK** prevents the model from substituting a familiar library. Naming the rejected alternative inline saves a round-trip.
- **CRITICAL PATH FEATURES** is the section where you specify the actual user copy, error messages, and edge cases. Skipping this is the #1 cause of generic, unship-able output.
- **DATA MODEL** in code form (TypeScript types or schema literals) is non-negotiable. Prose data models get hallucinated.
- **DELIVERABLES** as a numbered list with exact file paths is what makes the output copy-pasteable. Without it, the model produces narrative pseudo-code.
- **PHASE 2** stops the model from trying to build the thing you explicitly excluded.

## When this technique works

- Project is small enough to fit in one response (rough ceiling: ~15-25 files, ~3000 lines of code)
- Stack is opinionated and the model has strong priors on it (Next.js + Tailwind + Supabase, React Native + Expo + Firebase, etc.)
- The features are crisp enough that the model doesn't need to ask clarifying questions
- The output is a scaffold, not a finished product — you expect to refine it after

## When it doesn't

- Greenfield architecture decisions are still open (the model will pick badly with high confidence)
- The project has more than one screen of complex business logic
- The stack is unusual or the model's training data is thin on it
- You need iteration and feedback loops (use a multi-turn workflow instead)

## Companion: ingest the output back into the wiki

After running a one-shot prompt, save the resulting file tree as `raw/NNNN-one-shot-output-<projectname>.md` and ingest it. The compiled wiki pages then become the *spec* the next session works against — a powerful loop where the wiki and the codebase reinforce each other.

This is how [[../projects/cleanla-snap]] originated: the one-shot prompt became the seed deposit, was synthesized into project + concept + decision pages, and those pages are now what future Claude Code sessions in the project repo will work from.

## Backlinks

- [[../projects/cleanla-snap]]
- [[../concepts/llm-wiki-pattern]]
