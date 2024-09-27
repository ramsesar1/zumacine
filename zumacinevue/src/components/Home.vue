<template>
     <div>
      <router-link :to="`/movies/`">Peliculas</router-link>
      <br> <br>
      <router-link :to="`/series/`">Series</router-link>
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
  