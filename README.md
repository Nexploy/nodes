# Nexploy Nodes

The pipeline node library behind Nexploy. Nodes describe themselves through an
isomorphic descriptor; everything they need from the host arrives through injected
services, so nothing here reaches into the Nexploy app.

## Packages

| Package | Contents |
|---|---|
| `@nexploy/node-core` | Node contracts, Zod schemas, runtime helpers. No workspace dependencies. |
| `@nexploy/node-ui` | UI adapter, ref-drop primitives, node manifest and theme. Depends on `@workspace/ui` for the design system. |
| `@nexploy/nodes` | The 62 built-in nodes — descriptor, executor, config panel, locales. |

## Layout expected on disk

This repository is consumed by `nexploy` through pnpm `link:`, which resolves by
relative path. Both repositories must sit side by side:

```
Monorepo-Mixte/nexploy/
├── nexploy/   ← the app
└── nodes/     ← this repository
```

Cloning one without the other leaves `pnpm install` unable to resolve the links.

## Singleton packages are peer dependencies

`react`, `react-dom`, `next`, `next-intl`, `react-hook-form` and `@xyflow/react` are declared as
peer dependencies and deliberately **not installed here**. Each of them carries React context;
two physical copies mean two contexts, and a panel calling `useTranslations` or `useFormContext`
throws at runtime even when both copies are the same version.

Turbopack resolves linked packages through their real path, so node sources look for these
packages by walking up from this repository. A symlink at the shared parent points that walk at
Nexploy's copies:

```
Monorepo-Mixte/nexploy/
├── node_modules -> nexploy/apps/nexploy/node_modules
├── nexploy/
└── nodes/
```

`pnpm check:nodes` and the `preinstall` hook in the `nexploy` repository both verify this link.

## Shared dependency versions must stay in lockstep

`node-ui` and `nodes` compile against `@workspace/ui`, which is linked from `../nexploy`. TypeScript treats two copies of a type-bearing
package as unrelated types, so a version drift produces hundreds of errors of the form
*"Two different types with this name exist, but they are unrelated"*.

`pnpm-workspace.yaml` pins every shared dependency to the version Nexploy resolves:

```yaml
overrides:
  '@types/react': 19.2.2
  '@xyflow/react': 12.11.1
  lucide-react: 1.17.0
  next: 16.2.12
  react: 19.2.3
  react-dom: 19.2.3
  react-hook-form: 7.68.0
  zod: 4.3.6
```

When Nexploy bumps any of these, bump it here in the same change. Running `pnpm check:nodes`
from the `nexploy` repository reports any drift, with the exact versions on both sides.

## Commands

```bash
pnpm install
pnpm types      # typecheck all three packages
pnpm format
```

## Adding a node

See `.claude/skills/create-pipeline-node/SKILL.md` in the `nexploy` repository.
