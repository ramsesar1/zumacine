<template>
  <div>
    <h2>Movies</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else class="movies-container">
      <div class="card" v-for="movie in movies" :key="movie.id">
        <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title"
          class="movie-poster" />
        <div class="card-content">
          <h3>{{ movie.title }}</h3>
          <p class="overview">{{ movie.overview }}</p>
          <router-link :to="`/movie/${movie.id}`" class="details-link">Ver Detalles</router-link>
        </div>
      </div>
      <button @click="loadMoreMovies" v-if="!loadingMore" class="load-more-btn">Cargar más películas</button>
      <div v-if="loadingMore" class="loading-more">Cargando más películas...</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MoviesAPI',
  data() {
    return {
      movies: [],
      loading: true,
      loadingMore: false,
      error: null,
      currentPage: 1,
    };
  },

  async mounted() {
    await this.fetchMovies(this.currentPage);
  },

  methods: {
    async fetchMovies(page) {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: 'b27d7edb3072175fb8681650517059f7',
            page: page,
          },
        });
        this.movies.push(...response.data.results);
      } catch (error) {
        this.error = 'Fallo en cargar más películas, intente de nuevo';
        console.error(error);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    async loadMoreMovies() {
      this.loadingMore = true;
      this.currentPage += 1;
      await this.fetchMovies(this.currentPage);
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  font-family: 'Arial', sans-serif;
  margin-bottom: 20px;
}

.movies-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  width: 200px;
}

.card:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: auto;
}

.card-content {
  padding: 15px;
  text-align: center;
}

h3 {
  font-size: 1.2em;
  margin: 10px 0;
}

.overview {
  font-size: 0.9em;
  color: #555;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-link {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.details-link:hover {
  background-color: #2980b9;
}

.load-more-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 1em;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-more-btn:hover {
  background-color: #27ae60;
}

.loading-more {
  text-align: center;
  color: #888;
}

.error {
  color: red;
  text-align: center;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}
</style>
