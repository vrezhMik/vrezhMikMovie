import { config } from '@vue/test-utils'

class IOStub {
    constructor(_: IntersectionObserverCallback) { }
    observe = (_: Element) => { }
    unobserve = (_: Element) => { }
    disconnect = () => { }
    takeRecords = () => []
    root = null
    rootMargin = ''
    thresholds = []
}
; (globalThis as any).IntersectionObserver = IOStub as any

config.global.stubs = {
    SectionTitle: { template: '<div />' },
}

export async function flushAll() {
    await Promise.resolve()
    await Promise.resolve()
    await new Promise(r => setTimeout(r, 0))
    await Promise.resolve()
}

export async function waitUntil<T>(
    get: () => T,
    pred: (v: T) => boolean,
    { tries = 80, sleep = 10 } = {}
) {
    for (let i = 0; i < tries; i++) {
        const v = get()
        if (pred(v)) return v
        await new Promise(r => setTimeout(r, sleep))
    }
    return get()
}
