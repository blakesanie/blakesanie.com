import fs from 'fs/promises';
import path from 'path';
import { minify } from 'html-minifier-terser';

// Asynchronously discover all HTML files recursively
const getFilesAsync = async (dir) => {
    try {
        const list = await fs.readdir(dir);
        const subDirsAndFiles = await Promise.all(
            list.map(async (file) => {
                const fullPath = path.join(dir, file);
                const stat = await fs.stat(fullPath);
                if (stat.isDirectory()) {
                    return getFilesAsync(fullPath);
                } else if (file.endsWith('.html')) {
                    return fullPath;
                }
                return [];
            })
        );
        return subDirsAndFiles.flat();
    } catch {
        return [];
    }
};

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const runMinifierPipeline = async () => {
    const files = await getFilesAsync('./dist');

    console.log(`\x1b[36m[minify]\x1b[0m Starting advanced HTML, CSS, and JS minification...\n`);

    // Map each file to an isolated execution task that returns its own metrics
    const tasks = files.map(async (file) => {
        const relativePath = file.replace(/^.\/dist\//, '');
        try {
            const content = await fs.readFile(file, 'utf8');
            const sizeBefore = Buffer.byteLength(content, 'utf8');

            const minified = await minify(content, {
                collapseWhitespace: true,
                removeComments: true,
                decodeEntities: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeEmptyAttributes: true,
                sortAttributes: true,
                sortClassName: true,
                removeOptionalTags: false,
                caseSensitive: true,
                minifyCSS: {
                    level: {
                        1: {
                            cleanupCharsets: true,           // Safely removes redundant @charset declarations
                            normalizeUrls: true,             // Shortens and cleans up asset URLs
                            optimizeBackground: true,        // Shortens background property definitions
                            optimizeBorderRadius: true,      // Combines border-radius properties into shorthand
                            optimizeFilter: true,            // Optimizes SVG/CSS filter properties
                            optimizeFontWeight: true,        // Converts keyword weights (e.g., normal -> 400)
                            optimizeOutline: true,           // Shortens outline declarations
                            removeEmpty: true,               // Purges empty CSS blocks (e.g., a {})
                            removeNegativeZero: true,        // Converts values like -0px to 0
                            removeQuotes: true,              // Strips unnecessary quotes from font names or URLs
                            removeWhitespace: true,          // Compresses everything into a minified, single-line string
                            replaceMultipleZeros: true,      // Shortens 0 0 0 0 to a single 0
                            replaceTimeUnits: true,          // Converts ms to s where shorter (e.g., 200ms -> .2s)
                            replaceZeroUnits: true,          // Changes 0px or 0rem to just 0
                            roundingPrecision: false,        // Keeps exact fractional pixel values intact (prevents layout shifting)
                            selectorsSortingMethod: 'natural', // Sorts selectors predictably to maximize Brotli compression
                            specialComments: 0               // FORCE PURGE: Zero exceptions, wipes out /*! legal/preserve comments */
                        },
                        2: {
                            mergeAdjacentRules: true,        // Combines identical rules that sit right next to each other
                            mergeIntoShorthands: true,       // Aggressively packs properties (padding-top, etc.) into unified shorthands
                            mergeMedia: true,                // Safely merges duplicate @media query queries
                            mergeNonAdjacentRules: false,    // Safe fallback: Disables moving non-adjacent declarations
                            mergeSemantically: false,        // Safe fallback: Prevents risking semantic style shifts
                            overrideProperties: true,        // Eliminates overridden properties within the same block
                            removeEmpty: true,               // Cleans up any blocks left empty after structural changes
                            reduceNonAdjacentRules: false,   // Safe fallback: Keeps rules intact if they aren't next to each other
                            removeDuplicateFontRules: true,  // Drops duplicate @font-face rules
                            removeDuplicateMediaBlocks: true,// Purges identical @media rule blocks
                            removeDuplicateSelectors: true,  // Removes duplicate style definitions
                            restructuring: false,            // CRITICAL SAFETY: Locks cascade order completely so styles never break
                            skipProperties: []               // Processes all available standard properties
                        }
                    }
                },
                minifyJS: {
                    ecma: 2020,
                    mangle: { toplevel: true },
                    compress: {
                        passes: 3,
                        dead_code: true,
                        unused: true,
                        conditionals: true,
                        evaluate: true,
                        booleans: true,
                        sequences: true,
                        unsafe_arrows: true,
                        drop_console: true,
                        drop_debugger: true
                    },
                    format: { comments: false }
                }
            });

            const sizeAfter = Buffer.byteLength(minified, 'utf8');
            await fs.writeFile(file, minified);

            return {
                success: true,
                file: relativePath,
                sizeBefore,
                sizeAfter
            };
        } catch (err) {
            return {
                success: false,
                file: relativePath,
                error: err.message.split('\n')[0]
            };
        }
    });

    // Resolve all files concurrently in the background threadpool
    const results = await Promise.all(tasks);

    // Initialize summary tallies deterministically after concurrent execution
    let successCount = 0;
    let failCount = 0;
    let totalBytesBefore = 0;
    let totalBytesAfter = 0;

    // Process and print results cleanly in order
    for (const res of results) {
        if (res.success) {
            successCount++;
            totalBytesBefore += res.sizeBefore;
            totalBytesAfter += res.sizeAfter;

            const savings = res.sizeBefore - res.sizeAfter;
            const percentSavings = res.sizeBefore > 0 ? ((savings / res.sizeBefore) * 100).toFixed(1) : 0;

            console.log(
                `  \x1b[32m✔\x1b[0m Minified: ${res.file} ` +
                `(${formatBytes(res.sizeBefore)} → ${formatBytes(res.sizeAfter)} | \x1b[32m-${percentSavings}%\x1b[0m)`
            );
        } else {
            failCount++;
            console.warn(`  \x1b[31m✖\x1b[0m Skipped: ${res.file}\n    └─ ${res.error}`);
        }
    }

    // Final State Summary Metrics
    const totalSavings = totalBytesBefore - totalBytesAfter;
    const totalPercentSavings = totalBytesBefore > 0 ? ((totalSavings / totalBytesBefore) * 100).toFixed(1) : 0;

    console.log(`\n\x1b[36m--- [minify summary] ---\x1b[0m`);
    console.log(`Successfully processed  : ${successCount} file(s)`);
    if (failCount > 0) console.log(`Skipped with errors     : \x1b[31m${failCount} file(s)\x1b[0m`);
    console.log(`Total bundle size before: ${formatBytes(totalBytesBefore)}`);
    console.log(`Total bundle size after : ${formatBytes(totalBytesAfter)}`);
    console.log(`Total space saved        : \x1b[32m${formatBytes(totalSavings)} (-${totalPercentSavings}%)\x1b[0m\n`);
};

await runMinifierPipeline();