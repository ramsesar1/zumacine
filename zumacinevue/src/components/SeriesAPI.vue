<template>
  <div>
    <h2>Series</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else class="series-container">
      <div class="card" v-for="serie in series" :key="serie.id">
        <img v-if="serie.poster_path" :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`" :alt="serie.name"
          class="serie-poster" />
        <div class="card-content">
          <h3>{{ serie.name }}</h3>
          <p class="overview">{{ serie.overview }}</p>
          <router-link :to="`/serie/${serie.id}`" class="details-link">VER SERIES</router-link>
        </div>
      </div>
      <button @click="loadMoreSeries" v-if="!loadingMore" class="load-more-btn">Cargar más series</button>
      <div v-if="loadingMore" class="loading-more">Cargando más series...</div>
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
        this.error = 'Fallo en cargar más series, intente de nuevo';
        console.error(error);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

    async loadMoreSeries() {
      this.loadingMore = true;
      this.currentPage += 1;
      await this.fetchSeries(this.currentPage);
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

.series-container {
  display: flex;
  flex-wrap: wrap;
  /* Permite que las tarjetas se ajusten cuando no hay espacio suficiente */
  gap: 20px;
  /* Espacio entre las tarjetas */
  justify-content: center;
  /* Centra las tarjetas en la pantalla */
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

.serie-poster {
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
