<script>
import SearchIcon from "../../components/icons/SearchIcon.vue";
</script>
<template>
  <div class="flex-1 max-w-xl hidden md:block">
    <div data-debug-wrapper="true" style="display: contents">
      <div class="relative w-full">
        <div class="relative">
          <SearchIcon />
          <div style="display: contents">
            <input
              class="flex w-full rounded-xl border border-input bg-card/40 backdrop-blur-sm px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pl-12 pr-12 h-12"
              placeholder="Search movies..."
              type="text"
              value=""
            />
          </div>
          <div
            class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
