<template>
    <div>
      <h2>Series</h2>
      <div v-if="error">{{ error }}</div>
      <div v-else-if="loading">Loading...</div>
      <div v-else>
        <div v-for="serie in series" :key="serie.id">
          <h3>{{ serie.title }}</h3>
          <p>{{ serie.overview }}</p>
          <img
            v-if="serie.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`"
            :alt="serie.title"
            class="serie-poster"
          />
          <router-link :to="`/serie/${serie.id}`">VER SERIES</router-link>
        </div>
        <button @click="loadMoreSeries" v-if="!loadingMore">Cargar mas series</button>
        <div v-if="loadingMore">Cargando mas series...</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'SeriesAPI',
    data() {
      return {
        series: [],
        loading: true,
        loadingMore: false, 
        error: null,
        currentPage: 1, 
      };
    },
  
    async mounted() {
      await this.fetchSeries(this.currentPage);
    },
  
    methods: {
      async fetchSeries(page) {
        try {
          const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
            params: {
              api_key: 'b27d7edb3072175fb8681650517059f7',
              page: page,
            },
          });
          this.series.push(...response.data.results);
        } catch (error) {
          this.error = 'fallo en cargar mas series, intente denuevo';
          console.error(error);
        } finally {
          this.loading = false;
          this.loadingMore = false;
        }
      },
  
      // cargar mas series y no sobrecargar la api de golpe
      async loadMoreSeries() {
        this.loadingMore = true;
        this.currentPage += 1;
        await this.fetchSeries(this.currentPage);
      },
    },
  };
  </script>
  
  <style scoped>
  .serie-poster {
    width: 150px;
    height: auto;
    margin-top: 10px;
    border-radius: 5px;
  }
  </style>
  