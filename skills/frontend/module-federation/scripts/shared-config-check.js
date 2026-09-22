#!/usr/bin/env node

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

const UI_LIBS = ['antd', '@ant-design/pro', 'arco', '@arco-design/web-react'];

function checkExternalsConflict(ctx, results) {
  const shared = (ctx.mfConfig && ctx.mfConfig.shared) || {};
  const externals = (ctx.mfConfig && ctx.mfConfig.externals) || {};
  const sharedKeys = Array.isArray(shared) ? shared : Object.keys(shared);
  const externalKeys = Array.isArray(externals) ? externals : Object.keys(externals);

  sharedKeys.forEach((name) => {
    if (externalKeys.includes(name)) {
      results.push({
        code: 'SHARED-EXTERNALS-CONFLICT',
        severity: 'warning',
        message: `"${name}" is configured in both shared and externals. Remove it from one of the two to avoid runtime failures.`,
        context: { name },
      });
    }
  });
}

function checkTransformImport(ctx, results) {
  const shared = (ctx.mfConfig && ctx.mfConfig.shared) || {};
  const deps = ctx.dependencies || {};
  const bundler = (ctx.bundler && ctx.bundler.name) || '';

  const sharedKeys = Array.isArray(shared) ? shared : Object.keys(shared);
  const sharedUiLibs = sharedKeys.filter((name) => UI_LIBS.some((lib) => name === lib || name.startsWith(lib + '/')));
  if (sharedUiLibs.length === 0) return;

  const hasBabelPluginImport = !!deps['babel-plugin-import'];
  const isModernOrRsbuild = bundler === 'rsbuild' || bundler === 'modernjs';

  if (hasBabelPluginImport || isModernOrRsbuild) {
    const fix = isModernOrRsbuild
      ? 'Set `source.transformImport = false` in your Modern.js / Rsbuild config.'
      : 'Remove `babel-plugin-import` from your Babel config.';
    sharedUiLibs.forEach((name) => {
      results.push({
        code: 'SHARED-TRANSFORM-IMPORT',
        severity: 'warning',
        message: `"${name}" is in shared but transformImport / babel-plugin-import is active, which prevents sharing. ${fix}`,
        context: { name, bundler },
      });
    });
  }
}

// Packages whose subpath imports bypass an exact-name `shared` key.
const SUBPATH_SENSITIVE = ['react', 'react-dom', 'vue', 'lodash', 'antd', '@ant-design/icons'];

function checkSubpathImports(ctx, results) {
  const shared = (ctx.mfConfig && ctx.mfConfig.shared) || {};
  const sharedKeys = Array.isArray(shared) ? shared : Object.keys(shared);

  sharedKeys.forEach((name) => {
    if (typeof name !== 'string' || name.endsWith('/')) return;
    if (!SUBPATH_SENSITIVE.includes(name)) return;
    if (sharedKeys.includes(`${name}/`)) return;

    results.push({
      code: 'SHARED-SUBPATH',
      severity: 'warning',
      message: `"${name}" is shared by exact name only. Subpath imports such as "${name}/..." bypass the shared config and get bundled locally. Add a trailing-slash key "${name}/" with the same options to enable prefix matching.`,
      context: { name, suggestedKey: `${name}/` },
    });
  });
}

function checkMultiVersion(ctx, results) {
  const artifacts = ctx.buildArtifacts || {};
  const manifest = artifacts.mfManifest;
  if (!manifest) return;

  const versionMap = {};
  const sharedEntries = manifest.shared || [];
  sharedEntries.forEach((item) => {
    const { name, version } = item;
    if (!name || !version) return;
    if (!versionMap[name]) versionMap[name] = new Set();
    versionMap[name].add(version);
  });

  Object.entries(versionMap).forEach(([name, versions]) => {
    if (versions.size > 1) {
      results.push({
        code: 'SHARED-MULTI-VERSION',
        severity: 'warning',
        message: `Shared package "${name}" has multiple versions in build artifacts: ${[...versions].join(', ')}. Add an alias in your bundler config to resolve to a single version.`,
        context: { name, versions: [...versions] },
      });
    }
  });
}

function main(ctx) {
  const results = [];
  checkExternalsConflict(ctx, results);
  checkTransformImport(ctx, results);
  checkSubpathImports(ctx, results);
  checkMultiVersion(ctx, results);
  process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
}

const args = parseArgs(process.argv);
main(JSON.parse(args.context));
