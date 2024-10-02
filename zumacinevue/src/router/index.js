import { createRouter, createWebHistory } from 'vue-router'
import MovieLogin from '@/components/MovieLogin.vue'
import Movies from '@/components/MoviesAPI.vue'
import MovieDetail from '@/components/MovieDetail.vue'
import Home from '@/components/Home.vue'
import Series from '@/components/SeriesAPI.vue'
import SerieDetail from '@/components/SerieDetail.vue'
import ActorDetail from '@/components/ActorDetail.vue'; 
import CategoryDetail from '@/components/CategoryDetail.vue'; 
import KeywordDetail from '@/components/KeywordDetail.vue'; 
import seasons_Episodes from '@/components/seasons_Episodes.vue'; 

const routes = [
  {
    path: '/',
    name: 'Login',
    component: MovieLogin
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true } 
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
    meta: { requiresAuth: true } 
  },
  {
    path: '/series',
    name: 'Series',
    component: Series,
    meta: { requiresAuth: true }
  },
  {
    path: '/serie/:id',
    name: 'SerieDetail',
    component: SerieDetail,
    meta: { requiresAuth: true } 
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail,
    meta: { requiresAuth: true } 
  },
  {
    path: '/actor/:id',
    name: 'ActorDetail',
    component: ActorDetail,
    meta: { requiresAuth: true } 
  },
  {
    path: '/category/:id', 
    name: 'CategoryDetail',
    component: CategoryDetail,
    meta: { requiresAuth: true } 
  },
  {
    path: '/keyword/:id', 
    name: 'KeywordDetail',
    component: KeywordDetail,
    meta: { requiresAuth: true } 
  },
  {
    path: '/serie/:id/seasons',
    name: 'seasons_Episodes',
    component: seasons_Episodes,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('sessionId'); 

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

router.onError((error) => {
  console.error('Router error:', error)
})

export default router;
