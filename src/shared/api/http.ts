import { cacheGet, cacheSet, cacheKey } from "../cache";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const V4_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined;
const V3_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;


export async function tmdbGet<T>(
    path: string,
    params: Record<string, any> = {},
    ttlMs = 5 * 60 * 1000
): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${path}`);

    if (!V4_TOKEN && V3_KEY) {
        params.api_key = V3_KEY;
    }

    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });

    const key = cacheKey(url.toString());


    const cached = cacheGet<T>(key);
    if (cached) return cached;

    const res = await fetch(url.toString(), {
        headers: V4_TOKEN
            ? {
                Authorization: `Bearer ${V4_TOKEN}`,
                "Content-Type": "application/json;charset=utf-8",
            }
            : { "Content-Type": "application/json;charset=utf-8" },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`TMDB GET ${path} failed: ${res.status} ${res.statusText} ${text}`);
    }

    const data = (await res.json()) as T;

    cacheSet<T>(key, data, ttlMs);
    return data;
}
