import { Document, parseDocument } from 'yaml';

export interface ComposeBuildableService {
    serviceName: string;
    contextPath: string;
    dockerfilePath?: string;
    buildArgs?: Record<string, string>;
    target?: string;
    platform?: string;
    declaredImage?: string;
}

export interface ComposePlan {
    document: Document;
    buildable: ComposeBuildableService[];
    pulled: { serviceName: string; image: string }[];
    resolvedServices: Record<string, any>;
}

function joinPosix(...segments: string[]): string {
    const parts: string[] = [];

    for (const segment of segments) {
        for (const piece of segment.split('/')) {
            if (piece === '' || piece === '.') continue;

            if (piece === '..') {
                if (parts.length === 0) {
                    throw new Error(`Build context "${segments.join('/')}" escapes the repository directory`);
                }

                parts.pop();
                continue;
            }

            parts.push(piece);
        }
    }

    return parts.join('/');
}

function normalizeBuildArgs(args: unknown): Record<string, string> | undefined {
    if (!args) return undefined;

    if (Array.isArray(args)) {
        const entries = args
            .filter((entry): entry is string => typeof entry === 'string')
            .map((entry) => {
                const separator = entry.indexOf('=');
                return separator === -1
                    ? ([entry, ''] as const)
                    : ([entry.slice(0, separator), entry.slice(separator + 1)] as const);
            });

        return entries.length > 0 ? Object.fromEntries(entries) : undefined;
    }

    if (typeof args === 'object') {
        const entries = Object.entries(args as Record<string, unknown>)
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => [key, String(value)] as const);

        return entries.length > 0 ? Object.fromEntries(entries) : undefined;
    }

    return undefined;
}

function resolveExtends(serviceName: string, services: Record<string, any>, seen: string[] = []): Record<string, any> {
    const service = services[serviceName];

    if (!service || typeof service !== 'object') return {};

    const extendsDeclaration = service.extends;

    if (!extendsDeclaration) return service;

    const parentName = typeof extendsDeclaration === 'string' ? extendsDeclaration : extendsDeclaration.service;
    const parentFile = typeof extendsDeclaration === 'object' ? extendsDeclaration.file : undefined;

    if (parentFile) {
        throw new Error(
            `Service "${serviceName}" extends a service from another file ("${parentFile}"), which the runner build planner cannot resolve — declare "build" or "image" directly on the service, or build on the server`,
        );
    }

    if (typeof parentName !== 'string' || !services[parentName]) {
        throw new Error(`Service "${serviceName}" extends "${parentName}", which does not exist in this compose file`);
    }

    if (seen.includes(parentName)) {
        throw new Error(`Circular "extends" chain detected: ${[...seen, parentName].join(' -> ')}`);
    }

    const parent = resolveExtends(parentName, services, [...seen, serviceName]);
    const merged = { ...parent, ...service };

    delete merged.extends;

    return merged;
}

export function planComposeBuild(content: string, composeDirectory: string): ComposePlan {
    const document = parseDocument(content, { merge: true });

    if (document.errors.length > 0) {
        throw new Error(`Invalid Docker Compose file: ${document.errors[0]?.message}`);
    }

    const parsed = document.toJS({ merge: true });

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Invalid Docker Compose file: not a YAML mapping');
    }

    const services = (parsed as Record<string, any>).services;

    if (!services || typeof services !== 'object') {
        throw new Error('Invalid Docker Compose file: missing required "services" key');
    }

    const buildable: ComposeBuildableService[] = [];
    const pulled: { serviceName: string; image: string }[] = [];
    const resolvedServices: Record<string, any> = {};

    for (const serviceName of Object.keys(services as Record<string, any>)) {
        const rawService = resolveExtends(serviceName, services as Record<string, any>);

        if (!rawService || typeof rawService !== 'object') continue;

        resolvedServices[serviceName] = rawService;

        const build = rawService.build;
        const declaredImage = typeof rawService.image === 'string' ? rawService.image : undefined;

        if (!build) {
            if (declaredImage) pulled.push({ serviceName, image: declaredImage });
            continue;
        }

        if (typeof build === 'string') {
            buildable.push({
                serviceName,
                contextPath: joinPosix(composeDirectory, build),
                declaredImage,
            });
            continue;
        }

        const context = typeof build.context === 'string' ? build.context : '.';
        const dockerfile = typeof build.dockerfile === 'string' ? build.dockerfile : undefined;

        buildable.push({
            serviceName,
            contextPath: joinPosix(composeDirectory, context),
            dockerfilePath: dockerfile,
            buildArgs: normalizeBuildArgs(build.args),
            target: typeof build.target === 'string' ? build.target : undefined,
            platform: typeof build.platform === 'string' ? build.platform : undefined,
            declaredImage,
        });
    }

    return { document, buildable, pulled, resolvedServices };
}

export function renderComposeWithImages(
    document: Document,
    images: Map<string, string>,
    resolvedServices?: Record<string, any>,
): string {
    for (const [serviceName, image] of images) {
        const resolved = resolvedServices?.[serviceName];

        if (resolved) {
            const { build: _build, extends: _extends, ...rest } = resolved;
            document.setIn(['services', serviceName], { ...rest, image });
            continue;
        }

        document.deleteIn(['services', serviceName, 'build']);
        document.setIn(['services', serviceName, 'image'], image);
    }

    return document.toString();
}
