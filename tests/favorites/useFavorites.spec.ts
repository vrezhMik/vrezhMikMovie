import { useFavorites } from '../../src/shared/favorites/useFavorites'

vi.mock('@/shared/db/favorites-idb', () => {
    let store = new Map<number, any>()
    return {
        idbPut: vi.fn(async (m) => { store.set(m.id, m) }),
        idbDelete: vi.fn(async (id) => { store.delete(id) }),
        idbGetAll: vi.fn(async () => Array.from(store.values())),
        idbGet: vi.fn(async (id) => store.get(id)),
        idbClearAll: vi.fn(async () => { store.clear() }),
        FavMovie: {} as any,
    }
})

const sample = { id: 1, title: 'Dune', poster_path: null, vote_average: 8, release_date: '2021-10-22', backdrop_path: null }

it('likes / unlikes / toggles and exposes count + list', async () => {
    const fav = useFavorites()
    await fav.loadAll()
    expect(fav.count.value).toBe(0)

    await fav.like(sample as any)
    expect(fav.count.value).toBe(1)
    expect(fav.list.value[0].title).toBe('Dune')

    await fav.toggle(sample as any)
    expect(fav.count.value).toBe(0)
})

it('clears all', async () => {
    const fav = useFavorites()
    await fav.like(sample as any)
    expect(fav.count.value).toBe(1)
    await fav.clearAll()
    await fav.loadAll()
    expect(fav.count.value).toBe(0)
})
