# Design system

## Direction

The interface feels like a well-organized financial worksheet on a bright kitchen table: quiet paper-white surfaces, graphite text, one restrained green action color, and precise tabular numbers. The calculator is the working surface, not a decorative hero.

## Tokens

- Canvas: `#f4f6f2`
- Surface: `#fcfdfa`
- Soft surface: `#e8eee7`
- Ink: `#1d2722`
- Muted: `#5a665f`
- Border: `#d5ded7`
- Action: `#2c6e49`
- Action hover: `#205238`
- Focus: `#a4c3a2`
- Error: `#a63d40`

## Type

Use the local system stack with a slightly humanist fallback: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Use tabular numerals for money and rates. No display face is needed.

## Layout

Maximum width 1180px. Desktop tool layout is 7/5: inputs on the left, live results on the right. The results panel stays visually stronger through surface contrast, not heavy shadows. Mobile becomes one column with the result directly after the primary inputs.

## Interaction

Buttons use sentence case and verb plus object. Inputs always have visible labels and unit context. Validation sits beside the field. Results explain assumptions directly under the headline value.
