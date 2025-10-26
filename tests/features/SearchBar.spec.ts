import { mount } from '@vue/test-utils'
import SearchBar from '@/features/search-bar/SearchBar.vue'


vi.mock('@/shared/search/useSearch', () => {
    const v = { value: '' }
    return { useSearchQuery: () => v }
})

it('debounces updates to global query', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input')
    await input.setValue('dune')
    const { useSearchQuery } = await import('@/shared/search/useSearch')
    expect(useSearchQuery().value).toBe('')
    vi.advanceTimersByTime(400)
    expect(useSearchQuery().value).toBe('dune')
    vi.useRealTimers()
})
