import { createRouter, createWebHistory } from 'vue-router';
import MovieLogin from '@/components/MovieLogin.vue';
import Movies from '@/components/MoviesAPI.vue';
import MovieDetail from '@/components/MovieDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: MovieLogin,
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.onError((error) => {
  console.error('Router error:', error);
});

export default router;