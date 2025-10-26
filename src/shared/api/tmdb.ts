import { tmdbGet } from "./http";


export interface TmdbGenre { id: number; name: string }

export interface TmdbMovie {
    id: number;
    title: string;
    name?: string;
    overview?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
    adult?: boolean;
    genre_ids?: number[];
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
        page, sort_by, with_genres, include_adult, language, region,
    });
}

export function trendingMovies(opts?: {
    time_window?: "day" | "week";
    page?: number;
    language?: string;
    region?: string;
}) {
    const time_window = opts?.time_window ?? "day";
    const page = opts?.page ?? 1;
    const language = opts?.language ?? "en-US";
    const region = opts?.region;

    return tmdbGet<TmdbPaginated<TmdbMovie>>(
        `/trending/movie/${time_window}`,
        { page, language, region },
        10 * 60 * 1000
    );
}


export interface TmdbMovieDetails {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    runtime?: number | null;
    vote_average?: number;
    genres?: { id: number; name: string }[];
    poster_path?: string | null;
    backdrop_path?: string | null;
    status?: string;
    tagline?: string | null;
    homepage?: string | null;
    revenue?: number;
    budget?: number;
}

export function getMovieById(id: number, language = "en-US", ttlMs = 5 * 60_000) {
    return tmdbGet<TmdbMovieDetails>(`/movie/${id}`, { language }, ttlMs);
}


export interface TmdbCredits {
    id: number;
    cast: Array<{
        id: number;
        name: string;
        character?: string;
        profile_path?: string | null;
        order?: number;
    }>;
    crew: Array<{
        id: number;
        name: string;
        job?: string;
        department?: string;
        profile_path?: string | null;
    }>;
}

export function getMovieCredits(id: number, language = "en-US", ttlMs = 5 * 60_000) {
    return tmdbGet<TmdbCredits>(`/movie/${id}/credits`, { language }, ttlMs);
}

export interface TmdbVideo {
    id: string;
    key: string;
    name: string;
    site: "YouTube" | string;
    type: "Trailer" | "Teaser" | string;
    official?: boolean;
    published_at?: string;
}

export interface TmdbVideosResponse {
    id: number;
    results: TmdbVideo[];
}

export function getMovieVideos(id: number, language = "en-US", ttlMs = 5 * 60_000) {
    return tmdbGet<TmdbVideosResponse>(`/movie/${id}/videos`, { language }, ttlMs);
}

export function getMovieRecommendations(
    id: number,
    page = 1,
    language = "en-US",
    ttlMs = 5 * 60_000
) {
    return tmdbGet<TmdbPaginated<TmdbMovie>>(
        `/movie/${id}/recommendations`,
        { page, language },
        ttlMs
    );
}

export function getSimilarMovies(
    id: number,
    page = 1,
    language = "en-US",
    ttlMs = 5 * 60_000
) {
    return tmdbGet<TmdbPaginated<TmdbMovie>>(
        `/movie/${id}/similar`,
        { page, language },
        ttlMs
    );
}


export type TmdbMovieFull = TmdbMovieDetails & {
    credits: TmdbCredits;
    videos: TmdbVideosResponse;
};

export function getMovieByIdWithExtras(
    id: number,
    language = "en-US",
    ttlMs = 5 * 60_000
) {
    return tmdbGet<TmdbMovieFull>(
        `/movie/${id}`,
        { language, append_to_response: "credits,videos" },
        ttlMs
    );
}

export function searchMovies(
    query: string,
    opts?: { page?: number; include_adult?: boolean; language?: string; region?: string }
) {
    const page = opts?.page ?? 1;
    const include_adult = opts?.include_adult ?? false;
    const language = opts?.language ?? "en-US";
    const region = opts?.region;

    return tmdbGet<TmdbPaginated<TmdbMovie>>(
        "/search/movie",
        { query, page, include_adult, language, region },
        2 * 60 * 1000
    );
}


export function getMovieGenres(language = "en-US") {
    return tmdbGet<{ genres: TmdbGenre[] }>(
        "/genre/movie/list",
        { language },
        24 * 60 * 60 * 1000
    );
}

export const TMDB_IMG = {
    poster: (path?: string | null, size: "w342" | "w500" | "w780" | "original" = "w500") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : "",
    backdrop: (path?: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : "",
    profile: (path?: string | null, size: "w185" | "w342" | "original" = "w342") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : "",
};
