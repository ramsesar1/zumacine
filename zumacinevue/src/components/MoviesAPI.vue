<template>
  <div>
    <h2>Movies</h2>
    <div v-if="error">{{ error }}</div>
    <div v-else-if="loading">Loading...</div>
    <div v-else>
      <div v-for="movie in movies" :key="movie.id">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.overview }}</p>
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="movie-poster"
        />
        <router-link :to="`/movie/${movie.id}`">Ver Detalles</router-link>
      </div>
      <button @click="loadMoreMovies" v-if="!loadingMore">Cargar mas peliculas</button>
      <div v-if="loadingMore">Cargando mas peliculas...</div>
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
        this.error = 'fallo en cargar mas peliculas, intente denuevo';
        console.error(error);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    // cargar mas peliculas y no sobrecargar la api de golpe
    async loadMoreMovies() {
      this.loadingMore = true;
      this.currentPage += 1;
      await this.fetchMovies(this.currentPage);
    },
  },
};
</script>

<style scoped>
.movie-poster {
  width: 150px;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
}
</style>
