# Rebranding the X-Series color system
Year: 2021
Subline: Updating product color system to carry a new brand
Meta: Design systems · Brand integration

After Lightspeed acquired Vend I led the work to bring the product interface in line with the new Lightspeed brand. That meant evolving the product color system from the ground up, shipping it safely to a live merchant base, and doing it in a way that held up across accessibility, dark mode, and a dense POS interface.

Stats:

- 100% of product surface covered
- Progressive rollout, zero reversions

## Not a visual refresh. A systems problem.

When a brand changes after an acquisition, the temptation is to treat it as a reskin. This wasn't that. Color in a product interface communicates status, hierarchy, emphasis, and meaning, not just identity. Changing it without that lens creates inconsistency across states and surfaces that erodes trust in the interface.

Vend internally became X-Series, Lightspeed's retail flagship product, which made the stakes higher and the opportunity bigger. The new brand direction was still being established across the company. We had a chance to lead rather than follow, and to set the standard for how the new color language should translate into product.

## Why brand colors couldn't go straight into product

Vend already had a mature semantic color token system, which was a genuine advantage. The work was evolution, not a rebuild. But that didn't make it straightforward.

![Mapping brand colors against product roles: success, warning, destructive, neutral, structural. The goal was to find where brand intent and product function aligned, and where they conflicted.](palette-exploration)

The sharpest tension was the destructive red. A brand red and a system-level destructive red are not the same thing. Using the brand red for errors and warnings would have created ambiguity in high-stakes moments: a merchant voiding a transaction, or being warned before an irreversible action. The color needed to read as functional, not expressive. Finding that distinction was one of the clearer brand-meets-product decisions in the project.

The discretionary color set (seven colors used prominently across the quick keys on the POS interface) was where the brand direction was most visibly applied. These were the most expressive colors in the system, and the natural home for the new palette. The rest of the system required subtler work: finding neutral hues that felt coherent without drawing attention to themselves.

## Dark mode required more than new values

Colors that worked well in lighter contexts became much harder to read on darker surfaces. A straight palette swap wasn't going to be enough. The system needed new semantic token roles to properly manage foreground, background, border, and surface relationships.

![New token roles were introduced to handle contrast and surface relationships in dark mode, rather than forcing brand colors into roles they weren't designed for.](dark-mode-tokens)

This proved its value during rollout. Merchants fed back that pure white text on dark backgrounds was causing eye strain. Revising the foreground token to a softer off-white fixed the issue across every component in one change. No patching individual screens, no exceptions.

## Accessibility as a conscious tradeoff

Full compliance standards weren't achievable within the constraints of the project. The goal was a meaningful improvement on the status quo: better contrast, more readable in harsher lighting conditions. Where the ideal and the practical came apart, those decisions were made explicitly and documented. The quick key color set shipped as part of this work, with a proper accessibility revision carried forward as a later phase.

## Rollout designed to go unnoticed

The updated theme shipped behind a feature flag, progressing in stages from 25% to 50% to full rollout. Merchants had been told brand changes were coming as part of the acquisition, and an in-product message was triggered on first exposure.

A reversion path existed for genuine edge cases, but the bar was high: real usability concerns only, not preference, and only after understanding the specific situation. It was never needed.

![The updated interface in production. The change was designed to feel considered, not disruptive.](rollout-ui)

Full coverage required more than the flag. The rollout surfaced areas of the product that weren't using the correct tokens. I audited alongside engineering partners, triaging issues and making decisions on corrections as they came up, improving system hygiene alongside the visual update.

## Outcome

- Updated theme shipped to 100% of the product surface
- Zero merchant reversions across the full rollout
- Dark mode foreground revised mid-rollout from merchant feedback, propagated cleanly through the token system
- X-Series established as the color reference point for Lightspeed retail
- Token structure and approach fed directly into the later Lightspeed Unified Color System

>The foundations built here contributed to a [later effort to align the color system](https://example.com) across web, iOS, and Android. That work is covered separately.

