# Rule: Color API Patterns

## Function Naming

- Conversion: `to{Format}` (toHex, toRgb, toHsl)
- String conversion: `to{Format}String` (toHslString, toRgbString)
- Analysis: `is{Property}` (isDark, isLight, isInGamut)
- Composition: `adjust{Property}` (adjustHue, adjustChroma)
- Manipulation: verb form (darken, lighten, saturate, mix)

## Input/Output Patterns

- Accept both hex strings and color objects
- Return typed color objects (Esdora*Color types)
- String variants return CSS-compatible strings

## Why

Consistent naming makes the API predictable. Supporting both strings and objects provides flexibility.

## How to Apply

- Follow the naming convention above for new functions
- Accept flexible inputs (hex string + color object)
- Return strongly typed color objects
- Add string variant when CSS output is useful
