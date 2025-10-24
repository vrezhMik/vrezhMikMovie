<script setup lang="ts">
import ArrowIcon from "../../components/icons/ArrowIcon.vue";
import { ref } from "vue";

const isOpen = ref<boolean>(false);
</script>
<template>
  <aside class="lg:w-64 flex-shrink-0">
    <div class="lg:sticky lg:top-24">
      <div data-debug-wrapper="true" style="display: contents">
        <div data-testid="genre-filter" class="w-full">
          <div class="hidden lg:block">
            <fieldset class="space-y-4">
              <legend class="flex items-center justify-between mb-4">
                <span class="text-lg font-semibold text-foreground"
                  >Genres</span
                >
              </legend>
              <!-- big menu -->
              <div
                class="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2"
              >
                <label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Action</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Adventure</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Animation</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Comedy</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Crime</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Documentary</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Drama</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Family</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Fantasy</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >History</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Horror</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Music</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Mystery</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Romance</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Science Fiction</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >TV Movie</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Thriller</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >War</span
                  ></label
                ><label
                  class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card/40 border border-transparent hover:bg-card-hover"
                  ><input
                    class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    type="checkbox"
                  /><span class="text-sm font-medium text-foreground"
                    >Western</span
                  ></label
                >
              </div>
            </fieldset>
          </div>
          <div class="lg:hidden">
            <button
              class="flex items-center justify-between w-full p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 text-foreground hover:bg-card-hover transition-all duration-300"
              @click="isOpen = !isOpen"
            >
              <span class="font-medium">Genres </span
              ><ArrowIcon :class="isOpen ? 'rotate-180' : ''" />
            </button>
            <!-- small menu -->
            <div
              v-if="isOpen"
              class="mt-2 p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 space-y-3"
            >
              <div class="flex flex-wrap gap-2">
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Action
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Adventure
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Animation
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Comedy
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Crime
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Documentary
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Drama
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Family
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Fantasy
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    History
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Horror
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Music
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Mystery
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Romance
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Science Fiction
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    TV Movie
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Thriller
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    War
                  </div>
                </div>
                <div data-debug-wrapper="true" style="display: contents">
                  <div
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-muted/40 text-muted-foreground border border-muted/50 cursor-pointer transition-all duration-300 hover:scale-105"
                  >
                    Western
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
