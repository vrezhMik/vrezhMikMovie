<script setup lang="ts" generic="T">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import SectionTitle from "@/components/UI/SectionTitle.vue";
import TrendingIcon from "@/components/icons/TrendingIcon.vue";
import SliderButtonIcon from "@/components/icons/SliderButtonIcon.vue";

const props = withDefaults(
  defineProps<{
    items: ReadonlyArray<T>;
    visible?: number;
    gapPx?: number;
    itemWidthPx?: number;
    loop?: boolean;
    title?: string;
    autoplay?: boolean;
    intervalMs?: number;
    pauseOnHover?: boolean;
    swipeThresholdPx?: number;
  }>(),
  {
    visible: 4,
    gapPx: 16,
    itemWidthPx: 288,
    loop: true,
    title: "Carousel",
    autoplay: false,
    intervalMs: 3500,
    pauseOnHover: true,
    swipeThresholdPx: 40,
  }
);

const emit = defineEmits<{ (e: "shift", head: number): void }>();

const root = ref<HTMLElement | null>(null);
const strip = ref<HTMLDivElement | null>(null);
const animating = ref(false);
const head = ref(0);

const isStatic = computed(() => props.items.length <= (props.visible ?? 1));
const step = computed(() =>
  isStatic.value ? 0 : (props.itemWidthPx ?? 0) + (props.gapPx ?? 0)
);
const baseOffset = computed(() => (isStatic.value ? 0 : -step.value));
const poolSize = computed(() => {
  const len = props.items.length;
  return isStatic.value ? len : Math.min(len, (props.visible ?? 0) + 2);
});
const visibleIndices = computed<number[]>(() => {
  const len = props.items.length;
  if (len === 0) return [];
  const count = poolSize.value;
  const out: number[] = new Array(count);
  for (let i = 0; i < count; i++) out[i] = (head.value + i - 1 + len) % len;
  return out;
});

const transform = ref("translateX(0px)");
const transition = ref("");

function resetTransform() {
  transition.value = "";
  transform.value = `translateX(${baseOffset.value}px)`;
}

onMounted(resetTransform);
watch([step, () => props.items.length], resetTransform);

function shift(by: 1 | -1) {
  if (isStatic.value) return;
  if (animating.value || props.items.length <= 1) return;
  if (
    !props.loop &&
    ((by === 1 && head.value + (props.visible ?? 0) >= props.items.length) ||
      (by === -1 && head.value <= 0))
  )
    return;
  animating.value = true;
  transition.value = "transform 350ms var(--transition-smooth)";
  transform.value =
    by === 1
      ? `translateX(${baseOffset.value - step.value}px)`
      : `translateX(${baseOffset.value + step.value}px)`;
  const el = strip.value;
  if (!el) {
    animating.value = false;
    resetTransform();
    return;
  }
  const onEnd = () => {
    el.removeEventListener("transitionend", onEnd);
    const len = props.items.length;
    head.value = (head.value + by + len) % len;
    resetTransform();
    animating.value = false;
    emit("shift", head.value);
  };
  el.addEventListener("transitionend", onEnd, { once: true });
}

function next() {
  shift(1);
}
function prev() {
  shift(-1);
}

watch(
  () => props.items.length,
  () => {
    animating.value = false;
    head.value = 0;
    resetTransform();
    restartAutoplay();
  }
);

let timer: number | null = null;
const hovering = ref(false);
const interacting = ref(false);
let resumeTimeout: number | null = null;

function onInteractionStart() {
  interacting.value = true;
  stopAutoplay();
  if (resumeTimeout !== null) {
    window.clearTimeout(resumeTimeout);
    resumeTimeout = null;
  }
}

function onInteractionEnd() {
  interacting.value = false;
  resumeTimeout = window.setTimeout(() => {
    resumeTimeout = null;
    restartAutoplay();
  }, 400);
}

function startAutoplay() {
  stopAutoplay();
  if (!props.autoplay) return;
  if (isStatic.value) return;
  const canMove = props.loop || props.items.length > (props.visible ?? 1);
  if (!canMove) return;
  timer = window.setInterval(() => {
    if (document.hidden) return;
    if (interacting.value || dragging) return;
    next();
  }, props.intervalMs);
}

function stopAutoplay() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
}
function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

function onMouseEnter() {
  hovering.value = true;
}
function onMouseLeave() {
  hovering.value = false;
}

document.addEventListener("visibilitychange", restartAutoplay);
onMounted(startAutoplay);
onBeforeUnmount(() => {
  stopAutoplay();
  document.removeEventListener("visibilitychange", restartAutoplay);
});

const usePointer = ref(false);
onMounted(() => {
  usePointer.value = "PointerEvent" in window;
});

let pointerDown = false;
let dragging = false;
let startX = 0;
let deltaX = 0;
const dragStartThreshold = 10;

function beginDrag(x: number) {
  if (isStatic.value) return false;
  if (animating.value) return false;
  onInteractionStart();
  pointerDown = true;
  dragging = false;
  startX = x;
  deltaX = 0;
  return true;
}
function progressDrag(x: number, captureId?: number) {
  if (!pointerDown) return;
  deltaX = x - startX;
  if (!dragging && Math.abs(deltaX) > dragStartThreshold) {
    dragging = true;
    transition.value = "";
    if (captureId != null) {
      try {
        root.value?.setPointerCapture?.(captureId);
      } catch {}
    }
  }
  if (dragging) transform.value = `translateX(${baseOffset.value + deltaX}px)`;
}
function endDrag() {
  const threshold = props.swipeThresholdPx ?? 40;
  if (dragging && Math.abs(deltaX) >= threshold) {
    shift(deltaX > 0 ? -1 : 1);
  } else {
    resetTransform();
  }
  pointerDown = false;
  dragging = false;
  deltaX = 0;
  onInteractionEnd();
}

function onPointerDown(e: PointerEvent) {
  if (usePointer.value) {
    onInteractionStart();
    beginDrag(e.clientX);
  }
}
function onPointerMove(e: PointerEvent) {
  if (usePointer.value) progressDrag(e.clientX, e.pointerId);
}
function onPointerUp(e: PointerEvent) {
  if (!usePointer.value) return;
  try {
    root.value?.releasePointerCapture?.(e.pointerId);
  } catch {}
  endDrag();
}
function onPointerCancel() {
  if (!usePointer.value) return;
  resetTransform();
  pointerDown = false;
  dragging = false;
  deltaX = 0;
}

function onTouchStart(e: TouchEvent) {
  if (usePointer.value) return;
  const x = e.touches[0]?.clientX ?? 0;
  beginDrag(x);
}
function onTouchMove(e: TouchEvent) {
  if (usePointer.value) return;
  const x = e.touches[0]?.clientX ?? 0;
  progressDrag(x);
  if (dragging && e.cancelable) e.preventDefault();
}
function onTouchEnd() {
  if (!usePointer.value) endDrag();
}
function onTouchCancel() {
  if (usePointer.value) return;
  resetTransform();
  pointerDown = false;
  dragging = false;
  deltaX = 0;
}

function onFocusIn() {
  onInteractionStart();
}
function onFocusOut() {
  onInteractionEnd();
}
</script>

<template>
  <section class="mb-12">
    <div class="flex items-center gap-3 mb-6" v-if="$slots.header || title">
      <slot name="header">
        <SectionTitle
          :title="title"
          description="Popular movies everyone is watching"
          :icon="TrendingIcon"
          icon_style="bg-gradient-to-br from-primary to-accent"
        />
      </slot>
    </div>

    <div
      ref="root"
      tabindex="0"
      class="relative group overflow-hidden select-none touch-pan-y"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      @mouseenter="props.pauseOnHover ? onMouseEnter() : null"
      @mouseleave="props.pauseOnHover ? onMouseLeave() : null"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerCancel"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
      style="touch-action: pan-y"
    >
      <div
        ref="strip"
        data-carousel
        class="flex pb-4 will-change-transform transform-gpu"
        :class="{
          'justify-start': !isStatic,
          'justify-start md:justify-start': isStatic,
        }"
        :style="{ gap: (gapPx ?? 0) + 'px', transform, transition }"
      >
        <div
          v-for="(idx, slot) in visibleIndices"
          :key="slot"
          class="flex-shrink-0 w-72 snap-start"
        >
          <slot name="item" :item="(items[idx] as T)" :index="idx" />
        </div>
      </div>

      <button
        v-if="!isStatic"
        :disabled="animating"
        class="inline-flex items-center justify-center h-10 w-10 absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10 disabled:opacity-40 disabled:cursor-not-allowed hidden md:block"
        aria-label="Scroll left"
        @pointerdown.stop
        @pointerup.stop
        @touchstart.stop
        @touchend.stop
        @click="prev"
      >
        <SliderButtonIcon />
      </button>

      <button
        v-if="!isStatic"
        :disabled="animating"
        class="inline-flex items-center justify-center h-10 w-10 absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10 disabled:opacity-40 disabled:cursor-not-allowed hidden md:block"
        aria-label="Scroll right"
        @pointerdown.stop
        @pointerup.stop
        @touchstart.stop
        @touchend.stop
        @click="next"
      >
        <SliderButtonIcon class="rotate-180" />
      </button>
    </div>
  </section>
</template>

<style>
@media (prefers-reduced-motion: reduce) {
  [data-carousel] {
    transition: none !important;
  }
}
</style>
