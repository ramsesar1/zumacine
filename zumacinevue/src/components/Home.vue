<template>
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

    <br><br>

    <div class="movie-trend-container">
      <div v-for="(movie, index) in trendingMovies" :key="movie.id" class="movie-item">
        <div class="movie-image-container">
          <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" alt="Poster" class="movie-poster" />

          <div class="menu-icon" @click="toggleMenu(index)">
            &#x22EE;
          </div>

          <div v-if="openMenu === index" class="dropdown-menu">
            <ul>
              <li @click="toggleFavorites(movie)">
                {{ inFavorites(movie) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </li>
              <li @click="toggleWatchlist(movie)">
                {{ inWatchlist(movie) ? 'Quitar de lista de seguimiento' : 'Añadir a lista de seguimiento' }}
              </li>
              <li>
                Puntuación:
                <select v-model="selectedRating[movie.id]" @change="rateMovie(movie, selectedRating[movie.id])">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
        <h3 class="textoNegro">{{ movie.title }}</h3>
        <p class="textoNegro">Rating: {{ movie.vote_average }}</p>
        <p class="textoNegro">Fecha de estreno: {{ movie.release_date }}</p>
      </div>
    </div>

    <router-link :to="`/movies/`">Películas</router-link>
    <br><br>
    <router-link :to="`/series/`">Series</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MoviesAPI',
  data() {
    return {
      trendingMovies: [],
      selectedTrend: 'day',
      openMenu: null,
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

    async loadFavorites() {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      try {
        const accountResponse = await axios.get(`https://api.themoviedb.org/3/account`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId,
          },
        });
        const accountId = accountResponse.data.id;

        const favoritesResponse = await axios.get(`https://api.themoviedb.org/3/account/${accountId}/favorite/movies`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId,
            page: 1,
          },
        });
        this.favorites = favoritesResponse.data.results;
      } catch (error) {
        console.error('Error al cargar la lista de favoritos', error);
      }
    },

    async loadWatchlist() {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      try {
        const accountResponse = await axios.get(`https://api.themoviedb.org/3/account`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId,
          },
        });
        const accountId = accountResponse.data.id;

        const watchlistResponse = await axios.get(`https://api.themoviedb.org/3/account/${accountId}/watchlist/movies`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId,
            page: 1,
          },
        });
        this.watchlist = watchlistResponse.data.results;
      } catch (error) {
        console.error('Error al cargar la lista de seguimiento', error);
      }
    },

    toggleMenu(index) {
      this.openMenu = this.openMenu === index ? null : index;
    },

    inFavorites(movie) {
      return this.favorites.some(fav => fav.id === movie.id);
    },

    inWatchlist(movie) {
      return this.watchlist.some(watch => watch.id === movie.id);
    },

    async toggleFavorites(movie) {
      const sessionId = localStorage.getItem('sessionId');
      const isFavorite = this.inFavorites(movie);

      try {
        const accountResponse = await axios.get(`https://api.themoviedb.org/3/account`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        });
        const accountId = accountResponse.data.id;

        await axios.post(
          `https://api.themoviedb.org/3/account/${accountId}/favorite`,
          {
            media_type: 'movie',
            media_id: movie.id,
            favorite: !isFavorite
          },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        );

        if (isFavorite) {
          this.favorites = this.favorites.filter(fav => fav.id !== movie.id);
          this.setMessage('Removida de favoritos');
        } else {
          this.favorites.push(movie);
          this.setMessage('Añadida a favoritos');
        }

      } catch (error) {
        console.error('Fallo al cambiar favorito: ', error);
      }
    },

    async toggleWatchlist(movie) {
      const sessionId = localStorage.getItem('sessionId');
      const isInWatchlist = this.inWatchlist(movie);

      try {
        const accountResponse = await axios.get('https://api.themoviedb.org/3/account', {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            session_id: sessionId
          }
        });
        const accountId = accountResponse.data.id;

        await axios.post(
          `https://api.themoviedb.org/3/account/${accountId}/watchlist`,
          {
            media_type: 'movie',
            media_id: movie.id,
            watchlist: !isInWatchlist
          },
          {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              session_id: sessionId
            }
          }
        );

        if (isInWatchlist) {
          this.watchlist = this.watchlist.filter(watch => watch.id !== movie.id);
          this.setMessage('Removida de la lista');
        } else {
          this.watchlist.push(movie);
          this.setMessage('Añadida a la lista');
        }

      } catch (error) {
        console.error('Fallo al cambiar la lista de seguimiento: ', error);
      }
    },

    async rateMovie(movie, rating) {
      try {
        if (this.sessionId) {
          await axios.post(
            `https://api.themoviedb.org/3/movie/${movie.id}/rating?session_id=${this.sessionId}`,
            { value: rating },
            { params: { api_key: 'b27d7edb3072175fb8681650517059f7' } }
          );
        } else {
          console.error('Por favor, inicie sesión para puntuar películas.');
        }
      } catch (error) {
        console.error('Error al puntuar la película', error);
      }
    },

    setMessage(message) {
      this.message = message;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
};
</script>

<style scoped>
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
  flex-wrap: wrap;
}

.movie-item {
  width: 200px;
  margin: 10px;
  position: relative;
}

.movie-image-container {
  position: relative;
}

.movie-poster {
  width: 100%;
}

.menu-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}

.dropdown-menu {
  position: absolute;
  top: 30px;
  right: 10px;
  background: white;
  border: 1px solid #ccc;
  z-index: 10;
}

.dropdown-menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background: #f0f0f0;
}

.textoNegro {
  color: black;
}
</style>
