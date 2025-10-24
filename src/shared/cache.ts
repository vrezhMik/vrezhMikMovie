
type CacheEntry<T = unknown> = { data: T; expiresAt: number };

const mem = new Map<string, CacheEntry>();

const STORAGE_NAMESPACE = "tmdb_cache_v1";
const DEFAULT_TTL = 1000 * 60 * 5;

function storageGet<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(`${STORAGE_NAMESPACE}:${key}`);
        if (!raw) return null;
        const parsed: CacheEntry<T> = JSON.parse(raw);
        if (parsed.expiresAt < Date.now()) {
            localStorage.removeItem(`${STORAGE_NAMESPACE}:${key}`);
            return null;
        }
        return parsed.data;
    } catch {
        return null;
    }
}

function storageSet<T>(key: string, data: T, ttl = DEFAULT_TTL) {
    const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttl };
    try {
        localStorage.setItem(`${STORAGE_NAMESPACE}:${key}`, JSON.stringify(entry));
    } catch {

    }
}

export function cacheKey(url: string, params?: Record<string, any>) {
    return params ? `${url}?${new URLSearchParams(params as any).toString()}` : url;
}


export function cacheGet<T>(key: string): T | null {
    const m = mem.get(key);
    if (m && m.expiresAt >= Date.now()) return m.data as T;
    const s = storageGet<T>(key);
    if (s != null) {

        mem.set(key, { data: s, expiresAt: Date.now() + DEFAULT_TTL });
    }
    return s;
}

export function cacheSet<T>(key: string, data: T, ttl = DEFAULT_TTL) {
    const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttl };
    mem.set(key, entry);
    storageSet<T>(key, data, ttl);
}


export function cacheClearAll() {
    mem.clear();
    Object.keys(localStorage)
        .filter((k) => k.startsWith(`${STORAGE_NAMESPACE}:`))
        .forEach((k) => localStorage.removeItem(k));
}
