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

```bash
pnpm build       # tsc → dist/
pnpm typecheck
```

The build needs nothing but this repository. `dist/` keeps one file per source file so the
`'use client'` directive survives on each of the 62 configuration panels — a bundler would hoist
or drop it.

### The vendored sources

`src/vendor/` holds the slices of Nexploy's private packages the library uses — a dozen shadcn
components and a few pure helpers — rewritten to import from `@nexploy/nodes/vendor/*`. It is
**committed**, so publishing never depends on the state of another repository.

`scripts/vendor.mjs` regenerates it from a Nexploy checkout, following imports transitively:

```bash
pnpm vendor:sync    # refresh the copy, then commit it
pnpm vendor:check   # fail if it has drifted from nexploy
```

Both need a Nexploy checkout beside this repository, or `NEXPLOY_APP_ROOT` pointing at one. Run
`vendor:sync` when the design system changes; the build itself never calls it.

`src/vendor/SOURCE.json` records the Nexploy commit the copy came from. It exists because the copy
can regress without anything failing: a checkout on another branch may hold an older version of a
file that still resolves, and the copy would quietly take it. So `vendor:sync` refuses to run
against a tree with uncommitted changes under `packages/`, and `vendor:check` prints the recorded
commit next to the one it is comparing against.

## Working on a node from Nexploy

Nexploy installs the published version. To try a change before publishing:

```bash
cd nexploy && pnpm nodes:local    # builds and packs this repo, installs the tarball
```

`pnpm nodes:npm` restores the published version. Re-run `nodes:local` after each change; the
`file:` line it writes is local and must never be committed.

It packs a tarball rather than linking the directory on purpose. A `link:` makes this package
resolve `react`, `next-intl` and `zod` from *its own* store — two copies of each, which silently
breaks every React context and `instanceof` across the boundary. Extracting a tarball into
Nexploy's workspace resolves them there, exactly as the published package does.

## Publishing

Tagging `v*` runs typecheck, build and `npm publish` with provenance. The workflow checks out
Nexploy alongside, because the vendored sources come from it.

## Peer dependencies

`react`, `react-dom`, `next`, `next-intl`, `react-hook-form`, `@xyflow/react`, `zod`, `lucide-react`,
`dayjs` and `dockerode` are peers — the host provides them. Two copies of any of these means two
module instances, and identity breaks silently: React contexts stop resolving, and `instanceof`
returns false for Zod schemas and Ky's `HTTPError`.
