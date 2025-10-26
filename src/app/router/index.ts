import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    { path: '/', name: 'home', component: () => import('../../pages/home/HomePage.vue') },
    { path: '/favorites', name: 'favorites', component: () => import('../../pages/favorites/FavoritesPage.vue') },
    { path: '/movie/:id(\\d+)', name: 'movie-details', component: () => import('../../pages/movie/MovieDetailsPage.vue'), props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }),
})
