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

// Extracts the major version from ranges like "^3.1.0", "workspace:~3.1.0", ">=3".
function parseMajor(versionRange) {
  const match = /(\d+)/.exec(String(versionRange));
  return match ? Number(match[1]) : null;
}

function checkPlugin(ctx, results) {
  const bundler = (ctx.bundler && ctx.bundler.name) || '';
  const configFile = (ctx.bundler && ctx.bundler.configFile) || '';
  const deps = ctx.dependencies || {};

  const hasModernJsV3 = !!deps['@module-federation/modern-js-v3'];
  const hasModernJs = !!deps['@module-federation/modern-js'];
  const hasNextMf = !!deps['@module-federation/nextjs-mf'];
  const hasEnhanced = !!deps['@module-federation/enhanced'];
  const hasRspackPlugin = !!deps['@module-federation/rspack'];
  const hasRsbuildPlugin = !!deps['@module-federation/rsbuild-plugin'];

  const isModernJs = bundler === 'modernjs' || configFile.includes('modern');
  const isNextJs = bundler === 'nextjs' || !!deps['next'];

  if (isNextJs) {
    if (!hasNextMf) {
      results.push({
        code: 'CONFIG-PLUGIN',
        severity: 'warning',
        message: 'Next.js project detected but @module-federation/nextjs-mf is not installed.',
        context: { bundler, recommended: '@module-federation/nextjs-mf' },
      });
    }
    return;
  }

  if (isModernJs) {
    const modernJsAppToolsVersion = deps['@modern-js/app-tools'] || '';
    const major = parseMajor(modernJsAppToolsVersion);
    const recommended =
      major !== null && major >= 3 ? '@module-federation/modern-js-v3' : '@module-federation/modern-js';
    if (!hasModernJsV3 && !hasModernJs) {
      results.push({
        code: 'CONFIG-PLUGIN',
        severity: 'warning',
        message: `Modern.js project detected but no MF plugin found. Recommended: ${recommended}.`,
        context: { bundler, recommended },
      });
    }
    return;
  }

  if (bundler === 'rsbuild') {
    if (!hasRsbuildPlugin && !hasEnhanced && !hasRspackPlugin) {
      results.push({
        code: 'CONFIG-PLUGIN',
        severity: 'warning',
        message: 'Rsbuild project detected but no MF plugin found. Recommended: @module-federation/rsbuild-plugin.',
        context: { bundler, recommended: '@module-federation/rsbuild-plugin' },
      });
    }
    return;
  }

  if (bundler === 'rspack') {
    if (!hasEnhanced && !hasRspackPlugin) {
      results.push({
        code: 'CONFIG-PLUGIN',
        severity: 'warning',
        message: 'Rspack project detected but no MF plugin found. Recommended: @module-federation/enhanced/rspack.',
        context: { bundler, recommended: '@module-federation/enhanced/rspack' },
      });
    }
    return;
  }

  if (bundler === 'vite') {
    if (!deps['@module-federation/vite']) {
      results.push({
        code: 'CONFIG-PLUGIN',
        severity: 'warning',
        message: 'Vite project detected but @module-federation/vite is not installed.',
        context: { bundler, recommended: '@module-federation/vite' },
      });
    }
    return;
  }

  if (bundler === 'webpack') {
    if (!hasEnhanced) {
      results.push({
        code: 'CONFIG-PLUGIN',
        severity: 'warning',
        message: 'Webpack project detected but @module-federation/enhanced is not installed.',
        context: { bundler, recommended: '@module-federation/enhanced' },
      });
    }
    return;
  }
}

function checkAsyncEntry(ctx, results) {
  const deps = ctx.dependencies || {};
  const bundlerCtx = ctx.bundler || {};
  const configFile = bundlerCtx.bundlerConfigFile || bundlerCtx.configFile || '';

  if (deps['@module-federation/modern-js-v3'] || deps['@module-federation/modern-js']) {
    return;
  }

  const experiments = bundlerCtx.experiments || {};
  const asyncStartup = experiments.asyncStartup;

  if (asyncStartup === true) return;

  const bundler = bundlerCtx.name || '';

  // asyncStartup is a webpack/rspack-family experiment; Vite and Next.js handle entry init differently.
  if (bundler === 'vite' || bundler === 'nextjs') return;

  let note = 'Set `experiments.asyncStartup = true` in your bundler config, or use a manual async entry (bootstrap.js).';
  if (bundler === 'rspack') {
    note += ' Note: Rspack requires version > 1.7.4 for this option.';
  }

  const message =
    asyncStartup === false
      ? `experiments.asyncStartup is disabled. ${note}`
      : `experiments.asyncStartup could not be determined from the bundler config — verify it manually. ${note}`;

  results.push({
    code: 'CONFIG-ASYNC-ENTRY',
    severity: asyncStartup === false ? 'warning' : 'info',
    message: `${message} Without it, shared deps become async modules and a sync entry throws RUNTIME-005. See: https://module-federation.io/blog/hoisted-runtime`,
    context: { configFile, asyncStartup: asyncStartup === undefined ? null : asyncStartup },
  });
}

function checkExposes(ctx, results) {
  const projectRoot = ctx.project && ctx.project.root;
  const exposes = (ctx.mfConfig && ctx.mfConfig.exposes) || {};
  const exposeKeys = Object.keys(exposes);

  if (exposeKeys.length > 0 && !projectRoot) {
    results.push({
      code: 'CONFIG-EXPOSES-PATH',
      severity: 'info',
      message: 'project.root is missing from MFContext, so exposes paths were not verified on disk.',
      context: {},
    });
  }

  exposeKeys.forEach((key) => {
    const value = exposes[key];
    if (!key.startsWith('./')) {
      results.push({
        code: 'CONFIG-EXPOSES-KEY',
        severity: 'warning',
        message: `exposes key "${key}" should start with "./"`,
        context: { key },
      });
    }
    const rel = typeof value === 'string' ? value : value && value.import;
    if (!rel || typeof rel !== 'string') return;
    if (projectRoot) {
      const full = path.join(projectRoot, rel);
      if (!fs.existsSync(full)) {
        results.push({
          code: 'CONFIG-EXPOSES-PATH',
          severity: 'warning',
          message: `The path referenced by exposes["${key}"] does not exist: ${rel} (check exact file extension)`,
          context: { key, path: rel },
        });
      }
    }
  });
}

function main(ctx) {
  const results = [];
  checkPlugin(ctx, results);
  checkAsyncEntry(ctx, results);
  checkExposes(ctx, results);
  process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
}

const args = parseArgs(process.argv);
main(JSON.parse(args.context));
