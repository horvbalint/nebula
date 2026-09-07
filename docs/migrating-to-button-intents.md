# Migrating to `neb-button` intents

`neb-button` used to bake colour into `type` (`secondary-neutral`,
`tertiary-neutral`, `link-neutral`) and into two one-off booleans
(`destructive`, `adjective`). Colour is now a separate `intent` prop, and
`type` is purely the structural variant (fill / outline / ghost / link).

This is a **breaking change** — `type="secondary-neutral"` and the
`destructive`/`adjective` props no longer exist. There is no deprecation
period; update call sites when you upgrade.

---

## The new shape

```ts
type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'link'
type ButtonIntent = 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info'
```

Both default to `'primary'`. `type` picks the shape (solid fill, bordered,
ghost, inline link); `intent` picks the colour. Every combination of the two
is valid — e.g. `type="tertiary" intent="warning"` is a ghost button in the
warning hue, something the old API couldn't express at all.

---

## Mapping table

| Old | New |
| --- | --- |
| `type="primary"` | `type="primary"` (unchanged, `intent="primary"` is the default) |
| `type="secondary"` | `type="secondary"` (unchanged) |
| `type="secondary-neutral"` | `type="secondary" intent="neutral"` |
| `type="tertiary"` | `type="tertiary"` (unchanged) |
| `type="tertiary-neutral"` | `type="tertiary" intent="neutral"` |
| `type="link"` | `type="link"` (unchanged) |
| `type="link-neutral"` | `type="link" intent="neutral"` |
| `destructive` / `:destructive="cond"` | `intent="error"` / `:intent="cond ? 'error' : 'primary'"` |
| `adjective` / `:adjective="cond"` | `intent="success"` / `:intent="cond ? 'success' : 'primary'"` |

A conditional type like `:type="isActive ? 'tertiary' : 'tertiary-neutral'"`
becomes a static `type` plus a conditional `intent`:

```diff
- <neb-button :type="isActive ? 'tertiary' : 'tertiary-neutral'">
+ <neb-button type="tertiary" :intent="isActive ? 'primary' : 'neutral'">
```

`neb-button-group` gained the same `intent` prop (default `'neutral'`,
matching the old `type="secondary-neutral"` default) and forwards it to
children exactly like `type`.

---

## Find your call sites

```bash
grep -rn 'type="[a-z]*-neutral"\|:type="[^"]*-neutral' app/ components/
grep -rn 'destructive\|adjective' app/ components/
```

For a bare `-neutral` type with no other logic, a straight substitution
works:

```bash
sed -i 's/type="secondary-neutral"/type="secondary" intent="neutral"/g' <file>
sed -i 's/type="tertiary-neutral"/type="tertiary" intent="neutral"/g' <file>
sed -i 's/type="link-neutral"/type="link" intent="neutral"/g' <file>
```

Then check each remaining `destructive`/`adjective` hit and any ternary
`:type` by hand — those need the conditional-`intent` rewrite shown above,
not a mechanical replace.

---

## Why

The old `-neutral` suffix conflated two independent axes into `type`, so a
neutral ghost button and a warning ghost button had no shared name — you'd
have needed a `type="tertiary-warning"` per hue to get the same effect.
`destructive`/`adjective` were one-off booleans covering exactly one hue each
(error, success) with no path to `warning`/`info`. Splitting shape (`type`)
from colour (`intent`) covers all five hues uniformly and removes two
special-cased props.
