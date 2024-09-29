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
const routes = [
  {
    path: '/',
    name: 'Login',
    component: MovieLogin
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies
  },
  {
    path: '/series',
    name: 'Series',
    component: Series
  },
  {
    path: '/serie/:id',
    name: 'SerieDetail',
    component: SerieDetail
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail
  },
  {
    path: '/actor/:id',
    name: 'ActorDetail',
    component: ActorDetail,
    
  },
  {
    path: '/category/:id', 
    name: 'CategoryDetail',
    component: CategoryDetail,
  },
  {
    path: '/keyword/:id', 
    name: 'KeywordDetail',
    component: KeywordDetail,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router
