import { reactive, computed } from "vue";
import type { TmdbMovie, TmdbMovieFull } from "@/shared/api/tmdb";
import {
    idbClearAll,
    idbPut,
    idbDelete,
    idbGetAll,
    idbGet,
    type FavMovie,
} from "@/shared/db/favorites-idb";

const state = reactive({
    ready: false,
    byId: new Map<number, FavMovie>(),
});

function toFav(movie: TmdbMovie | TmdbMovieFull): FavMovie {
    return {
        id: movie.id,
        title: (movie as any).title ?? (movie as any).name ?? "",
        poster_path: movie.poster_path ?? null,
        backdrop_path: (movie as any).backdrop_path ?? null,
        vote_average: (movie as any).vote_average ?? 0,
        release_date: (movie as any).release_date,
    };
}

async function clearAll() {
    await idbClearAll();
    state.byId.clear();
    state.ready = false;
}

async function ensureLoaded() {
    if (state.ready) return;
    const all = await idbGetAll();
    state.byId.clear();

    for (const m of all) {
        const hydrated: FavMovie = {
            id: m.id,
            title: m.title,
            poster_path: m.poster_path ?? null,
            backdrop_path: (m as any).backdrop_path ?? null,
            vote_average: m.vote_average ?? 0,
            release_date: m.release_date,
        };
        state.byId.set(hydrated.id, hydrated);
    }
    state.ready = true;
}

export function useFavorites() {
    const count = computed(() => state.byId.size);
    const list = computed(() => Array.from(state.byId.values()));

    async function like(movie: TmdbMovie | TmdbMovieFull) {
        await ensureLoaded();
        const fav = toFav(movie);
        await idbPut(fav);
        state.byId.set(fav.id, fav);
    }

    async function unlike(id: number) {
        await ensureLoaded();
        await idbDelete(id);
        state.byId.delete(id);
    }

    async function toggle(movie: TmdbMovie | TmdbMovieFull) {
        await ensureLoaded();
        if (state.byId.has(movie.id)) return unlike(movie.id);
        return like(movie);
    }

    async function isLiked(id: number) {
        await ensureLoaded();
        if (state.byId.has(id)) return true;
        const row = await idbGet(id);
        if (row) {
            const hydrated: FavMovie = {
                id: row.id,
                title: row.title,
                poster_path: row.poster_path ?? null,
                backdrop_path: (row as any).backdrop_path ?? null,
                vote_average: row.vote_average ?? 0,
                release_date: row.release_date,
            };
            state.byId.set(id, hydrated);
            return true;
        }
        return false;
    }

    async function loadAll() {
        state.ready = false;
        await ensureLoaded();
    }

    function clearMemCache() {
        state.byId.clear();
        state.ready = false;
    }

    return {
        count,
        list,
        like,
        unlike,
        toggle,
        isLiked,
        loadAll,
        clearMemCache,
        clearAll,
    };
}
