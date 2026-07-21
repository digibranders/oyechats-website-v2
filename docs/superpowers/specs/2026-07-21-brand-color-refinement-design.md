# OyeChats Website Brand Color Refinement Design

## Goal

Refresh the OyeChats marketing website to the approved violet brand palette without changing functionality, content, component structure, responsive layouts, or typography hierarchy.

## Scope

Only `oyechats-website` is in scope. The admin dashboard, platform application, and embeddable widget are explicitly excluded.

## Architecture

The website already exposes its visual system through CSS custom properties in `src/app/globals.css`, then maps those values into Tailwind v4 theme tokens. The refinement will preserve that architecture: existing `--volt*` compatibility aliases will resolve to the approved centralized brand tokens, avoiding component-level color literals or broad class-name churn.

The shared design-system components and page components will continue to use their existing semantic utilities. Any remaining direct references to the prior magenta palette will be replaced with a centralized token or a compatible Tailwind utility backed by those tokens.

## Approved Brand Tokens

```css
--brand-primary: #7C3AED;
--brand-primary-hover: #6D28D9;
--brand-primary-active: #5B21B6;

--brand-primary-50: #F5F3FF;
--brand-primary-100: #EDE9FE;
--brand-primary-200: #DDD6FE;

--brand-focus: rgba(124, 58, 237, 0.15);
```

The current `--volt`, `--volt-2`, `--volt-tint`, and `--volt-line` values will become compatibility aliases to these values. `--volt-light` and `--volt-ink` will map to appropriate approved primary values for existing dark-surface and text usage, without introducing a second brand palette.

## Interaction System

- Primary actions use `--brand-primary`, white text, a 12px radius, no border, and restrained 180–200ms transitions.
- Hover uses `--brand-primary-hover` with a maximum `translateY(-1px)` where the component already supports movement.
- Active uses `--brand-primary-active` and returns to its resting position.
- Focus-visible uses a consistent 1px `box-shadow: 0 0 0 1px var(--brand-focus)` with no thick outline, glow, or added layout movement.
- Inputs retain neutral borders and white backgrounds; their focused border becomes the brand primary color with the shared 1px focus ring.
- The current magenta-heavy decorative gradients and glows will be recolored to the centralized violet tokens and reduced only where necessary to preserve the approved accent-restraint policy. Layout, sizing, and animation behavior remain unchanged.

## Constraints

- No functionality, information architecture, component structure, content, layout, breakpoints, or typography-scale changes.
- No component-level hardcoded values from the approved brand palette.
- Preserve existing accessibility semantics and keyboard interaction.
- Retain semantic status colors, neutrals, and non-brand content accents unless they are legacy primary-brand usage.

## Verification

Run website linting, TypeScript checking, and production build after the refinement. Inspect the diff to confirm all changed color values route through the centralized tokens and no old primary magenta literals remain in live website source.
