<template>
  <div>
    <!-- Navbar -->
    <Navbar />
    
    <h1>Detalles de Palabra Clave</h1>
    <div v-if="keyword">
      <h2>{{ keyword.name }}</h2>
      <div class="filters">
        <label for="filter-select">Filtrado por: </label>
        <select id="filter-select" v-model="filter" @change="resetResults">
          <option value="movie">Películas</option>
          <option value="tv">Series</option>
        </select>

        <label for="sort-select">Ordenar por: </label>
        <select id="sort-select" v-model="sortOrder" @change="resetResults">
          <option value="popularity.desc">Popularidad (descendente)</option>
          <option value="popularity.asc">Popularidad (ascendente)</option>
        </select>
      </div>

      <h3>Resultados:</h3>
      <div v-if="filteredResults.length" class="grid-container">
        <div
          v-for="item in filteredResults"
          :key="item.id"
          class="grid-item"
          @click="navigateToDetail(item)"
        >
          <img v-if="item.poster_path" :src="`https://image.tmdb.org/t/p/w200${item.poster_path}`" :alt="item.title || item.name" />
          <img v-else src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/640px-No-Image-Placeholder.svg.png" alt="Sin imagen disponible" class="serie-poster" />
          <p>{{ item.title || item.name }} <br> ({{ item.release_date || item.first_air_date }})</p>
        </div>
      </div>

      <p v-else>No se encontraron resultados.</p>

      <!-- Botón de "Cargar más" -->
      <div v-if="hasMoreResults" class="load-more">
        <button @click="loadMore">Cargar más</button>
      </div>
    </div>
    <p v-else>Cargando detalles de la palabra clave...</p>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from './Navbar.vue';

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      keyword: null, // Almacena los detalles de la palabra clave
      filter: this.$route.query.filter || 'movie', // Valor inicial según query
      sortOrder: 'popularity.desc', // Ordenar por popularidad descendente
      filteredResults: [], // Almacena los resultados filtrados
      page: 1, // Página actual
      totalPages: 1, // Total de páginas disponibles
    };
  },
  computed: {
    hasMoreResults() {
      return this.page < this.totalPages; // Verifica si hay más resultados para cargar
    },
  },
  watch: {
    '$route.query.filter': {
      immediate: true,
      handler(newFilter) {
        this.filter = newFilter || 'movie';
        this.resetResults(); // Resetea los resultados cuando el filtro cambia
      },
    },
  },
  mounted() {
    this.fetchKeywordDetails(); 
  },
  methods: {
    async fetchKeywordDetails() {
      try {
        const keywordId = this.$route.params.id; // Obtener el ID de la palabra clave desde la URL
        const response = await axios.get(
          `https://api.themoviedb.org/3/keyword/${keywordId}?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        this.keyword = response.data;
        this.fetchFilteredResults(); // Llama a la función para obtener resultados filtrados
      } catch (error) {
        console.error("Error al obtener detalles de la palabra clave:", error);
      }
    },
    async fetchFilteredResults() {
      try {
        const keywordId = this.$route.params.id;
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/${this.filter}?api_key=b27d7edb3072175fb8681650517059f7&language=es&sort_by=${this.sortOrder}&with_keywords=${keywordId}&page=${this.page}`
        );
        this.filteredResults = [...this.filteredResults, ...response.data.results]; // Añade los nuevos resultados a los ya existentes
        this.totalPages = response.data.total_pages; // Actualiza el total de páginas
      } catch (error) {
        console.error("Error al obtener resultados filtrados:", error);
      }
    },
    resetResults() {
      this.page = 1; // Resetea a la primera página
      this.filteredResults = []; // Limpia los resultados
      this.fetchFilteredResults(); // Obtiene los nuevos resultados con el filtro actualizado
    },
    loadMore() {
      this.page++; // Incrementa la página
      this.fetchFilteredResults(); // Carga más resultados
    },
    navigateToDetail(item) {
      if (this.filter === 'movie') {
        this.$router.push({ name: 'MovieDetail', params: { id: item.id } });
      } else if (this.filter === 'tv') {
        this.$router.push({ name: 'SerieDetail', params: { id: item.id } });
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  justify-items: center;
  padding: 0 20px;
}

.grid-item {
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.grid-item:hover {
  transform: scale(1.05);
}

img {
  width: 150px;
  height: 225px;
  border-radius: 10px;
}

p {
  margin-top: 10px;
  font-weight: bold;
  font-size: 0.9em;
}

h3 {
  text-align: center;
  font-size: 1.5em;
}

.load-more {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>








