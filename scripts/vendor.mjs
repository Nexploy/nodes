// Copies the slices of nexploy's private packages that the library actually uses
// into src/vendor/, rewriting their specifiers.
//
// src/vendor/ is committed, so building this package needs nothing but this
// repository. Run this by hand (pnpm vendor:sync) when nexploy's design system
// changes; --check regenerates into a temporary directory and fails on any
// difference, without touching the tree.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const appRoot = process.env.NEXPLOY_APP_ROOT ?? resolve(root, '..', 'nexploy');

const SOURCES = {
    ui: join(appRoot, 'packages', 'ui', 'src'),
    shared: join(appRoot, 'packages', 'shared', 'src'),
    'typescript-interface': join(appRoot, 'packages', 'typescript-interface', 'src'),
};

for (const [name, dir] of Object.entries(SOURCES)) {
    if (!existsSync(dir)) {
        console.error(`vendor: ${dir} not found — set NEXPLOY_APP_ROOT to the nexploy checkout.`);
        process.exit(1);
    }
}

const VENDOR_PREFIX = '@nexploy/nodes/vendor/';
const SOURCE_FILE = 'SOURCE.json';

// Where the copy came from. A checkout on another branch can hold an older
// version of a file that still resolves, and the copy would silently regress —
// so record the exact commit and refuse to generate from an ambiguous tree.
function sourceState() {
    const git = (...args) => execFileSync('git', args, { cwd: appRoot, encoding: 'utf8' }).trim();
    try {
        return {
            commit: git('rev-parse', 'HEAD'),
            branch: git('rev-parse', '--abbrev-ref', 'HEAD'),
            dirty: git('status', '--porcelain', '--', 'packages').length > 0,
        };
    } catch {
        return { commit: null, branch: null, dirty: false };
    }
}

function readSafe(path) {
    return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

function walk(dir, out = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (/\.tsx?$/.test(entry.name)) out.push(full);
    }
    return out;
}

function resolveInSource(pkg, subpath) {
    const base = join(SOURCES[pkg], subpath);
    for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
        if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    }
    return null;
}

const specifiers = new Set();
for (const file of walk(join(root, 'src')).filter((f) => !f.includes(`${'/'}vendor${'/'}`))) {
    for (const [, spec] of readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        if (spec.startsWith(VENDOR_PREFIX)) specifiers.add(spec.slice(VENDOR_PREFIX.length));
    }
}

const queue = [...specifiers];
const copied = new Map();
const externals = new Set();

while (queue.length) {
    const spec = queue.shift();
    if (copied.has(spec)) continue;
    const [pkg, ...rest] = spec.split('/');
    if (!SOURCES[pkg]) {
        console.error(`vendor: no source mapped for @workspace/${pkg} (needed by the library)`);
        process.exit(1);
    }
    const file = resolveInSource(pkg, rest.join('/'));
    if (!file) {
        console.error(`vendor: cannot resolve @workspace/${pkg}/${rest.join('/')}`);
        process.exit(1);
    }
    copied.set(spec, file);

    for (const [, dep] of readFileSync(file, 'utf8').matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        if (dep.startsWith('@workspace/')) {
            queue.push(dep.slice('@workspace/'.length));
        } else if (dep.startsWith('.')) {
            const abs = resolve(dirname(file), dep);
            const sub = relative(SOURCES[pkg], abs);
            queue.push(`${pkg}/${sub}`);
        } else if (!dep.startsWith('node:')) {
            externals.add(dep.startsWith('@') ? dep.split('/').slice(0, 2).join('/') : dep.split('/')[0]);
        }
    }
}

const check = process.argv.includes('--check');
const vendorDir = join(root, 'src', 'vendor');

const rendered = new Map();
for (const [spec, file] of copied) {
    const relPath = spec.replace(/\.tsx?$/, '') + (file.endsWith('.tsx') ? '.tsx' : '.ts');
    rendered.set(relPath, readFileSync(file, 'utf8').replaceAll('@workspace/', VENDOR_PREFIX));
}

const state = sourceState();

if (check) {
    const onDisk = new Set();
    const collect = (dir, prefix = '') => {
        if (!existsSync(dir)) return;
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
            if (entry.isDirectory()) collect(join(dir, entry.name), rel);
            else onDisk.add(rel);
        }
    };
    collect(vendorDir);
    onDisk.delete(SOURCE_FILE);

    const recorded = JSON.parse(readSafe(join(vendorDir, SOURCE_FILE)) ?? '{}');
    if (recorded.commit && state.commit && recorded.commit !== state.commit) {
        console.log(`vendor: copy was generated from ${recorded.commit.slice(0, 8)} (${recorded.branch}),`);
        console.log(`        this checkout is at ${state.commit.slice(0, 8)} (${state.branch})`);
    }

    const stale = [...rendered].filter(([rel, body]) => readSafe(join(vendorDir, rel)) !== body).map(([rel]) => rel);
    const orphan = [...onDisk].filter((rel) => !rendered.has(rel));
    if (stale.length === 0 && orphan.length === 0) {
        console.log(`vendor: src/vendor/ matches nexploy (${rendered.size} files)`);
        process.exit(0);
    }
    console.error('vendor: src/vendor/ is out of date with nexploy.\n');
    for (const rel of stale) console.error(`  changed  ${rel}`);
    for (const rel of orphan) console.error(`  orphan   ${rel}`);
    console.error('\nRun pnpm vendor:sync and commit the result.');
    process.exit(1);
}

if (state.dirty) {
    console.error('vendor: the nexploy checkout has uncommitted changes under packages/.');
    console.error('        Commit them first, or the copy records a state nobody can reproduce.');
    process.exit(1);
}

rmSync(vendorDir, { recursive: true, force: true });
for (const [rel, body] of rendered) {
    const target = join(vendorDir, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, body);
}

writeFileSync(
    join(vendorDir, SOURCE_FILE),
    `${JSON.stringify({ repository: 'Nexploy/nexploy', ...state, generatedAt: new Date().toISOString() }, null, 2)}\n`,
);

console.log(`vendor: ${copied.size} files copied into src/vendor/`);
console.log(`vendor: from nexploy ${state.commit?.slice(0, 8) ?? 'unknown'} (${state.branch ?? 'unknown'})`);
console.log(`vendor: external packages required — ${[...externals].sort().join(', ')}`);
