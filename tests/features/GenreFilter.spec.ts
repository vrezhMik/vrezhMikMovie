import { mount } from '@vue/test-utils'
import GenreList from '@/components/UI/GenreList.vue'

const genres = [{ id: 1, name: 'Action' }, { id: 2, name: 'Drama' }]

it('emits toggle and shows Clear all only when selected', async () => {
    const wrapper = mount(GenreList, { props: { genres, selectedIds: [], loading: false, error: null } })
    expect(wrapper.text()).not.toContain('Clear all')

    await wrapper.setProps({ selectedIds: [1] })
    expect(wrapper.text()).toContain('Clear all')
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('toggle')?.[0]).toEqual([1])
})
