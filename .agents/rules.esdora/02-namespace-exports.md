# Rule: Namespace Exports (esdora meta)

## Export Pattern

```typescript
import * as biz from '@esdora/biz'
import * as color from '@esdora/color'
import * as date from '@esdora/date'
import * as kit from '@esdora/kit'

export { biz, color, date, kit }
```

## Usage

```typescript
import { kit, color } from 'esdora'

kit.isCircular(obj)
color.hexToRgb('#FF5733')
```

## Why

Namespace exports prevent name collisions between packages and provide clear provenance.

## How to Apply

- Import each workspace package as namespace
- Export all namespaces from root index.ts
- Never flatten exports (e.g., `export { isCircular } from '@esdora/kit'`)
