import { createRouter, createWebHistory } from 'vue-router';
import MovieLogin from '@/components/MovieLogin.vue';
import Movies from '@/components/MoviesAPI.vue';
import MovieDetail from '@/components/MovieDetail.vue';
import Home from '@/components/Home.vue';
import Series from '@/components/SeriesAPI.vue';
import SerieDetail from '@/components/SerieDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: MovieLogin,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
  },
  {
    path: '/series',
    name: 'Series',
    component: Series,
  },
  {
    path: '/serie/:id',
    name: 'SerieDetail',
    component: SerieDetail,
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