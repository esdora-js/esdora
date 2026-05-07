# Rule: Package Overview - @esdora/color

## Identity

- **Package**: @esdora/color
- **Version**: 0.3.3
- **Description**: Color conversion and manipulation with CSS string support
- **Location**: packages/color/

## Architecture Layers

| Layer | Path | Purpose |
|-------|------|---------|
| _internal | src/_internal/ | Types, parser, format (not exported) |
| analysis | src/analysis/ | isDark, getContrast, isLight, isAccessible, isInGamut |
| composition | src/composition/ | adjustChroma, adjustHue, adjustLightness, adjustSaturation |
| conversion | src/conversion/ | toHex, toHsl, toRgb, toLch, toOklch, to*String |
| generation | src/generation/ | generatePalette, randomColor |
| manipulation | src/manipulation/ | darken, lighten, saturate, desaturate, mix, setAlpha |

## Dependencies

- culori (color engine)
- @esdora/kit (workspace:*)

## Why

Culori is the industry-standard color engine. Wrapping it provides consistent Esdora API patterns.

## How to Apply

- Use culori for color math operations
- Export Esdora-specific convenience functions
- Keep internal helpers in `_internal/` (not exported)
