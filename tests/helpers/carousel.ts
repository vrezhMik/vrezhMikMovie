import { nextTick } from 'vue'
declare const vi: any

function withFakeTimers<T>(fn: () => T, fallback: () => T) {
    try {

        if (typeof vi?.getTimerCount === 'function') {
            return fn()
        }
    } catch { }
    return fallback()
}


export async function fireTransitionEndOnStrip(wrapper: any) {
    const el = wrapper.find('[data-carousel]').element as HTMLElement
    el.dispatchEvent(new (window as any).Event('transitionend'))
    await nextTick()
}

export async function flushTiny() {
    await Promise.resolve()
    await nextTick()
}

export function last<T>(arr: readonly T[] | undefined | null): T | undefined {
    return arr && arr.length ? arr[arr.length - 1] : undefined
}
export async function waitForTransitionHook() {
    await nextTick()
    try {

        if (typeof vi?.advanceTimersByTime === 'function') {

            if (typeof vi.advanceTimersByTimeAsync === 'function') {

                await vi.advanceTimersByTimeAsync(0)
            } else {

                vi.advanceTimersByTime(0)
            }
        } else {

            await new Promise(r => setTimeout(r, 0))
        }
    } catch {

        await new Promise(r => setTimeout(r, 0))
    }
    await nextTick()
}