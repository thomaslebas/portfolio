# Unifying Lightspeed's product colours

Year: 2024
Subline: One colour foundation across five products and three platforms
Meta: Design systems · Platform unification · Colour palette development

Lightspeed's products came together through acquisition, and it showed. With the Design Systems team, I helped define a single colour foundation to replace four legacy systems: crafting the palette and token architecture alongside systems designers and platform leads from across the company, and shaping the migration that carried products onto it across web, iOS, and Android.

Stats:
- Applied to 5 products, 3 platforms, one foundation
- 200+ token model cut down to an adoptable common set
- Adopted voluntarily beyond any mandated teams

## Merchants could see the seams between our products

Lightspeed grew by acquiring companies, and each product arrived with its own design heritage: five products, four design systems with different colour logic, token structures, and levels of maturity, and one product with no system at all. None of them was wrong; each was right for the company that built it. But a merchant running their store across more than one Lightspeed product was moving between interfaces that looked like they came from different companies, and behind the scenes the duplication doubled up maintenance for design and engineering. We needed a coherent experience.

![Product interfaces before unification. The inconsistency was visible to anyone using more than one product.](before-unification)

## Colour was the most visible problem and the cheapest to fix

Unifying the whole experience was a much bigger problem than colour. But colour is on every screen of every product, merchants could see the inconsistency directly, and it was materially cheaper to align in code than components or layouts. That sequencing decision made colour the first proof point for unification instead of an attempt to solve everything at once.

## We cut a theoretically perfect system down to one teams could actually adopt

The hardest decision of the project was how universal the system should really be.

The first iteration of the token model was broad, flexible, and highly abstract. It was theoretically complete and practically unusable. A second iteration reduced some of that flexibility, but the model had still grown past 200 tokens with a conceptual naming language that made migration too expensive and the day-to-day system too hard to use.

So we simplified again. The third iteration chose practicality over purity: closer to existing usage patterns, a smaller common set, and deliberate inheritance from existing colour logic where keeping structure and naming reduced disruption.

![The token model across three iterations. Each one traded theoretical flexibility for adoptability.](token-model-iterations)

## Primitives carry the values. Semantics carry the meaning.

The architecture we landed on had two layers, and the separation is what made everything else work.

Below: a primitive colour system. A foundation of raw, lightness-based scales (gray-50, gray-55, red-60) with no opinion about usage. This is where the colour craft lived, and where I worked most closely with the two other systems designers shaping the palette. We built the scales in OkLCH for perceptual consistency and used APCA and WCAG as working tools during design, not checks after it.

The judgment calls were specific. 
- We lowered red chroma so the product's destructive red separated cleanly from the Lightspeed brand red, because an interface where “delete” reads as branding has a problem. 
- We added intermediate greys like gray-55 and gray-65 because dark surfaces needed steps the original scale didn't have. 
- We explored P3-first but accepted sRGB fallback constraints, choosing colours that survive real rendering environments over a purer palette that wouldn't.

Above: a semantic token layer. The tokens designers and engineers actually reference, named for purpose rather than appearance, each resolving to a primitive. Dark mode becomes a remapping of semantics to different primitives rather than a second palette, and a value change propagates everywhere without touching usage.

![Primitive scales feeding the semantic token layer, with light and dark resolution. Designers and engineers touch only the semantic layer; the primitives beneath can be tuned without breaking anything above.](token-architecture)

Accessibility involved real iteration rather than clean answers: stronger contrast outcomes on some foreground colours would have flattened the semantic hierarchy, so we kept iterating rather than locking in values that looked right but failed contrast expectations.

## Exceptions allowed. Forks never.

A unified system is only unified if exceptions don't quietly hollow it out. The project's sharpest debates were about naming conventions, the source of truth, and whether platforms could carry their own exception values. The principle I held across all of them: any platform-specific deviation had to be explicit and reviewable, never an untracked fork. Exceptions could exist, but as exceptions, not as a second source of truth. Systems survive on governance, not on launch.

## Migration left products cleaner than it found them

The first real test of the system was getting an existing product onto it, and that started with Helios, the design system behind X-Series, Lightspeed's retail flagship product.

Years of accumulated drift meant every legacy token needed a verdict: redundant tokens were merged, overloaded ones got use-case-by-use-case calls, and unused ones were deprecated rather than preserved for historical completeness. The payoff was that products arrived on the other side cleaner than they left, instead of carrying their old noise into the new system.

## Outcome

- Rollout and implementation across all five products and three platforms, with X-Series carrying it to merchants first
- Lightspeed's Hospitality division joined voluntarily. Adoption was optional for them, and they opted in, the clearest signal the system was compelling rather than mandated
- Teams moved from independent drift to actively managing token versions and release timing together

