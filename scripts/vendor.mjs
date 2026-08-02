// Copies the slices of nexploy's private packages that the library actually uses
// into src/vendor/, rewriting their specifiers. Run before every build so the
// published package is self-contained and the copy never drifts.
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

const vendorDir = join(root, 'src', 'vendor');
rmSync(vendorDir, { recursive: true, force: true });

for (const [spec, file] of copied) {
    const [pkg] = spec.split('/');
    const target = join(vendorDir, spec.replace(/\.tsx?$/, '') + (file.endsWith('.tsx') ? '.tsx' : '.ts'));
    mkdirSync(dirname(target), { recursive: true });
    const source = readFileSync(file, 'utf8').replaceAll('@workspace/', VENDOR_PREFIX);
    writeFileSync(target, source);
}

console.log(`vendor: ${copied.size} files copied into src/vendor/`);
console.log(`vendor: external packages required — ${[...externals].sort().join(', ')}`);
