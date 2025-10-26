import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import MovieList from '@/components/UI/MovieList.vue'
import { flushAll, waitUntil } from '../setup'

const q = ref('')
vi.mock('@/shared/search/useSearch', () => ({ useSearchQuery: () => q }))

function makeMovies(n: number, offset = 0) {
    return Array.from({ length: n }, (_, i) => ({
        id: i + 1 + offset,
        title: `Movie ${i + 1 + offset}`,
        poster_path: null,
        backdrop_path: null,
        vote_average: 7.1,
        release_date: '2024-01-01',
    }))
}

const discoverMock = vi.fn((opts: any = {}) => {
    const page = Number(opts?.page ?? 1)
    return Promise.resolve({
        page,
        total_pages: 10,
        total_results: 200,
        results: makeMovies(8, (page - 1) * 8),
    })
})

const searchMock = vi.fn((query: string, opts: any = {}) => {
    const page = Number(opts?.page ?? 1)
    const total_pages = 2
    const perPage = page === 1 ? 6 : 0
    return Promise.resolve({
        page,
        total_pages,
        total_results: 6,
        results: makeMovies(perPage, 100 + (page - 1) * perPage),
    })
})

vi.mock('@/shared/api/tmdb', () => ({
    discoverMovies: (opts?: any) => discoverMock(opts),
    searchMovies: (query: string, opts?: any) => searchMock(query, opts),
}))

describe('MovieList', () => {
    beforeEach(() => {
        q.value = ''
        discoverMock.mockClear()
        searchMock.mockClear()
    })

    it('loads discover on mount and renders cards', async () => {
        const wrapper = mount(MovieList, {
            global: {
                stubs: {
                    SectionTitle: { template: '<div />' },
                    MovieCard: { template: '<div class="movie-card-stub"/>' },
                },
            },
            attachTo: document.body,
        })

        await flushAll()
        await waitUntil(
            () => wrapper.findAll('.movie-card-stub').length,
            n => n >= 8
        )

        expect(wrapper.findAll('.movie-card-stub').length).toBeGreaterThanOrEqual(8)
    })

    it('switches to search when query is set', async () => {
        const wrapper = mount(MovieList, {
            global: {
                stubs: {
                    SectionTitle: { template: '<div />' },
                    MovieCard: { template: '<div class="movie-card-stub"/>' },
                },
            },
            attachTo: document.body,
        })

        await flushAll()

        q.value = 'star'

        await flushAll()

        await waitUntil(
            () => wrapper.findAll('.movie-card-stub').length,
            n => n >= 6,
            { tries: 120, sleep: 10 }
        )

        expect(wrapper.findAll('.movie-card-stub').length).toBeGreaterThanOrEqual(6)
        expect(searchMock).toHaveBeenCalled()
    })
})
