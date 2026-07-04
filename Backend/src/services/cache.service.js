const crypto = require("crypto");

let cacheInstance;
let cacheType = "memory-map";

try {
    // Try to load node-cache (with TTL support)
    const NodeCache = require("node-cache");
    // Standard TTL is 24 hours (86400 seconds)
    cacheInstance = new NodeCache({ stdTTL: 86400, checkperiod: 600 });
    cacheType = "node-cache";
    console.log("🚀 Cache Service: node-cache initialized successfully (24h TTL)");
} catch (error) {
    // Fallback to simple in-memory Map
    const memoryMap = new Map();
    cacheInstance = {
        get: (key) => memoryMap.get(key),
        set: (key, val) => memoryMap.set(key, val),
        has: (key) => memoryMap.has(key),
    };
    cacheType = "memory-map";
    console.warn("⚠️ Cache Service: node-cache not installed. Falling back to simple In-Memory Map.");
}

/**
 * Get value from cache
 * @param {string} key 
 */
function get(key) {
    return cacheInstance.get(key);
}

/**
 * Set value in cache
 * @param {string} key 
 * @param {any} val 
 */
function set(key, val) {
    cacheInstance.set(key, val);
}

/**
 * Check if cache contains key
 * @param {string} key 
 */
function has(key) {
    return cacheInstance.has(key);
}

/**
 * Generate a unique cache key based on inputs
 * @param  {...any} args 
 */
function generateKey(...args) {
    const rawString = args.map(arg => String(arg || "")).join("_");
    return crypto.createHash("sha256").update(rawString).digest("hex");
}

module.exports = {
    get,
    set,
    has,
    generateKey,
    getCacheType: () => cacheType
};
