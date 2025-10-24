import { tmdbGet } from "./http";


export interface TmdbMovie {
    id: number;
    title: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
}

export interface TmdbPaginated<T> {
    page: number;
    total_pages: number;
    total_results: number;
    results: T[];
}


export function discoverMovies(opts?: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    include_adult?: boolean;
    language?: string;
    region?: string;
}) {
    const {
        page = 1,
        sort_by = "popularity.desc",
        with_genres,
        include_adult = false,
        language = "en-US",
        region,
    } = opts ?? {};

    return tmdbGet<TmdbPaginated<TmdbMovie>>("/discover/movie", {
        page,
        sort_by,
        with_genres,
        include_adult,
        language,
        region,
    });
}
