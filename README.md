# @nexploy/nodes

The pipeline node library behind Nexploy, published to npm. Nodes describe themselves through an
isomorphic descriptor; everything they need from the host arrives through injected services, so
nothing here reaches into the Nexploy application.

```bash
npm install @nexploy/nodes
```

## Layout

```
src/
├── core/     contracts, Zod schemas, execution helpers — no React
├── ui/       UI adapter, drag-and-drop primitives, node manifest, theme
├── nodes/    the 62 built-in nodes, one folder each
└── vendor/   generated at build time, never edited by hand
```

A node is a single self-describing folder:

```
src/nodes/deploy-compose/
├── node.ts        descriptor — the source of truth
├── executor.ts    server-side logic
├── Config.tsx     configuration panel
└── locales/       name, description and labels (en, fr)
```

The descriptor drives the interface definition, the category colour and icon, the AI catalogue and
the outputs that can be dragged onto a downstream node. None of that is declared twice.

## Entry points

| Import | Contents |
|---|---|
| `@nexploy/nodes/core/*` | `pipeline`, `nodeServices`, `nodeDescriptor`, `schemas/*`… |
| `@nexploy/nodes/ui/*` | `adapter`, `RefAware`, `refValidation`, `theme`, `nodeManifest` |
| `@nexploy/nodes/registry/*` | `descriptors`, `server`, `client`, `messages` |

## Build

`src/vendor/` holds the slices of Nexploy's private packages the library uses — a dozen shadcn
components and a few pure helpers. `scripts/vendor.mjs` recomputes that copy from the Nexploy
checkout before every build, following imports transitively and rewriting specifiers, so the
published package is self-contained and the copy cannot drift.

```bash
pnpm build       # vendor + tsc → dist/
pnpm dev         # same, in watch mode
pnpm typecheck
```

The build needs a Nexploy checkout beside this repository, or `NEXPLOY_APP_ROOT` pointing at one.
`dist/` keeps one file per source file so the `'use client'` directive survives on each of the 62
configuration panels — a bundler would hoist or drop it.

## Working on a node from Nexploy

Nexploy installs the published version. To try a change before publishing:

```bash
cd nexploy && pnpm nodes:link     # points @nexploy/nodes at ../nodes
cd ../nodes && pnpm dev           # rebuild dist/ on every change
```

`pnpm nodes:unlink` restores the published version. The link is local and must never be committed.

## Publishing

Tagging `v*` runs typecheck, build and `npm publish` with provenance. The workflow checks out
Nexploy alongside, because the vendored sources come from it.

## Peer dependencies

`react`, `react-dom`, `next`, `next-intl`, `react-hook-form`, `@xyflow/react`, `zod`, `lucide-react`,
`dayjs` and `dockerode` are peers — the host provides them. Two copies of any of these means two
module instances, and identity breaks silently: React contexts stop resolving, and `instanceof`
returns false for Zod schemas and Ky's `HTTPError`.
