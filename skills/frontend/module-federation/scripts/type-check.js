#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx >= 0) {
        args[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
      } else {
        args[arg.slice(2)] = argv[i + 1] || '';
        i++;
      }
    }
  }
  return args;
}

function semverGt(a, b) {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const av = aParts[i] || 0;
    const bv = bParts[i] || 0;
    if (av > bv) return true;
    if (av < bv) return false;
  }
  return false;
}

function stripVersionPrefix(version) {
  return (version || '').replace(/^[\^~>=<\s]+/, '');
}

// tsconfig.json is JSONC: strip comments and trailing commas before parsing.
function parseJsonc(text) {
  const withoutComments = text
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm, (match, lineComment, blockComment) =>
      lineComment || blockComment ? '' : match
    )
    .replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(withoutComments);
}

function main(ctx) {
  const projectRoot = ctx.project && ctx.project.root;
  const mfRole = (ctx.project && ctx.project.mfRole) || 'unknown';
  const isProducer = mfRole === 'remote' || mfRole === 'host+remote';
  const isConsumer = mfRole === 'host' || mfRole === 'host+remote';
  const results = [];

  const tsconfigPath = projectRoot ? path.join(projectRoot, 'tsconfig.json') : null;

  const hasTsconfig = tsconfigPath && fs.existsSync(tsconfigPath);
  const hasTypescript = Boolean(
    (ctx.dependencies && ctx.dependencies.typescript) || (ctx.devDependencies && ctx.devDependencies.typescript)
  );

  if (!projectRoot) {
    results.push({
      code: 'TYPE-001',
      severity: 'warning',
      scenario: 'ENV_INCOMPLETE',
      message: 'project.root is missing from MFContext. Re-run the context sub-skill so it emits an absolute project root.',
      context: {},
    });

    process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
    return;
  }

  if (!hasTsconfig || !hasTypescript) {
    if (!hasTsconfig) {
      results.push({
        code: 'TYPE-001',
        severity: 'warning',
        scenario: 'ENV_INCOMPLETE',
        message:
          'tsconfig.json not found in project root. Type consumption (e.g., producer type files) may not be correctly configured.',
        context: { tsconfigPath },
      });
    }
    if (!hasTypescript) {
      results.push({
        code: 'TYPE-001',
        severity: 'warning',
        scenario: 'ENV_INCOMPLETE',
        message:
          'typescript not found in dependencies/devDependencies. Skipping tsc; please verify the type generation workflow.',
        context: {},
      });
    }

    process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
    return;
  }

  const mfTypesDir = path.join(projectRoot, '@mf-types');
  const mfTypesExists = fs.existsSync(mfTypesDir);

  if (!mfTypesExists) {
    const diagnosticsPath = path.join(projectRoot, '.mf', 'diagnostics', 'latest.json');
    const diagnosticsExists = fs.existsSync(diagnosticsPath);
    let canReadDiagnostics = false;

    if (diagnosticsExists) {
      try {
        JSON.parse(fs.readFileSync(diagnosticsPath, 'utf8'));
        canReadDiagnostics = true;
      } catch (e) {
        canReadDiagnostics = false;
      }
    }

    const rawEnhancedVersion = ctx.dependencies && ctx.dependencies['@module-federation/enhanced'];
    const enhancedVersion = stripVersionPrefix(rawEnhancedVersion);

    if (enhancedVersion && semverGt(enhancedVersion, '2.0.1')) {
      canReadDiagnostics = canReadDiagnostics || diagnosticsExists;
    }

    const typeGenFailedResult = {
      code: 'TYPE-001',
      severity: 'error',
      scenario: 'TYPE_GENERATION_FAILED',
      message: '@mf-types directory not found. Type generation may have failed on the producer side.',
      canReadDiagnostics,
      context: {},
    };

    if (enhancedVersion) {
      typeGenFailedResult.enhancedVersion = enhancedVersion;
    }

    if (diagnosticsExists) {
      typeGenFailedResult.diagnosticsPath = diagnosticsPath;
    }

    // A missing @mf-types means different things depending on which side of the federation this is.
    if (isProducer) {
      results.push(typeGenFailedResult);
    }

    if (isConsumer) {
      results.push({
        code: 'TYPE-001',
        severity: 'warning',
        scenario: 'TYPES_NOT_PULLED',
        message:
          'Remote types have not been pulled. Run the appropriate pull-types command to fetch remote type definitions.',
        context: {},
      });
    }

    if (!isProducer && !isConsumer) {
      results.push({
        code: 'TYPE-001',
        severity: 'warning',
        scenario: 'RUNTIME_ONLY_SUSPECTED',
        message:
          '@mf-types is missing and the build config declares no remotes or exposes. This usually means remotes are registered through the runtime API, which the DTS pipeline cannot discover. Follow the runtime-types sub-skill (dts.consumeTypes.remoteTypeUrls + `mf dts`).',
        context: { mfRole },
      });
    }
  } else {
    let tsconfig = null;
    try {
      tsconfig = parseJsonc(fs.readFileSync(tsconfigPath, 'utf8'));
    } catch (e) {
      results.push({
        code: 'TYPE-001',
        severity: 'warning',
        scenario: 'ENV_INCOMPLETE',
        message: `Failed to parse tsconfig.json: ${e.message}`,
        context: { tsconfigPath },
      });

      process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
      return;
    }

    const paths = tsconfig && tsconfig.compilerOptions && tsconfig.compilerOptions.paths;

    const wildcardPaths = paths && paths['*'];
    const hasMfTypesPath = Array.isArray(wildcardPaths) && wildcardPaths.some((p) => String(p).includes('@mf-types/'));

    if (!hasMfTypesPath) {
      results.push({
        code: 'TYPE-001',
        severity: 'warning',
        scenario: 'TSCONFIG_PATHS_MISSING',
        message:
          'tsconfig.json compilerOptions.paths is missing the "@mf-types" entry. Add `"*": ["./@mf-types/*"]` under compilerOptions.paths to enable remote type resolution.',
        context: { tsconfigPath },
      });
    } else {
      results.push({
        code: 'TYPE-001',
        severity: 'info',
        scenario: 'ENV_OK',
        message: 'TypeScript environment and remote type configuration look correct.',
        context: {},
      });
    }
  }

  process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
}

const args = parseArgs(process.argv);

let ctx;
try {
  ctx = JSON.parse(args.context);
} catch (e) {
  process.stderr.write(`Failed to parse --context argument: ${e.message}\n`);
  process.exit(1);
}

main(ctx);
