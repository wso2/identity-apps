/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * One-time migration script: converts TypeScript translation objects to individual JSON files.
 *
 * This script:
 *  1. Compiles the i18n module TypeScript sources to CommonJS (dist/src/translations/).
 *  2. Requires the compiled locale bundles.
 *  3. For each locale, writes one JSON file per namespace into
 *     src/translations/<locale>/portals/<namespace>.json
 *  4. Writes a per-locale src/translations/<locale>/meta.json with locale metadata.
 *  5. Cleans up the compiled translation artefacts from dist/.
 *
 * Usage (run from the modules/i18n directory):
 *   node scripts/convert-ts-to-json.js
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const log = (...args) => console.log("[convert-ts-to-json]", ...args);
const die = (msg) => { console.error("[convert-ts-to-json] ERROR:", msg); process.exit(1); };

function mkdirp(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + "\n", "utf8");
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const MODULE_ROOT       = path.join(__dirname, "..");
const BUNDLE_DIR        = path.join(MODULE_ROOT, "dist", "bundle");
const DIST_SRC          = path.join(MODULE_ROOT, "dist", "src");
const TRANSLATIONS_DIST = path.join(DIST_SRC, "translations");
const TRANSLATIONS_SRC  = path.join(MODULE_ROOT, "src", "translations");

// ---------------------------------------------------------------------------
// Step 1 – Verify dist/bundle/ exists (built by a prior 'pnpm build' run)
// ---------------------------------------------------------------------------

if (!fs.existsSync(BUNDLE_DIR)) {
    die(`dist/bundle/ not found at ${BUNDLE_DIR}.\nRun 'pnpm build' in modules/i18n first.`);
}

// Find the root meta file (meta.<hash>.json)
const metaFiles = fs.readdirSync(BUNDLE_DIR).filter((f) => /^meta\.[a-f0-9]+\.json$/.test(f));
if (metaFiles.length === 0) {
    die("No meta.*.json file found in dist/bundle/. Run 'pnpm build' first.");
}

const bundleMeta = JSON.parse(fs.readFileSync(path.join(BUNDLE_DIR, metaFiles[0]), "utf8"));
const bundleLocales = Object.keys(bundleMeta); // e.g. ["en-US", "fr-FR", ...]
log(`Found bundle with locales: ${bundleLocales.join(", ")}\n`);

// ---------------------------------------------------------------------------
// Step 2 – Convert the 9 compiled locales from dist/bundle/
//           Each file is  <namespace>.<8hexhash>.json  under <locale>/portals/
// ---------------------------------------------------------------------------

let totalFiles = 0;

for (const localeCode of bundleLocales) {
    const localeMeta       = bundleMeta[localeCode];
    const bundlePortalsDir = path.join(BUNDLE_DIR, localeCode, "portals");
    const destLocaleDir    = path.join(TRANSLATIONS_SRC, localeCode);
    const destPortalsDir   = path.join(destLocaleDir, "portals");

    log(`Processing locale from bundle: ${localeCode} (${localeMeta.name})`);

    if (!fs.existsSync(bundlePortalsDir)) {
        log(`  WARNING: portals/ dir not found in bundle for ${localeCode} – skipping.`);
        continue;
    }

    mkdirp(destPortalsDir);

    // All namespace JSON files except extensions (that comes from the app layer)
    const nsFiles = fs.readdirSync(bundlePortalsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("extensions."));

    const writtenNamespaces = [];

    for (const file of nsFiles) {
        // "authenticationFlow.469a7345.json" -> namespace = "authenticationFlow"
        const namespace = file.substring(0, file.indexOf("."));
        const content   = JSON.parse(fs.readFileSync(path.join(bundlePortalsDir, file), "utf8"));
        writeJson(path.join(destPortalsDir, `${namespace}.json`), content);
        writtenNamespaces.push(namespace);
        totalFiles++;
    }

    log(`  Written ${writtenNamespaces.length} namespace file(s).`);

    // Write per-locale meta.json (no paths – those are generated at build time)
    const metaJson = {
        code:       localeMeta.code,
        direction:  localeMeta.direction,
        flag:       localeMeta.flag,
        name:       localeMeta.name,
        namespaces: writtenNamespaces  // exact set of namespaces this locale provides
    };
    if (localeMeta.enabled !== undefined)              metaJson.enabled = localeMeta.enabled;
    if (localeMeta.showOnLanguageSwitcher !== undefined) metaJson.showOnLanguageSwitcher = localeMeta.showOnLanguageSwitcher;

    writeJson(path.join(destLocaleDir, "meta.json"), metaJson);
    log(`  Written meta.json\n`);
}

// ---------------------------------------------------------------------------
// Step 3 – Handle ta-IN which is not in the bundle (not exported from index.ts)
//           Force a fresh compile then read the compiled ta-IN portals directly.
// ---------------------------------------------------------------------------

const TA_IN_SRC_META    = path.join(TRANSLATIONS_SRC, "..", "..", "src", "translations", "ta-IN", "meta.ts");
const TA_IN_BUNDLE_META = path.join(BUNDLE_DIR, "ta-IN");

if (!fs.existsSync(TA_IN_BUNDLE_META)) {
    log("ta-IN is not in dist/bundle/ – compiling it now to extract its translations…");

    // Delete the tsbuildinfo so tsc re-compiles translation files that were previously cleaned.
    const tsBuildInfo = path.join(MODULE_ROOT, "dist", "tsconfig.tsbuildinfo");
    if (fs.existsSync(tsBuildInfo)) {
        fs.unlinkSync(tsBuildInfo);
        log("  Deleted stale tsconfig.tsbuildinfo for a clean compile.");
    }

    try {
        execSync("pnpm compile", { cwd: MODULE_ROOT, stdio: "inherit" });
    } catch (e) {
        log("WARNING: ta-IN compile failed – skipping ta-IN conversion:", e.message);
    }

    const TA_IN_DIST_INDEX = path.join(TRANSLATIONS_DIST, "ta-IN", "index.js");
    if (fs.existsSync(TA_IN_DIST_INDEX)) {
        try {
            // Clear any cached require for ta-IN
            Object.keys(require.cache)
                .filter((k) => k.includes(`${path.sep}ta-IN${path.sep}`))
                .forEach((k) => delete require.cache[k]);

            const { TA_IN: taInBundle } = require(TA_IN_DIST_INDEX);
            if (taInBundle && taInBundle.meta && taInBundle.resources) {
                const { meta: taMeta, resources: taResources } = taInBundle;
                const destLocaleDir  = path.join(TRANSLATIONS_SRC, "ta-IN");
                const destPortalsDir = path.join(destLocaleDir, "portals");

                log(`Processing locale from compile: ta-IN (${taMeta.name})`);
                mkdirp(destPortalsDir);

                const writtenNamespaces = [];
                const portals = (taResources && taResources.portals) || {};
                for (const [nsKey, nsContent] of Object.entries(portals)) {
                    if (!nsContent || typeof nsContent !== "object") continue;
                    writeJson(path.join(destPortalsDir, `${nsKey}.json`), nsContent);
                    writtenNamespaces.push(nsKey);
                    totalFiles++;
                }

                log(`  Written ${writtenNamespaces.length} namespace file(s).`);

                const metaJson = {
                    code:       taMeta.code,
                    direction:  taMeta.direction,
                    flag:       taMeta.flag,
                    name:       taMeta.name,
                    namespaces: writtenNamespaces
                };
                writeJson(path.join(destLocaleDir, "meta.json"), metaJson);
                log("  Written meta.json\n");
            }
        } catch (e) {
            log("WARNING: Could not load ta-IN bundle:", e.message);
        }
    } else {
        log("INFO: ta-IN compiled output not found after compile – skipping.\n");
    }

    // Clean up the newly compiled translation artefacts
    try {
        execSync("pnpm clean:translations", { cwd: MODULE_ROOT, stdio: "inherit" });
    } catch (_) { /* non-fatal */ }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

log(`\n===================================================`);
log(`Total namespace JSON files written: ${totalFiles}`);
log(`===================================================\n`);
log("=== Phase 1 conversion complete! ===");
log("");
log("Next steps:");
log("  1. Review the generated JSON files in src/translations/");
log("  2. Delete the TypeScript translation source files");
log("  3. Update post-build.js to read from JSON source directly");
