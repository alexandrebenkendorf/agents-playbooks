#!/usr/bin/env node

const https = require('https');
const http = require('http');

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

function extractRemoteUrl(remoteValue) {
  const raw = typeof remoteValue === 'string' ? remoteValue : (remoteValue && remoteValue.external) || null;
  if (!raw) return null;
  const atIndex = raw.indexOf('@');
  return atIndex >= 0 ? raw.slice(atIndex + 1) : raw;
}

function getPathname(url) {
  try {
    return new URL(url).pathname;
  } catch (err) {
    return url.split(/[?#]/)[0];
  }
}

function isManifestUrl(url) {
  return getPathname(url).endsWith('.json');
}

function getPublicPath(remoteEntry) {
  try {
    return new URL('.', remoteEntry).href;
  } catch (err) {
    const lastSlash = remoteEntry.lastIndexOf('/');
    return lastSlash >= 0 ? remoteEntry.slice(0, lastSlash + 1) : `${remoteEntry}/`;
  }
}

function fetchJson(url, redirectsLeft = 5) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (res) => {
        const { statusCode, headers } = res;

        if (statusCode >= 300 && statusCode < 400 && headers.location) {
          res.resume();
          if (redirectsLeft <= 0) {
            resolve({ ok: false, error: `Too many redirects while fetching ${url}` });
            return;
          }
          resolve(fetchJson(new URL(headers.location, url).href, redirectsLeft - 1));
          return;
        }

        if (statusCode >= 400) {
          res.resume();
          resolve({ ok: false, error: `HTTP ${statusCode} from ${url}` });
          return;
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ ok: true, data: JSON.parse(data) });
          } catch {
            resolve({ ok: false, error: `Failed to parse JSON from ${url}` });
          }
        });
      })
      .on('error', (err) => {
        resolve({ ok: false, error: err.message });
      });
  });
}

function extractManifestInfo(manifest) {
  if (!manifest) return null;
  return {
    exposes: manifest.exposes || [],
    remotes: manifest.remotes || [],
    shared: manifest.shared || [],
    metaData: manifest.metaData || null,
  };
}

function withTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

// Base for resources: metaData.publicPath when it is a real location, else the entry's directory.
function resolveBase(fallbackPublicPath, manifestUrl, metaData) {
  const declared = metaData && metaData.publicPath;
  if (!declared || declared === 'auto') {
    return fallbackPublicPath;
  }
  try {
    return withTrailingSlash(new URL(declared, manifestUrl).href);
  } catch (err) {
    return fallbackPublicPath;
  }
}

function resolveResource(base, dir, name) {
  return new URL(`${dir || ''}${name}`, base).href;
}

function resolveTypeUrls(base, metaData) {
  const types = (metaData && metaData.types) || {};
  const dir = types.path ? withTrailingSlash(types.path) : '';
  const zip = resolveResource(base, dir, types.zip || '@mf-types.zip');
  const api = types.api ? resolveResource(base, dir, types.api) : null;
  return { typesZip: zip, typesApi: api };
}

async function main(ctx, moduleName, explicitUrl) {
  let entry = explicitUrl || null;

  if (!entry) {
    const remotes = (ctx.mfConfig && ctx.mfConfig.remotes) || {};
    const remoteValue = remotes[moduleName];
    if (!remoteValue) {
      process.stdout.write(
        JSON.stringify(
          {
            error: `Remote "${moduleName}" not found in mfConfig.remotes`,
            availableRemotes: Object.keys(remotes),
          },
          null,
          2
        ) + '\n'
      );
      return;
    }
    entry = extractRemoteUrl(remoteValue);
  }

  if (!entry) {
    process.stdout.write(JSON.stringify({ error: `Cannot resolve entry URL for "${moduleName}"` }, null, 2) + '\n');
    return;
  }

  const publicPath = getPublicPath(entry);
  const manifestUrl = isManifestUrl(entry) ? entry : `${publicPath}mf-manifest.json`;
  const manifestRes = await fetchJson(manifestUrl);
  const manifest = manifestRes.ok ? extractManifestInfo(manifestRes.data) : null;
  const metaData = manifest && manifest.metaData;

  const base = resolveBase(publicPath, manifestUrl, metaData);
  const remoteEntryMeta = (metaData && metaData.remoteEntry) || {};
  const remoteEntryName = remoteEntryMeta.name || 'remoteEntry.js';
  const remoteEntryDir = remoteEntryMeta.path ? withTrailingSlash(remoteEntryMeta.path) : '';
  const remoteEntry = isManifestUrl(entry) ? resolveResource(base, remoteEntryDir, remoteEntryName) : entry;
  const { typesZip, typesApi } = resolveTypeUrls(base, metaData);

  const result = {
    moduleName,
    entry,
    publicPath: base,
    remoteEntry,
    typesZip,
    typesApi,
    hasSsr: Boolean(metaData && metaData.ssrRemoteEntry),
    exposes: manifest ? manifest.exposes : [],
    remotes: manifest ? manifest.remotes : [],
    shared: manifest ? manifest.shared : [],
    manifestUrl,
    manifestError: manifestRes.ok ? undefined : manifestRes.error,
  };

  process.stdout.write(JSON.stringify({ result }, null, 2) + '\n');
}

const args = parseArgs(process.argv);

if (!args.module) {
  process.stderr.write('Error: --module <module-name> is required\n');
  process.exit(1);
}

main(JSON.parse(args.context || '{}'), args.module, args.url || null).catch((err) => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
});
