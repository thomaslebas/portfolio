# Designing a vision for a marketplace
Year: 2025
Subline: Turning a stalled vision into an executable, cross-product direction
Meta: Design vision · Product strategy

Lightspeed sells point-of-sale software to retailers, and had recently acquired a wholesale platform where those retailers order stock from brands. The problem: it worked brand by brand, more like a set of private portals than a marketplace. I took a vision to unify it, one that had stalled for six months, and turned it into concrete use cases, experience blueprints, and a phased plan. Other teams carried execution after I moved to a different part of the business, and the direction held into the marketplace now in beta.

Stats:

- Direction set across three products
- Milestone framing carried into the roadmap
- Core experience now in beta with merchants

## A network gated behind connections

Retailers bought wholesale through a patchwork of separate portals and manual email flows, then re-keyed the results into their point-of-sale system by hand. Discovery happened one brand at a time, which made it hard to find anything outside an established buying pattern.

The wholesale platform had a structural limit. It was built around private, one-to-one brand relationships, so a merchant could find a supplier but could not browse or buy without first setting up a formal connection to that brand. The network was broad, but its value was locked behind those connections.

The opportunity was to open it up: expand supply across more retail categories and wire it directly into the point-of-sale system, so ordering stock felt less like a chore and more like shopping. The reference points were Faire and Amazon Business, adapted to how relationship-driven wholesale actually works.

## An aligned vision that wasn't shipping

An earlier cross-functional effort had already produced a vision the leadership team believed in, along with a handful of small integration wins. But the step-change never arrived. Incremental progress was not adding up to a marketplace. The missing ingredient was not more vision. It was translation, turning an agreed direction into something teams could actually build against.

## Not what to build. Where it should live.

The hardest question was architectural. The strategy document I co-authored laid out three options for where the new marketplace should live: built on top of the point-of-sale platform, built inside the existing wholesale platform, or built fresh as a standalone product. In every version, the wholesale platform stayed the system of record for orders. What was up for grabs was the experience layer, the part merchants would actually touch.

![The three platform options, weighed against speed to market, engineering investment, and where merchants would naturally expect to find the experience.](platform-options)

Answering it meant understanding how three different products modelled the same things (a product, a price, an order) in incompatible ways, and whether they could be brought together into one coherent experience. That was the question the spike existed to make concrete.

## From a vision to something buildable

In January 2025 I led a design spike to move from big-picture framing to specific, buildable direction.

We scoped it tight: cross-brand discovery first, building an order second. Checkout, payments, and order management were left to the teams that owned them, which kept the spike from ballooning into a redesign of everything.

At the stakeholder review I owned the user stories and the framing: which merchant problems mattered, which use cases the marketplace had to support, and how to explain the reasoning so stakeholders could make decisions rather than just approve screens.

## One experience above three systems that disagreed

The central design problem was simple to state and hard to solve: let a merchant search across many brands and hold a single cart, inside whichever product they already used. The difficulty was underneath. The same object, a product, existed differently in each of the three systems, with its own rules for catalogue, pricing, and orders. The work was designing one experience that could sit on top of all three without leaking their differences to the merchant.

![Experience blueprint for the journey from discovery to order, mapped across screens and against the three systems underneath. This is where the shared layer, and the seams between systems, became visible.](experience-blueprint)

The sharpest craft decision was the product tile, the small card representing each item in a list. It had to work for two situations at once: a brand the merchant was already connected to, where they could buy right away, and a new brand, where they could browse but had to set up a connection first. The tile needed to signal that difference at a glance, so a merchant understood "you can order this now" versus "you can explore this, with a step to unlock it." Push the constraint too hard and browsing feels like hitting walls. Hide it and the merchant hits a dead end at the worst moment, deep in intent. Deciding where that signal lived, and how it carried into the fuller product page, was the clearest point where brand and function had to be reconciled.

![Product tile and detail views for connected and new brands. The problem was signalling what a merchant could buy without dampening the momentum of discovery.](product-tile-states)

The cart was the other place the systems fought back. A merchant shopping across brands expects one cart, but orders still resolve per brand, each with its own terms and fulfilment. The concept landed on a single cart that held everything together, then split into separate orders at the point of purchase. That was a deliberate call: honest to how wholesale orders actually settle, rather than promising a one-click checkout the systems could not yet support. It is also the pattern that shipped.

![A single cross-brand cart that holds everything in one place, then resolves into separate orders per brand at checkout.](multibrand-cart)

## The spike became the roadmap

Within weeks, the next quarter's plan drew its first milestones straight from the spike: cross-brand search across connected brands, then expansion to brands a merchant had not yet connected with. The design sessions I co-presented shortly after extended this into a four-milestone story, from cross-brand search through to multi-brand checkout. The vision had become a sequence.

## Handover as a deliverable

I knew I was moving to a different part of the business, so the final phase was making sure the direction survived my departure. I set the incoming designer up with clear first priorities, named the areas needing attention (information architecture, product tiles, the product page, the cart), and pinned down a design-system approach so the marketplace could be built once and reused across products rather than rebuilt for each.

## What it became

Other product, design, and engineering owners carried execution after I left, and the direction held. The four-milestone story carried into the official roadmap almost unchanged, then expanded as teams sequenced the work. The marketplace is now in beta with merchants, keeping the core the spike defined: cross-brand discovery, filtering, product detail, recommendations, connection-aware access, a shared cart, and ordering tied back to point of sale.

It also deviated, in ways worth naming. The experience ended up living more inside the standalone wholesale product than embedded in point of sale, as the spike had imagined. Opening up new, unconnected brands rolled out slower, because that supply was thin at launch. And multi-brand checkout shipped as the shared cart with separate per-brand orders, not the single combined checkout the original milestone described. The direction held; execution made its own calls, which is what execution should do.

## Outcome

- The four-milestone framing carried into the official roadmap almost unchanged, then expanded as teams sequenced the work
- The marketplace shipped to beta with the cross-brand discovery, filtering, and point-of-sale-linked ordering the spike defined
- Three competing platform proposals became one direction that design, product, and engineering aligned around

No marketplace shipped while I was on it, and execution was carried by other owners. What I can point to is leverage: I set the problem space, the cross-product experience, and the milestone structure that later teams used to keep moving, and that work survived into the beta now in front of merchants.

