<template>
  <Navbar />

  <div>
    <div class="banner">
      <div class="welcome-message">
        <label style="font-weight: bolder;">Bienvenido. Millones de películas, series y gente por descubrir. Explora ya.</label>
      </div>
    </div>

    <br><br>

    <div>
      <label>Tendencia</label>
      <select v-model="selectedTrend" @change="fetchTrending">
        <option value="day">Hoy</option>
        <option value="week">Esta semana</option>
      </select>
    </div>

    <div class="movie-trend-container horizontal-scroll">
      <div v-for="(movie, index) in trendingMovies" :key="movie.id" class="movie-item">
        <div class="movie-image-container">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Poster" class="movie-poster" />
          <div class="menu-icon" @click="toggleMenu(index, 'trending')">
            &#x22EE;
          </div>
          <div v-if="openMenu === index && activeMenu === 'trending'" class="dropdown-menu">
            <ul>
              <li @click="toggleFavorites(movie, 'movie')">
                {{ inFavorites(movie) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </li>
              <li @click="toggleWatchlist(movie, 'movie')">
                {{ inWatchlist(movie) ? 'Quitar de lista de seguimiento' : 'Añadir a lista de seguimiento' }}
              </li>
              <li>
                Puntuación:
                <select v-model="selectedRating[movie.id]" @change="rateMovie(movie, selectedRating[movie.id], 'movie')">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
        <router-link :to="`/movie/${movie.id}`" class="details-link">
          <h3 class="textoNegro">{{ movie.title }}</h3>
          <p class="textoNegro">Rating: {{ movie.vote_average }}</p>
          <p class="textoNegro">Fecha de estreno: {{ movie.release_date }}</p>
        </router-link>
      </div>
    </div>

    <br><br><br><br>

    <div>
      <label>Lo más popular </label>
      <select v-model="selectedCategory" @change="fetchPopular">
        <option value="movie">Películas</option>
        <option value="tv">Series</option>
      </select>
    </div>

    <div class="movie-trend-container horizontal-scroll">
      <div v-for="(item, index) in popularItems" :key="item.id" class="movie-item">
        <div class="movie-image-container">
          <img :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" alt="Poster" class="movie-poster" />
          <div class="menu-icon" @click="toggleMenu(index, 'popular')">
            &#x22EE;
          </div>
          <div v-if="openMenu === index && activeMenu === 'popular'" class="dropdown-menu">
            <ul>
              <li @click="toggleFavorites(item, selectedCategory)">
                {{ inFavorites(item) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </li>
              <li @click="toggleWatchlist(item, selectedCategory)">
                {{ inWatchlist(item) ? 'Quitar de lista de seguimiento' : 'Añadir a lista de seguimiento' }}
              </li>
              <li>
                Puntuación:
                <select v-model="selectedRating[item.id]" @change="rateMovie(item, selectedRating[item.id], selectedCategory)">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
        <router-link :to="selectedCategory === 'movie' ? `/movie/${item.id}` : `/serie/${item.id}`" class="details-link">
          <h3 class="textoNegro">{{ selectedCategory === 'movie' ? item.title : item.name }}</h3>
          <p class="textoNegro">Rating: {{ item.vote_average }}</p>
          <p class="textoNegro">{{ selectedCategory === 'movie' ? 'Fecha de estreno: ' + item.release_date : 'Fecha de estreno: ' + item.first_air_date }}</p>
        </router-link>
      </div>
    </div>

    <br><br><br><br>

    <div>
      <label>Ver gratis </label>
      <select v-model="selectedFreeCategory" @change="fetchFreeItems">
        <option value="movie">Películas</option>
        <option value="tv">Series</option>
      </select>
    </div>

    <div class="movie-trend-container horizontal-scroll">
      <div v-for="(item, index) in freeItems" :key="item.id" class="movie-item">
        <div class="movie-image-container">
          <img :src="`https://image.tmdb.org/t/p/w500${item.poster_path}`" alt="Poster" class="movie-poster" />
          <div class="menu-icon" @click="toggleMenu(index, 'free')">
            &#x22EE;
          </div>
          <div v-if="openMenu === index && activeMenu === 'free'" class="dropdown-menu">
            <ul>
              <li @click="toggleFavorites(item, selectedFreeCategory)">
                {{ inFavorites(item) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </li>
              <li @click="toggleWatchlist(item, selectedFreeCategory)">
                {{ inWatchlist(item) ? 'Quitar de lista de seguimiento' : 'Añadir a lista de seguimiento' }}
              </li>
              <li>
                Puntuación:
                <select v-model="selectedRating[item.id]" @change="rateMovie(item, selectedRating[item.id], selectedFreeCategory)">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
        <router-link :to="selectedFreeCategory === 'movie' ? `/movie/${item.id}` : `/serie/${item.id}`" class="details-link">
          <h3 class="textoNegro">{{ selectedFreeCategory === 'movie' ? item.title : item.name }}</h3>
          <p class="textoNegro">Rating: {{ item.vote_average }}</p>
          <p class="textoNegro">{{ selectedFreeCategory === 'movie' ? 'Fecha de estreno: ' + item.release_date : 'Fecha de estreno: ' + item.first_air_date }}</p>
        </router-link>
      </div>
    </div>

    <br><br>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';

export default {
  name: 'MoviesAPI',
  components: {
    Navbar
  },
  data() {
    return {
      trendingMovies: [],
      popularItems: [],
      freeItems: [],
      selectedTrend: 'day',
      selectedCategory: 'movie',
      selectedFreeCategory: 'movie',
      openMenu: null,
      activeMenu: null,
      selectedRating: {},
      favorites: [],
      watchlist: [],
      sessionId: localStorage.getItem('sessionId'),
      accountId: localStorage.getItem('accountId'),
    };
  },

  async mounted() {
    await this.fetchTrending();
    await this.loadFavorites();
    await this.loadWatchlist();
    await this.fetchPopular();
    await this.fetchFreeItems();
  },

  methods: {
    async fetchTrending() {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/${this.selectedTrend}`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
          },
        });
        this.trendingMovies = response.data.results;

        this.trendingMovies.forEach(movie => {
          this.$set(this.selectedRating, movie.id, movie.vote_average);
        });
      } catch (error) {
        console.error('Error al cargar películas en tendencia', error);
      }
    },

    async fetchPopular() {
      const url = this.selectedCategory === 'movie'
        ? 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&region=AE'
        : 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1';

      try {
        const response = await axios.get(url, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
          },
        });
        this.popularItems = response.data.results;

        this.popularItems.forEach(item => {
          this.$set(this.selectedRating, item.id, item.vote_average);
        });
      } catch (error) {
        console.error('Error al cargar elementos populares', error);
      }
    },

    async fetchFreeItems() {
       const url = this.selectedFreeCategory === 'movie'
        ? 'https://api.themoviedb.org/3/discover/movie?with_watch_monetization_types=free&page=2'
        : 'https://api.themoviedb.org/3/discover/tv?with_watch_monetization_types=free&page=2';

      try {
        const response = await axios.get(url, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
          },
        });
        this.freeItems = response.data.results;

        this.freeItems.forEach(item => {
          this.$set(this.selectedRating, item.id, item.vote_average);
        });
      } catch (error) {
        console.error('Error al cargar elementos gratuitos', error);
      }
    },

    toggleMenu(index, menuType) {
      this.openMenu = this.openMenu === index && this.activeMenu === menuType ? null : index;
      this.activeMenu = menuType;
    },

    toggleFavorites(item, type) {
      if (this.inFavorites(item)) {
        this.favorites = this.favorites.filter(f => f.id !== item.id);
        this.removeFromFavorites(item.id, type);
      } else {
        this.favorites.push(item);
        this.addToFavorites(item, type);
      }
    },

    toggleWatchlist(item, type) {
      if (this.inWatchlist(item)) {
        this.watchlist = this.watchlist.filter(w => w.id !== item.id);
        this.removeFromWatchlist(item.id, type);
        console.log(response.data)
      } else {
        this.watchlist.push(item);
        this.addToWatchlist(item, type);
      }
    },

    inFavorites(item) {
      return this.favorites.some(f => f.id === item.id);
    },

    inWatchlist(item) {
      return this.watchlist.some(w => w.id === item.id);
    },

    async addToFavorites(item, type) {
      try {
        const response = await axios.post(`https://api.themoviedb.org/3/account/${this.accountId}/favorite`, {
          media_type: type,
          media_id: item.id,
          favorite: true,
        }, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error al añadir a favoritos', error);
      }
    },

    async removeFromFavorites(id, type) {
      try {
        const response = await axios.post(`https://api.themoviedb.org/3/account/${this.accountId}/favorite`, {
          media_type: type,
          media_id: id,
          favorite: false,
        }, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error al quitar de favoritos', error);
      }
    },

    async addToWatchlist(item, type) {
      try {
        const response = await axios.post(`https://api.themoviedb.org/3/account/${this.accountId}/watchlist`, {
          media_type: type,
          media_id: item.id,
          watchlist: true,
        }, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error al añadir a la lista de seguimiento', error);
      }
    },

    async removeFromWatchlist(id, type) {
      try {
        const response = await axios.post(`https://api.themoviedb.org/3/account/${this.accountId}/watchlist`, {
          media_type: type,
          media_id: id,
          watchlist: false,
        }, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error al quitar de la lista de seguimiento', error);
      }
    },

    async rateMovie(item, rating, type) {
      try {
        const response = await axios.post(`https://api.themoviedb.org/3/${type}/${item.id}/rating`, {
          value: rating,
        }, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error al calificar', error);
      }
    },

    async loadFavorites() {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/account/${this.accountId}/favorite/movies`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        this.favorites = response.data.results;
      } catch (error) {
        console.error('Error al cargar favoritos', error);
      }
    },

    async loadWatchlist() {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/account/${this.accountId}/watchlist/movies`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: this.sessionId,
          },
        });
        this.watchlist = response.data.results;
      } catch (error) {
        console.error('Error al cargar lista de seguimiento', error);
      }
    },
  },
};
</script>
<style>
.banner {
  background-image: url('src/assets/banner.jpg');
  background-size: cover;
  background-position: center;
  padding: 50px;
  text-align: center;
}

.welcome-message {
  color: white;
  font-size: 24px;
}
.movie-trend-container {
  display: flex;
  overflow-x: auto;
}

.movie-item {
  margin: 10px;
  position: relative;
}

.movie-image-container {
  position: relative;
}

.movie-poster {
  width: 150px;
  height: 225px;
  object-fit: cover;
}

.menu-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  padding: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 10;
}

.dropdown-menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 5px 10px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.textoNegro {
  color: black;
}
</style>
