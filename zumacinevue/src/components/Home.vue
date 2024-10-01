<template>
  <div>
    <div class="banner">
      <div class="welcome-message">
        <label style="font-weight: bolder;">Bienvenido. Millones de películas, series y gente por descubrir. Explora ya.</label>
      </div>
    </div>

    <br><br>

    <div>
      <label>Tendencia </label>
      <select v-model="selectedTrend" @change="fetchTrending">
        <option value="day">Hoy</option>
        <option value="week">Esta semana</option>
      </select>
    </div>

    <br><br>

    <div class="movie-trend-container horizontal-scroll">
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

    <br><br>

    <!-- Sección Lo más popular -->
    <div>
      <label>Lo más popular </label>
      <select v-model="selectedPopular" @change="fetchPopular">
        <option value="streaming">Retransmisión</option>
        <option value="on_tv">En televisión</option>
        <option value="on_demand">En alquiler</option>
        <option value="in_theaters">En cines</option>
      </select>
    </div>

    <br><br>

    <div class="movie-trend-container horizontal-scroll">
      <div v-for="(popularMovie, index) in popularMovies" :key="popularMovie.id" class="movie-item">
        <div class="movie-image-container">
          <img :src="`https://image.tmdb.org/t/p/w500${popularMovie.poster_path}`" alt="Poster" class="movie-poster" />

          <div class="menu-icon" @click="toggleMenu(index)">
            &#x22EE;
          </div>

          <div v-if="openMenu === index" class="dropdown-menu">
            <ul>
              <li @click="toggleFavorites(popularMovie)">
                {{ inFavorites(popularMovie) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </li>
              <li @click="toggleWatchlist(popularMovie)">
                {{ inWatchlist(popularMovie) ? 'Quitar de lista de seguimiento' : 'Añadir a lista de seguimiento' }}
              </li>
              <li>
                Puntuación:
                <select v-model="selectedRating[popularMovie.id]" @change="rateMovie(popularMovie, selectedRating[popularMovie.id])">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
        <h3 class="textoNegro">{{ popularMovie.title }}</h3>
        <p class="textoNegro">Rating: {{ popularMovie.vote_average }}</p>
        <p class="textoNegro">Fecha de estreno: {{ popularMovie.release_date }}</p>
      </div>
    </div>

    <br><br>

    <!-- Sección Ver gratis -->
    <div>
      <label>Ver gratis </label>
      <select v-model="selectedFree" @change="fetchFree">
        <option value="movies">Películas</option>
        <option value="tv">Televisión</option>
      </select>
    </div>

    <br><br>

    <div class="movie-trend-container horizontal-scroll">
      <div v-for="(freeContent, index) in freeContentList" :key="freeContent.id" class="movie-item">
        <div class="movie-image-container">
          <img :src="`https://image.tmdb.org/t/p/w500${freeContent.poster_path}`" alt="Poster" class="movie-poster" />

          <div class="menu-icon" @click="toggleMenu(index)">
            &#x22EE;
          </div>

          <div v-if="openMenu === index" class="dropdown-menu">
            <ul>
              <li @click="toggleFavorites(freeContent)">
                {{ inFavorites(freeContent) ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </li>
              <li @click="toggleWatchlist(freeContent)">
                {{ inWatchlist(freeContent) ? 'Quitar de lista de seguimiento' : 'Añadir a lista de seguimiento' }}
              </li>
              <li>
                Puntuación:
                <select v-model="selectedRating[freeContent.id]" @change="rateMovie(freeContent, selectedRating[freeContent.id])">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </li>
            </ul>
          </div>
        </div>
        <h3 class="textoNegro">{{ freeContent.title }}</h3>
        <p class="textoNegro">Rating: {{ freeContent.vote_average }}</p>
        <p class="textoNegro">Fecha de estreno: {{ freeContent.release_date }}</p>
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
      popularMovies: [], // Nueva propiedad para las películas populares
      selectedPopular: 'streaming',
      selectedFree: 'movies',
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
    await this.fetchFree();

  },

  methods: {

    async fetchFree() {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/${this.selectedFree}/popular`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            page: 1,
          },
        });
        this.freeContentList = response.data.results;
      } catch (error) {
        console.error('Error al cargar contenido gratuito', error);
      }
    },

    async fetchPopular() {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            language: 'es-ES', // Cambia el idioma si es necesario
            page: 1,
          },
        });
        this.popularMovies = response.data.results; // Actualizar popularMovies
      } catch (error) {
        console.error('Error al cargar películas populares', error);
      }
    },

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
  flex-wrap: nowrap; /* Cambiado a nowrap para evitar el salto de línea */
  overflow-x: auto; /* Habilitar scroll horizontal */
  padding: 10px 0; /* Espaciado superior e inferior */
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

/* Estilo adicional para la sección de desplazamiento */
.horizontal-scroll {
  overflow-x: auto; /* Scroll horizontal */
  white-space: nowrap; /* Para evitar el salto de línea */
}
</style>
