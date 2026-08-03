// Switches @nexploy/shared between the published package and the local checkout.
//
//   pnpm shared:local   build + pack ../shared, install the tarball
//   pnpm shared:npm     go back to the published version
//
// The local mode packs a tarball rather than linking the directory, so the install is
// byte-for-byte what the registry would serve: `files`, the exports map and the built
// dist/ all apply. A `link:` would instead expose the checkout as-is, including sources
// and tooling that never ship.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sharedRepo = process.env.NEXPLOY_SHARED_ROOT ?? resolve(root, '..', 'shared');
const manifestPath = join(root, 'package.json');
const PREFIX = 'nexploy-shared-';

const mode = process.argv[2];
if (mode !== 'local' && mode !== 'npm') {
    console.error('usage: node scripts/shared-source.mjs <local|npm>');
    process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const current = manifest.dependencies['@nexploy/shared'];

if (mode === 'local') {
    if (!existsSync(join(sharedRepo, 'package.json'))) {
        console.error(`@nexploy/shared not found at ${sharedRepo} — clone it next to this repository.`);
        process.exit(1);
    }
    execFileSync('pnpm', ['run', 'build'], { cwd: sharedRepo, stdio: 'inherit' });
    for (const stale of readdirSync(root).filter((f) => f.startsWith(PREFIX) && f.endsWith('.tgz'))) {
        rmSync(join(root, stale));
    }
    execFileSync('pnpm', ['pack', '--pack-destination', root], { cwd: sharedRepo, stdio: 'inherit' });

    const tarball = readdirSync(root).find((f) => f.startsWith(PREFIX) && f.endsWith('.tgz'));
    if (!tarball) {
        console.error('pnpm pack produced no tarball.');
        process.exit(1);
    }
    if (!current.startsWith('file:')) manifest.sharedVersion = current;
    manifest.dependencies['@nexploy/shared'] = `file:./${tarball}`;
} else {
    const pinned = manifest.sharedVersion;
    if (!pinned) {
        console.error('No recorded version to restore — set @nexploy/shared by hand.');
        process.exit(1);
    }
    manifest.dependencies['@nexploy/shared'] = pinned;
    delete manifest.sharedVersion;
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\n@nexploy/shared → ${manifest.dependencies['@nexploy/shared']}`);
console.log('run pnpm install to apply');
