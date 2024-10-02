<template>
  <Navbar />
  <div>
    <h2>Series</h2>

    <div class="sort-container">
      <label for="sort-by">Ordenar por: </label>
      <select v-model="selectedSortOption" id="sort-by">
        <option value="default">Por defecto</option>
        <option value="popular">Popularidad (descendente)</option>
        <option value="least_popular">Popularidad (ascendente)</option>
        <option value="top_rated">Calificacion (descendente)</option>
        <option value="lowest_rated">Calificacion (ascendente)</option>
      </select>
      <button @click="confirmSort">Confirmar</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else class="series-container">
    <div class="card" v-for="serie in series" :key="serie.id">
      <img v-if="serie.poster_path" 
          :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`" 
          :alt="serie.name" 
          class="serie-poster" 
      />
      <img v-else src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/640px-No-Image-Placeholder.svg.png" alt="Sin imagen disponible" class="serie-poster" />
      <div class="card-content">
        <h3>{{ serie.name }}</h3>
        <p class="overview">{{ serie.overview }}</p>
        <router-link :to="`/serie/${serie.id}`" class="details-link">VER SERIES</router-link>
      </div>
    </div>
  </div>
  <button @click="loadMoreSeries" v-if="!loadingMore" class="load-more-btn">Cargar más series</button>
  <div v-if="loadingMore" class="loading-more">Cargando más series...</div>
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';

export default {
  name: 'SeriesAPI',
  components: {
    Navbar
  },
  data() {
    return {
      series: [],
      loading: true,
      loadingMore: false,
      error: null,
      currentPage: 1,
      selectedSortOption: 'default',
      apiEndPoints: {
        default: 'https://api.themoviedb.org/3/tv/on_the_air',
        popular: 'https://api.themoviedb.org/3/tv/popular?language=en-US&region=AE',
        top_rated: 'https://api.themoviedb.org/3/tv/top_rated?language=en-US&region=AT',
        least_popular:
          'https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=popularity.asc',
        lowest_rated:
          'https://api.themoviedb.org/3/discover/tv?language=en-US&sort_by=vote_average.asc'
      }
    };
  },

  async mounted() {
    await this.fetchSeries(this.apiEndPoints.default, this.currentPage)
  },

  methods: {
    async fetchSeries(apiUrl,page) {
      try {
        const response = await axios.get(apiUrl, {
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

    confirmSort() {
      this.series = []
      this.loading = true
      this.currentPage = 1

      const selectedApi = this.apiEndPoints[this.selectedSortOption] || this.apiEndPoints.default
      this.fetchSeries(selectedApi, this.currentPage)
    },

    async loadMoreSeries() {
      this.loadingMore = true;
      this.currentPage += 1;

      const selectedApi = this.apiEndPoints[this.selectedSortOption] || this.apiEndPoints.default
      await this.fetchSeries(selectedApi, this.currentPage)
    },
  },
};
</script>

<style scoped>
.sort-container {
  text-align: center;
  margin-bottom: 20px;
}

#sort-by {
  padding: 5px;
  margin-right: 10px;
}

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
  margin: 20px auto; /* Centramos el botón */
  padding: 8px 16px; /* Reducimos el padding */
  font-size: 0.9rem; /* Ajustamos el tamaño de fuente */
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  max-width: 200px; /* Limitamos el ancho máximo */
  text-align: center;
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
