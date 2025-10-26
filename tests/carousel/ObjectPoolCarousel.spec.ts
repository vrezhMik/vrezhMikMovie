import { mount } from '@vue/test-utils'
import Carousel from '@/features/carousel/ObjectPoolCarousel.vue'
import {
    fireTransitionEndOnStrip,
    last,
    flushTiny,
    waitForTransitionHook,
} from '../helpers/carousel'
import { DOMWrapper } from '@vue/test-utils';
function mountWith(items: number[] = [1, 2, 3, 4, 5], extraProps = {}) {
    return mount(Carousel, {
        props: { items, visible: 3, itemWidthPx: 100, gapPx: 0, loop: true, ...extraProps },
        slots: {
            item: `<template #item="{ item }"><div class="slot">{{ item }}</div></template>`,
        },
        attachTo: document.body,
    })
}

describe('ObjectPoolCarousel', () => {
    it('emits shift and advances on next/prev after transitionend', async () => {
        const wrapper = mountWith()

            ; (wrapper.vm as any).next()
        await waitForTransitionHook()
        await fireTransitionEndOnStrip(wrapper)
        const shifts1 = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(shifts1)?.[0]).toBe(1)

            ; (wrapper.vm as any).prev()
        await waitForTransitionHook()
        await fireTransitionEndOnStrip(wrapper)
        const shifts2 = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(shifts2)?.[0]).toBe(0)
    })

    it('autoplay advances and pauses on hover', async () => {
        vi.useFakeTimers()
        const wrapper = mountWith([1, 2, 3, 4, 5], { autoplay: true, intervalMs: 500, pauseOnHover: true })
        await flushTiny()

        vi.advanceTimersByTime(500)
        await waitForTransitionHook()
        await fireTransitionEndOnStrip(wrapper)
        const after1 = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(after1)?.[0]).toBe(1)

        await wrapper.trigger('mouseenter')
        vi.advanceTimersByTime(1000)
        await flushTiny()
        const afterHover = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(afterHover)?.[0]).toBe(1)

        await wrapper.trigger('mouseleave')
        vi.advanceTimersByTime(500)
        await waitForTransitionHook()
        await fireTransitionEndOnStrip(wrapper)
        const after2 = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(after2)?.[0]).toBe(2)

        vi.useRealTimers()
    })


    it('swipe left/right shifts after threshold', async () => {
        const wrapper = mountWith()

        const strip = wrapper.find('[data-carousel]');
        const panelEl = strip.element.parentElement as HTMLElement;
        const panel = new DOMWrapper(panelEl);

        await panel.trigger('touchstart', { touches: [{ clientX: 100 }] })
        await panel.trigger('touchmove', { touches: [{ clientX: 40 }] })
        await panel.trigger('touchend')
        await waitForTransitionHook()
        await fireTransitionEndOnStrip(wrapper)
        const afterLeft = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(afterLeft)?.[0]).toBe(1)

        await panel.trigger('touchstart', { touches: [{ clientX: 40 }] })
        await panel.trigger('touchmove', { touches: [{ clientX: 110 }] })
        await panel.trigger('touchend')
        await waitForTransitionHook()
        await fireTransitionEndOnStrip(wrapper)
        const afterRight = wrapper.emitted('shift') as unknown[][] | undefined
        expect(last(afterRight)?.[0]).toBe(0)
    })

})
