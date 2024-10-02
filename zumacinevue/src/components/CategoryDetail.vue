<template>
  <div>
    <!-- Navbar -->
    <Navbar />
    
    <h1>Detalles de Categoría</h1>
    <div v-if="category">
      <h2>{{ category.name }}</h2>
      <div class="filters">
        <label for="filter-select">Filtrado por: </label>
        <select id="filter-select" v-model="filter" @change="fetchFilteredResults">
          <option value="movie">Películas</option>
          <option value="tv">Series</option>
        </select>

        <label for="sort-select">Ordenar por: </label>
        <select id="sort-select" v-model="sortOrder" @change="fetchFilteredResults">
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
          <p>{{ item.title || item.name }} <br> ({{ item.release_date || item.first_air_date }})</p>
        </div>
      </div>

      <p v-else>No se encontraron resultados.</p>
    </div>
    <p v-else>Cargando detalles de la categoría...</p>
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
      category: null, // Almacena los detalles de la categoría
      filter: this.$route.query.filter || 'movie', // Filtro inicial (películas o series según la query)
      sortOrder: 'popularity.desc', // Ordenar por popularidad descendente
      filteredResults: [], // Almacena los resultados filtrados
    };
  },
  watch: {
    // Verifica si el filtro cambia al navegar entre rutas
    '$route.query.filter': {
      immediate: true, // Para que se ejecute cuando el componente se monta
      handler(newFilter) {
        this.filter = newFilter || 'movie'; // Actualiza el filtro con lo que se recibe en la query
        this.fetchFilteredResults(); // Refresca los resultados cuando cambie el filtro
      }
    }
  },
  mounted() {
    this.fetchCategoryDetails(); 
  },
  methods: {
    async fetchCategoryDetails() {
      try {
        const categoryId = this.$route.params.id; // Obtener el ID de la categoría desde la URL
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/${categoryId}?api_key=b27d7edb3072175fb8681650517059f7&language=es`
        );
        this.category = response.data;
        this.fetchFilteredResults(); // Llama a la función para obtener resultados filtrados
      } catch (error) {
        console.error("Error al obtener detalles de la categoría:", error);
      }
    },
    async fetchFilteredResults() {
      try {
        const categoryId = this.$route.params.id;
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/${this.filter}?api_key=b27d7edb3072175fb8681650517059f7&language=es&sort_by=${this.sortOrder}&with_genres=${categoryId}`
        );
        this.filteredResults = response.data.results;
      } catch (error) {
        console.error("Error al obtener resultados filtrados:", error);
      }
    },
    navigateToDetail(item) {
      if (this.filter === 'movie') {
        // Redirigir a MovieDetail.vue si es una película
        this.$router.push({ name: 'MovieDetail', params: { id: item.id } });
      } else if (this.filter === 'tv') {
        // Redirigir a SerieDetail.vue si es una serie
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Distribuye las películas de forma uniforme */
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
  cursor: pointer; /* Añadir cursor de pointer */
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
</style>






