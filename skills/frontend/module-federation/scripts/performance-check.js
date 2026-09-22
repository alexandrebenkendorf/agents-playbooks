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

function main(ctx) {
  const results = [];
  const bundlerName = (ctx.bundler && ctx.bundler.name) || 'unknown';
  const hasTypescript = Boolean(ctx.dependencies && ctx.dependencies.typescript);

  results.push({
    code: 'PERF',
    severity: 'info',
    message:
      'If build time is the confirmed bottleneck, `manifest.disableAssetsAnalyze: true` (an MF `manifest` option, not `dev`) skips asset analysis. Trade-off: it disables resource preloading and omits shared/exposes from the manifest, so only suggest it deliberately.',
    context: { bundler: bundlerName, option: 'manifest.disableAssetsAnalyze' },
  });

  results.push({
    code: 'PERF',
    severity: 'info',
    message:
      'The MF `dev` option controls dev-time churn: disableLiveReload, disableHotTypesReload, disableDynamicRemoteTypeHints. Disable the relevant one if producer rebuilds constantly reload the consumer page or re-pull types.',
    context: { bundler: bundlerName, option: 'dev' },
  });

  if (bundlerName === 'rspack' || bundlerName === 'rsbuild') {
    results.push({
      code: 'PERF',
      severity: 'info',
      message:
        'Rspack/Rsbuild project detected. Setting splitChunks.chunks to "async" is recommended to reduce initial bundle size.',
      context: { bundler: bundlerName },
    });
  }

  if (hasTypescript) {
    results.push({
      code: 'PERF',
      severity: 'info',
      message:
        'TypeScript dependency detected. If type generation (DTS) overhead is too high, consider disabling DTS (`dts: false`) or setting `dts.generateTypes.compilerInstance = "tsgo"` for faster type generation.',
      context: { typescript: ctx.dependencies.typescript },
    });
  }

  process.stdout.write(`${JSON.stringify({ context: ctx, results }, null, 2)}\n`);
}

const args = parseArgs(process.argv);
main(JSON.parse(args.context));
